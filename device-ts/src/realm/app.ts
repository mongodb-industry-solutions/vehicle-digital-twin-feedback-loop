import { Component, Device } from './schemas';
import { appID, realmUser } from './config';
import Realm from 'realm';
import { ObjectID } from "bson";
import { publishMessage } from '../mqtt/mqtt';
import {activateGen, deactivateGen} from '../data-generator/data-generator';

const schemaList = [Device, Component];
const app = new Realm.App({ id: appID });
let realm: Realm;


// REST API insert new device function
export function createDevice(name: string) {
  realm.write(() => {
    realm.create<Device>('Device', {
      _id: new ObjectID(),
      name: name,
      owner_id: app.currentUser?.id ?? "no current user id!",
      isOn: false,
      components: []
    });
  });
  return {
    devices: realm.objects<Device>('Device').map(({ _id, name }) => {
      return { 'device_id': _id, 'device_name': name };
    })
  };
}

// REST API add component function
export function addComponent(name: string) {
  if (realm.objects<Device>('Device').length > 0) {
    const device = realm.objects<Device>('Device')[0];
    realm.write(() => {
      const component = realm.create<Component>('Component', {
        _id: new ObjectID,
        name: name,
        owner_id: app.currentUser?.id ?? "no current user",
      });
      device.components.push(component);
    });
    return { success: "Component created and related to id: " + device._id };
  } else {
    const err = "Add component failed, no device available!";
    console.log(err);
    return err;
  }

}

// Realm object change listener
function changedPropertiesListener(object: any, changes: any) {
  changes.changedProperties.forEach((propName: string) => {
    console.log(`Changed Property: ${propName}: ${object[propName]}`);

    if(propName === 'isOn') {
      if (object[propName]) {
        // Activate data-generator
        activateGen();
      } else {
        //deactivated data-generator
        deactivateGen();
      }
      // Framework for publishing MQTT messages
      publishMessage(`{ ${propName} : ${object[propName]} }`);
    }
  });
}

// Realm collection change listener
const changeListener = (
  objects: Realm.Collection<any>,
  changes: any) => {
  // Handle newly added objects
  changes.insertions.forEach((index: number) => {
    console.log(`New object added: ${objects[index].name}!`);
    objects[0].addListener(changedPropertiesListener);
  });
  //console.log(JSON.stringify(objects));
}

async function login() {
  // Authenticate the device user
  const credentials: Realm.Credentials = Realm.Credentials.emailPassword(realmUser.username, realmUser.password);
  const user: Realm.User = await app.logIn(credentials);
  console.log("Successfully logged in: " + user.id);
  return user;
}

// Main function
async function run() {
  login().then(async (user) => {
    realm = await Realm.open({
      schema: schemaList,
      sync: {
        user: user,
        flexible: true,
      }
    });
    // Create and add a filter subscription
    await realm.subscriptions.update((subscriptions) => {
      subscriptions.add(
        realm
          .objects(Device.schema.name)
          .filtered("owner_id =" + JSON.stringify(app.currentUser?.id), { name: "device-filter" })
      );
      subscriptions.add(
        realm
          .objects(Component.schema.name)
          .filtered("owner_id =" + JSON.stringify(app.currentUser?.id), { name: "component-filter" })
      );
    });
    // Add change listener to filtered list of objects
    realm.objects('Device').addListener(changeListener);
    realm.objects('Component').addListener(changeListener);
  }).catch((err) => {
    console.log('Login failed: ', err)
  });
}

// Execute main function
run().catch((err) => {
  console.error("Failed: ", err);
});

// Shutdown and cleanup code
process.on("SIGINT", function () {
  console.log("Shutdown and cleanup initiated!");
  try {
    realm.write(() => {
      // Delete all objects of the current filter from the realm.
      realm.deleteAll();
    });
    realm.removeAllListeners();
    realm.subscriptions.update((subscriptions) => {
      subscriptions.removeAll();
    })
    process.exit();
  } catch (err) {
    console.error("Failed: ", err);
  }
});

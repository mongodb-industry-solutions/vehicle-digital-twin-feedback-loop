import { Component, Device, Sensor } from './schemas';
import { appID, realmUser } from './config';
import Realm from 'realm';
import { ObjectID } from "bson";
import { publishMessage } from '../mqtt/mqtt';
import { activateGen, deactivateGen } from '../data-generator/data-generator';

/**
 * Initialize a new Realm application instance
 */
const app = new Realm.App({ id: appID });
let realm: Realm;

/**
 * Creates a new Device object with the provided name
 * @param name Name of the device
 * @returns Attributes of the created device as JSON object
 */
export function createDevice(name: string) {
  realm.write(() => {
    realm.create<Device>('Device', {
      _id: new ObjectID(),
      name: name,
      owner_id: app.currentUser?.id ?? "no current user id!",
      isOn: false,
      mixedTypes: null,
      components: []
    });
  });
  return {
    devices: realm.objects<Device>('Device').map(({ _id, name }) => {
      return { 'device_id': _id, 'device_name': name };
    })
  };
}

/**
 * Creates a new component with the provided name and relates it to the first previously created Device object
 * @param name Name of the component to be created
 * @returns Result of the component creation procedure as JSON object or the resulting error
 */
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
    return { result: "Component created and related to id: " + device._id };
  } else {
    const err = "Add component failed, no device available!";
    console.log(err);
    return err;
  }
}

/**
 * Uses the asymmetric sync functionality to efficiently push a time series object to the backend
 * @param value Number type e.g. a sensor value
 * @returns JSON object
 */
export function addSensor(value: number) {
  let sensor;
  // Backend functionality not implemented yet
  /*
  realm.write(() => {
    sensor = realm.create<Sensor>('Sensor', {
      _id: new ObjectID,
      name: "sensor",
      value: value,
      //owner_id: app.currentUser?.id ?? "no current user"
    });
  });*/
  return ({ result: 'not implemented yet' });
}

/**
 * Pauses synchronization of a previously opened Realm
 * @returns JSON object
 */
export function pauseRealm() {
  console.log('pause')
  realm.syncSession?.pause();
  return ({ state: 'paused' });
}

/**
 * Resumes synchronization of a previsouly paused Realm 
 * @returns JSON object
 */
export function resumeRealm() {
  console.log('resume');
  realm.syncSession?.resume();
  return ({ state: 'resumed' });
}

/**
 * Change a flexible sync subscription dynamically to change data sets to be synchronized
 */
export function toggleSyncSubscription() {
  // Idea: Slider or simple toggle to select all or a subset of objects to sync
  console.log('not implemented yet')
}

/**
 * Object change listener callback function to process change events
 * @param object Modified object
 * @param changes List of modified fields
 */
function deviceChangeListener(object: any, changes: any) {
  console.log(`Changed object: ${object.name}`);
  if (changes.deleted) {
    console.log(`Object ${object.name} has been deleted!`);
  }
  console.log(`${changes.changedProperties.length} properties have been changed:`);
  changes.changedProperties.forEach((prop: any) => {
    console.log(` ${prop}`);
  });
}

/**
 * Adds an object change listener to the first previously created Device object using the above functiona as callback
 * @returns JSON object
 */
export function addObjectChangeListener() {
  realm.objects('Device')[0].addListener(deviceChangeListener);
  return { result: "Listener added!" }
}

/**
 * Remove a previously added object change listener from the first Device object created
 * @returns JSON object
 */
export function removeObjectChangeListener() {
  realm.objects('Device')[0].removeListener(deviceChangeListener);
  return { result: "Listener removed!" }
}

/**
 * WORK IN PROGRESS!
 * @todo create activation/deactivation listener
 * @todo depending on active/passive add/remove MQTT listener on topic
 * @todo add asymmetric write function for time series data to Atlas backend
 * Object change listener which listens on MQTT topic and streams events via asymmetric sync to backend
 * @param object 
 * @param changes 
 */
function eventForwarderListener(object: any, changes: any) {
  changes.changedProperties.forEach((propName: string) => {
    console.log(`Changed Property: ${propName}: ${object[propName]}`);

    if (propName === 'isOn') {
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

/**
 * Callback function for Realm collections listener
 * @param objects 
 * @param changes 
 */
const changeListener = (
  objects: Realm.Collection<any>,
  changes: any) => {
  // Handle newly added objects
  changes.insertions.forEach((index: number) => {
    console.log(`New object added: ${objects[index].name}!`);
    //objects[0].addListener(changedPropertiesListener);
  });
  //console.log(JSON.stringify(objects));
}

/**
 * Atlas application services email/password authentication
 * @returns Realm user object
 */
async function login() {
  const credentials: Realm.Credentials = Realm.Credentials.emailPassword(realmUser.username, realmUser.password);
  const user: Realm.User = await app.logIn(credentials);
  console.log("Successfully logged in: " + user.id);
  return user;
}

/**
 * On process shutdown remove all change listeners,delete created devices/components and exit program
 */
process.on("SIGINT", function () {
  console.log("Shutdown and cleanup initiated!");
  try {
    // Remove all change listener
    realm.removeAllListeners();
    // Delete all device and component entries of the current subscription
    realm.write(() => {
      realm.deleteAll();
    });
    // Remove all flexible sync subscriptions
    realm.subscriptions.update((subscriptions) => {
      subscriptions.removeAll();
    })
  } catch (err) {
    console.error("Failed: ", err);
  }
  process.exit();
});

/**
 * Main function
 */
async function run() {
  login().then(async (user) => {
    realm = await Realm.open({
      schema: [Device, Component, Sensor],
      sync: {
        user: user,
        flexible: true,
      }
    });
    // Create and add flexible xync subscription filters
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
    // Add Realm change listener to filtered list of objects
    //realm.objects('Device').addListener(changeListener);
    //realm.objects('Component').addListener(changeListener);
  }).catch((err) => {
    console.log('Login failed: ', err)
  });
}

/**
 * Execute main function
 */
run().catch((err) => {
  console.error("Failed: ", err);
});

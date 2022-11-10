import { ObjectID } from 'bson';

// Provide the Realm App ID
export const appID = "connected-vehicle-nnafn"; //"digital-twin-backend-itfpm"; //"connected-vehicle-nnafn";

// Provide the configured customer profile
export const realmUser = {
    username: "demo",
    password: "demopw"
}

export const vin = "5UXFE83578L342684"; // https://vingenerator.org/brand


export const vehicleConfig = {
    _id: new ObjectID,
    name: "My Car",
    device_id: "",
    vin: vin,
    isOn: false,
    battery: { sn: "123", capacity: 1000, voltage: 50, current: 50 }
  }
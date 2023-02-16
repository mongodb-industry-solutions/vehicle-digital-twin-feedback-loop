import { ObjectID } from 'bson';

// Provide the Realm App ID
export const appID = "<--YOUR APP SERVICES ID-->" 

// Provide the configured customer profile
export const realmUser = {
    username: "demo",
    password: "demopw"
}

export const vin = "5UXFE83578L342684"; // https://vingenerator.org/brand


export const vehicleConfig = {
    _id: vin,
    name: "My Car",
    owner_id: "",
    mixedTypes: "Change Type",
    isOn: false,
    commands: [],
    battery: { sn: "123", capacity: 1000, voltage: 50, current: 50 }
  }

// Provide the Realm App ID
export const appID = "<--YOUR APP SERVICES ID-->"

// Provide the configured Email/Password user account. 
// If you have changed the password while creating the user you must update it here too
export const realmUser = {
    username: "demo",
    password: "demopw"
}

// Create brand/vehicle type specific VINs https://vingenerator.org/brand
export const vin = "5UXFE83578L342684";

// Vehicle default configuration
export const vehicleConfig = {
    _id: vin,
    name: "My Car",
    owner_id: "",
    mixedTypes: "Change Type",
    isOn: false,
    commands: [],
    battery: { sn: "123", capacity: 1000, voltage: 50, current: 50 }
}
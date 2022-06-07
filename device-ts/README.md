# Typescript Sample Code for IoT Device

## Set up the Atlas backend
[Guide](https://github.com/mongodb-industry-solutions/Connected-Devices/blob/main/Guide%20-%20Digital%20Twin%20Sanbox%20Environment.pdf)

## Prepare and run "Device Simulator"

1. Update Realm App ID in ./src/congif.ts
2. cd ./device-ts
3. npm install
4. npx tsc
5. The file "index.html" in src is not automatically copied to build folder yet! -> just copy paste from src
6. node build/server.js
7. Open web console http://localhost:3000

## Prepare and run iOS mobile app

1. Open the Controller.xcodeproj with XCode
2. Open the config file ./mobile-swift/Controller/Config.xcconfig
3. Update Atlas_App_ID = <-- Your Atlas App ID -->
4. Run the the app. Sometimes after a fresh download I had to readd the Realm packages to be able to start the app. 

## Create and run docker image

1. docker build . -t device-ts
2. docker run -p 3000:3000 device-ts

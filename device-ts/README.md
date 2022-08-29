# Typescript Sample Code for IoT Device

## Prepare and run "Device Simulator"

1. Update Realm App ID in `./src/config.ts`
2. `cd ./device-ts`
3. `npm install`
4. `npm run build`
6. `npm start`
7. Open web console http://localhost:3000

## OPTIONAL Create and run docker image (to be verfied due to adding copyfiles!)

1. `docker build . -t device-ts`
2. `docker run -p 3000:3000 device-ts`

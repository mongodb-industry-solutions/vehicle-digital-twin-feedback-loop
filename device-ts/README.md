# Typescript Sample Code for IoT Device

## Prepare and run "Device Simulator"

1. Update Realm App ID in ./src/congif.ts
2. cd ./device-ts
3. npm install
4. npx tsc
5. The file "index.html" in src is not automatically copied to build folder yet! -> just copy paste from src
6. node build/server.js
7. Open web console http://localhost:3000

## OPTIONAL Create and run docker image

1. docker build . -t device-ts
2. docker run -p 3000:3000 device-ts

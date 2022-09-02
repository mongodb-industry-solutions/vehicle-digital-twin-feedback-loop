# Typescript Sample Code for IoT Device

## Prerequisits

Install [Node.js](https://nodejs.org/)

## Prepare and run "Device Simulator"

1. Update Realm App ID in `./src/config.ts`
2. `cd ./device-ts`
3. `npm install`
4. `npm run build`
6. `npm start`
7. Open web console http://localhost:3000

## Build and run "Device Simulator" in a container

Prerequisit:
- [Docker Desktop](https://www.docker.com/) (may require license!) or alternatively [Colima](https://github.com/abiosoft/colima)

1. `docker build . -t device-ts`
2. `docker run -p 3000:3000 device-ts`

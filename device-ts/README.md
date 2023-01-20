# Typescript Sample Code for Vehicle

## Prerequisites

Install [Node.js](https://nodejs.org/)

## Prepare and run "Device Simulator" locally

1. Update Realm App ID in `./src/config.ts`
2. `cd ./device-ts`
3. `npm install`
4. `npm run build`
6. `npm start`
7. Open web console http://localhost:3000

## Build and run "Device Simulator" locally in a container

Prerequisites:
- [Docker Desktop](https://www.docker.com/) (may require license!) or alternatively [Colima](https://github.com/abiosoft/colima)

1. `docker build . -t device-ts`
2. `docker run -p 3000:3000 device-ts`

## Build and run "Device Simulator" on AWS VM

1. `Sudo yum update`
2. `Sudo yum install docker`
3. `sudo systemctl enable docker.service`
4. `sudo systemctl start docker.service`
5. `git clone https://github.com/mongodb-industry-solutions/Connected-Products.git`
6. Change the config file app id
7. `sudo docker build . -t device-ts`
8. `sudo docker run -p 80:3000 device-ts`
9. Access simulator UI via http:// PUBLIC IP ADDRESS:80

# Typescript Sample Code for Vehicle Simulator

Here you will set up your vehicle simulator. We've provided three options for you to do so: locally, locally in a container, or on AWS VM. The most straightforward way is to run it locally, but you are free to choose the option best fit for you! 

## Prerequisites

Install [Node.js](https://nodejs.org/)

## Option 1: Prepare and run "Vehicle Simulator" locally

1. Update your App ID (from Part 1) in `./src/config.ts`
2. `cd ./vehicle-ts`
3. `npm install`
4. `npm run build`
6. `npm start`
7. Open web console http://localhost:3000

## Option 2: Build and run "Vehicle Simulator" locally in a container

Prerequisites:
- [Docker Desktop](https://www.docker.com/) (may require license!) or alternatively [Colima](https://github.com/abiosoft/colima)

1. `docker build . -t vehicle-ts`
2. `docker run -p 3000:3000 vehicle-ts`

## Option 3: Build and run "Vehicle Simulator" on AWS VM

1. `Sudo yum update`
2. `Sudo yum install docker`
3. `sudo systemctl enable docker.service`
4. `sudo systemctl start docker.service`
5. `git clone https://github.com/mongodb-industry-solutions/Connected-Products.git`
6. Change the config file app id
7. `sudo docker build . -t vehicle-ts`
8. `sudo docker run -p 80:3000 vehicle-ts`
9. Access simulator UI via http:// PUBLIC IP ADDRESS:80

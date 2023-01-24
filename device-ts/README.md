# Typescript Sample Code for Vehicle Simulator

Here you will set up your vehicle simulator. We've provided three options for you to do so: locally, locally in a container, or on AWS VM. The most straightforward way is to run it locally, but you are free to choose the option best fit for you! 

After you've completed one of the options, you should see the following: 
![till](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/VehicleGIF.gif)

## Prerequisites

Install [Node.js v17.9.0 or higher](https://nodejs.org/)

## Option 1: Prepare and run "Vehicle Simulator" locally

1. Update your App ID (from [Part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/atlas-backend/README.md)) in `./src/config.ts`
2. Run the following commands: 
      
      `cd ./vehicle-ts`
      
      `npm install`
      
      `npm run build`
      
      `npm start`
3. Open the web console http://localhost:3000. 

## Option 2: Build and run "Vehicle Simulator" locally in a container

Prerequisites:
- [Docker Desktop](https://www.docker.com/) (may require license!) or alternatively [Colima](https://github.com/abiosoft/colima)

1. Run the following commands: 
    
    `docker build . -t vehicle-ts`
    
    `docker run -p 3000:3000 vehicle-ts`

## Option 3: Build and run "Vehicle Simulator" on AWS VM

1. Run the following commands: 
      
      `Sudo yum update`
      
      `Sudo yum install docker`
      
      `sudo systemctl enable docker.service`

      `sudo systemctl start docker.service`

      `git clone https://github.com/mongodb-industry-solutions/Connected-Products.git`
2. Update your App ID (from [Part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/atlas-backend/README.md)) in `./src/config.ts`
3. Run the following commands:

      `sudo docker build . -t vehicle-ts`
      
      `sudo docker run -p 80:3000 vehicle-ts`
4. Access simulator UI via http:// PUBLIC IP ADDRESS:80


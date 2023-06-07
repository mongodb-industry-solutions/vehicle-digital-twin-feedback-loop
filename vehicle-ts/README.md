# Vehicle Simulator (TypeScript)

Here you will set up your vehicle simulator. We've provided three options for you to do so: locally, locally in a container, or on AWS VM. The most straightforward way is to run it locally, but you are free to choose the option best fit for you! 

After you've completed one of the options, you should see the following: 
![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/vehicle.png)

## Prerequisites

1. Install [Node.js](https://nodejs.org/)
* Tested with Node.js v19.6.0

## Option 1: Prepare and run "Vehicle Simulator" locally

1. Navigate into the vehicle-ts folder 
2. Update your App ID and the realmUser password if you have changed it while creating the atlas-backend (from [Part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/atlas-backend/README.md)) in `./src/realm/config.ts`
3. Run the following commands: 
      
      `npm install`
      
      `npm run build`
      
      `npm start`
4. Open the web console http://localhost:3000. 

## Intermediary Step:
For demonstration purposes, we've set up a quick intermediary step so that you do not have to create an AWS account and can quickly see the demo come into action! This means you can already test the demonstration as we have bridged the Amazon SageMaker loop with MongoDB to have the first feeling of success!  

However, if you are interested in running the demo with AWS integration, please refer to our Partner repository: [Setup Instructions for MongoDB and Amazon SageMaker Integration](https://github.com/mongodb-partners/Vehicle-Digital-Twin-Solution). There we'll instruct you how to connect the whole feedback loop. 

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

      `git clone https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop.git`
2. Update your App ID (from [Part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/atlas-backend/README.md)) in `./src/config.ts`
3. Run the following commands:

      `sudo docker build . -t vehicle-ts`
      
      `sudo docker run -p 3000:3000 vehicle-ts`
4. Access simulator UI via http:// PUBLIC IP ADDRESS:3000

Congrats! The second part is completed. Now you'll continue setting up the iOS Swift Vehicle Controller Mobile Application in [Part 3](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/tree/main/mobile-swift).


# Vehicle Controller App (iOS Swift)

Congrats! You've finished [part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend) and [part 2](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/device-ts) where you set up the Atlas Backend and created the vehicle simulator. Now we'll show you how to create the Vehicle Controller Mobile Application. 

## Prepare and run the iOS Vehicle Controller mobile app

1. Open the Controller.xcodeproj with XCode
2. Open the config file  ```./mobile-swift/Controller/Config.xcconfig```
3. Update ```Atlas_App_ID = <-- Your Atlas App ID -->```
4. Run the the app. Sometimes it may be required to reset the package caches in Xcode -> ```'File -> Packages -> Reset Package Caches'```
5. If you have changed the password for the user created in [part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend) update the password on the login screen!

![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/Mobileapp.png)

## Continue with Part 4 where you will integrate Amazon SageMaker
Part 4: [Set up the Amazon SageMaker Integration](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/aws-sagemaker)

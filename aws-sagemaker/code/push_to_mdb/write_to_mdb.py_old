import pymongo

def handler(event, context):
    try:
        #Read data passed to eventbus (e.g. sagemaker-lambda-partner)
        predicted_value = event['detail']['predicted_value']
        vin = event['detail']['vin']

        # Setup the variables for MongoDB Atlas Connection
        values = {
            "mongo-endpoint": "mongodb+srv://XXXX:XXXX@XXXX/?retryWrites=true&w=majority", # Update with your MongoDB connection string
            "region-name": "XXXX",  # Update your region
            "model-endpoint": "sagemaker-soln-XXXX",  # Update your sagemaker model endpoint
            "db": "XXXX", # Update your database name
            "col": "XXXX" # Update your collection name
        }

        
        ENDPOINT_NAME= values['model-endpoint'] 
        REGION_NAME = values['region-name']
        MONGO_ENDPOINT = values['mongo-endpoint']
        MONGO_DB = values['db']
        MONGO_COL = values['col']

        #Connect to MongoDB Atlas
        try: 
            client = pymongo.MongoClient(MONGO_ENDPOINT)
            db = client[MONGO_DB]
            print("Connected to MongoDB Atlas")
        except pymongo.errors.ConnectionFailure as e:
            print("Could not connect to MongoDB Atlas: %s" % e)
            exit()
        
        
        print("prediction: " + str(predicted_value))

        print("VIN: " + str(vin))


        try: 
            updateResult = db[MONGO_COL].update_one({"vin" : vin},{"$set": {"prediction": predicted_value, "error_message":"NotApplicable", "status": "Success"}})
            print("updated the document successfully")
            print("Matched %d documents." % updateResult.matched_count)
            print("Modified %d documents." % updateResult.modified_count)
            return "Updated : {} count : {}".format(predicted_value, updateResult.modified_count)
        
        except pymongo.errors.PyMongoError as e:
            print("An error occurred while updating the document: %s" % e)
            exit()

    except Exception as e:
        print("error" + str(e))
        updateResult = db[MONGO_COL].update_one(
            {"vin" : vin},
            {
                "$set": {"error_message": str(e), "status": "Failure"}
            }
        )
        raise e
   

import boto3
import json
import numpy as np
import pymongo
import os

def push_to_eventbus(predicted_value, EVENTBUS_NAME, REGION_NAME, vin):
    #Setting up client for AWS
    client = boto3.client('events',
                        region_name= REGION_NAME)
    #Creating JSON for pushing to eventbus
    detailJsonString = {"predicted_value": predicted_value, "vin": vin}

    print(detailJsonString)
    #Putting events to eventbus - sagemaker-lambda-partner
    response = client.put_events(
        Entries=[
            {
                'Source':'user-event',
                'DetailType':'user-preferences',
                'Detail':json.dumps(detailJsonString),
                'EventBusName': EVENTBUS_NAME
            }
        ]
    )

    return response

#lambda function start
def handler(event, context):
    try:
        ENDPOINT_NAME= os.environ['model_endpoint'] 
        REGION_NAME = os.environ['region_name']
        EVENTBUS_NAME = os.environ['eventbus_name']

        #enable the sagemaker runtime
        runtime=boto3.client('runtime.sagemaker',region_name=REGION_NAME)

        #Read data and format 
        read_arr = event['detail']['fullDocument']['read']
        vin = event['detail']['fullDocument']['vin']
        data = np.delete(read_arr,0,1).astype('float64').tolist()

        payload = json.dumps([data])
        #Prediction from model
        response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                        ContentType='application/json',
                                        Body=payload)

        out = json.loads(response['Body'].read().decode())[0]
        #Update result in mongo db
        prediction = 100*(1.0-out[0])
        response = push_to_eventbus(prediction, EVENTBUS_NAME, REGION_NAME, vin)
        return response

    except Exception as e:
        print("Exception: " + str(e))
        raise e

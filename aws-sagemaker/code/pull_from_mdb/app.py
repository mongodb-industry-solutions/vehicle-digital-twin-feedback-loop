import boto3
import json
import numpy as np
import pymongo

def push_to_eventbus(predicted_value, EVENTBUS_NAME, REGION_NAME, vin):
    #Setting up client for AWS
    client = boto3.client('events',
                        region_name= REGION_NAME)
    #Creating JSON for pushing to eventbus
    detailJsonString = {"predicted_value": predicted_value, "vin": vin}

    print(detailJsonString)
    #Putting events to eventbus
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
        values = {
            "region-name": "XXXX",  # Update your region
            "eventbus-name": "XXXXX", # Update the event-bus created 
            "model-endpoint": "sagemaker-soln-XXXX",  # Update your sagemaker model endpoint
        }
        
        ENDPOINT_NAME= values['model-endpoint'] 
        REGION_NAME = values['region-name']
        EVENTBUS_NAME = values['eventbus-name']

        #enable the sagemaker runtime
        runtime=boto3.client('runtime.sagemaker',region_name=REGION_NAME)

        #Read data and format 
        read_arr = event['detail']['read']
        vin = event['detail']['vin']

        payload = json.dumps([read_arr])
        
        print("payload for ML Model : " + str(payload))
        #Prediction from model
        response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                        ContentType='application/json',
                                        Body=payload)

        out = json.loads(response['Body'].read().decode())[0]
        #Update result in mongodb
        prediction = 100*(1.0-out[0])
        response = push_to_eventbus(prediction, EVENTBUS_NAME, REGION_NAME, vin)
        return response

    except Exception as e:
        print("Exception: " + str(e))
        

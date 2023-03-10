FROM amazon/aws-lambda-python:3.8

ADD app.py ./

RUN pip install 'pymongo[srv]'==3.11
RUN pip install boto3
RUN pip install numpy

CMD ["app.handler"]

FROM amazon/aws-lambda-python:3.8

ADD write_to_mdb.py ./

RUN pip install 'pymongo[srv]'==3.11

CMD ["write_to_mdb.handler"]
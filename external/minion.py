import CpuSimple
import json
from time import sleep
import requests
import socket
import sys

url = 'http://powermaster:5000/api/cpusample'
headers = {'Content-Type': 'application/json'}
hostname = socket.gethostname()

while True:
    sample = CpuSimple.CpuSimple()
    jsond = json.dumps({"id":sample.id,"timestamp":sample.timestamp,"target_id":hostname,"cpu_load":sample.cpu_load,"temperature":sample.temperature})
    try:    
        response = requests.post(url, headers=headers, data=jsond)
        print(jsond)
        print(response)
    except requests.exceptions.ConnectionError as e:
        print 'Error connecting to database:', e
    sleep(0.1)

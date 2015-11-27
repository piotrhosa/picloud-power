import requests
import json
import uuid

url = 'http://localhost:5000/api/powersample'
headers = {'Content-Type': 'application/json'}
json = json.dumps({"id":uuid.uuid1().hex,"target_id":"target0","energy":0.0,"time":0,"power":0.0,
                   "peak_power":0.0,"peak_current":0.0,"peak_voltage":0.0})

#filters = []
#params = dict(q=json.dumps(dict(filters=filters)))

response = requests.post(url, headers=headers, data=json)
#assert response.status_code == 201
print(response.status_code)

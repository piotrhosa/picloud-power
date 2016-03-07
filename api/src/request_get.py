import requests
import json

url = 'http://127.0.0.1:5000/api/powersample'
headers = {'Content-Type': 'application/json'}

filters = []
params = dict(q=json.dumps(dict(filters=filters)))

response = requests.get(url, params=params, headers=headers)
#assert response.status_code == 200
print(response.json())
import unittest
import api_run
import requests
import uuid
import json
import time

class TestAPIWithJSON(unittest.TestCase):

    def test_powersample(self):
        api_run.create_run('test_data')
        time.sleep(10)
        url = 'http://localhost:5000/api/powersample'
        headers = {'Content-Type': 'application/json'}
        filters = []
        params = dict(q=json.dumps(dict(filters=filters)))

        json_test = json.dumps({
            "id": uuid.uuid1().hex,
            "target_id": 'test',
            "energy": 0.0,
            "time": 0.0,
            "timestamp": 0.0,
            "peak_power": 0.0,
            "peak_current": 0.0,
            "peak_voltage": 0.0,
            "avg_power": 0.0,
            "avg_current": 0.0,
            "avg_voltage": 0.0,
            "n_samples": 0})

        response = requests.post(url, headers=headers, data=json_test)
        self.assertEqual(response.status_code, 201)

if __name__ == '__main__':
    unittest.main()

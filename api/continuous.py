#!/usr/bin/python

# Output continuous data in CSV format

import pyenergy
from time import sleep
import requests
import json
import uuid
import datetime
import time

url = 'http://localhost:5000/api/powersample'
rate_url = 'http://localhost:5000/api/config'
headers = {'Content-Type': 'application/json'}

em = pyenergy.EnergyMonitor("EE00")
em.connect()

em.enableMeasurementPoint(1)
em.enableMeasurementPoint(2)
em.enableMeasurementPoint(3)
em.start(1)
em.start(2)
em.start(3)

filters = []
params = dict(q=json.dumps(dict(filters=filters)))

print "kupa"

#response = requests.get(rate_url, params=params, headers=headers)

#data = json.loads(response.text)
#obj = data[u'objects']
#ob = obj[0]
#rate = float(ob[u'rate'])

#print rate

while True:
    print "AGAIN"
    m = em.getMeasurement(1)
    t = datetime.datetime.now()
    ut = int(time.mktime(t.timetuple()) * 1000) + int(t.microsecond/1000)

    m1 = em.getMeasurement(2)
    t1 = datetime.datetime.utcnow()
    ut1 = int(time.mktime(t1.timetuple()) * 1000) + int(t1.microsecond/1000)

    m2 = em.getMeasurement(3)
    t2 = datetime.datetime.utcnow()
    ut2 = int(time.mktime(t2.timetuple()) * 1000) + int(t2.microsecond/1000)

    jsond = json.dumps({"id":uuid.uuid1().hex,"target_id":"cluster","energy":m.energy,"time":m.time,"timestamp":ut,
                   "peak_power":m.peak_power,"peak_current":m.peak_current,"peak_voltage":m.peak_voltage,
                   "avg_power":m.avg_power,"avg_current":m.avg_current,"avg_voltage":m.avg_voltage,"n_samples":m.n_samples})
    response = requests.post(url, headers=headers, data=jsond)
    print jsond

    jsond = json.dumps({"id":uuid.uuid1().hex,"target_id":"master","energy":m1.energy,"time":m1.time,"timestamp":ut1,
                   "peak_power":m1.peak_power,"peak_current":m1.peak_current,"peak_voltage":m1.peak_voltage,
                   "avg_power":m1.avg_power,"avg_current":m1.avg_current,"avg_voltage":m1.avg_voltage,"n_samples":m1.n_samples})
    response = requests.post(url, headers=headers, data=jsond)

    jsond = json.dumps({"id":uuid.uuid1().hex,"target_id":"minion","energy":m2.energy,"time":m2.time,"timestamp":ut2,
                   "peak_power":m2.peak_power,"peak_current":m2.peak_current,"peak_voltage":m2.peak_voltage,
                   "avg_power":m2.avg_power,"avg_current":m2.avg_current,"avg_voltage":m2.avg_voltage,"n_samples":m2.n_samples})
    response = requests.post(url, headers=headers, data=jsond)

    sleep(0.1)

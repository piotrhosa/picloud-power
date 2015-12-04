#!/usr/bin/python

# Output continuous data in CSV format

import requests
import json
import uuid

import pyenergy
from time import sleep

url = 'http://localhost:5000/api/powersample'
headers = {'Content-Type': 'application/json'}

em = pyenergy.EnergyMonitor("EE00")
em.connect()

em.enableMeasurementPoint(1)
em.start()

print "energy, time, power, peak_power, peak_current, peak_voltage"
while True:
    m = em.getMeasurement()

    print "{}, {}, {}, {}, {}, {}".format(m.energy, m.time, m.energy/m.time, m.peak_power, m.avg_current, m.avg_voltage)
    json = json.dumps({"id":uuid.uuid1().hex,"target_id":"target0","energy":m.energy,"time":m.time,"power":m.energy/m.time,
                   "peak_power":m.peak_power,"peak_current":m.avg_current,"peak_voltage":m.avg_voltage})
    sleep(0.1)

#!/usr/bin/python

# Post continuous data to database
# Author: Piotr Hosa, University of Glasgow

import pyenergy
import requests
import json
import uuid
import datetime
import time
import sys
from time import sleep

# Declare parameters for requests
url = 'http://localhost:5000/api/powersample'
headers = {'Content-Type': 'application/json'}
filters = []
params = dict(q=json.dumps(dict(filters=filters)))

# Measurement target names
M1_NAME = 'pi0'
M2_NAME = 'pi1'
M3_NAME = 'pi2'

# Data for handling code in exceptions
connection_dropped = False
dot_limit = 3
dots = 0

# Declare monitor over serial link and connect
em = pyenergy.EnergyMonitor("EE00")
em.connect()

# Establish measurement points and start measurements
em.enableMeasurementPoint(1)
em.enableMeasurementPoint(2)
em.enableMeasurementPoint(3)
em.start(1)
em.start(2)
em.start(3)

while True:
    m1 = em.getMeasurement(1)
    t1 = datetime.datetime.now()
    timestamp1 = int(time.mktime(t1.timetuple()) * 1000) + int(t1.microsecond / 1000)

    m2 = em.getMeasurement(2)
    t2 = datetime.datetime.utcnow()
    timestamp2 = int(time.mktime(t2.timetuple()) * 1000) + int(t2.microsecond / 1000)

    m3 = em.getMeasurement(3)
    t3 = datetime.datetime.utcnow()
    timestamp3 = int(time.mktime(t3.timetuple()) * 1000) + int(t3.microsecond / 1000)

    json_data1 = json.dumps({
                   "id": uuid.uuid1().hex,
                   "target_id": M1_NAME,
                   "energy": m1.energy,
                   "time": m1.time,
                   "timestamp": timestamp1,
                   "peak_power": m1.peak_power,
                   "peak_current": m1.peak_current,
                   "peak_voltage": m1.peak_voltage,
                   "avg_power": m1.avg_power,
                   "avg_current": m1.avg_current,
                   "avg_voltage": m1.avg_voltage,
                   "n_samples": m1.n_samples})

    json_data2 = json.dumps({
                   "id": uuid.uuid1().hex,
                   "target_id": M2_NAME,
                   "energy": m2.energy,
                   "time": m2.time,
                   "timestamp": timestamp2,
                   "peak_power": m2.peak_power,
                   "peak_current": m2.peak_current,
                   "peak_voltage": m2.peak_voltage,
                   "avg_power": m2.avg_power,
                   "avg_current": m2.avg_current,
                   "avg_voltage": m2.avg_voltage,
                   "n_samples": m2.n_samples})

    json_data3 = json.dumps({
                   "id": uuid.uuid1().hex,
                   "target_id": M3_NAME,
                   "energy": m3.energy,
                   "time": m3.time,
                   "timestamp": timestamp3,
                   "peak_power": m3.peak_power,
                   "peak_current": m3.peak_current,
                   "peak_voltage": m3.peak_voltage,
                   "avg_power": m3.avg_power,
                   "avg_current": m3.avg_current,
                   "avg_voltage": m3.avg_voltage,
                   "n_samples": m3.n_samples})

    try:
        response1 = requests.post(url, headers=headers, data=json_data1)
        print json_data1
        response2 = requests.post(url, headers=headers, data=json_data2)
        print json_data2
        response3 = requests.post(url, headers=headers, data=json_data3)
        print json_data3
	
        connection_dropped = False

    except requests.exceptions.ConnectionError as e:
        if not connection_dropped: 
            print 'Error connecting to database:', e

        connection_dropped = True
        if dots <= dot_limit:
            dots = dots + 1
        else:
            dots = 0

        dots_str = '.' * dots

        sys.stdout.write('Waiting for connection to be established |' + dots_str + '|' +  '\r')
        sys.stdout.write("\r")
        sys.stdout.flush()
    sleep(0.1)

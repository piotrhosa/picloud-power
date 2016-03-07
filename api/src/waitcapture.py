import time
import datetime
import requests
import json
#import powersample
import csv

def wait_capture(start, finish, email, mode, target=None):
    t = datetime.datetime.now()
    ut = int(time.mktime(t.timetuple()) * 1000) + int(t.microsecond/1000)
    waitingSec = int(finish / 1000) - int(time.mktime(t.timetuple()))

    if waitingSec > 0: time.sleep(waitingSec)

    url_power = 'http://localhost:5000/api/powersample'
    url_cpu = 'http://localhost:5000/api/cpusample'
    url = url_power if mode == 'power' else url_cpu
    headers = {'Content-Type': 'application/json'}
    filters = [dict(name='timestamp', op='<', val=finish),dict(name='timestamp', op='>', val=start)]
    if target is not None:
        filter = [{"name": 'target_id', "op": '==', "val": target}]
        filters = filters + filter
        print "appended filter"
    params = dict(q=json.dumps(dict(filters=filters)))
    response = requests.get(url, params=params, headers=headers)
    total_pages = response.json()['total_pages']
    objects = response.json()['objects']

    for i in range(2, total_pages):
        url_page = url + '?page=' + str(i) 
        response = requests.get(url_page, params=params, headers=headers)
        objects = objects + response.json()['objects']

    print objects

    file_name = 'gems_' + mode + '_samples_' + str(finish) + '.csv'
    print file_name
    print file_name
    with open(file_name, 'wb') as csvfile:
        samplewriter = csv.writer(csvfile, delimiter=',',quotechar='|', quoting=csv.QUOTE_MINIMAL)

        if mode == 'power':
            samplewriter.writerow(['id', 'timestamp', 'target_id', 'energy', 'time', 'peak_power','peak_current', 'peak_voltage', 'n_samples', 'avg_power', 'avg_current', 'avg_voltage'])
            for sample in objects:
                samplewriter.writerow([sample['id'], sample['timestamp'], sample['target_id'], sample['energy'], sample['time'], sample['peak_power'], sample['peak_current'], sample['peak_voltage'], sample['n_samples'], sample['avg_power'], sample['avg_current'], sample['avg_voltage']])
        else:
            samplewriter.writerow(['id', 'timestamp', 'target_id', 'temperature', 'cpu_load'])
            for sample in objects:
                samplewriter.writerow([sample['id'], sample['timestamp'], sample['target_id'], sample['temperature'], sample['cpu_load']])
         
    return file_name

import time
import datetime
import requests
import json
#import powersample
import csv

def wait_capture(start, finish, email):
    t = datetime.datetime.now()
    ut = int(time.mktime(t.timetuple()) * 1000) + int(t.microsecond/1000)
    waitingSec = int(finish / 1000) - int(time.mktime(t.timetuple()))
    print waitingSec
    if waitingSec > 0: time.sleep(waitingSec)

    url = 'http://localhost:5000/api/powersample'
    headers = {'Content-Type': 'application/json'}
    filters = [dict(name='timestamp', op='<', val=finish),dict(name='timestamp', op='>', val=start)]
    params = dict(q=json.dumps(dict(filters=filters)))
    response = requests.get(url, params=params, headers=headers)
    #print response.json()['objects'][0]

    file_name = 'gems_samples_' + str(finish) + '.csv'

    with open(file_name, 'wb') as csvfile:
        samplewriter = csv.writer(csvfile, delimiter=',',quotechar='|', quoting=csv.QUOTE_MINIMAL)

        for sample in response.json()['objects']:
            samplewriter.writerow([sample['id'], sample['timestamp'], sample['target_id'], sample['energy'], sample['time'], sample['peak_power'], sample['peak_current'], sample['peak_voltage'], sample['n_samples'], sample['avg_power'], sample['avg_current'], sample['avg_voltage']])

    return file_name
import time
import datetime
import subprocess
import uuid
import psutil

class CpuSimple:
    def __init__(self):
        self.timestamp = self.getTimestampMilis()
        self.id = uuid.uuid1().hex
        self.temperature = self.getTemperature()
        self.cpu_load = self.getCpuLoad()

    def getTimestampMilis(self):
        t = datetime.datetime.now()
        ut = int(time.mktime(t.timetuple()) * 1000) + int(t.microsecond/1000)
        return ut

    def getTemperature(self):
        bash_command = "/opt/vc/bin/vcgencmd measure_temp"
        process = subprocess.Popen(bash_command.split(), stdout=subprocess.PIPE)
        output = process.communicate()[0]
        output = float(output[5:-3])
        return output

    def getCpuLoad(self):
        return psutil.cpu_percent()        

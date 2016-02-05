#import subprocess

#bashCommand = "sudo salt 'alarmpi' cmd.shell 'echo 'kupa''"
#bashCommand = "echo 'kupa'"

#while True:
#process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
#output = process.communicate()[0]
#print output

import salt.client

local = salt.client.LocalClient()
resp = local.cmd('*', 'cmd.run', ['/opt/vc/bin/vcgencmd measure_temp'])
temp = resp['alarmpi']
temp = float(temp[5:-2])
print temp
### Readme

This application aims to visualize real time power consumption data in a web application. The subject of the measurements is the Glasgow Raspberry Pi Cloud. The data is provided by a power mesuring board. This system was developed as my final year project at the University of Glasgow in 2015-2016.

### Installation

#### Web Client
1. Install grunt and Bower by issuing the commands:
`$npm install -g bower`
`$npm install -g grunt-cli`

2. Install the dependencies using Bower from the app directory:
`$bower install`

3. You can serve the web app by executing the command:
`$grunt serve`

#### API and database
1. To install Python dependencies execture this command from the api directory:
`$pip install -r requirements.txt`

2. Serve the API:
`$python create_run.py`

#### Cluster nodes
1. Install the psutil library on Arch Linux:
2. `$pacman -Sy python2-psutil` Or on Raspbian: `$pip install psutil`

2. Place minion.py and CpuSimple.py on the nodes
3. Execute script:
`$python2 minion.py`

#### Power reporting
1. Get the pyenergy Python library:
`$pip install pyenergy`

2. Execute the continuous.py script:
`$python continuous.py`

## Author
Piotr Hosa

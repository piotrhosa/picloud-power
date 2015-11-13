# API

## Must have
1. Real-time graph in the main page that shows power, temperature and load for the whole cluster
2. Alert queue in the main page that updates whenever there is an event that indicates a fault
3. A graphical representation of the cluster with color-coded states that gives an overview and allows to further investigate clicked node and opens a new view
4. The detailed view for each node must contain basic information about it (address, name, up time, alert rate) and also show a real-time graph for power, temperature and load for this node
5. CSV storage that keeps all the records and makes them available for later
6. Cross-browser compatibility for the 3 most common browsers (Chrome, Firefox, IE)
7. Compatibility with Arch for the API
8. Responsiveness??
9. Authentiction?? 

## Should have
1. All graphs should have an option to toggle between viewing power, temperature and load, some of them, or all of them.
2. An indication of whether the power measurement board is active
3. The option to change the sampling frequency and to zoom in and out in graphs
4. The facility to reboot nodes remotely in case of node failure
5. Compatibility with two less common browsers (Safari and Opera)
6. Compatibility with Ubuntu for the API

## Could have
1. If cluster managed by Kubernetes, could have a list of pods for each node in the GUI
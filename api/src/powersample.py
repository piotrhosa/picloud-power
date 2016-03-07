class PowerSample:
    def __init__(self, id, timestamp, target_id, energy, time, peak_power, peak_current, peak_voltage, n_samples, avg_power, avg_current, avg_voltage):
        self.id = id
        self.timestamp = timestamp
        self.target_id = target_id
        self.energy = energy
        self.time = time
        self.peak_power = peak_power
        self.peak_current = peak_current
        self.peak_voltage = peak_voltage
        self.n_samples = n_samples
        self.avg_power = avg_power
        self.avg_current = avg_current
        self.avg_voltage = avg_voltage

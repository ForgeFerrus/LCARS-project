// LCARS OS Core System
class LCARSOS {
    constructor() {
        this.startTime = Date.now();
        this.processes = [];
        this.init();
    }

    init() {
        this.updateStardate();
        this.updateUptime();
        
        // Update stardate every second
        setInterval(() => this.updateStardate(), 1000);
        
        // Update uptime every second
        setInterval(() => this.updateUptime(), 1000);
    }

    updateStardate() {
        // Calculate Star Trek style stardate
        const now = new Date();
        const year = now.getFullYear();
        const dayOfYear = Math.floor((now - new Date(year, 0, 0)) / 1000 / 60 / 60 / 24);
        const stardate = ((year - 2000) * 1000) + dayOfYear + (now.getHours() / 24);
        document.getElementById('stardate').textContent = `STARDATE: ${stardate.toFixed(2)}`;
    }

    updateUptime() {
        const uptime = Date.now() - this.startTime;
        const hours = Math.floor(uptime / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);
        
        const uptimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const uptimeEl = document.getElementById('uptime');
        if (uptimeEl) {
            uptimeEl.textContent = uptimeStr;
        }
    }

    addProcess(name) {
        this.processes.push({
            name: name,
            pid: Math.floor(Math.random() * 10000),
            startTime: Date.now()
        });
        this.updateProcessCount();
    }

    removeProcess(name) {
        this.processes = this.processes.filter(p => p.name !== name);
        this.updateProcessCount();
    }

    updateProcessCount() {
        const statusElements = document.querySelectorAll('.status-item .status-value');
        if (statusElements[2]) {
            statusElements[2].textContent = this.processes.length;
        }
    }

    getSystemInfo() {
        return {
            version: '1.0.0',
            platform: 'LCARS',
            uptime: Date.now() - this.startTime,
            processes: this.processes.length,
            memory: {
                total: '16 GB',
                used: '4.2 GB',
                available: '11.8 GB'
            },
            cpu: {
                model: 'Quantum Core Processor',
                cores: 8,
                usage: Math.floor(Math.random() * 30) + 10
            },
            network: {
                status: 'Connected',
                interface: 'Subspace Network Adapter',
                speed: '10 Gbps'
            }
        };
    }
}

// Initialize LCARS OS
window.lcarsos = new LCARSOS();

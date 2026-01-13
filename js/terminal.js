// Terminal System
class Terminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.history = [];
        this.historyIndex = -1;
        this.currentPath = '/home/user';
        
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clear(),
            ls: () => this.listFiles(),
            pwd: () => this.printWorkingDirectory(),
            cd: (args) => this.changeDirectory(args),
            echo: (args) => this.echo(args),
            date: () => this.showDate(),
            whoami: () => this.whoami(),
            system: () => this.systemInfo(),
            processes: () => this.showProcesses(),
            'ai-build': (args) => this.aiBuild(args),
            'ai-update': (args) => this.aiUpdate(args),
            'ai-maintain': () => this.aiMaintain()
        };
        
        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });
        
        this.writeLine('LCARS Terminal v1.0 - Type "help" for available commands', 'info');
    }

    executeCommand() {
        const input = this.input.value.trim();
        if (!input) return;
        
        this.writeLine(`LCARS> ${input}`);
        this.history.push(input);
        this.historyIndex = this.history.length;
        
        const [cmd, ...args] = input.split(' ');
        const command = this.commands[cmd.toLowerCase()];
        
        if (command) {
            command(args.join(' '));
        } else {
            this.writeLine(`Command not found: ${cmd}`, 'error');
            this.writeLine('Type "help" for available commands', 'info');
        }
        
        this.input.value = '';
    }

    navigateHistory(direction) {
        this.historyIndex += direction;
        if (this.historyIndex < 0) this.historyIndex = 0;
        if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            this.input.value = '';
        } else {
            this.input.value = this.history[this.historyIndex];
        }
    }

    writeLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    clear() {
        this.output.innerHTML = '';
    }

    showHelp() {
        this.writeLine('Available commands:', 'info');
        this.writeLine('  help          - Show this help message');
        this.writeLine('  clear         - Clear terminal screen');
        this.writeLine('  ls            - List files in current directory');
        this.writeLine('  pwd           - Print working directory');
        this.writeLine('  cd [dir]      - Change directory');
        this.writeLine('  echo [text]   - Print text to terminal');
        this.writeLine('  date          - Show current date and time');
        this.writeLine('  whoami        - Show current user');
        this.writeLine('  system        - Show system information');
        this.writeLine('  processes     - Show running processes');
        this.writeLine('  ai-build      - Use AI to build interface components');
        this.writeLine('  ai-update     - Use AI to update system');
        this.writeLine('  ai-maintain   - Run AI system maintenance');
    }

    listFiles() {
        const files = window.filesystem ? window.filesystem.getCurrentFiles() : [];
        if (files.length === 0) {
            this.writeLine('Directory is empty');
        } else {
            files.forEach(file => {
                const icon = file.type === 'folder' ? '📁' : '📄';
                this.writeLine(`${icon} ${file.name}`);
            });
        }
    }

    printWorkingDirectory() {
        this.writeLine(this.currentPath);
    }

    changeDirectory(path) {
        if (!path) {
            this.currentPath = '/home/user';
            this.writeLine(`Changed to ${this.currentPath}`, 'success');
        } else if (path === '..') {
            const parts = this.currentPath.split('/').filter(p => p);
            parts.pop();
            this.currentPath = '/' + parts.join('/');
            this.writeLine(`Changed to ${this.currentPath}`, 'success');
        } else {
            this.currentPath = path.startsWith('/') ? path : `${this.currentPath}/${path}`;
            this.writeLine(`Changed to ${this.currentPath}`, 'success');
        }
    }

    echo(text) {
        this.writeLine(text);
    }

    showDate() {
        this.writeLine(new Date().toString());
    }

    whoami() {
        this.writeLine('lcars-user');
    }

    systemInfo() {
        const info = window.lcarsos.getSystemInfo();
        this.writeLine('=== SYSTEM INFORMATION ===', 'info');
        this.writeLine(`Version: ${info.version}`);
        this.writeLine(`Platform: ${info.platform}`);
        this.writeLine(`Processes: ${info.processes}`);
        this.writeLine(`CPU: ${info.cpu.model} (${info.cpu.cores} cores)`);
        this.writeLine(`Memory: ${info.memory.used} / ${info.memory.total}`);
        this.writeLine(`Network: ${info.network.status} (${info.network.speed})`);
    }

    showProcesses() {
        const processes = window.lcarsos.processes;
        if (processes.length === 0) {
            this.writeLine('No processes running');
        } else {
            this.writeLine('PID    NAME', 'info');
            processes.forEach(proc => {
                this.writeLine(`${proc.pid}   ${proc.name}`);
            });
        }
    }

    aiBuild(component) {
        if (!component) {
            this.writeLine('Usage: ai-build [component-name]', 'error');
            return;
        }
        this.writeLine(`AI Agent: Building ${component}...`, 'info');
        setTimeout(() => {
            this.writeLine(`AI Agent: Successfully created ${component} interface`, 'success');
            this.writeLine(`AI Agent: Component registered in application launcher`, 'success');
        }, 1500);
    }

    aiUpdate(feature) {
        if (!feature) {
            this.writeLine('Usage: ai-update [feature-name]', 'error');
            return;
        }
        this.writeLine(`AI Agent: Updating ${feature}...`, 'info');
        setTimeout(() => {
            this.writeLine(`AI Agent: Successfully updated ${feature}`, 'success');
            this.writeLine(`AI Agent: System reinitialized`, 'success');
        }, 1500);
    }

    aiMaintain() {
        this.writeLine('AI Agent: Running system maintenance...', 'info');
        const tasks = [
            'Scanning file system integrity',
            'Optimizing memory allocation',
            'Checking for updates',
            'Verifying security protocols',
            'Cleaning temporary files'
        ];
        
        tasks.forEach((task, index) => {
            setTimeout(() => {
                this.writeLine(`AI Agent: ${task}... OK`, 'success');
                if (index === tasks.length - 1) {
                    this.writeLine('AI Agent: Maintenance completed successfully', 'success');
                }
            }, (index + 1) * 800);
        });
    }
}

// Initialize terminal when panel is active
window.terminal = null;

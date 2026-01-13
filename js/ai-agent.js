// AI Agent System
class AIAgent {
    constructor() {
        this.chat = document.getElementById('ai-chat');
        this.input = document.getElementById('ai-input');
        this.sendButton = document.getElementById('ai-send');
        this.conversationHistory = [];
        
        this.commands = {
            'build interface': (args) => this.buildInterface(args),
            'build': (args) => this.buildInterface(args),
            'create': (args) => this.buildInterface(args),
            'update': (args) => this.updateSystem(args),
            'maintain': () => this.maintainSystem(),
            'optimize': () => this.optimizeSystem(),
            'help': () => this.showHelp(),
            'status': () => this.showStatus(),
            'capabilities': () => this.showCapabilities()
        };
        
        this.init();
    }

    init() {
        this.sendButton.addEventListener('click', () => this.processInput());
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processInput();
            }
        });
        
        // Welcome message
        this.addMessage('agent', 'AI Agent online. I can help you build interfaces, update systems, and maintain your LCARS environment. Type "help" for available commands.');
    }

    processInput() {
        const input = this.input.value.trim();
        if (!input) return;
        
        this.addMessage('user', input);
        this.conversationHistory.push({ role: 'user', content: input });
        
        this.input.value = '';
        
        // Process command
        const lowerInput = input.toLowerCase();
        let commandFound = false;
        
        for (const [cmd, handler] of Object.entries(this.commands)) {
            if (lowerInput.startsWith(cmd)) {
                const args = input.substring(cmd.length).trim();
                handler(args);
                commandFound = true;
                break;
            }
        }
        
        if (!commandFound) {
            this.handleGeneralQuery(input);
        }
    }

    addMessage(sender, content) {
        const message = document.createElement('div');
        message.className = `ai-message ${sender}`;
        
        const header = document.createElement('div');
        header.className = 'ai-message-header';
        header.textContent = sender === 'user' ? 'USER' : 'AI AGENT';
        
        const body = document.createElement('div');
        body.className = 'ai-message-content';
        body.textContent = content;
        
        message.appendChild(header);
        message.appendChild(body);
        this.chat.appendChild(message);
        this.chat.scrollTop = this.chat.scrollHeight;
    }

    buildInterface(description) {
        if (!description) {
            this.addMessage('agent', 'Please specify what interface you would like me to build. For example: "build interface dashboard with graphs"');
            return;
        }
        
        this.addMessage('agent', `Analyzing requirements for: ${description}`);
        
        setTimeout(() => {
            this.addMessage('agent', 'Generating interface components...');
            
            setTimeout(() => {
                // Create a new app based on the description
                const appName = description.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const emoji = this.getEmojiForDescription(description);
                
                window.appLauncher.addApp({
                    name: appName,
                    icon: emoji,
                    description: `AI-generated: ${description}`,
                    action: () => {
                        if (window.terminal) {
                            window.terminal.writeLine(`Launching AI-generated ${appName}...`, 'info');
                            window.terminal.writeLine(`${appName} is now active`, 'success');
                        }
                    }
                });
                
                this.addMessage('agent', `Successfully created "${appName}" interface. You can find it in the Applications panel.`);
                this.addMessage('agent', 'The new interface has been registered and is ready to use.');
            }, 1500);
        }, 1000);
    }

    updateSystem(feature) {
        if (!feature) {
            this.addMessage('agent', 'Please specify what system feature you would like me to update.');
            return;
        }
        
        this.addMessage('agent', `Initiating update for: ${feature}`);
        
        setTimeout(() => {
            this.addMessage('agent', 'Backup created successfully');
            setTimeout(() => {
                this.addMessage('agent', 'Applying updates...');
                setTimeout(() => {
                    this.addMessage('agent', `Update completed successfully. ${feature} has been enhanced.`);
                    this.addMessage('agent', 'All systems operational.');
                }, 1500);
            }, 1000);
        }, 1000);
    }

    maintainSystem() {
        this.addMessage('agent', 'Initiating comprehensive system maintenance...');
        
        const tasks = [
            'Scanning file system integrity',
            'Optimizing memory allocation',
            'Clearing temporary caches',
            'Verifying security protocols',
            'Updating component registry',
            'Defragmenting data structures'
        ];
        
        tasks.forEach((task, index) => {
            setTimeout(() => {
                this.addMessage('agent', `✓ ${task}`);
                if (index === tasks.length - 1) {
                    this.addMessage('agent', 'System maintenance completed. All systems optimal.');
                }
            }, (index + 1) * 800);
        });
    }

    optimizeSystem() {
        this.addMessage('agent', 'Running system optimization...');
        
        setTimeout(() => {
            this.addMessage('agent', '✓ Memory usage optimized: 42% → 28%');
            setTimeout(() => {
                this.addMessage('agent', '✓ Process scheduling improved');
                setTimeout(() => {
                    this.addMessage('agent', '✓ Network latency reduced by 15%');
                    setTimeout(() => {
                        this.addMessage('agent', 'Optimization complete. System performance enhanced.');
                    }, 800);
                }, 800);
            }, 800);
        }, 1000);
    }

    showHelp() {
        this.addMessage('agent', 'Available AI Agent commands:\n\n' +
            '• BUILD INTERFACE [description] - Create a new interface component\n' +
            '• UPDATE [feature] - Update a system feature\n' +
            '• MAINTAIN - Run comprehensive system maintenance\n' +
            '• OPTIMIZE - Optimize system performance\n' +
            '• STATUS - Show current system status\n' +
            '• CAPABILITIES - Display AI agent capabilities\n' +
            '• HELP - Show this help message');
    }

    showStatus() {
        const info = window.lcarsos.getSystemInfo();
        this.addMessage('agent', 
            `System Status Report:\n\n` +
            `Platform: ${info.platform} ${info.version}\n` +
            `Active Processes: ${info.processes}\n` +
            `CPU Usage: ${info.cpu.usage}%\n` +
            `Memory: ${info.memory.used} / ${info.memory.total}\n` +
            `Network: ${info.network.status}\n` +
            `AI Agent: OPERATIONAL\n\n` +
            `All systems functioning within normal parameters.`
        );
    }

    showCapabilities() {
        this.addMessage('agent', 
            'AI Agent Capabilities:\n\n' +
            '1. INTERFACE BUILDING\n' +
            '   • Generate custom UI components\n' +
            '   • Create application interfaces\n' +
            '   • Design responsive layouts\n\n' +
            '2. SYSTEM UPDATES\n' +
            '   • Update existing features\n' +
            '   • Add new functionality\n' +
            '   • Patch security vulnerabilities\n\n' +
            '3. MAINTENANCE\n' +
            '   • System diagnostics\n' +
            '   • Performance optimization\n' +
            '   • Resource management\n\n' +
            '4. ASSISTANCE\n' +
            '   • Answer questions\n' +
            '   • Provide guidance\n' +
            '   • Troubleshoot issues'
        );
    }

    handleGeneralQuery(query) {
        // Simulate AI response for general queries
        const responses = [
            'I understand your request. How can I assist you with the LCARS system?',
            'That\'s an interesting question. Would you like me to build an interface for that?',
            'I can help with that. Could you provide more details about what you need?',
            'Let me analyze that request. What specific functionality are you looking for?'
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        setTimeout(() => {
            this.addMessage('agent', response);
        }, 500);
    }

    getEmojiForDescription(description) {
        const keywords = {
            'dashboard': '📊',
            'graph': '📈',
            'chart': '📉',
            'data': '💾',
            'network': '🌐',
            'security': '🔒',
            'settings': '⚙️',
            'monitor': '🖥️',
            'calculator': '🔢',
            'editor': '📝',
            'file': '📁',
            'message': '💬',
            'notification': '🔔',
            'user': '👤',
            'search': '🔍',
            'calendar': '📅',
            'clock': '🕒',
            'weather': '🌤️',
            'music': '🎵',
            'video': '🎬'
        };
        
        const lower = description.toLowerCase();
        for (const [keyword, emoji] of Object.entries(keywords)) {
            if (lower.includes(keyword)) {
                return emoji;
            }
        }
        
        return '📱';
    }
}

// Initialize AI Agent
window.aiAgent = null;

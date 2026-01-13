// Application Launcher System
class AppLauncher {
    constructor() {
        this.apps = [
            {
                id: 'calculator',
                name: 'Calculator',
                icon: '🔢',
                description: 'Scientific calculator',
                action: () => this.launchCalculator()
            },
            {
                id: 'text-editor',
                name: 'Text Editor',
                icon: '📝',
                description: 'LCARS text editor',
                action: () => this.launchTextEditor()
            },
            {
                id: 'diagnostics',
                name: 'Diagnostics',
                icon: '🔧',
                description: 'System diagnostics tool',
                action: () => this.launchDiagnostics()
            },
            {
                id: 'network',
                name: 'Network',
                icon: '🌐',
                description: 'Network monitoring',
                action: () => this.launchNetwork()
            },
            {
                id: 'data-analyzer',
                name: 'Data Analyzer',
                icon: '📊',
                description: 'Data analysis tools',
                action: () => this.launchDataAnalyzer()
            },
            {
                id: 'interface-builder',
                name: 'Interface Builder',
                icon: '🎨',
                description: 'Build custom interfaces with AI',
                action: () => this.launchInterfaceBuilder()
            }
        ];
    }

    render() {
        const grid = document.getElementById('app-grid');
        grid.innerHTML = '';
        
        this.apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = `
                <div class="app-icon">${app.icon}</div>
                <div class="app-name">${app.name}</div>
                <div class="app-description">${app.description}</div>
            `;
            card.onclick = () => {
                window.lcarsos.addProcess(app.name);
                app.action();
            };
            grid.appendChild(card);
        });
    }

    launchCalculator() {
        if (window.terminal) {
            window.terminal.writeLine('Launching Calculator...', 'info');
            window.terminal.writeLine('Calculator interface loaded', 'success');
        }
    }

    launchTextEditor() {
        if (window.terminal) {
            window.terminal.writeLine('Launching Text Editor...', 'info');
            window.terminal.writeLine('Text Editor ready', 'success');
        }
    }

    launchDiagnostics() {
        if (window.terminal) {
            window.terminal.writeLine('Running system diagnostics...', 'info');
            setTimeout(() => {
                window.terminal.writeLine('All systems nominal', 'success');
            }, 1000);
        }
    }

    launchNetwork() {
        if (window.terminal) {
            window.terminal.writeLine('Network Monitor activated', 'info');
            window.terminal.writeLine('Subspace connection: ACTIVE', 'success');
            window.terminal.writeLine('Bandwidth: 10 Gbps', 'success');
        }
    }

    launchDataAnalyzer() {
        if (window.terminal) {
            window.terminal.writeLine('Data Analyzer initialized', 'info');
            window.terminal.writeLine('Ready to process data streams', 'success');
        }
    }

    launchInterfaceBuilder() {
        if (window.terminal) {
            window.terminal.writeLine('AI Interface Builder activated', 'info');
            window.terminal.writeLine('AI Agent standing by for instructions', 'success');
        }
        // Switch to AI Agent panel
        document.querySelector('[data-action="ai-agent"]').click();
    }

    addApp(app) {
        this.apps.push({
            id: app.id || `app-${Date.now()}`,
            name: app.name,
            icon: app.icon || '📱',
            description: app.description || 'Custom application',
            action: app.action || (() => {
                if (window.terminal) {
                    window.terminal.writeLine(`Launching ${app.name}...`, 'info');
                }
            })
        });
        this.render();
    }
}

// Initialize app launcher
window.appLauncher = new AppLauncher();

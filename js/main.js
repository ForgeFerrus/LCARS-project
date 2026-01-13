// Main Application Controller
class LCARSApp {
    constructor() {
        this.currentPanel = 'welcome-panel';
        this.init();
    }

    init() {
        // Set up navigation
        const buttons = document.querySelectorAll('[data-action]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.switchPanel(action);
            });
        });

        // Initialize subsystems
        this.initializeSubsystems();
        
        // Show welcome panel
        this.switchPanel('welcome');
    }

    switchPanel(action) {
        // Hide all panels
        const panels = document.querySelectorAll('.content-panel');
        panels.forEach(panel => panel.classList.remove('active'));

        // Show selected panel
        let panelId = `${action}-panel`;
        if (action === 'welcome') {
            panelId = 'welcome-panel';
        }

        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.add('active');
            this.currentPanel = panelId;
            
            // Initialize panel-specific features
            this.initializePanel(action);
        }
    }

    initializePanel(action) {
        switch(action) {
            case 'terminal':
                if (!window.terminal) {
                    window.terminal = new Terminal();
                }
                document.getElementById('terminal-input').focus();
                break;
                
            case 'files':
                window.filesystem.render();
                break;
                
            case 'apps':
                window.appLauncher.render();
                break;
                
            case 'ai-agent':
                if (!window.aiAgent) {
                    window.aiAgent = new AIAgent();
                }
                document.getElementById('ai-input').focus();
                break;
                
            case 'system':
                this.displaySystemInfo();
                break;
        }
    }

    displaySystemInfo() {
        const info = window.lcarsos.getSystemInfo();
        const systemInfoEl = document.getElementById('system-info');
        
        systemInfoEl.innerHTML = `
            <div class="info-card">
                <h3>SYSTEM INFORMATION</h3>
                <div class="info-row">
                    <span class="info-label">Version:</span>
                    <span class="info-value">${info.version}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Platform:</span>
                    <span class="info-value">${info.platform}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Active Processes:</span>
                    <span class="info-value">${info.processes}</span>
                </div>
            </div>
            
            <div class="info-card">
                <h3>CPU INFORMATION</h3>
                <div class="info-row">
                    <span class="info-label">Model:</span>
                    <span class="info-value">${info.cpu.model}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Cores:</span>
                    <span class="info-value">${info.cpu.cores}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Usage:</span>
                    <span class="info-value">${info.cpu.usage}%</span>
                </div>
            </div>
            
            <div class="info-card">
                <h3>MEMORY</h3>
                <div class="info-row">
                    <span class="info-label">Total:</span>
                    <span class="info-value">${info.memory.total}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Used:</span>
                    <span class="info-value">${info.memory.used}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Available:</span>
                    <span class="info-value">${info.memory.available}</span>
                </div>
            </div>
            
            <div class="info-card">
                <h3>NETWORK</h3>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">${info.network.status}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Interface:</span>
                    <span class="info-value">${info.network.interface}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Speed:</span>
                    <span class="info-value">${info.network.speed}</span>
                </div>
            </div>
        `;
    }

    initializeSubsystems() {
        console.log('LCARS Development Environment initialized');
        console.log('All subsystems online');
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lcarsApp = new LCARSApp();
});

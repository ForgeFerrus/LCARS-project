// Application Launcher System
class AppLauncher {
    constructor() {
        this.apps = [
            {
                id: 'calculator',
                name: 'Калькулятор',
                icon: '🔢',
                description: 'Науковий калькулятор',
                action: () => this.launchCalculator()
            },
            {
                id: 'text-editor',
                name: 'Текстовий редактор',
                icon: '📝',
                description: 'Текстовий редактор LCARS',
                action: () => this.launchTextEditor()
            },
            {
                id: 'diagnostics',
                name: 'Діагностика',
                icon: '🔧',
                description: 'Інструмент системної діагностики',
                action: () => this.launchDiagnostics()
            },
            {
                id: 'network',
                name: 'Мережа',
                icon: '🌐',
                description: 'Моніторинг мережі',
                action: () => this.launchNetwork()
            },
            {
                id: 'data-analyzer',
                name: 'Аналізатор даних',
                icon: '📊',
                description: 'Інструменти аналізу даних',
                action: () => this.launchDataAnalyzer()
            },
            {
                id: 'interface-builder',
                name: 'Конструктор інтерфейсів',
                icon: '🎨',
                description: 'Створення власних інтерфейсів з AI',
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
            window.terminal.writeLine('Запуск Калькулятор...', 'info');
            window.terminal.writeLine('Інтерфейс калькулятора завантажено', 'success');
        }
    }

    launchTextEditor() {
        if (window.terminal) {
            window.terminal.writeLine('Запуск Текстовий редактор...', 'info');
            window.terminal.writeLine('Текстовий редактор готовий', 'success');
        }
    }

    launchDiagnostics() {
        if (window.terminal) {
            window.terminal.writeLine('Запуск системної діагностики...', 'info');
            setTimeout(() => {
                window.terminal.writeLine('Всі системи в нормі', 'success');
            }, 1000);
        }
    }

    launchNetwork() {
        if (window.terminal) {
            window.terminal.writeLine('Монітор мережі активовано', 'info');
            window.terminal.writeLine('Підпросторове з\'єднання: АКТИВНЕ', 'success');
            window.terminal.writeLine('Пропускна здатність: 10 Гбіт/с', 'success');
        }
    }

    launchDataAnalyzer() {
        if (window.terminal) {
            window.terminal.writeLine('Аналізатор даних ініціалізовано', 'info');
            window.terminal.writeLine('Готовий обробляти потоки даних', 'success');
        }
    }

    launchInterfaceBuilder() {
        if (window.terminal) {
            window.terminal.writeLine('Конструктор інтерфейсів AI активовано', 'info');
            window.terminal.writeLine('AI Агент очікує інструкцій', 'success');
        }
        // Switch to AI Agent panel
        document.querySelector('[data-action="ai-agent"]').click();
    }

    addApp(app) {
        this.apps.push({
            id: app.id || `app-${Date.now()}`,
            name: app.name,
            icon: app.icon || '📱',
            description: app.description || 'Власна програма',
            action: app.action || (() => {
                if (window.terminal) {
                    window.terminal.writeLine(`Запуск ${app.name}...`, 'info');
                }
            })
        });
        this.render();
    }
}

// Initialize app launcher
window.appLauncher = new AppLauncher();

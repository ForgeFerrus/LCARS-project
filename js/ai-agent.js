// AI Agent System
class AIAgent {
    constructor() {
        this.chat = document.getElementById('ai-chat');
        this.input = document.getElementById('ai-input');
        this.sendButton = document.getElementById('ai-send');
        this.conversationHistory = [];
        
        this.commands = {
            'побудувати інтерфейс': (args) => this.buildInterface(args),
            'побудувати': (args) => this.buildInterface(args),
            'створити': (args) => this.buildInterface(args),
            'build interface': (args) => this.buildInterface(args),
            'build': (args) => this.buildInterface(args),
            'create': (args) => this.buildInterface(args),
            'оновити': (args) => this.updateSystem(args),
            'update': (args) => this.updateSystem(args),
            'обслужити': () => this.maintainSystem(),
            'maintain': () => this.maintainSystem(),
            'оптимізувати': () => this.optimizeSystem(),
            'optimize': () => this.optimizeSystem(),
            'допомога': () => this.showHelp(),
            'help': () => this.showHelp(),
            'статус': () => this.showStatus(),
            'status': () => this.showStatus(),
            'можливості': () => this.showCapabilities(),
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
        this.addMessage('agent', 'AI Агент в мережі. Я можу допомогти вам будувати інтерфейси, оновлювати системи та підтримувати ваше середовище LCARS. Введіть "допомога" для доступних команд.');
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
        header.textContent = sender === 'user' ? 'КОРИСТУВАЧ' : 'AI АГЕНТ';
        
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
            this.addMessage('agent', 'Будь ласка, вкажіть, який інтерфейс ви хочете, щоб я побудував. Наприклад: "побудувати інтерфейс дашборду з графіками"');
            return;
        }
        
        this.addMessage('agent', `Аналіз вимог для: ${description}`);
        
        setTimeout(() => {
            this.addMessage('agent', 'Генерація компонентів інтерфейсу...');
            
            setTimeout(() => {
                // Create a new app based on the description
                const appName = description.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const emoji = this.getEmojiForDescription(description);
                
                window.appLauncher.addApp({
                    name: appName,
                    icon: emoji,
                    description: `Згенеровано AI: ${description}`,
                    action: () => {
                        if (window.terminal) {
                            window.terminal.writeLine(`Запуск згенерованого AI ${appName}...`, 'info');
                            window.terminal.writeLine(`${appName} тепер активний`, 'success');
                        }
                    }
                });
                
                this.addMessage('agent', `Успішно створено інтерфейс "${appName}". Ви можете знайти його в панелі Програм.`);
                this.addMessage('agent', 'Новий інтерфейс зареєстровано та готовий до використання.');
            }, 1500);
        }, 1000);
    }

    updateSystem(feature) {
        if (!feature) {
            this.addMessage('agent', 'Будь ласка, вкажіть, яку системну функцію ви хочете, щоб я оновив.');
            return;
        }
        
        this.addMessage('agent', `Ініціація оновлення для: ${feature}`);
        
        setTimeout(() => {
            this.addMessage('agent', 'Резервна копія успішно створена');
            setTimeout(() => {
                this.addMessage('agent', 'Застосування оновлень...');
                setTimeout(() => {
                    this.addMessage('agent', `Оновлення успішно завершено. ${feature} було покращено.`);
                    this.addMessage('agent', 'Всі системи працюють.');
                }, 1500);
            }, 1000);
        }, 1000);
    }

    maintainSystem() {
        this.addMessage('agent', 'Ініціація комплексного обслуговування системи...');
        
        const tasks = [
            'Сканування цілісності файлової системи',
            'Оптимізація розподілу пам\'яті',
            'Очищення тимчасових кешів',
            'Перевірка протоколів безпеки',
            'Оновлення реєстру компонентів',
            'Дефрагментація структур даних'
        ];
        
        tasks.forEach((task, index) => {
            setTimeout(() => {
                this.addMessage('agent', `✓ ${task}`);
                if (index === tasks.length - 1) {
                    this.addMessage('agent', 'Обслуговування системи завершено. Всі системи оптимальні.');
                }
            }, (index + 1) * 800);
        });
    }

    optimizeSystem() {
        this.addMessage('agent', 'Запуск оптимізації системи...');
        
        setTimeout(() => {
            this.addMessage('agent', '✓ Використання пам\'яті оптимізовано: 42% → 28%');
            setTimeout(() => {
                this.addMessage('agent', '✓ Планування процесів покращено');
                setTimeout(() => {
                    this.addMessage('agent', '✓ Затримка мережі зменшена на 15%');
                    setTimeout(() => {
                        this.addMessage('agent', 'Оптимізацію завершено. Продуктивність системи покращено.');
                    }, 800);
                }, 800);
            }, 800);
        }, 1000);
    }

    showHelp() {
        this.addMessage('agent', 'Доступні команди AI Агента:\n\n' +
            '• ПОБУДУВАТИ ІНТЕРФЕЙС [опис] - Створити новий компонент інтерфейсу\n' +
            '• ОНОВИТИ [функція] - Оновити системну функцію\n' +
            '• ОБСЛУЖИТИ - Запустити комплексне обслуговування системи\n' +
            '• ОПТИМІЗУВАТИ - Оптимізувати продуктивність системи\n' +
            '• СТАТУС - Показати поточний статус системи\n' +
            '• МОЖЛИВОСТІ - Показати можливості AI агента\n' +
            '• ДОПОМОГА - Показати це повідомлення');
    }

    showStatus() {
        const info = window.lcarsos.getSystemInfo();
        this.addMessage('agent', 
            `Звіт про статус системи:\n\n` +
            `Платформа: ${info.platform} ${info.version}\n` +
            `Активні процеси: ${info.processes}\n` +
            `Використання ЦП: ${info.cpu.usage}%\n` +
            `Пам'ять: ${info.memory.used} / ${info.memory.total}\n` +
            `Мережа: Підключено\n` +
            `AI Агент: ПРАЦЮЄ\n\n` +
            `Всі системи функціонують у межах нормальних параметрів.`
        );
    }

    showCapabilities() {
        this.addMessage('agent', 
            'Можливості AI Агента:\n\n' +
            '1. ПОБУДОВА ІНТЕРФЕЙСУ\n' +
            '   • Генерація власних компонентів UI\n' +
            '   • Створення інтерфейсів програм\n' +
            '   • Дизайн адаптивних макетів\n\n' +
            '2. ОНОВЛЕННЯ СИСТЕМИ\n' +
            '   • Оновлення існуючих функцій\n' +
            '   • Додавання нової функціональності\n' +
            '   • Виправлення вразливостей безпеки\n\n' +
            '3. ОБСЛУГОВУВАННЯ\n' +
            '   • Діагностика системи\n' +
            '   • Оптимізація продуктивності\n' +
            '   • Управління ресурсами\n\n' +
            '4. ДОПОМОГА\n' +
            '   • Відповіді на питання\n' +
            '   • Надання порад\n' +
            '   • Вирішення проблем'
        );
    }

    handleGeneralQuery(query) {
        // Simulate AI response for general queries
        const responses = [
            'Я розумію ваш запит. Як я можу допомогти вам з системою LCARS?',
            'Це цікаве питання. Бажаєте, щоб я побудував для цього інтерфейс?',
            'Я можу допомогти з цим. Чи могли б ви надати більше деталей про те, що вам потрібно?',
            'Дозвольте мені проаналізувати цей запит. Яку саме функціональність ви шукаєте?'
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

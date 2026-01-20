// Terminal System
class Terminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.history = [];
        this.historyIndex = -1;
        this.currentPath = '/home/user';
        
        this.commands = {
            допомога: () => this.showHelp(),
            help: () => this.showHelp(),
            очистити: () => this.clear(),
            clear: () => this.clear(),
            список: () => this.listFiles(),
            ls: () => this.listFiles(),
            шлях: () => this.printWorkingDirectory(),
            pwd: () => this.printWorkingDirectory(),
            зд: (args) => this.changeDirectory(args),
            cd: (args) => this.changeDirectory(args),
            ехо: (args) => this.echo(args),
            echo: (args) => this.echo(args),
            дата: () => this.showDate(),
            date: () => this.showDate(),
            хто: () => this.whoami(),
            whoami: () => this.whoami(),
            система: () => this.systemInfo(),
            system: () => this.systemInfo(),
            процеси: () => this.showProcesses(),
            processes: () => this.showProcesses(),
            'ai-побудувати': (args) => this.aiBuild(args),
            'ai-build': (args) => this.aiBuild(args),
            'ai-оновити': (args) => this.aiUpdate(args),
            'ai-update': (args) => this.aiUpdate(args),
            'ai-обслужити': () => this.aiMaintain(),
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
        
        this.writeLine('Термінал LCARS v1.0 - Введіть "допомога" для доступних команд', 'info');
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
            this.writeLine(`Команду не знайдено: ${cmd}`, 'error');
            this.writeLine('Введіть "допомога" для доступних команд', 'info');
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
        this.writeLine('Доступні команди:', 'info');
        this.writeLine('  допомога       - Показати це повідомлення');
        this.writeLine('  очистити       - Очистити екран терміналу');
        this.writeLine('  список         - Показати файли в поточній директорії');
        this.writeLine('  шлях           - Показати поточну директорію');
        this.writeLine('  зд [дир]       - Змінити директорію');
        this.writeLine('  ехо [текст]    - Вивести текст у термінал');
        this.writeLine('  дата           - Показати поточну дату та час');
        this.writeLine('  хто            - Показати поточного користувача');
        this.writeLine('  система        - Показати системну інформацію');
        this.writeLine('  процеси        - Показати запущені процеси');
        this.writeLine('  ai-побудувати  - Використати AI для побудови компонентів інтерфейсу');
        this.writeLine('  ai-оновити     - Використати AI для оновлення системи');
        this.writeLine('  ai-обслужити   - Запустити обслуговування системи AI');
    }

    listFiles() {
        const files = window.filesystem ? window.filesystem.getCurrentFiles() : [];
        if (files.length === 0) {
            this.writeLine('Директорія порожня');
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
            this.writeLine(`Змінено на ${this.currentPath}`, 'success');
        } else if (path === '..') {
            const parts = this.currentPath.split('/').filter(p => p);
            parts.pop();
            this.currentPath = '/' + parts.join('/');
            this.writeLine(`Змінено на ${this.currentPath}`, 'success');
        } else {
            this.currentPath = path.startsWith('/') ? path : `${this.currentPath}/${path}`;
            this.writeLine(`Змінено на ${this.currentPath}`, 'success');
        }
    }

    echo(text) {
        this.writeLine(text);
    }

    showDate() {
        this.writeLine(new Date().toString());
    }

    whoami() {
        this.writeLine('користувач-lcars');
    }

    systemInfo() {
        const info = window.lcarsos.getSystemInfo();
        this.writeLine('=== СИСТЕМНА ІНФОРМАЦІЯ ===', 'info');
        this.writeLine(`Версія: ${info.version}`);
        this.writeLine(`Платформа: ${info.platform}`);
        this.writeLine(`Процеси: ${info.processes}`);
        this.writeLine(`ЦП: Квантовий процесор (${info.cpu.cores} ядер)`);
        this.writeLine(`Пам'ять: ${info.memory.used} / ${info.memory.total}`);
        this.writeLine(`Мережа: Підключено (${info.network.speed})`);
    }

    showProcesses() {
        const processes = window.lcarsos.processes;
        if (processes.length === 0) {
            this.writeLine('Немає запущених процесів');
        } else {
            this.writeLine('PID    НАЗВА', 'info');
            processes.forEach(proc => {
                this.writeLine(`${proc.pid}   ${proc.name}`);
            });
        }
    }

    aiBuild(component) {
        if (!component) {
            this.writeLine('Використання: ai-побудувати [назва-компонента]', 'error');
            return;
        }
        this.writeLine(`AI Агент: Побудова ${component}...`, 'info');
        setTimeout(() => {
            this.writeLine(`AI Агент: Успішно створено інтерфейс ${component}`, 'success');
            this.writeLine(`AI Агент: Компонент зареєстровано у запускачі програм`, 'success');
        }, 1500);
    }

    aiUpdate(feature) {
        if (!feature) {
            this.writeLine('Використання: ai-оновити [назва-функції]', 'error');
            return;
        }
        this.writeLine(`AI Агент: Оновлення ${feature}...`, 'info');
        setTimeout(() => {
            this.writeLine(`AI Агент: Успішно оновлено ${feature}`, 'success');
            this.writeLine(`AI Агент: Система переініціалізована`, 'success');
        }, 1500);
    }

    aiMaintain() {
        this.writeLine('AI Агент: Запуск обслуговування системи...', 'info');
        const tasks = [
            'Сканування цілісності файлової системи',
            'Оптимізація розподілу пам\'яті',
            'Перевірка оновлень',
            'Перевірка протоколів безпеки',
            'Очищення тимчасових файлів'
        ];
        
        tasks.forEach((task, index) => {
            setTimeout(() => {
                this.writeLine(`AI Агент: ${task}... ОК`, 'success');
                if (index === tasks.length - 1) {
                    this.writeLine('AI Агент: Обслуговування успішно завершено', 'success');
                }
            }, (index + 1) * 800);
        });
    }
}

// Initialize terminal when panel is active
window.terminal = null;

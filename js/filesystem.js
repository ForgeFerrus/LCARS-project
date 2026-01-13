// File System Simulation
class FileSystem {
    constructor() {
        this.currentPath = '/';
        this.files = {
            '/': {
                type: 'folder',
                name: '/',
                children: {
                    'home': {
                        type: 'folder',
                        name: 'home',
                        children: {
                            'user': {
                                type: 'folder',
                                name: 'user',
                                children: {
                                    'documents': {
                                        type: 'folder',
                                        name: 'documents',
                                        children: {
                                            'readme.txt': { type: 'file', name: 'readme.txt', content: 'Welcome to LCARS OS' }
                                        }
                                    },
                                    'projects': {
                                        type: 'folder',
                                        name: 'projects',
                                        children: {
                                            'lcars-ui.js': { type: 'file', name: 'lcars-ui.js', content: 'LCARS UI Components' }
                                        }
                                    },
                                    'config.json': { type: 'file', name: 'config.json', content: '{"theme": "lcars"}' }
                                }
                            }
                        }
                    },
                    'system': {
                        type: 'folder',
                        name: 'system',
                        children: {
                            'kernel.sys': { type: 'file', name: 'kernel.sys', content: 'System kernel' },
                            'drivers': {
                                type: 'folder',
                                name: 'drivers',
                                children: {}
                            }
                        }
                    },
                    'apps': {
                        type: 'folder',
                        name: 'apps',
                        children: {}
                    }
                }
            }
        };
    }

    render() {
        const tree = document.getElementById('file-tree');
        tree.innerHTML = '';
        this.renderNode(this.files['/'], tree, 0);
    }

    renderNode(node, parent, depth) {
        if (node.type === 'folder') {
            const folderEl = document.createElement('div');
            folderEl.className = 'folder-item';
            folderEl.style.paddingLeft = `${depth * 20}px`;
            folderEl.textContent = node.name;
            folderEl.onclick = () => this.toggleFolder(folderEl, node);
            parent.appendChild(folderEl);
            
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'folder-children';
            childrenContainer.style.display = 'block';
            parent.appendChild(childrenContainer);
            
            if (node.children) {
                Object.values(node.children).forEach(child => {
                    this.renderNode(child, childrenContainer, depth + 1);
                });
            }
        } else {
            const fileEl = document.createElement('div');
            fileEl.className = 'file-item';
            fileEl.style.paddingLeft = `${depth * 20}px`;
            fileEl.textContent = node.name;
            fileEl.onclick = () => this.openFile(node);
            parent.appendChild(fileEl);
        }
    }

    toggleFolder(element, node) {
        const next = element.nextElementSibling;
        if (next) {
            next.style.display = next.style.display === 'none' ? 'block' : 'none';
        }
    }

    openFile(file) {
        if (window.terminal) {
            window.terminal.writeLine(`Opening file: ${file.name}`, 'info');
            if (file.content) {
                window.terminal.writeLine(file.content);
            }
        }
    }

    getCurrentFiles() {
        // For terminal ls command
        const pathParts = this.currentPath.split('/').filter(p => p);
        let current = this.files['/'];
        
        for (const part of pathParts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            }
        }
        
        if (current.children) {
            return Object.values(current.children);
        }
        return [];
    }
}

// Initialize filesystem
window.filesystem = new FileSystem();

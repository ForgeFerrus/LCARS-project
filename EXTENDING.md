# Example: Adding a Custom Module to LCARS Interface

This guide shows how to create and integrate a new module into the LCARS interface.

## Step 1: Create Your Module File

Create a new file `modules/custom_module.py`:

```python
"""
Custom Module for LCARS Interface
Example module demonstrating the module interface
"""

import tkinter as tk
from tkinter import scrolledtext

class CustomModule:
    """Custom Example Module"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        
        # Create main frame
        self.frame = tk.Frame(parent)
        self.frame.pack(fill=tk.BOTH, expand=True)
        
        self.setup_ui()
        self.apply_colors(app.get_current_colors())
    
    def setup_ui(self):
        """Setup module UI"""
        # Title
        self.title = tk.Label(
            self.frame,
            text="CUSTOM MODULE",
            font=("Arial", 16, "bold"),
            pady=10
        )
        self.title.pack(fill=tk.X)
        
        # Content area
        self.content = scrolledtext.ScrolledText(
            self.frame,
            wrap=tk.WORD,
            font=("Arial", 11)
        )
        self.content.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        self.content.insert("1.0", "Your custom module content here!")
        
        # Button
        self.btn = tk.Button(
            self.frame,
            text="ACTION",
            font=("Arial", 12, "bold"),
            command=self.perform_action,
            width=15
        )
        self.btn.pack(pady=10)
        
        # Status bar
        self.status_bar = tk.Label(
            self.frame,
            text="READY",
            font=("Arial", 9),
            anchor="w",
            relief=tk.SUNKEN,
            padx=5
        )
        self.status_bar.pack(fill=tk.X, side=tk.BOTTOM)
    
    def perform_action(self):
        """Example action method"""
        self.content.insert(tk.END, "\nAction performed!")
        self.status_bar.config(text="Action completed")
    
    def apply_colors(self, colors):
        """Apply LCARS color scheme"""
        if not colors:
            return
        
        self.frame.configure(bg=colors['background'])
        self.title.configure(
            bg=colors['primary'],
            fg=colors['background']
        )
        self.content.configure(
            bg=colors['background'],
            fg=colors['text'],
            insertbackground=colors['text']
        )
        self.btn.configure(
            bg=colors['button'],
            fg=colors['text'],
            activebackground=colors['button_active']
        )
        self.status_bar.configure(
            bg=colors['primary'],
            fg=colors['background']
        )
```

## Step 2: Register Module in Package

Edit `modules/__init__.py` to include your module:

```python
"""
LCARS Interface Modules Package
"""

from .editor import EditorModule
from .ai_assistant import AIAssistantModule
from .filesystem import FilesystemModule
from .console import ConsoleModule
from .custom_module import CustomModule  # Add this line

__all__ = [
    'EditorModule',
    'AIAssistantModule',
    'FilesystemModule',
    'ConsoleModule',
    'CustomModule'  # Add this line
]
```

## Step 3: Configure Module

Add your module to `config/modules.json`:

```json
{
  "modules": [
    {
      "id": "editor",
      "name": "EDITOR",
      "description": "Text and Code Editor",
      "enabled": true
    },
    {
      "id": "ai",
      "name": "AI",
      "description": "AI Assistant (OpenAI Integration)",
      "enabled": true
    },
    {
      "id": "filesystem",
      "name": "FILESYSTEM",
      "description": "File Management System",
      "enabled": true
    },
    {
      "id": "console",
      "name": "CONSOLE",
      "description": "System Console",
      "enabled": true
    },
    {
      "id": "custom",
      "name": "CUSTOM",
      "description": "Custom Example Module",
      "enabled": true
    }
  ]
}
```

## Step 4: Integrate in Main Application

Edit `lcars_interface.py` to import and load your module:

1. Add import at the top:
```python
from modules.custom_module import CustomModule
```

2. Add case in `load_module()` method:
```python
def load_module(self, module_id):
    """Load and display a module"""
    # Clear current module
    if self.active_module_widget:
        self.active_module_widget.destroy()
    
    # Create new module
    if module_id == "editor":
        self.current_module = EditorModule(self.content_frame, self)
    elif module_id == "ai":
        self.current_module = AIAssistantModule(self.content_frame, self)
    elif module_id == "filesystem":
        self.current_module = FilesystemModule(self.content_frame, self)
    elif module_id == "console":
        self.current_module = ConsoleModule(self.content_frame, self)
    elif module_id == "custom":  # Add this
        self.current_module = CustomModule(self.content_frame, self)  # Add this
    
    # ... rest of method
```

## Step 5: Test Your Module

1. Run the application:
```bash
python lcars_interface.py
```

2. Click the "CUSTOM" button in the sidebar
3. Your module should load with LCARS styling
4. Try changing eras to see color updates

## Advanced Module Features

### Accessing App Resources

```python
# Get current era colors
colors = self.app.get_current_colors()

# Access configuration
era = self.app.current_era
modules = self.app.modules_config
```

### Threading for Long Operations

```python
import threading

def perform_long_action(self):
    self.status_bar.config(text="Processing...")
    thread = threading.Thread(target=self.long_task)
    thread.daemon = True
    thread.start()

def long_task(self):
    # Do work here
    result = expensive_operation()
    # Update UI in main thread
    self.frame.after(0, lambda: self.update_ui(result))
```

### File Dialog Integration

```python
from tkinter import filedialog

def select_file(self):
    filename = filedialog.askopenfilename(
        title="Select file",
        filetypes=[("All files", "*.*")]
    )
    if filename:
        self.process_file(filename)
```

### Message Boxes

```python
from tkinter import messagebox

def show_info(self):
    messagebox.showinfo("Info", "Operation completed")

def confirm_action(self):
    if messagebox.askyesno("Confirm", "Proceed?"):
        self.perform_action()
```

## Module Best Practices

1. **Always implement `apply_colors()`**: Ensure your module responds to era changes
2. **Use threading for slow operations**: Keep UI responsive
3. **Provide status feedback**: Update status bar for user actions
4. **Handle errors gracefully**: Use try/except and show user-friendly messages
5. **Store UI elements as instance variables**: Needed for color updates
6. **Follow LCARS aesthetic**: Use uppercase text, bold fonts, similar layouts
7. **Test with all eras**: Verify colors work with each palette

## Color Usage Guidelines

- **Primary**: Title bars, status bars, important UI elements
- **Secondary**: Secondary controls, dividers
- **Accent**: Highlights, hover states
- **Background**: Main background (usually black)
- **Text**: All text content
- **Button**: Button backgrounds
- **Button Active**: Button hover/active state

## Example: Network Status Module

Here's a more complex example showing a network monitoring module:

```python
import tkinter as tk
import socket
import threading

class NetworkModule:
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.frame = tk.Frame(parent)
        self.frame.pack(fill=tk.BOTH, expand=True)
        self.setup_ui()
        self.apply_colors(app.get_current_colors())
        self.update_network_info()
    
    def setup_ui(self):
        # Title
        self.title = tk.Label(
            self.frame,
            text="NETWORK STATUS",
            font=("Arial", 16, "bold"),
            pady=10
        )
        self.title.pack(fill=tk.X)
        
        # Network info display
        self.info_text = tk.Text(
            self.frame,
            font=("Courier New", 10),
            height=20,
            state=tk.DISABLED
        )
        self.info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Refresh button
        self.btn_refresh = tk.Button(
            self.frame,
            text="REFRESH",
            font=("Arial", 12, "bold"),
            command=self.update_network_info,
            width=15
        )
        self.btn_refresh.pack(pady=10)
        
        self.status_bar = tk.Label(
            self.frame,
            text="READY",
            font=("Arial", 9),
            anchor="w",
            relief=tk.SUNKEN,
            padx=5
        )
        self.status_bar.pack(fill=tk.X, side=tk.BOTTOM)
    
    def update_network_info(self):
        self.status_bar.config(text="Gathering network information...")
        thread = threading.Thread(target=self.get_network_info)
        thread.daemon = True
        thread.start()
    
    def get_network_info(self):
        info = []
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            
            info.append(f"Hostname: {hostname}")
            info.append(f"Local IP: {local_ip}")
            
            # Add more network info as needed
            
        except Exception as e:
            info.append(f"Error: {str(e)}")
        
        self.frame.after(0, lambda: self.display_info("\n".join(info)))
    
    def display_info(self, text):
        self.info_text.config(state=tk.NORMAL)
        self.info_text.delete("1.0", tk.END)
        self.info_text.insert("1.0", text)
        self.info_text.config(state=tk.DISABLED)
        self.status_bar.config(text="Network information updated")
    
    def apply_colors(self, colors):
        if not colors:
            return
        
        self.frame.configure(bg=colors['background'])
        self.title.configure(bg=colors['primary'], fg=colors['background'])
        self.info_text.configure(bg=colors['background'], fg=colors['text'])
        self.btn_refresh.configure(
            bg=colors['button'],
            fg=colors['text'],
            activebackground=colors['button_active']
        )
        self.status_bar.configure(bg=colors['primary'], fg=colors['background'])
```

---

With these examples, you can create any custom module for the LCARS interface!

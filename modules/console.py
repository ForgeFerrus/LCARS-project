"""
Console Module for LCARS Interface
Provides system-level console operations
"""

import tkinter as tk
from tkinter import scrolledtext
import subprocess
import threading
import os
import platform


class ConsoleModule:
    """System Console Module"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.process = None
        self.current_dir = os.path.expanduser("~")
        
        # Create main frame
        self.frame = tk.Frame(parent)
        self.frame.pack(fill=tk.BOTH, expand=True)
        
        self.setup_ui()
        self.apply_colors(app.get_current_colors())
        self.show_welcome()
    
    def setup_ui(self):
        """Setup console UI"""
        # Title
        title = tk.Label(
            self.frame,
            text="SYSTEM CONSOLE",
            font=("Arial", 16, "bold"),
            pady=10
        )
        title.pack(fill=tk.X)
        
        # Console output
        self.console_output = scrolledtext.ScrolledText(
            self.frame,
            wrap=tk.WORD,
            font=("Courier New", 10),
            height=25,
            state=tk.DISABLED
        )
        self.console_output.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        # Input frame
        input_frame = tk.Frame(self.frame)
        input_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Current directory label
        self.dir_label = tk.Label(
            input_frame,
            text=f"CWD: {self.current_dir}",
            font=("Courier New", 9),
            anchor="w"
        )
        self.dir_label.pack(fill=tk.X)
        
        # Command input
        command_frame = tk.Frame(input_frame)
        command_frame.pack(fill=tk.X, pady=5)
        
        tk.Label(
            command_frame,
            text="COMMAND >",
            font=("Courier New", 11, "bold")
        ).pack(side=tk.LEFT, padx=5)
        
        self.command_input = tk.Entry(
            command_frame,
            font=("Courier New", 11)
        )
        self.command_input.pack(fill=tk.X, expand=True, side=tk.LEFT)
        self.command_input.bind("<Return>", lambda e: self.execute_command())
        
        # Button frame
        button_frame = tk.Frame(input_frame)
        button_frame.pack(fill=tk.X)
        
        self.btn_execute = tk.Button(
            button_frame,
            text="EXECUTE",
            font=("Arial", 10, "bold"),
            command=self.execute_command,
            width=12
        )
        self.btn_execute.pack(side=tk.LEFT, padx=5)
        
        self.btn_clear = tk.Button(
            button_frame,
            text="CLEAR",
            font=("Arial", 10, "bold"),
            command=self.clear_console,
            width=12
        )
        self.btn_clear.pack(side=tk.LEFT, padx=5)
        
        self.btn_info = tk.Button(
            button_frame,
            text="SYSTEM INFO",
            font=("Arial", 10, "bold"),
            command=self.show_system_info,
            width=12
        )
        self.btn_info.pack(side=tk.LEFT, padx=5)
        
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
        
        # Store elements for color application
        self.title = title
        self.input_frame = input_frame
        self.command_frame = command_frame
        self.button_frame = button_frame
        self.buttons = [self.btn_execute, self.btn_clear, self.btn_info]
    
    def show_welcome(self):
        """Show welcome message"""
        system = platform.system()
        release = platform.release()
        machine = platform.machine()
        
        welcome = f"""
╔═══════════════════════════════════════════════════════════╗
║          LCARS SYSTEM CONSOLE - INITIALIZED               ║
╚═══════════════════════════════════════════════════════════╝

System: {system} {release}
Architecture: {machine}
Python: {platform.python_version()}
Current Directory: {self.current_dir}

Console ready for commands.
Type 'help' for available commands.

"""
        self.write_output(welcome)
    
    def write_output(self, text):
        """Write text to console output"""
        self.console_output.config(state=tk.NORMAL)
        self.console_output.insert(tk.END, text)
        self.console_output.config(state=tk.DISABLED)
        self.console_output.see(tk.END)
    
    def execute_command(self):
        """Execute console command"""
        command = self.command_input.get().strip()
        
        if not command:
            return
        
        # Clear input
        self.command_input.delete(0, tk.END)
        
        # Show command
        self.write_output(f"\n> {command}\n")
        
        # Handle special commands
        if command == "help":
            self.show_help()
            return
        elif command == "clear" or command == "cls":
            self.clear_console()
            return
        elif command.startswith("cd "):
            self.change_directory(command[3:].strip())
            return
        elif command == "pwd":
            self.write_output(f"{self.current_dir}\n")
            return
        
        # Execute system command
        self.status_bar.config(text="STATUS: Executing command...")
        self.btn_execute.config(state=tk.DISABLED)
        
        # Run in background thread
        thread = threading.Thread(target=self.run_command, args=(command,))
        thread.daemon = True
        thread.start()
    
    def run_command(self, command):
        """Run system command in background"""
        try:
            # Determine shell based on OS
            shell = platform.system() != 'Windows'
            
            # Execute command
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                cwd=self.current_dir,
                timeout=30
            )
            
            # Display output
            if result.stdout:
                self.write_output(result.stdout)
            
            if result.stderr:
                self.write_output(f"[ERROR]\n{result.stderr}")
            
            if result.returncode != 0:
                self.write_output(f"\n[Command exited with code {result.returncode}]\n")
            
            self.frame.after(0, lambda: self.status_bar.config(text="STATUS: READY"))
            
        except subprocess.TimeoutExpired:
            self.write_output("\n[ERROR] Command timed out\n")
            self.frame.after(0, lambda: self.status_bar.config(text="STATUS: Command timed out"))
        except Exception as e:
            self.write_output(f"\n[ERROR] {str(e)}\n")
            self.frame.after(0, lambda: self.status_bar.config(text=f"STATUS: ERROR - {str(e)}"))
        finally:
            self.frame.after(0, lambda: self.btn_execute.config(state=tk.NORMAL))
    
    def change_directory(self, path):
        """Change current directory"""
        try:
            new_path = os.path.abspath(os.path.join(self.current_dir, path))
            if os.path.isdir(new_path):
                self.current_dir = new_path
                self.dir_label.config(text=f"CWD: {self.current_dir}")
                self.write_output(f"Changed directory to: {self.current_dir}\n")
            else:
                self.write_output(f"[ERROR] Directory not found: {path}\n")
        except Exception as e:
            self.write_output(f"[ERROR] {str(e)}\n")
    
    def show_help(self):
        """Show help information"""
        help_text = """
AVAILABLE COMMANDS:
------------------
help         - Show this help message
clear/cls    - Clear console output
cd <path>    - Change current directory
pwd          - Print working directory
exit         - Close console (use EXIT button instead)

SYSTEM COMMANDS:
----------------
Any standard system command can be executed.
Examples:
  - ls / dir    : List files
  - cat / type  : Display file contents
  - python      : Run Python scripts
  - echo        : Print text
  
Note: Commands timeout after 30 seconds.

"""
        self.write_output(help_text)
    
    def clear_console(self):
        """Clear console output"""
        self.console_output.config(state=tk.NORMAL)
        self.console_output.delete("1.0", tk.END)
        self.console_output.config(state=tk.DISABLED)
        self.show_welcome()
    
    def show_system_info(self):
        """Show detailed system information"""
        info = f"""
SYSTEM INFORMATION:
------------------
Operating System: {platform.system()} {platform.release()}
Version: {platform.version()}
Architecture: {platform.machine()}
Processor: {platform.processor()}
Python Version: {platform.python_version()}
Python Implementation: {platform.python_implementation()}
Current Directory: {self.current_dir}
Home Directory: {os.path.expanduser('~')}

"""
        self.write_output(info)
    
    def apply_colors(self, colors):
        """Apply LCARS color scheme"""
        if not colors:
            return
        
        self.frame.configure(bg=colors['background'])
        self.title.configure(
            bg=colors['primary'],
            fg=colors['background']
        )
        
        self.console_output.configure(
            bg=colors['background'],
            fg=colors['text']
        )
        
        self.input_frame.configure(bg=colors['background'])
        self.command_frame.configure(bg=colors['background'])
        self.button_frame.configure(bg=colors['background'])
        
        self.dir_label.configure(
            bg=colors['background'],
            fg=colors['accent']
        )
        
        for widget in [self.command_frame]:
            for child in widget.winfo_children():
                if isinstance(child, tk.Label):
                    child.configure(bg=colors['background'], fg=colors['text'])
        
        self.command_input.configure(
            bg=colors['background'],
            fg=colors['text'],
            insertbackground=colors['text']
        )
        
        for btn in self.buttons:
            btn.configure(
                bg=colors['button'],
                fg=colors['text'],
                activebackground=colors['button_active']
            )
        
        self.status_bar.configure(
            bg=colors['primary'],
            fg=colors['background']
        )

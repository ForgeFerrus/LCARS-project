"""
Editor Module for LCARS Interface
Provides text and code editing capabilities
"""

import tkinter as tk
from tkinter import scrolledtext, filedialog, messagebox
import os


class EditorModule:
    """Text and Code Editor Module"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.current_file = None
        
        # Create main frame
        self.frame = tk.Frame(parent)
        self.frame.pack(fill=tk.BOTH, expand=True)
        
        self.setup_ui()
        self.apply_colors(app.get_current_colors())
    
    def setup_ui(self):
        """Setup editor UI"""
        # Top toolbar
        toolbar = tk.Frame(self.frame, height=40)
        toolbar.pack(fill=tk.X, side=tk.TOP)
        toolbar.pack_propagate(False)
        
        # Editor buttons
        self.btn_new = tk.Button(
            toolbar,
            text="NEW",
            font=("Arial", 10, "bold"),
            command=self.new_file,
            width=8
        )
        self.btn_new.pack(side=tk.LEFT, padx=5, pady=5)
        
        self.btn_open = tk.Button(
            toolbar,
            text="OPEN",
            font=("Arial", 10, "bold"),
            command=self.open_file,
            width=8
        )
        self.btn_open.pack(side=tk.LEFT, padx=5, pady=5)
        
        self.btn_save = tk.Button(
            toolbar,
            text="SAVE",
            font=("Arial", 10, "bold"),
            command=self.save_file,
            width=8
        )
        self.btn_save.pack(side=tk.LEFT, padx=5, pady=5)
        
        self.btn_save_as = tk.Button(
            toolbar,
            text="SAVE AS",
            font=("Arial", 10, "bold"),
            command=self.save_file_as,
            width=8
        )
        self.btn_save_as.pack(side=tk.LEFT, padx=5, pady=5)
        
        # File label
        self.file_label = tk.Label(
            toolbar,
            text="[NEW FILE]",
            font=("Arial", 10, "bold"),
            anchor="w",
            padx=10
        )
        self.file_label.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Text editor
        self.text_editor = scrolledtext.ScrolledText(
            self.frame,
            wrap=tk.WORD,
            font=("Courier New", 11),
            undo=True,
            maxundo=-1
        )
        self.text_editor.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
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
        
        # Store toolbar and buttons for color application
        self.toolbar = toolbar
        self.toolbar_buttons = [self.btn_new, self.btn_open, self.btn_save, self.btn_save_as]
    
    def new_file(self):
        """Create a new file"""
        if self.text_editor.get("1.0", tk.END).strip():
            if messagebox.askyesno("New File", "Current content will be lost. Continue?"):
                self.text_editor.delete("1.0", tk.END)
                self.current_file = None
                self.file_label.config(text="[NEW FILE]")
                self.status_bar.config(text="NEW FILE CREATED")
        else:
            self.text_editor.delete("1.0", tk.END)
            self.current_file = None
            self.file_label.config(text="[NEW FILE]")
            self.status_bar.config(text="NEW FILE CREATED")
    
    def open_file(self):
        """Open an existing file"""
        filename = filedialog.askopenfilename(
            title="Select file to open",
            filetypes=[
                ("Text files", "*.txt"),
                ("Python files", "*.py"),
                ("JSON files", "*.json"),
                ("All files", "*.*")
            ]
        )
        
        if filename:
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                    self.text_editor.delete("1.0", tk.END)
                    self.text_editor.insert("1.0", content)
                    self.current_file = filename
                    self.file_label.config(text=f"FILE: {os.path.basename(filename)}")
                    self.status_bar.config(text=f"OPENED: {filename}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to open file: {str(e)}")
                self.status_bar.config(text=f"ERROR: {str(e)}")
    
    def save_file(self):
        """Save current file"""
        if self.current_file:
            try:
                with open(self.current_file, 'w', encoding='utf-8') as f:
                    content = self.text_editor.get("1.0", tk.END)
                    f.write(content)
                    self.status_bar.config(text=f"SAVED: {self.current_file}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save file: {str(e)}")
                self.status_bar.config(text=f"ERROR: {str(e)}")
        else:
            self.save_file_as()
    
    def save_file_as(self):
        """Save file with new name"""
        filename = filedialog.asksaveasfilename(
            title="Save file as",
            defaultextension=".txt",
            filetypes=[
                ("Text files", "*.txt"),
                ("Python files", "*.py"),
                ("JSON files", "*.json"),
                ("All files", "*.*")
            ]
        )
        
        if filename:
            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    content = self.text_editor.get("1.0", tk.END)
                    f.write(content)
                    self.current_file = filename
                    self.file_label.config(text=f"FILE: {os.path.basename(filename)}")
                    self.status_bar.config(text=f"SAVED: {filename}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save file: {str(e)}")
                self.status_bar.config(text=f"ERROR: {str(e)}")
    
    def apply_colors(self, colors):
        """Apply LCARS color scheme"""
        if not colors:
            return
        
        self.frame.configure(bg=colors['background'])
        self.toolbar.configure(bg=colors['background'])
        self.file_label.configure(
            bg=colors['background'],
            fg=colors['text']
        )
        
        for btn in self.toolbar_buttons:
            btn.configure(
                bg=colors['button'],
                fg=colors['text'],
                activebackground=colors['button_active']
            )
        
        self.text_editor.configure(
            bg=colors['background'],
            fg=colors['text'],
            insertbackground=colors['text']
        )
        
        self.status_bar.configure(
            bg=colors['primary'],
            fg=colors['background']
        )

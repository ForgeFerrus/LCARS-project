"""
Filesystem Module for LCARS Interface
Provides file management with read/write operations
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog, simpledialog
import os
from pathlib import Path


class FilesystemModule:
    """File Management System Module"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.current_path = Path.home()
        
        # Create main frame
        self.frame = tk.Frame(parent)
        self.frame.pack(fill=tk.BOTH, expand=True)
        
        self.setup_ui()
        self.apply_colors(app.get_current_colors())
        self.refresh_file_list()
    
    def setup_ui(self):
        """Setup filesystem UI"""
        # Top toolbar
        toolbar = tk.Frame(self.frame, height=40)
        toolbar.pack(fill=tk.X, side=tk.TOP)
        toolbar.pack_propagate(False)
        
        # Navigation buttons
        self.btn_home = tk.Button(
            toolbar,
            text="HOME",
            font=("Arial", 10, "bold"),
            command=self.go_home,
            width=10
        )
        self.btn_home.pack(side=tk.LEFT, padx=5, pady=5)
        
        self.btn_up = tk.Button(
            toolbar,
            text="UP",
            font=("Arial", 10, "bold"),
            command=self.go_up,
            width=10
        )
        self.btn_up.pack(side=tk.LEFT, padx=5, pady=5)
        
        self.btn_refresh = tk.Button(
            toolbar,
            text="REFRESH",
            font=("Arial", 10, "bold"),
            command=self.refresh_file_list,
            width=10
        )
        self.btn_refresh.pack(side=tk.LEFT, padx=5, pady=5)
        
        # Path display
        self.path_label = tk.Label(
            toolbar,
            text=str(self.current_path),
            font=("Arial", 10),
            anchor="w",
            padx=10
        )
        self.path_label.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Main content area - split view
        paned = tk.PanedWindow(self.frame, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Left panel - file list
        left_panel = tk.Frame(paned)
        paned.add(left_panel, width=400)
        
        tk.Label(
            left_panel,
            text="FILES AND DIRECTORIES",
            font=("Arial", 12, "bold"),
            pady=5
        ).pack(fill=tk.X)
        
        # File list with scrollbar
        list_frame = tk.Frame(left_panel)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.file_listbox = tk.Listbox(
            list_frame,
            font=("Courier New", 10),
            yscrollcommand=scrollbar.set
        )
        self.file_listbox.pack(fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.file_listbox.yview)
        
        self.file_listbox.bind("<Double-Button-1>", self.on_item_double_click)
        self.file_listbox.bind("<<ListboxSelect>>", self.on_item_select)
        
        # Right panel - file operations
        right_panel = tk.Frame(paned)
        paned.add(right_panel)
        
        tk.Label(
            right_panel,
            text="FILE OPERATIONS",
            font=("Arial", 12, "bold"),
            pady=5
        ).pack(fill=tk.X)
        
        # File info
        self.info_text = scrolledtext.ScrolledText(
            right_panel,
            wrap=tk.WORD,
            font=("Courier New", 9),
            height=8,
            state=tk.DISABLED
        )
        self.info_text.pack(fill=tk.X, padx=5, pady=5)
        
        # Operation buttons
        ops_frame = tk.Frame(right_panel)
        ops_frame.pack(fill=tk.X, padx=5, pady=5)
        
        self.btn_read = tk.Button(
            ops_frame,
            text="READ FILE",
            font=("Arial", 10, "bold"),
            command=self.read_file,
            width=12
        )
        self.btn_read.pack(side=tk.LEFT, padx=5)
        
        self.btn_create = tk.Button(
            ops_frame,
            text="CREATE FILE",
            font=("Arial", 10, "bold"),
            command=self.create_file,
            width=12
        )
        self.btn_create.pack(side=tk.LEFT, padx=5)
        
        self.btn_delete = tk.Button(
            ops_frame,
            text="DELETE",
            font=("Arial", 10, "bold"),
            command=self.delete_item,
            width=12
        )
        self.btn_delete.pack(side=tk.LEFT, padx=5)
        
        # File content viewer/editor
        tk.Label(
            right_panel,
            text="FILE CONTENT",
            font=("Arial", 10, "bold"),
            pady=5
        ).pack(fill=tk.X)
        
        self.content_text = scrolledtext.ScrolledText(
            right_panel,
            wrap=tk.WORD,
            font=("Courier New", 9)
        )
        self.content_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Save button for content
        self.btn_save_content = tk.Button(
            right_panel,
            text="SAVE CHANGES",
            font=("Arial", 10, "bold"),
            command=self.save_content,
            width=15
        )
        self.btn_save_content.pack(pady=5)
        
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
        self.toolbar = toolbar
        self.toolbar_buttons = [self.btn_home, self.btn_up, self.btn_refresh]
        self.left_panel = left_panel
        self.right_panel = right_panel
        self.ops_frame = ops_frame
        self.op_buttons = [self.btn_read, self.btn_create, self.btn_delete, self.btn_save_content]
        self.selected_item = None
    
    def refresh_file_list(self):
        """Refresh the file list"""
        self.file_listbox.delete(0, tk.END)
        self.path_label.config(text=str(self.current_path))
        
        try:
            items = []
            
            # Add parent directory if not at root
            if self.current_path.parent != self.current_path:
                items.append(("[DIR]  ..", self.current_path.parent))
            
            # List directories first, then files
            dirs = []
            files = []
            
            for item in sorted(self.current_path.iterdir()):
                if item.is_dir():
                    dirs.append(item)
                else:
                    files.append(item)
            
            for d in dirs:
                self.file_listbox.insert(tk.END, f"[DIR]  {d.name}")
            
            for f in files:
                size = f.stat().st_size
                size_str = self.format_size(size)
                self.file_listbox.insert(tk.END, f"[FILE] {f.name} ({size_str})")
            
            self.status_bar.config(text=f"LISTED {len(dirs)} directories, {len(files)} files")
            
        except PermissionError:
            messagebox.showerror("Error", "Permission denied")
            self.status_bar.config(text="ERROR: Permission denied")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to list directory: {str(e)}")
            self.status_bar.config(text=f"ERROR: {str(e)}")
    
    def format_size(self, size):
        """Format file size"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f}{unit}"
            size /= 1024.0
        return f"{size:.1f}TB"
    
    def on_item_double_click(self, event):
        """Handle double-click on item"""
        selection = self.file_listbox.curselection()
        if not selection:
            return
        
        item_text = self.file_listbox.get(selection[0])
        
        if item_text.startswith("[DIR]"):
            name = item_text[7:].strip()
            if name == "..":
                self.go_up()
            else:
                self.current_path = self.current_path / name
                self.refresh_file_list()
    
    def on_item_select(self, event):
        """Handle item selection"""
        selection = self.file_listbox.curselection()
        if not selection:
            return
        
        item_text = self.file_listbox.get(selection[0])
        
        if item_text.startswith("[DIR]"):
            name = item_text[7:].split()[0].strip()
            if name != "..":
                self.selected_item = self.current_path / name
                self.show_item_info(self.selected_item)
        else:
            name = item_text[7:].split('(')[0].strip()
            self.selected_item = self.current_path / name
            self.show_item_info(self.selected_item)
    
    def show_item_info(self, path):
        """Show information about selected item"""
        self.info_text.config(state=tk.NORMAL)
        self.info_text.delete("1.0", tk.END)
        
        try:
            stat = path.stat()
            info = f"Name: {path.name}\n"
            info += f"Path: {path}\n"
            info += f"Type: {'Directory' if path.is_dir() else 'File'}\n"
            info += f"Size: {self.format_size(stat.st_size)}\n"
            info += f"Modified: {Path(path).stat().st_mtime}\n"
            
            self.info_text.insert("1.0", info)
        except Exception as e:
            self.info_text.insert("1.0", f"Error: {str(e)}")
        
        self.info_text.config(state=tk.DISABLED)
    
    def read_file(self):
        """Read and display file content"""
        if not self.selected_item or not self.selected_item.is_file():
            messagebox.showwarning("Warning", "Please select a file first")
            return
        
        try:
            with open(self.selected_item, 'r', encoding='utf-8') as f:
                content = f.read()
                self.content_text.delete("1.0", tk.END)
                self.content_text.insert("1.0", content)
                self.status_bar.config(text=f"READ: {self.selected_item.name}")
        except UnicodeDecodeError:
            messagebox.showerror("Error", "Cannot read binary file as text")
            self.status_bar.config(text="ERROR: Binary file")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to read file: {str(e)}")
            self.status_bar.config(text=f"ERROR: {str(e)}")
    
    def create_file(self):
        """Create a new file"""
        filename = tk.simpledialog.askstring("Create File", "Enter filename:")
        if filename:
            filepath = self.current_path / filename
            try:
                filepath.touch()
                self.refresh_file_list()
                self.status_bar.config(text=f"CREATED: {filename}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to create file: {str(e)}")
                self.status_bar.config(text=f"ERROR: {str(e)}")
    
    def delete_item(self):
        """Delete selected item"""
        if not self.selected_item:
            messagebox.showwarning("Warning", "Please select an item first")
            return
        
        if messagebox.askyesno("Confirm Delete", f"Delete {self.selected_item.name}?"):
            try:
                if self.selected_item.is_file():
                    self.selected_item.unlink()
                elif self.selected_item.is_dir():
                    self.selected_item.rmdir()
                
                self.refresh_file_list()
                self.content_text.delete("1.0", tk.END)
                self.status_bar.config(text=f"DELETED: {self.selected_item.name}")
                self.selected_item = None
            except Exception as e:
                messagebox.showerror("Error", f"Failed to delete: {str(e)}")
                self.status_bar.config(text=f"ERROR: {str(e)}")
    
    def save_content(self):
        """Save edited content to file"""
        if not self.selected_item or not self.selected_item.is_file():
            messagebox.showwarning("Warning", "Please select a file first")
            return
        
        content = self.content_text.get("1.0", tk.END)
        try:
            with open(self.selected_item, 'w', encoding='utf-8') as f:
                f.write(content)
            self.status_bar.config(text=f"SAVED: {self.selected_item.name}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save file: {str(e)}")
            self.status_bar.config(text=f"ERROR: {str(e)}")
    
    def go_home(self):
        """Go to home directory"""
        self.current_path = Path.home()
        self.refresh_file_list()
    
    def go_up(self):
        """Go to parent directory"""
        if self.current_path.parent != self.current_path:
            self.current_path = self.current_path.parent
            self.refresh_file_list()
    
    def apply_colors(self, colors):
        """Apply LCARS color scheme"""
        if not colors:
            return
        
        self.frame.configure(bg=colors['background'])
        self.toolbar.configure(bg=colors['background'])
        self.path_label.configure(
            bg=colors['background'],
            fg=colors['text']
        )
        
        for btn in self.toolbar_buttons:
            btn.configure(
                bg=colors['button'],
                fg=colors['text'],
                activebackground=colors['button_active']
            )
        
        self.left_panel.configure(bg=colors['background'])
        self.right_panel.configure(bg=colors['background'])
        self.ops_frame.configure(bg=colors['background'])
        
        for widget in [self.left_panel, self.right_panel]:
            for child in widget.winfo_children():
                if isinstance(child, tk.Label):
                    child.configure(bg=colors['background'], fg=colors['text'])
        
        self.file_listbox.configure(
            bg=colors['background'],
            fg=colors['text'],
            selectbackground=colors['button'],
            selectforeground=colors['text']
        )
        
        self.info_text.configure(
            bg=colors['background'],
            fg=colors['text']
        )
        
        self.content_text.configure(
            bg=colors['background'],
            fg=colors['text'],
            insertbackground=colors['text']
        )
        
        for btn in self.op_buttons:
            btn.configure(
                bg=colors['button'],
                fg=colors['text'],
                activebackground=colors['button_active']
            )
        
        self.status_bar.configure(
            bg=colors['primary'],
            fg=colors['background']
        )

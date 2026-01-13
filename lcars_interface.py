#!/usr/bin/env python3
"""
LCARS Operating System Interface
Main application entry point
"""

import tkinter as tk
from tkinter import ttk
import json
import os
from pathlib import Path

# Import modules
from modules.editor import EditorModule
from modules.ai_assistant import AIAssistantModule
from modules.filesystem import FilesystemModule
from modules.console import ConsoleModule


class LCARSInterface:
    """Main LCARS Interface Application"""
    
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("LCARS Operating System Interface")
        
        # Load configurations
        self.config_dir = Path(__file__).parent / "config"
        self.eras = self.load_eras()
        self.modules_config = self.load_modules()
        
        # Current state
        self.current_era = "24th"  # Default to TNG era
        self.current_module = None
        self.active_module_widget = None
        
        # Setup UI
        self.setup_fullscreen()
        self.setup_ui()
        self.apply_era_colors()
        
    def load_eras(self):
        """Load era configurations from JSON"""
        era_file = self.config_dir / "eras.json"
        try:
            with open(era_file, 'r') as f:
                data = json.load(f)
                return data.get('eras', {})
        except Exception as e:
            print(f"Error loading eras: {e}")
            return {}
    
    def load_modules(self):
        """Load module configurations from JSON"""
        module_file = self.config_dir / "modules.json"
        try:
            with open(module_file, 'r') as f:
                data = json.load(f)
                return data.get('modules', [])
        except Exception as e:
            print(f"Error loading modules: {e}")
            return []
    
    def setup_fullscreen(self):
        """Setup fullscreen mode without Windows UI elements"""
        self.root.overrideredirect(True)  # Remove window decorations
        self.root.state('zoomed')  # Maximize window
        
        # Get screen dimensions
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        self.root.geometry(f"{screen_width}x{screen_height}+0+0")
        
        # Bind escape key to toggle fullscreen
        self.root.bind("<Escape>", self.toggle_fullscreen)
        self.root.bind("<F11>", self.toggle_fullscreen)
        
    def toggle_fullscreen(self, event=None):
        """Toggle fullscreen mode"""
        current_state = self.root.overrideredirect()
        self.root.overrideredirect(not current_state)
        if current_state:
            self.root.state('normal')
        else:
            self.root.state('zoomed')
    
    def setup_ui(self):
        """Setup the main LCARS UI layout"""
        # Main container
        self.main_frame = tk.Frame(self.root)
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Top bar with characteristic LCARS shape
        self.top_bar = tk.Frame(self.main_frame, height=80)
        self.top_bar.pack(fill=tk.X, side=tk.TOP)
        self.top_bar.pack_propagate(False)
        
        # LCARS title
        self.title_label = tk.Label(
            self.top_bar,
            text="LCARS OPERATING SYSTEM INTERFACE",
            font=("Arial", 24, "bold"),
            anchor="w",
            padx=20
        )
        self.title_label.pack(fill=tk.BOTH, expand=True, side=tk.LEFT)
        
        # Era selector
        self.era_frame = tk.Frame(self.top_bar)
        self.era_frame.pack(side=tk.RIGHT, padx=20)
        
        tk.Label(
            self.era_frame,
            text="STARFLEET ERA:",
            font=("Arial", 10, "bold")
        ).pack(side=tk.LEFT, padx=5)
        
        self.era_var = tk.StringVar(value=self.current_era)
        era_options = list(self.eras.keys())
        self.era_selector = ttk.Combobox(
            self.era_frame,
            textvariable=self.era_var,
            values=era_options,
            state="readonly",
            width=10
        )
        self.era_selector.pack(side=tk.LEFT)
        self.era_selector.bind("<<ComboboxSelected>>", self.change_era)
        
        # Left sidebar with module buttons
        self.sidebar = tk.Frame(self.main_frame, width=200)
        self.sidebar.pack(fill=tk.Y, side=tk.LEFT, padx=10, pady=10)
        self.sidebar.pack_propagate(False)
        
        # Module buttons
        self.module_buttons = {}
        for module_cfg in self.modules_config:
            if module_cfg.get('enabled', True):
                btn = tk.Button(
                    self.sidebar,
                    text=module_cfg['name'],
                    font=("Arial", 14, "bold"),
                    command=lambda m=module_cfg['id']: self.load_module(m),
                    height=2,
                    relief=tk.RAISED,
                    bd=3
                )
                btn.pack(fill=tk.X, pady=5)
                self.module_buttons[module_cfg['id']] = btn
        
        # Exit button at bottom of sidebar
        exit_btn = tk.Button(
            self.sidebar,
            text="EXIT",
            font=("Arial", 14, "bold"),
            command=self.exit_application,
            height=2,
            relief=tk.RAISED,
            bd=3
        )
        exit_btn.pack(fill=tk.X, pady=5, side=tk.BOTTOM)
        self.module_buttons['exit'] = exit_btn
        
        # Main content area
        self.content_frame = tk.Frame(self.main_frame)
        self.content_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Welcome screen
        self.show_welcome()
    
    def show_welcome(self):
        """Show welcome screen"""
        welcome = tk.Frame(self.content_frame)
        welcome.pack(fill=tk.BOTH, expand=True)
        
        tk.Label(
            welcome,
            text="LCARS OPERATING SYSTEM",
            font=("Arial", 36, "bold")
        ).pack(pady=50)
        
        tk.Label(
            welcome,
            text="SELECT A MODULE TO BEGIN",
            font=("Arial", 18)
        ).pack(pady=20)
        
        # Show available modules
        info_text = "AVAILABLE MODULES:\n\n"
        for module in self.modules_config:
            if module.get('enabled', True):
                info_text += f"• {module['name']}: {module['description']}\n"
        
        tk.Label(
            welcome,
            text=info_text,
            font=("Arial", 14),
            justify=tk.LEFT
        ).pack(pady=20)
        
        self.active_module_widget = welcome
    
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
        
        if self.current_module:
            self.active_module_widget = self.current_module.frame
            # Highlight active button
            for btn_id, btn in self.module_buttons.items():
                if btn_id == module_id:
                    btn.config(relief=tk.SUNKEN)
                elif btn_id != 'exit':
                    btn.config(relief=tk.RAISED)
    
    def change_era(self, event=None):
        """Change the current era and apply new colors"""
        self.current_era = self.era_var.get()
        self.apply_era_colors()
    
    def apply_era_colors(self):
        """Apply color scheme based on selected era"""
        if self.current_era not in self.eras:
            return
        
        colors = self.eras[self.current_era]['colors']
        
        # Apply to main elements
        self.root.configure(bg=colors['background'])
        self.main_frame.configure(bg=colors['background'])
        self.top_bar.configure(bg=colors['primary'])
        self.title_label.configure(
            bg=colors['primary'],
            fg=colors['background']
        )
        self.era_frame.configure(bg=colors['primary'])
        for widget in self.era_frame.winfo_children():
            if isinstance(widget, tk.Label):
                widget.configure(bg=colors['primary'], fg=colors['background'])
        
        self.sidebar.configure(bg=colors['background'])
        self.content_frame.configure(bg=colors['background'])
        
        # Apply to buttons
        for btn_id, btn in self.module_buttons.items():
            if btn_id == 'exit':
                btn.configure(
                    bg=colors['secondary'],
                    fg=colors['text'],
                    activebackground=colors['button_active']
                )
            else:
                btn.configure(
                    bg=colors['button'],
                    fg=colors['text'],
                    activebackground=colors['button_active']
                )
        
        # Apply to active module if any
        if self.current_module and hasattr(self.current_module, 'apply_colors'):
            self.current_module.apply_colors(colors)
    
    def get_current_colors(self):
        """Get current era colors"""
        if self.current_era in self.eras:
            return self.eras[self.current_era]['colors']
        return {}
    
    def exit_application(self):
        """Exit the application"""
        self.root.quit()
        self.root.destroy()
    
    def run(self):
        """Start the application"""
        self.root.mainloop()


def main():
    """Main entry point"""
    app = LCARSInterface()
    app.run()


if __name__ == "__main__":
    main()

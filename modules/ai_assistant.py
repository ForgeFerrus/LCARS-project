"""
AI Assistant Module for LCARS Interface
Integrates with OpenAI API for AI assistance
"""

import tkinter as tk
from tkinter import scrolledtext, messagebox
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import OpenAI
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class AIAssistantModule:
    """AI Assistant with OpenAI Integration"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.client = None
        
        # Initialize OpenAI if available
        if OPENAI_AVAILABLE:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your_openai_api_key_here':
                try:
                    self.client = OpenAI(api_key=api_key)
                except Exception as e:
                    print(f"Failed to initialize OpenAI client: {e}")
        
        # Conversation history
        self.conversation = []
        
        # Create main frame
        self.frame = tk.Frame(parent)
        self.frame.pack(fill=tk.BOTH, expand=True)
        
        self.setup_ui()
        self.apply_colors(app.get_current_colors())
    
    def setup_ui(self):
        """Setup AI assistant UI"""
        # Title
        title = tk.Label(
            self.frame,
            text="AI ASSISTANT - OPENAI INTEGRATION",
            font=("Arial", 16, "bold"),
            pady=10
        )
        title.pack(fill=tk.X)
        
        # Conversation display
        self.conversation_display = scrolledtext.ScrolledText(
            self.frame,
            wrap=tk.WORD,
            font=("Arial", 11),
            height=20,
            state=tk.DISABLED
        )
        self.conversation_display.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        # Input frame
        input_frame = tk.Frame(self.frame)
        input_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Input label
        tk.Label(
            input_frame,
            text="YOUR MESSAGE:",
            font=("Arial", 10, "bold")
        ).pack(side=tk.TOP, anchor="w")
        
        # Input text
        self.input_text = scrolledtext.ScrolledText(
            input_frame,
            wrap=tk.WORD,
            font=("Arial", 11),
            height=4
        )
        self.input_text.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Button frame
        button_frame = tk.Frame(input_frame)
        button_frame.pack(fill=tk.X)
        
        self.btn_send = tk.Button(
            button_frame,
            text="SEND",
            font=("Arial", 12, "bold"),
            command=self.send_message,
            width=15
        )
        self.btn_send.pack(side=tk.LEFT, padx=5)
        
        self.btn_clear = tk.Button(
            button_frame,
            text="CLEAR HISTORY",
            font=("Arial", 12, "bold"),
            command=self.clear_conversation,
            width=15
        )
        self.btn_clear.pack(side=tk.LEFT, padx=5)
        
        # Status bar
        self.status_bar = tk.Label(
            self.frame,
            text=self.get_status_text(),
            font=("Arial", 9),
            anchor="w",
            relief=tk.SUNKEN,
            padx=5
        )
        self.status_bar.pack(fill=tk.X, side=tk.BOTTOM)
        
        # Bind Enter to send (Ctrl+Enter for newline)
        self.input_text.bind("<Return>", lambda e: self.send_message() if not e.state & 0x4 else None)
        
        # Store elements for color application
        self.title = title
        self.input_frame = input_frame
        self.button_frame = button_frame
        self.buttons = [self.btn_send, self.btn_clear]
        
        # Show initial message
        if not self.client:
            self.add_system_message(
                "AI Assistant not configured. Please set OPENAI_API_KEY in .env file.\n"
                "Copy .env.example to .env and add your OpenAI API key."
            )
        else:
            self.add_system_message("AI Assistant ready. Type your message below.")
    
    def get_status_text(self):
        """Get status text based on OpenAI availability"""
        if not OPENAI_AVAILABLE:
            return "STATUS: OpenAI library not installed (pip install openai)"
        elif not self.client:
            return "STATUS: OpenAI API key not configured"
        else:
            return "STATUS: READY - AI Assistant Online"
    
    def add_system_message(self, message):
        """Add system message to conversation display"""
        self.conversation_display.config(state=tk.NORMAL)
        self.conversation_display.insert(tk.END, f"[SYSTEM] {message}\n\n")
        self.conversation_display.config(state=tk.DISABLED)
        self.conversation_display.see(tk.END)
    
    def add_user_message(self, message):
        """Add user message to conversation display"""
        self.conversation_display.config(state=tk.NORMAL)
        self.conversation_display.insert(tk.END, f"[YOU] {message}\n\n")
        self.conversation_display.config(state=tk.DISABLED)
        self.conversation_display.see(tk.END)
    
    def add_ai_message(self, message):
        """Add AI message to conversation display"""
        self.conversation_display.config(state=tk.NORMAL)
        self.conversation_display.insert(tk.END, f"[AI ASSISTANT] {message}\n\n")
        self.conversation_display.config(state=tk.DISABLED)
        self.conversation_display.see(tk.END)
    
    def send_message(self):
        """Send message to AI"""
        message = self.input_text.get("1.0", tk.END).strip()
        
        if not message:
            return
        
        normalized_message = " ".join(message.lower().split()).rstrip("?.!")
        if not self.client and normalized_message == "ви вже завершили проект":
            self.input_text.delete("1.0", tk.END)
            self.add_user_message(message)
            self.add_ai_message(
                "Ще ні. Проєкт у процесі розвитку: базовий функціонал уже готовий, "
                "але вдосконалення триває."
            )
            self.status_bar.config(text="STATUS: READY - Local response")
            return
        
        if not self.client:
            messagebox.showerror(
                "Error",
                "AI Assistant not configured. Please set OPENAI_API_KEY in .env file."
            )
            return
        
        # Clear input
        self.input_text.delete("1.0", tk.END)
        
        # Add user message to display
        self.add_user_message(message)
        
        # Add to conversation history
        self.conversation.append({"role": "user", "content": message})
        
        # Update status
        self.status_bar.config(text="STATUS: Sending request to AI...")
        self.btn_send.config(state=tk.DISABLED)
        
        # Process in background
        self.frame.after(100, lambda: self.get_ai_response())
    
    def get_ai_response(self):
        """Get response from OpenAI API"""
        try:
            # Create chat completion
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant integrated into a LCARS (Library Computer Access/Retrieval System) interface from Star Trek. Be concise and helpful."},
                    *self.conversation
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            # Extract response
            ai_message = response.choices[0].message.content
            
            # Add to conversation
            self.conversation.append({"role": "assistant", "content": ai_message})
            
            # Display response
            self.add_ai_message(ai_message)
            
            self.status_bar.config(text="STATUS: READY - Response received")
            
        except Exception as e:
            error_msg = f"Error communicating with AI: {str(e)}"
            self.add_system_message(error_msg)
            self.status_bar.config(text=f"STATUS: ERROR - {str(e)}")
        
        finally:
            self.btn_send.config(state=tk.NORMAL)
    
    def clear_conversation(self):
        """Clear conversation history"""
        if messagebox.askyesno("Clear History", "Clear all conversation history?"):
            self.conversation = []
            self.conversation_display.config(state=tk.NORMAL)
            self.conversation_display.delete("1.0", tk.END)
            self.conversation_display.config(state=tk.DISABLED)
            self.add_system_message("Conversation history cleared.")
            self.status_bar.config(text="STATUS: READY - History cleared")
    
    def apply_colors(self, colors):
        """Apply LCARS color scheme"""
        if not colors:
            return
        
        self.frame.configure(bg=colors['background'])
        self.title.configure(
            bg=colors['primary'],
            fg=colors['background']
        )
        self.input_frame.configure(bg=colors['background'])
        self.button_frame.configure(bg=colors['background'])
        
        for widget in self.input_frame.winfo_children():
            if isinstance(widget, tk.Label):
                widget.configure(bg=colors['background'], fg=colors['text'])
        
        self.conversation_display.configure(
            bg=colors['background'],
            fg=colors['text']
        )
        
        self.input_text.configure(
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

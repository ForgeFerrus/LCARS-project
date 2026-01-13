# LCARS Interface - Quick Start Guide

## Prerequisites
- Python 3.7 or higher installed
- pip (Python package manager)

## Installation

### Method 1: Using Launch Scripts (Recommended)

**On Linux/Mac:**
```bash
./launch.sh
```

**On Windows:**
```batch
launch.bat
```

The scripts will automatically:
- Create a virtual environment
- Install all dependencies
- Launch the LCARS interface

### Method 2: Manual Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python lcars_interface.py
```

## First Launch

1. The interface will open in fullscreen mode
2. You'll see the LCARS welcome screen
3. The default era is set to "24th" (TNG Era)

## Navigation

### Changing Eras
- Use the dropdown menu in the top-right corner
- Select from 7 different Starfleet eras
- Colors will update automatically

### Using Modules

**EDITOR Module:**
- Click "EDITOR" button in the left sidebar
- Use NEW, OPEN, SAVE buttons to manage files
- Edit text or code directly in the interface

**AI Module:**
- Click "AI" button
- First-time setup: Configure OpenAI API key (see below)
- Type messages and get AI assistance

**FILESYSTEM Module:**
- Click "FILESYSTEM" button
- Browse directories using the file list
- Double-click folders to navigate
- Select files to read/edit their contents
- Use operation buttons for file management

**CONSOLE Module:**
- Click "CONSOLE" button
- Type system commands
- Press Enter to execute
- Use built-in commands: help, clear, cd, pwd

### Keyboard Shortcuts
- **ESC** or **F11**: Toggle fullscreen
- **Enter**: Execute (in Console and AI modules)

## Setting Up AI Assistant (Optional)

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. Restart the application
4. The AI module will now be fully functional

## Troubleshooting

### "No module named tkinter"
- **Linux:** Install with `sudo apt-get install python3-tk`
- **Mac:** tkinter comes with Python
- **Windows:** tkinter is included with Python

### AI Module Not Working
- Check that `.env` file exists with valid API key
- Verify OpenAI package is installed: `pip install openai`
- Check your OpenAI account has API credits

### Fullscreen Issues
- Press **ESC** to exit fullscreen
- Press **F11** to toggle fullscreen mode

## Tips

1. **File Management**: Use the Filesystem module to navigate to your project directories
2. **Quick Edits**: The Editor module is perfect for quick file edits
3. **System Commands**: The Console supports all your OS commands
4. **AI Assistant**: Great for getting help, explanations, or code suggestions
5. **Era Selection**: Try different eras to find your favorite color scheme!

## Exiting the Application

Click the **EXIT** button in the left sidebar or close the window normally.

## Support

For issues or questions, please refer to the main README.md file or open an issue on GitHub.

---

**Live Long and Prosper! 🖖**

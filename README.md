# LCARS Operating System Interface

A complete LCARS (Library Computer Access/Retrieval System) inspired operating system interface, featuring the iconic Star Trek computer design across multiple Starfleet eras.

## Features

### LCARS Design
- **Full-screen interface** with authentic LCARS styling
- **Dynamic era switching** across 7 Starfleet timelines:
  - 22nd Century (Enterprise Era)
  - 23rd Century Early (The Original Series)
  - 23rd Century Late (The Motion Picture)
  - 24th Century Early (The Next Generation)
  - 24th Century Late (Voyager/Deep Space Nine)
  - 25th Century (Picard Era)
  - 29th Century (Future)
- **Era-specific color palettes** with authentic LCARS styling
- **Characteristic LCARS shapes** and layout

### Functional Modules

#### 1. Editor Module
- Text and code editing capabilities
- File operations (New, Open, Save, Save As)
- Syntax highlighting support
- Multi-format support (TXT, Python, JSON, etc.)

#### 2. AI Assistant Module
- **OpenAI API integration** for intelligent assistance
- Conversational interface
- Context-aware responses
- Conversation history management
- LCARS-themed AI interactions

#### 3. Filesystem Module
- Complete file management system
- **Read/Write operations**
- Directory navigation
- File creation and deletion
- File content viewer/editor
- File information display

#### 4. Console Module
- System-level command execution
- Cross-platform support (Windows, Linux, macOS)
- Directory navigation
- System information display
- Command history
- Real-time command output

### Modular Architecture
- JSON-based configuration system
- Easy module extensibility
- Configurable color schemes per era
- Module enable/disable via configuration

## Installation

### Requirements
- Python 3.7 or higher
- tkinter (usually included with Python)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ForgeFerrus/LCARS-project.git
cd LCARS-project
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Configure OpenAI API for AI Assistant:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

## Usage

### Running the Application

Start the LCARS interface:
```bash
python lcars_interface.py
```

### Keyboard Shortcuts
- **ESC** or **F11**: Toggle fullscreen mode
- **Enter**: Execute commands (in Console module)

### Module Navigation
Click on any module button in the left sidebar:
- **EDITOR**: Open the text/code editor
- **AI**: Launch the AI Assistant
- **FILESYSTEM**: Access file management
- **CONSOLE**: Open system console
- **EXIT**: Close the application

### Era Selection
Use the dropdown in the top-right corner to switch between Starfleet eras. The interface colors will dynamically update to match the selected era's palette.

## Configuration

### Era Customization
Edit `config/eras.json` to customize era colors:
```json
{
  "eras": {
    "24th": {
      "name": "24th Century Early (TNG Era)",
      "colors": {
        "primary": "#FF9966",
        "secondary": "#CC6633",
        "accent": "#FFCC99",
        "background": "#000000",
        "text": "#FFCC99",
        "button": "#CC7744",
        "button_active": "#FF9955"
      }
    }
  }
}
```

### Module Configuration
Edit `config/modules.json` to enable/disable modules:
```json
{
  "modules": [
    {
      "id": "editor",
      "name": "EDITOR",
      "description": "Text and Code Editor",
      "enabled": true
    }
  ]
}
```

## Module Details

### Editor Module
- Create, open, and save files
- Support for multiple file formats
- Real-time editing
- Status bar with file information

### AI Assistant Module
- Requires OpenAI API key (set in `.env` file)
- Conversational AI interface
- Context-aware responses
- Message history
- LCARS-themed chat interface

### Filesystem Module
- Navigate directories
- View file information (size, type, modified date)
- Read file contents
- Edit and save files
- Create new files
- Delete files and directories
- Home and parent directory shortcuts

### Console Module
- Execute system commands
- Cross-platform command support
- Directory navigation (cd, pwd)
- Built-in help system
- System information display
- 30-second command timeout
- Real-time output display

## Development

### Adding New Modules

1. Create a new module file in `modules/` directory:
```python
class NewModule:
    def __init__(self, parent, app):
        self.frame = tk.Frame(parent)
        self.frame.pack(fill=tk.BOTH, expand=True)
        # Setup your module UI
    
    def apply_colors(self, colors):
        # Apply LCARS colors to your module
        pass
```

2. Import the module in `lcars_interface.py`
3. Add module configuration to `config/modules.json`
4. Update the `load_module()` method in `LCARSInterface` class

### Adding New Eras

Add new era definitions to `config/eras.json` with color palette specifications.

## Technologies Used
- **Python 3**: Core programming language
- **tkinter**: GUI framework
- **OpenAI API**: AI assistant functionality
- **python-dotenv**: Environment variable management

## License
This project is open source and available for educational and personal use.

## Acknowledgments
Inspired by the LCARS (Library Computer Access/Retrieval System) interface from Star Trek, created by Michael Okuda.

## Screenshots
The interface features authentic LCARS styling with era-specific color palettes, modular zones for different functionalities, and a full-screen experience true to the Star Trek aesthetic.

---

**Note**: This is a fan-made project and is not affiliated with or endorsed by CBS, Paramount Pictures, or any official Star Trek entities.
#!/bin/bash
# LCARS Interface Launcher Script

echo "Starting LCARS Operating System Interface..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Checking dependencies..."
pip install -q -r requirements.txt

# Launch LCARS interface
echo "Launching LCARS Interface..."
echo ""
python3 lcars_interface.py

# Deactivate virtual environment
deactivate

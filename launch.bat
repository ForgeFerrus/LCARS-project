@echo off
REM LCARS Interface Launcher Script for Windows

echo Starting LCARS Operating System Interface...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    echo Please install Python 3.7 or higher
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Checking dependencies...
pip install -q -r requirements.txt

REM Launch LCARS interface
echo Launching LCARS Interface...
echo.
python lcars_interface.py

REM Deactivate virtual environment
deactivate

pause

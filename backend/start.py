# Simple Backend Startup Script
# File: backend/start.py

import subprocess
import sys
import os
import time

def check_python():
    """Check if Python is available and the right version."""
    try:
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 8):
            print("❌ Python 3.8 or higher is required")
            print(f"📍 Current version: {sys.version}")
            return False
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
        return True
    except Exception as e:
        print(f"❌ Error checking Python version: {e}")
        return False

def install_dependencies():
    """Install required dependencies if they're not already installed."""
    print("📦 Checking dependencies...")
    try:
        # Check if requirements.txt exists
        if not os.path.exists("requirements.txt"):
            print("❌ requirements.txt not found")
            return False
        
        # Try to install dependencies
        print("🔄 Installing dependencies from requirements.txt...")
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Dependencies installed successfully")
            return True
        else:
            print(f"❌ Error installing dependencies: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def start_backend():
    """Start the FastAPI backend server."""
    print("\n🚀 Starting Construction Management Backend...")
    print("=" * 60)
    print("📍 Server will be available at: http://localhost:8000")
    print("📋 Quick form available at: http://localhost:8000/simple-form")
    print("📚 API documentation at: http://localhost:8000/docs")
    print("🖥️  Frontend (if running): http://localhost:3000")
    print("⏹️  Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        # Change to the backend directory if we're not already there
        if not os.path.exists("app"):
            print("🔄 Changing to backend directory...")
            os.chdir("backend")
        
        # Start the server using Python directly
        from app.main import start_server
        start_server()
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
        print("👋 Goodbye!")
    except ImportError:
        print("❌ Could not import the main app. Make sure you're in the backend directory.")
        print("🔄 Trying alternative startup method...")
        try:
            subprocess.run([
                sys.executable, "-m", "uvicorn", "app.main:app", 
                "--reload", "--host", "127.0.0.1", "--port", "8000"
            ])
        except Exception as e:
            print(f"❌ Failed to start server: {e}")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main startup function."""
    print("🏗️  Construction Management Backend Startup")
    print("=" * 50)
    
    # Check Python version
    if not check_python():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("⚠️  Continuing anyway, dependencies might already be installed...")
    
    # Add a small delay for readability
    time.sleep(1)
    
    # Start the backend
    start_backend()

if __name__ == "__main__":
    main()
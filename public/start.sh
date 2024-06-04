#!/bin/bash

# Define the directory containing your project
PROJECT_DIR="C:\Users\USER\Documents\Projects\FileManagement\file-management"

# Navigate to the project directory
cd "$PROJECT_DIR" || { echo "Directory not found: $PROJECT_DIR";}

# Run npm run dev
npm run start -- -p 3081 &

# Wait for a few seconds to ensure the development server starts
# sleep 5

# Open localhost in the default web browser
# # Linux
# xdg-open http://localhost:3000 &> /dev/null &
# # macOS
# open http://localhost:3000 &
# Windows (Git Bash)
# cmd.exe /c start http://localhost:5173

start http://localhost:3081

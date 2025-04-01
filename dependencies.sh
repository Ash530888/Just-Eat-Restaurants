#!/bin/bash

# Ensure Node.js and npm are installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js."
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install npm."
    exit
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Dependencies installed successfully!"

#!/usr/bin/env bash

# Install dependencies
npm install

# Build the project
npm run build

# Ensure proper permissions
chmod -R 755 dist/

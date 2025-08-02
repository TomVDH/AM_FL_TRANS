#!/bin/bash
# Quick setup script - non-interactive version
rm -rf node_modules package-lock.json .next && npm install && npm run build && echo "✅ Setup complete! Run 'npm run dev' to start development server." 
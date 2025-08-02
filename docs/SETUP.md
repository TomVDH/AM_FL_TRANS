# 🚀 AM Translations Helper - Project Setup Guide

This guide ensures your project can be instantiated properly regardless of how it's synced (Google Drive, Dropbox, Git, etc.).

## 📋 Prerequisites

Before running the setup scripts, ensure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## 🛠️ Quick Setup

### Option 1: Automated Setup (Recommended)

#### macOS/Linux:
```bash
./setup.sh
```

#### Windows:
```cmd
setup.bat
```

### Option 2: Manual Setup

If the automated scripts don't work, follow these steps:

1. **Clean existing installation:**
   ```bash
   rm -rf node_modules package-lock.json .next
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify TypeScript:**
   ```bash
   npm run type-check
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 What the Setup Scripts Do

The automated setup scripts perform the following steps:

1. **Environment Check**
   - Verify Node.js and npm are installed
   - Check versions for compatibility

2. **Clean Installation**
   - Remove existing `node_modules` directory
   - Remove `package-lock.json` for fresh dependency resolution
   - Remove `.next` build directory

3. **Dependency Installation**
   - Install all project dependencies
   - Handle any sync-related file corruption

4. **TypeScript Verification**
   - Run type checking
   - Automatically fix common font import issues
   - Ensure code quality

5. **Build Verification**
   - Build the project for production
   - Verify all components compile correctly

6. **Development Server**
   - Optionally start the development server
   - Provide helpful commands for ongoing development

## 🌐 Sync-Specific Considerations

### Google Drive
- **Issue**: Sometimes corrupts binary files or adds metadata
- **Solution**: The setup script cleans and reinstalls everything
- **Prevention**: Add `node_modules/` and `.next/` to `.gitignore`

### Dropbox
- **Issue**: May sync incomplete files during saves
- **Solution**: Clean installation ensures complete files
- **Prevention**: Use selective sync for large directories

### Git
- **Issue**: Different environments may have different Node.js versions
- **Solution**: Script checks Node.js version requirements
- **Prevention**: Use `.nvmrc` for version consistency

## 📁 Project Structure

```
AM Translations Helper/
├── setup.sh              # macOS/Linux setup script
├── setup.bat             # Windows setup script
├── SETUP.md              # This setup guide
├── package.json          # Project dependencies
├── src/                  # Source code
│   ├── app/             # Next.js app directory
│   └── components/      # React components
├── codex/               # Content files
└── excels/              # Excel files
```

## 🚨 Troubleshooting

### Common Issues

1. **"Command not found: next"**
   - Run: `npm install`
   - Then: `npm run dev`

2. **TypeScript errors with fonts**
   - The setup script automatically fixes these
   - Manual fix: Remove `next/font/google` imports

3. **Build fails with module errors**
   - Run: `rm -rf node_modules package-lock.json`
   - Then: `npm install`

4. **Port 3000 already in use**
   - Kill existing process: `lsof -ti:3000 | xargs kill -9`
   - Or use different port: `npm run dev -- -p 3001`

### Platform-Specific Issues

#### macOS
- If `./setup.sh` fails, run: `chmod +x setup.sh`
- If you get permission errors, run: `sudo chown -R $(whoami) .`

#### Windows
- Run Command Prompt as Administrator if you get permission errors
- If PowerShell execution policy blocks scripts, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

#### Linux
- If you get "command not found", install bash: `sudo apt-get install bash`

## 🎯 Available Commands

After setup, you can use these commands:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linting
npm run type-check # Check TypeScript types
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Ensure Node.js 18+ is installed
3. Try the manual setup steps
4. Check the project's GitHub issues

## 🔄 Re-running Setup

If you need to re-run setup (e.g., after syncing issues):

```bash
# macOS/Linux
./setup.sh

# Windows
setup.bat

# Or manually
rm -rf node_modules package-lock.json .next && npm install && npm run build
```

The setup scripts are designed to be safe to run multiple times and will clean up any corrupted files automatically. 
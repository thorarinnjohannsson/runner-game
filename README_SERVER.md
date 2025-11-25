# Starting the Game Server

## Quick Start

### Option 1: Using npm (Recommended)
```bash
npm start
```

### Option 2: Using Node.js directly
```bash
node server.js
```

### Option 3: Using the shell script
```bash
./start.sh
```

## Server Details

- **Default Port**: 8000
- **URL**: http://localhost:8000
- **Stops**: Press `Ctrl+C`
- **Hot Reload**: ✅ Enabled by default (automatically reloads browser on file changes)

## Hot Reload 🔥

The server automatically watches for changes in:
- `js/` directory (all JavaScript files)
- `styles.css`
- `index.html`

When you save any file, the browser will automatically reload!

### Disable Hot Reload

If you want to disable hot reload:
```bash
npm run server:no-reload
# or
HOT_RELOAD=false node server.js
```

## Change Port

To use a different port:
```bash
PORT=8001 npm start
# or
PORT=8001 node server.js
```

## Troubleshooting

### Port Already in Use

If port 8000 is already in use:

**Option 1: Kill the process**
```bash
lsof -ti:8000 | xargs kill -9
```

**Option 2: Use a different port**
```bash
PORT=8001 npm start
```

### Server Keeps Crashing

The Node.js server is more stable than Python's http.server. If it still crashes:

1. Check for errors in the terminal
2. Make sure Node.js is installed: `node --version`
3. Try a different port: `PORT=8001 npm start`

## Features

- ✅ Reliable and stable
- ✅ Handles errors gracefully
- ✅ No caching (always fresh files)
- ✅ Works on all platforms
- ✅ Shows network URL for mobile testing


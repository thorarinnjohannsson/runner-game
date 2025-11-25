#!/usr/bin/env node
// Simple HTTP server for the game with hot reload
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces by default
const HOT_RELOAD = process.env.HOT_RELOAD !== 'false'; // Enable by default

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// WebSocket clients for hot reload
const wsClients = new Set();

// Hot reload script to inject into HTML
const hotReloadScript = `
<script>
(function() {
    if (typeof WebSocket === 'undefined') return;
    const ws = new WebSocket('ws://' + window.location.hostname + ':${PORT}/__hot_reload__');
    ws.onmessage = function(event) {
        if (event.data === 'reload') {
            console.log('🔄 Hot reload: Reloading page...');
            window.location.reload();
        }
    };
    ws.onerror = function() {
        // WebSocket connection failed, ignore silently
    };
    ws.onclose = function() {
        // Connection closed, try to reconnect after a delay
        setTimeout(function() {
            // Page will reload anyway if server restarts
        }, 1000);
    };
})();
</script>
`;

const server = http.createServer((req, res) => {
    // Handle WebSocket upgrade for hot reload
    if (req.url === '/__hot_reload__' && req.headers.upgrade === 'websocket') {
        handleWebSocketUpgrade(req, res);
        return;
    }
    
    // Remove query string and decode URL
    let filePath = decodeURIComponent(req.url.split('?')[0]);
    
    // Default to index.html
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // Security: prevent directory traversal
    filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    
    // Get full file path
    const fullPath = path.join(__dirname, filePath);
    
    // Check if file exists
    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        
        // Get file extension for MIME type
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // Read and serve file
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            
            // Inject hot reload script into HTML files
            if (ext === '.html' && HOT_RELOAD) {
                let htmlContent = data.toString();
                // Inject before closing </body> tag
                if (htmlContent.includes('</body>')) {
                    htmlContent = htmlContent.replace('</body>', hotReloadScript + '\n</body>');
                } else {
                    htmlContent += hotReloadScript;
                }
                data = Buffer.from(htmlContent, 'utf-8');
            }
            
            // Add cache-busting headers for development
            const headers = {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            };
            
            res.writeHead(200, headers);
            res.end(data);
        });
    });
});

// Simple WebSocket upgrade handler
function handleWebSocketUpgrade(req, res) {
    const crypto = require('crypto');
    const WS_MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    const key = req.headers['sec-websocket-key'];
    
    if (!key) {
        res.writeHead(400);
        res.end();
        return;
    }
    
    const acceptKey = crypto
        .createHash('sha1')
        .update(key + WS_MAGIC_STRING)
        .digest('base64');
    
    const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`
    ];
    
    res.writeHead(101, {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Accept': acceptKey
    });
    
    // Store client socket
    wsClients.add(res);
    
    // Handle client disconnect
    res.on('close', () => {
        wsClients.delete(res);
    });
    
    // Send ping to keep connection alive
    const pingInterval = setInterval(() => {
        if (wsClients.has(res)) {
            try {
                // Simple ping frame (0x89 = ping, 0x0 = empty payload)
                res.write(Buffer.from([0x89, 0x0]));
            } catch (e) {
                wsClients.delete(res);
                clearInterval(pingInterval);
            }
        } else {
            clearInterval(pingInterval);
        }
    }, 30000);
}

// Broadcast reload message to all connected clients
function broadcastReload() {
    const message = 'reload';
    // Simple WebSocket text frame: 0x81 = text frame, length = message length
    const frame = Buffer.alloc(2 + message.length);
    frame[0] = 0x81; // Text frame, no mask
    frame[1] = message.length;
    frame.write(message, 2);
    
    wsClients.forEach(client => {
        try {
            client.write(frame);
        } catch (e) {
            wsClients.delete(client);
        }
    });
}

// Handle errors gracefully
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.log(`\nTry one of these:`);
        console.log(`  1. Kill the process using port ${PORT}:`);
        console.log(`     lsof -ti:${PORT} | xargs kill -9`);
        console.log(`  2. Use a different port:`);
        console.log(`     PORT=8001 node server.js\n`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

// File watcher for hot reload
let watchers = [];
function setupFileWatcher() {
    if (!HOT_RELOAD) return;
    
    const watchDirs = [
        path.join(__dirname, 'js'),
        path.join(__dirname, 'styles.css'),
        path.join(__dirname, 'index.html')
    ];
    
    const watchedFiles = new Set();
    let reloadTimeout = null;
    let pendingChanges = new Set();
    
    function watchFile(filePath) {
        if (watchedFiles.has(filePath)) return;
        watchedFiles.add(filePath);
        
        try {
            const watcher = fs.watch(filePath, { persistent: true }, (eventType) => {
                if (eventType === 'change') {
                    const fileName = path.basename(filePath);
                    pendingChanges.add(fileName);
                    
                    // Wait longer for agent to finish making changes
                    // Increased debounce time to 2 seconds to allow multiple file edits
                    clearTimeout(reloadTimeout);
                    reloadTimeout = setTimeout(() => {
                        const changedFiles = Array.from(pendingChanges);
                        console.log(`\n🔄 Files changed: ${changedFiles.join(', ')}`);
                        console.log('   Waiting for changes to settle...');
                        
                        // Additional wait to ensure agent is done (total ~3 seconds)
                        setTimeout(() => {
                            console.log('   Reloading browser...\n');
                            broadcastReload();
                            pendingChanges.clear();
                        }, 1000);
                    }, 2000); // Wait 2 seconds after last change
                }
            });
            
            watcher.on('error', (err) => {
                // Ignore errors for files that don't exist yet
            });
            
            watchers.push(watcher);
        } catch (e) {
            // File might not exist, ignore
        }
    }
    
    // Watch directories
    watchDirs.forEach(dir => {
        try {
            const stats = fs.statSync(dir);
            if (stats.isDirectory()) {
                // Watch all files in directory
                fs.readdirSync(dir).forEach(file => {
                    const filePath = path.join(dir, file);
                    if (fs.statSync(filePath).isFile()) {
                        watchFile(filePath);
                    }
                });
                
                // Watch for new files
                const dirWatcher = fs.watch(dir, { persistent: true }, (eventType, filename) => {
                    if (filename && eventType === 'rename') {
                        const filePath = path.join(dir, filename);
                        setTimeout(() => {
                            try {
                                if (fs.statSync(filePath).isFile()) {
                                    watchFile(filePath);
                                }
                            } catch (e) {
                                // File might have been deleted
                            }
                        }, 100);
                    }
                });
                watchers.push(dirWatcher);
            } else if (stats.isFile()) {
                watchFile(dir);
            }
        } catch (e) {
            // Directory/file doesn't exist, skip
        }
    });
}

// Get network IP addresses
function getNetworkIPs() {
    const interfaces = require('os').networkInterfaces();
    const ips = [];
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }
    
    return ips;
}

// Start server
server.listen(PORT, HOST, () => {
    console.log('\n🚀 Game server started!');
    
    const networkIPs = getNetworkIPs();
    const localIP = networkIPs[0] || 'localhost';
    
    console.log(`\n📍 Local:    http://localhost:${PORT}`);
    if (networkIPs.length > 0) {
        console.log(`\n📍 Network access:`);
        networkIPs.forEach(ip => {
            console.log(`   http://${ip}:${PORT}`);
        });
    } else {
        console.log(`\n⚠️  No network interfaces found. Only accessible via localhost.`);
    }
    
    if (HOT_RELOAD) {
        console.log(`\n🔥 Hot reload: ENABLED`);
        console.log(`   Watching for file changes...`);
        setupFileWatcher();
    } else {
        console.log(`\n💡 Hot reload: DISABLED`);
    }
    
    console.log(`\n💡 Press Ctrl+C to stop the server\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...');
    
    // Close all file watchers
    watchers.forEach(watcher => {
        try {
            watcher.close();
        } catch (e) {
            // Ignore errors
        }
    });
    
    // Close WebSocket connections
    wsClients.forEach(client => {
        try {
            client.end();
        } catch (e) {
            // Ignore errors
        }
    });
    
    server.close(() => {
        console.log('✅ Server stopped\n');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    watchers.forEach(watcher => {
        try {
            watcher.close();
        } catch (e) {}
    });
    wsClients.forEach(client => {
        try {
            client.end();
        } catch (e) {}
    });
    server.close(() => {
        process.exit(0);
    });
});


#!/usr/bin/env node
// Script to manually bump version (major, minor, or patch)
const fs = require('fs');
const path = require('path');

const VERSION_FILE = path.join(__dirname, 'VERSION');

function getCurrentVersion() {
    try {
        return fs.readFileSync(VERSION_FILE, 'utf-8').trim() || '1.0.0';
    } catch (error) {
        return '1.0.0';
    }
}

function incrementVersion(version, type = 'patch') {
    const parts = version.split('.').map(Number);
    if (parts.length !== 3) parts = [1, 0, 0];
    
    switch(type) {
        case 'major':
            parts[0]++;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1]++;
            parts[2] = 0;
            break;
        case 'patch':
        default:
            parts[2]++;
            break;
    }
    
    return parts.join('.');
}

// Get version type from command line argument
const versionType = process.argv[2] || 'patch'; // 'major', 'minor', or 'patch'

if (!['major', 'minor', 'patch'].includes(versionType)) {
    console.error('Usage: node bump-version.js [major|minor|patch]');
    console.error('Default: patch');
    process.exit(1);
}

const currentVersion = getCurrentVersion();
const newVersion = incrementVersion(currentVersion, versionType);

// Update VERSION file
fs.writeFileSync(VERSION_FILE, newVersion);

console.log(`Version bumped: ${currentVersion} → ${newVersion}`);
console.log(`Run 'node generate-version.js' to update version.json`);


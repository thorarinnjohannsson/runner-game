#!/usr/bin/env node
// Script to generate version info with semantic versioning
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERSION_FILE = path.join(__dirname, 'VERSION');
const VERSION_JSON = path.join(__dirname, 'version.json');

// Read current version or start at 1.0.0
function getCurrentVersion() {
    try {
        const versionContent = fs.readFileSync(VERSION_FILE, 'utf-8').trim();
        return versionContent || '1.0.0';
    } catch (error) {
        return '1.0.0';
    }
}

// Increment version (patch version by default)
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

try {
    // Get current version from VERSION file (source of truth)
    const versionToUse = getCurrentVersion();
    
    // Get commit date
    let commitDate;
    try {
        commitDate = execSync('git log -1 --format="%ci"', { encoding: 'utf-8' }).trim();
    } catch (error) {
        commitDate = new Date().toISOString();
    }
    
    // Get commit message (first line)
    let commitMessage;
    try {
        commitMessage = execSync('git log -1 --format="%s"', { encoding: 'utf-8' }).trim();
    } catch (error) {
        commitMessage = 'Development build';
    }
    
    // Get short commit hash (optional, for reference)
    let commitHash;
    try {
        commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch (error) {
        commitHash = 'dev';
    }
    
    const versionInfo = {
        version: versionToUse,
        hash: commitHash,
        date: commitDate,
        message: commitMessage,
        timestamp: Date.now()
    };
    
    // Write to version.json
    fs.writeFileSync(VERSION_JSON, JSON.stringify(versionInfo, null, 2));
    
    // Update VERSION file
    fs.writeFileSync(VERSION_FILE, versionToUse);
    
    console.log(`Version info generated: v${versionToUse} (${commitDate})`);
} catch (error) {
    console.error('Error generating version:', error.message);
    // Fallback
    const versionInfo = {
        version: '1.0.0',
        hash: 'dev',
        date: new Date().toISOString(),
        message: 'Development build',
        timestamp: Date.now()
    };
    
    fs.writeFileSync(VERSION_JSON, JSON.stringify(versionInfo, null, 2));
    console.log('Version info generated (fallback): v1.0.0');
}

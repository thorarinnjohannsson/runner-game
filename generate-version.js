#!/usr/bin/env node
// Script to generate version info with simple incremental versioning (1, 2, 3, etc.)
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERSION_FILE = path.join(__dirname, 'VERSION');
const VERSION_JSON = path.join(__dirname, 'version.json');

// Read current version or start at 1
function getCurrentVersion() {
    try {
        const versionContent = fs.readFileSync(VERSION_FILE, 'utf-8').trim();
        // Parse as integer, default to 1 if invalid
        const version = parseInt(versionContent, 10);
        return isNaN(version) ? 1 : version;
    } catch (error) {
        return 1;
    }
}

// Increment version (simple integer increment)
function incrementVersion(version) {
    return version + 1;
}

try {
    // Get current version and increment it
    const currentVersion = getCurrentVersion();
    const newVersion = incrementVersion(currentVersion);
    const versionToUse = newVersion.toString();
    
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
    
    // Update VERSION file with incremented version
    fs.writeFileSync(VERSION_FILE, versionToUse);
    
    console.log(`Version incremented: ${currentVersion} → ${newVersion} (${commitDate})`);
} catch (error) {
    console.error('Error generating version:', error.message);
    // Fallback
    const versionInfo = {
        version: '1',
        hash: 'dev',
        date: new Date().toISOString(),
        message: 'Development build',
        timestamp: Date.now()
    };
    
    fs.writeFileSync(VERSION_JSON, JSON.stringify(versionInfo, null, 2));
    fs.writeFileSync(VERSION_FILE, '1');
    console.log('Version info generated (fallback): v1');
}

#!/usr/bin/env node
// Script to generate version info from git
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    // Get git commit hash (short)
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    
    // Get commit date
    const commitDate = execSync('git log -1 --format="%ci"', { encoding: 'utf-8' }).trim();
    
    // Get commit message (first line)
    const commitMessage = execSync('git log -1 --format="%s"', { encoding: 'utf-8' }).trim();
    
    const versionInfo = {
        hash: commitHash,
        date: commitDate,
        message: commitMessage,
        timestamp: Date.now()
    };
    
    // Write to version.json
    fs.writeFileSync(
        path.join(__dirname, 'version.json'),
        JSON.stringify(versionInfo, null, 2)
    );
    
    console.log(`Version info generated: ${commitHash} (${commitDate})`);
} catch (error) {
    // Fallback if not a git repo or git command fails
    const versionInfo = {
        hash: 'dev',
        date: new Date().toISOString(),
        message: 'Development build',
        timestamp: Date.now()
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'version.json'),
        JSON.stringify(versionInfo, null, 2)
    );
    
    console.log('Version info generated (fallback): dev build');
}


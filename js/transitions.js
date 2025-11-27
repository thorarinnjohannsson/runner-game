// LEVEL TRANSITION MANAGER - Cave sequence and animations

// Transition phases
const TRANSITION_PHASES = {
    MOUNTAIN_APPROACH: 'MOUNTAIN_APPROACH',
    CAVE_ENTRY: 'CAVE_ENTRY',
    CAVE_INTERIOR: 'CAVE_INTERIOR',
    ANTICIPATION: 'ANTICIPATION',
    CAVE_EXIT: 'CAVE_EXIT',
    LEVEL_INTRO: 'LEVEL_INTRO'
};

// Transition manager class
class TransitionManager {
    constructor() {
        this.active = false;
        this.phase = null;
        this.phaseStartTime = 0;
        this.totalStartTime = 0;
        
        // Animation state
        this.characterX = 0;
        this.characterY = 0;
        this.mountainX = 0;
        this.caveAlpha = 0;
        this.statsRevealed = 0;
        this.countdown = 3;
        this.torches = [];
        
        // Stats animation
        this.statsToShow = [];
        this.currentStatIndex = 0;
    }
    
    start() {
        this.active = true;
        this.phase = TRANSITION_PHASES.MOUNTAIN_APPROACH;
        this.phaseStartTime = Date.now();
        this.totalStartTime = Date.now();
        this.characterX = player ? player.x : 100;
        this.characterY = player ? player.y : GROUND_Y - 40;
        
        // Target ground position
        this.targetGroundY = GROUND_Y - 40;
        
        // Mountain fixed on the right side (sticking out 200px)
        this.mountainX = canvas.width - 200; 
        
        this.caveAlpha = 0;
        this.statsRevealed = 0;
        this.currentStatIndex = 0;
        
        // Clear obstacles in front of player to ensure clear path
        if (typeof obstacles !== 'undefined') {
            obstacles = obstacles.filter(obs => obs.x < this.characterX);
        }
        
        // Clear any existing effects before starting transition
        // This ensures celebration effects only appear during the transition scene
        if (typeof clearEffects !== 'undefined') {
            clearEffects();
        }
        
        // Prepare stats for reveal
        this.prepareStats();
        
        // Play level complete sound
        if (typeof audioManager !== 'undefined') {
            audioManager.playSound('gameOver'); // Triumphant fanfare
        }
    }
    
    prepareStats() {
        this.statsToShow = [
            { label: 'Time', value: this.formatTime(lastLevelStats.duration) },
            { label: 'Obstacles', value: lastLevelStats.obstaclesCleared },
            { label: 'Level Score', value: levelManager.getPointsRequired() },
            { label: 'Heart Reward', value: typeof heartRewardEarned !== 'undefined' && heartRewardEarned ? '+1 ❤️' : (typeof lives !== 'undefined' && lives >= 5 ? 'MAX ❤️' : ''), isHeart: true },
            { label: 'TOTAL', value: score, isTotal: true }
        ];
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    update() {
        if (!this.active) return;
        
        const phaseElapsed = Date.now() - this.phaseStartTime;
        
        switch (this.phase) {
            case TRANSITION_PHASES.MOUNTAIN_APPROACH:
                this.updateMountainApproach(phaseElapsed);
                break;
            case TRANSITION_PHASES.CAVE_ENTRY:
                this.updateCaveEntry(phaseElapsed);
                break;
            case TRANSITION_PHASES.CAVE_INTERIOR:
                this.updateCaveInterior(phaseElapsed);
                break;
            case TRANSITION_PHASES.ANTICIPATION:
                this.updateAnticipation(phaseElapsed);
                break;
            case TRANSITION_PHASES.CAVE_EXIT:
                this.updateCaveExit(phaseElapsed);
                break;
            case TRANSITION_PHASES.LEVEL_INTRO:
                this.updateLevelIntro(phaseElapsed);
                break;
        }
    }
    
    updateMountainApproach(elapsed) {
        const duration = 2500; // 2.5 seconds
        
        // Character runs forward toward the cave
        this.characterX += 6;
        
        // If character is in the air, guide them to ground smoothly
        if (this.characterY < this.targetGroundY) {
            // Ease down to ground
            const descendSpeed = 4;
            this.characterY = Math.min(this.characterY + descendSpeed, this.targetGroundY);
        } else if (this.characterY > this.targetGroundY) {
            this.characterY = this.targetGroundY;
        }
        
        
        if (elapsed > duration) {
            this.nextPhase();
        }
    }
    
    updateCaveEntry(elapsed) {
        const duration = 1500; // 1.5 seconds
        
        // Continue moving
        this.characterX += 4;
        
        // Fade to dark
        this.caveAlpha = Math.min(1, elapsed / 1000);
        
        if (elapsed > duration) {
            // Initialize torches
            this.torches = [
                new TorchFlicker(canvas.width * 0.2, canvas.height * 0.3),
                new TorchFlicker(canvas.width * 0.8, canvas.height * 0.3)
            ];
            this.nextPhase();
        }
    }
    
    updateCaveInterior(elapsed) {
        const duration = 3500; // Reduced from 5 to 3.5 seconds
        const statDelay = 400; // Reduced from 800ms to 400ms - faster reveal
        
        // Update torches
        this.torches.forEach(torch => torch.update());
        
        // Create continuous particle effects
        if (elapsed < duration && elapsed % 200 < 50) { // Every 200ms, create particles for 50ms
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            if (typeof createParticleExplosion !== 'undefined' && typeof Particle !== 'undefined') {
                // Create sparkle particles
                for (let i = 0; i < 3; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 100 + Math.random() * 150;
                    const x = centerX + Math.cos(angle) * distance;
                    const y = centerY + Math.sin(angle) * distance;
                    const vx = (Math.random() - 0.5) * 2;
                    const vy = (Math.random() - 0.5) * 2 - 1;
                    const size = 2 + Math.random() * 3;
                    const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#FFFFFF'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    if (typeof particles !== 'undefined') {
                        particles.push(new Particle(x, y, vx, vy, color, size, 'star'));
                    }
                }
            }
        }
        
        // Reveal stats one by one (faster)
        const statsShouldShow = Math.floor(elapsed / statDelay);
        if (statsShouldShow > this.currentStatIndex && this.currentStatIndex < this.statsToShow.length) {
            this.currentStatIndex = statsShouldShow;
            
            // Create stone carve effect
            const y = 200 + this.currentStatIndex * 60;
            if (typeof addEffect !== 'undefined' && typeof createStoneCarveEffect !== 'undefined') {
                addEffect(createStoneCarveEffect(canvas.width / 2 - 100, y, 200));
            }
            
            // Play carve sound
            if (typeof audioManager !== 'undefined') {
                audioManager.playSound('jump');
            }
            
            // Special effect for heart reward
            if (this.statsToShow[this.currentStatIndex] && this.statsToShow[this.currentStatIndex].isHeart && typeof heartRewardEarned !== 'undefined' && heartRewardEarned) {
                // Create heart celebration particles
                if (typeof createParticleExplosion !== 'undefined') {
                    createParticleExplosion(canvas.width / 2, y, '#FF0000');
                }
            }
            
            // If last stat (total), create celebration
            if (this.currentStatIndex === this.statsToShow.length - 1) {
                if (typeof addEffect !== 'undefined' && typeof createCelebrationBurst !== 'undefined') {
                    addEffect(createCelebrationBurst(canvas.width / 2, y, 40));
                }
            }
        }
        
        if (elapsed > duration) {
            this.nextPhase();
        }
    }
    
    updateAnticipation(elapsed) {
        const duration = 2000; // Reduced from 3 to 2 seconds
        
        // Update torches
        this.torches.forEach(torch => torch.update());
        
        // Update countdown (starts immediately, faster)
        const newCountdown = 2 - Math.floor(elapsed / 1000);
        if (newCountdown !== this.countdown && newCountdown >= 0) {
            this.countdown = newCountdown;
            if (typeof audioManager !== 'undefined') {
                audioManager.playSound('jump'); // Beep
            }
        }
        
        if (elapsed > duration) {
            // Apply new theme BEFORE exit phase starts
            if (typeof applyTheme !== 'undefined' && typeof levelManager !== 'undefined') {
                const newTheme = levelManager.getNextTheme(); // Use next theme
                applyTheme(newTheme);
            }
            
            // Reset character position to LEFT side (starts off-screen left)
            this.characterX = -50;
            
            this.nextPhase();
        }
    }
    
    updateCaveExit(elapsed) {
        const duration = 2000; // 2 seconds
        
        // Fade out cave
        this.caveAlpha = Math.max(0, 1 - elapsed / 1000);
        
        // Character moves out from left
        this.characterX += 6;
        
        // Flash effect at start
        if (elapsed < 300) {
            // Only add flash once
            if (elapsed < 50) {
                addEffect(new ScreenFlash('#FFFFFF', 0.3));
            }
        }
        
        if (elapsed > duration) {
            // Skip LEVEL_INTRO phase - go directly to completing the transition
            // This starts the game immediately after exiting the cave
            this.complete();
        }
    }
    
    updateLevelIntro(elapsed) {
        const duration = 2000; // 2 seconds
        
        if (elapsed > duration) {
            this.complete();
        }
    }
    
    nextPhase() {
        const phases = Object.values(TRANSITION_PHASES);
        const currentIndex = phases.indexOf(this.phase);
        
        if (currentIndex < phases.length - 1) {
            this.phase = phases[currentIndex + 1];
            this.phaseStartTime = Date.now();
        }
    }
    
    complete() {
        this.active = false;
        
        // Start next level
        if (typeof startNextLevel === 'function') {
            startNextLevel();
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        switch (this.phase) {
            case TRANSITION_PHASES.MOUNTAIN_APPROACH:
                this.drawMountainApproach(ctx);
                break;
            case TRANSITION_PHASES.CAVE_ENTRY:
                this.drawCaveEntry(ctx);
                break;
            case TRANSITION_PHASES.CAVE_INTERIOR:
                this.drawCaveInterior(ctx);
                break;
            case TRANSITION_PHASES.ANTICIPATION:
                this.drawAnticipation(ctx);
                break;
            case TRANSITION_PHASES.CAVE_EXIT:
                this.drawCaveExit(ctx);
                break;
            case TRANSITION_PHASES.LEVEL_INTRO:
                this.drawLevelIntro(ctx);
                break;
        }
    }
    
    drawMountainApproach(ctx) {
        // Draw mountain - FULL HEIGHT from ground to top
        ctx.save();
        
        // Mountain silhouette
        ctx.fillStyle = '#6D5C4D';
        ctx.beginPath();
        ctx.moveTo(this.mountainX, GROUND_Y);
        
        // Left slope up
        ctx.lineTo(this.mountainX + 80, GROUND_Y - 150);
        ctx.lineTo(this.mountainX + 120, 0); // Peak reaches top of screen
        
        // Extend to right edge
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, GROUND_Y);
        
        ctx.closePath();
        ctx.fill();
        
        // Darker mountain layer for depth
        ctx.fillStyle = '#5A4A3D';
        ctx.beginPath();
        ctx.moveTo(this.mountainX + 20, GROUND_Y);
        ctx.lineTo(this.mountainX + 100, GROUND_Y - 120);
        ctx.lineTo(this.mountainX + 120, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, GROUND_Y);
        ctx.closePath();
        ctx.fill();
        
        // Cave entrance (centered at ground level)
        const caveX = this.mountainX + 80;
        const caveY = GROUND_Y - 70;
        const caveWidth = 80;
        const caveHeight = 70;
        
        // Cave opening (Blackness extends to right)
        ctx.fillStyle = '#1A0F08';
        ctx.beginPath();
        ctx.arc(caveX + 30, caveY + 30, 30, Math.PI, 1.5 * Math.PI, false);
        ctx.lineTo(canvas.width, caveY);
        ctx.lineTo(canvas.width, caveY + caveHeight);
        ctx.lineTo(caveX, caveY + caveHeight);
        ctx.lineTo(caveX, caveY + 30);
        ctx.fill();
        
        ctx.restore();
        
        // Draw character running
        if (player) {
            ctx.save();
            ctx.translate(this.characterX, this.characterY);
            // Draw player at 0,0 since we've translated
            const tempX = player.x;
            const tempY = player.y;
            player.x = 0;
            player.y = 0;
            player.draw(ctx);
            player.x = tempX;
            player.y = tempY;
            ctx.restore();
        }
        
        // Draw FOREGROUND mountain part to mask entry
        ctx.save();
        ctx.fillStyle = '#5A4A3D';
        ctx.beginPath();
        // A rock formation covering the right side of the player as they enter
        ctx.moveTo(this.mountainX + 110, GROUND_Y);
        ctx.lineTo(this.mountainX + 110, caveY);
        ctx.lineTo(canvas.width, caveY); // Top of cave entrance
        ctx.lineTo(canvas.width, 0); // Mask everything right of entrance high up? No just entrance
        // Actually just draw the "Arch" over the top/right
        ctx.restore();
    }
    
    drawCaveEntry(ctx) {
        // Dark overlay
        ctx.fillStyle = `rgba(0, 0, 0, ${this.caveAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Character silhouette
        if (this.caveAlpha < 0.9 && player) {
            ctx.save();
            ctx.globalAlpha = 1 - this.caveAlpha;
            ctx.translate(this.characterX, this.characterY);
            const tempX = player.x;
            const tempY = player.y;
            player.x = 0;
            player.y = 0;
            player.draw(ctx);
            player.x = tempX;
            player.y = tempY;
            ctx.restore();
        }
    }
    
    drawCaveInterior(ctx) {
        const elapsed = Date.now() - this.phaseStartTime;
        
        // Detect mobile landscape
        const isLandscape = typeof isPortrait !== 'undefined' ? !isPortrait : canvas.width > canvas.height;
        const isMobileLandscape = typeof isMobile !== 'undefined' && isMobile && isLandscape;
        
        // Animated gradient background with theme colors
        const nextTheme = typeof levelManager !== 'undefined' ? levelManager.getNextTheme() : null;
        if (nextTheme) {
            // Use horizontal gradient for landscape
            const gradient = ctx.createLinearGradient(0, 0, isLandscape ? canvas.width : 0, isLandscape ? 0 : canvas.height);
            const time = Date.now() * 0.001;
            const pulse = 0.5 + Math.sin(time) * 0.3;
            
            // Blend between dark cave and theme colors
            gradient.addColorStop(0, this.interpolateColor('#1A0F08', nextTheme.skyTop || '#2C3E50', pulse * 0.3));
            gradient.addColorStop(0.5, this.interpolateColor('#1A0F08', nextTheme.groundTop || '#34495E', pulse * 0.2));
            gradient.addColorStop(1, '#1A0F08');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = '#1A0F08';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw torches
        this.torches.forEach(torch => torch.draw(ctx));
        
        // Title with pulsing glow - smaller and positioned for landscape
        const titlePulse = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
        ctx.fillStyle = '#FFD700';
        const titleSize = isMobileLandscape ? 32 : 48;
        ctx.font = `bold ${titleSize * titlePulse}px Arial`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15 * titlePulse;
        const titleY = isMobileLandscape ? 30 : 100;
        ctx.fillText(`LEVEL ${levelManager.currentLevel} COMPLETE!`, canvas.width / 2, titleY);
        ctx.shadowBlur = 0;
        
        if (isMobileLandscape) {
            // LANDSCAPE LAYOUT: Side-by-side stats with better space usage
            const slideProgress = Math.min(1, elapsed / 300);
            const panelPadding = 20;
            const panelSpacing = 15;
            const leftPanelX = panelPadding;
            const rightPanelX = canvas.width / 2 + panelSpacing / 2;
            const panelY = titleY + 40;
            const panelWidth = (canvas.width - panelPadding * 2 - panelSpacing) / 2;
            const panelHeight = canvas.height - panelY - panelPadding;
            
            // Left panel: Time and Obstacles
            const leftPanelOffsetX = (1 - slideProgress) * -panelWidth;
            this.drawStatPanel(ctx, leftPanelX + leftPanelOffsetX, panelY, panelWidth, panelHeight, 
                this.statsToShow.filter((_, i) => i < 2), elapsed, 0);
            
            // Right panel: Score, Heart, Total
            const rightPanelOffsetX = (1 - slideProgress) * panelWidth;
            this.drawStatPanel(ctx, rightPanelX + rightPanelOffsetX, panelY, panelWidth, panelHeight, 
                this.statsToShow.filter((_, i) => i >= 2), elapsed, 2);
        } else {
            // PORTRAIT/DESKTOP LAYOUT: Centered vertical panel
            const tabletX = canvas.width / 2 - 200;
            const tabletY = titleY + 50;
            const slideProgress = Math.min(1, elapsed / 300);
            const tabletOffsetX = (1 - slideProgress) * -400;
            
            // Panel glow effect
            const glowPulse = 0.5 + Math.sin(Date.now() * 0.008) * 0.5;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20 * glowPulse;
            ctx.fillStyle = '#5D4E37';
            ctx.fillRect(tabletX + tabletOffsetX, tabletY, 400, 320);
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = '#3E2F1F';
            ctx.lineWidth = 4;
            ctx.strokeRect(tabletX + tabletOffsetX, tabletY, 400, 320);
            
            // Inner glow border
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3 * glowPulse;
            ctx.strokeRect(tabletX + tabletOffsetX + 4, tabletY + 4, 392, 312);
            ctx.globalAlpha = 1.0;
            
            // Stats carved in stone with fade-in animation
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            
            for (let i = 0; i < Math.min(this.currentStatIndex + 1, this.statsToShow.length); i++) {
                const stat = this.statsToShow[i];
                const y = tabletY + 50 + i * 55;
                const fadeProgress = Math.min(1, (elapsed - i * 400) / 200);
                
                if (fadeProgress > 0) {
                    ctx.globalAlpha = fadeProgress;
                    this.drawStatLine(ctx, stat, tabletX + tabletOffsetX + 40, y, tabletX + tabletOffsetX + 360);
                    ctx.globalAlpha = 1.0;
                }
            }
        }
        
        ctx.textAlign = 'left';
    }
    
    // Helper method to draw a stat panel (for landscape layout)
    drawStatPanel(ctx, x, y, width, height, stats, elapsed, startIndex) {
        const glowPulse = 0.5 + Math.sin(Date.now() * 0.008) * 0.5;
        
        // Panel background
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20 * glowPulse;
        ctx.fillStyle = '#5D4E37';
        ctx.fillRect(x, y, width, height);
        ctx.shadowBlur = 0;
        
        // Panel border
        ctx.strokeStyle = '#3E2F1F';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        
        // Inner glow border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3 * glowPulse;
        ctx.strokeRect(x + 4, y + 4, width - 8, height - 8);
        ctx.globalAlpha = 1.0;
        
        // Calculate spacing for stats
        const padding = 20;
        const statHeight = (height - padding * 2) / Math.max(stats.length, 1);
        const fontSize = Math.min(20, statHeight * 0.4);
        
        // Draw stats
        for (let i = 0; i < Math.min(this.currentStatIndex + 1 - startIndex, stats.length); i++) {
            const stat = stats[i];
            const statY = y + padding + i * statHeight + statHeight / 2;
            const fadeProgress = Math.min(1, (elapsed - (startIndex + i) * 400) / 200);
            
            if (fadeProgress > 0 && stat) {
                ctx.globalAlpha = fadeProgress;
                this.drawStatLine(ctx, stat, x + padding, statY, x + width - padding, fontSize);
                ctx.globalAlpha = 1.0;
            }
        }
    }
    
    // Helper method to draw a single stat line
    drawStatLine(ctx, stat, leftX, y, rightX, fontSize = 24) {
        // Special styling for heart reward
        if (stat.isHeart) {
            const heartPulse = 1 + Math.sin(Date.now() * 0.01) * 0.2;
            ctx.fillStyle = '#FF0000';
            ctx.font = `bold ${(fontSize + 4) * heartPulse}px Arial`;
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 15 * heartPulse;
        } else if (stat.isTotal) {
            ctx.fillStyle = '#FFD700';
            ctx.font = `bold ${fontSize + 8}px Arial`;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = '#D4A574';
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.shadowBlur = 0;
        }
        
        ctx.textAlign = 'left';
        ctx.fillText(stat.label + ':', leftX, y);
        ctx.textAlign = 'right';
        ctx.fillText(stat.value.toString(), rightX, y);
        ctx.shadowBlur = 0;
    }
    
    // Helper function to interpolate colors
    interpolateColor(color1, color2, factor) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    drawAnticipation(ctx) {
        // Detect mobile landscape
        const isLandscape = typeof isPortrait !== 'undefined' ? !isPortrait : canvas.width > canvas.height;
        const isMobileLandscape = typeof isMobile !== 'undefined' && isMobile && isLandscape;
        
        // Dark cave
        ctx.fillStyle = '#1A0F08';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Torches
        this.torches.forEach(torch => torch.draw(ctx));
        
        // Exit light
        const exitGlow = ctx.createRadialGradient(
            canvas.width * 0.7, GROUND_Y - 50, 0,
            canvas.width * 0.7, GROUND_Y - 50, 150
        );
        exitGlow.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        exitGlow.addColorStop(1, 'rgba(255, 255, 200, 0)');
        ctx.fillStyle = exitGlow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const nextTheme = levelManager.getNextTheme();
        
        if (isMobileLandscape) {
            // LANDSCAPE LAYOUT: Horizontal layout with countdown on right
            // Left side: Theme info
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 10;
            const leftX = 30;
            const leftY = canvas.height / 2;
            ctx.fillText('PREPARE FOR', leftX, leftY - 30);
            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = typeof getThemeColor !== 'undefined' ? getThemeColor(nextTheme) : '#FFFFFF';
            ctx.fillText(nextTheme.name, leftX, leftY + 20);
            
            // Right side: Countdown (larger, prominent)
            if (this.countdown > 0) {
                const countdownPulse = 1 + Math.sin(Date.now() * 0.02) * 0.15;
                const countdownSize = Math.min(80, canvas.height * 0.4);
                ctx.font = `bold ${countdownSize * countdownPulse}px Arial`;
                ctx.fillStyle = '#FF4444';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 6;
                ctx.textAlign = 'right';
                ctx.shadowColor = '#FF4444';
                ctx.shadowBlur = 20 * countdownPulse;
                const rightX = canvas.width - 30;
                const rightY = canvas.height / 2;
                ctx.strokeText(this.countdown.toString(), rightX, rightY);
                ctx.fillText(this.countdown.toString(), rightX, rightY);
            }
        } else {
            // PORTRAIT/DESKTOP LAYOUT: Centered vertical
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 10;
            ctx.fillText('PREPARE FOR', canvas.width / 2, canvas.height / 2 - 80);
            
            ctx.font = 'bold 36px Arial';
            ctx.fillText(nextTheme.name, canvas.width / 2, canvas.height / 2 - 30);
            
            // Countdown with dynamic scale animation
            if (this.countdown > 0) {
                const countdownPulse = 1 + Math.sin(Date.now() * 0.02) * 0.15;
                ctx.font = `bold ${96 * countdownPulse}px Arial`;
                ctx.fillStyle = '#FF4444';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 6;
                ctx.shadowColor = '#FF4444';
                ctx.shadowBlur = 20 * countdownPulse;
                ctx.strokeText(this.countdown.toString(), canvas.width / 2, canvas.height / 2 + 80);
                ctx.fillText(this.countdown.toString(), canvas.width / 2, canvas.height / 2 + 80);
            }
        }
        
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }
    
    // Helper method to get theme color (matches ui.js function)
    getThemeColor(theme) {
        if (theme.id === 'desert') return '#FFA726';
        if (theme.id === 'forest') return '#66BB6A';
        if (theme.id === 'snow') return '#90CAF9';
        if (theme.id === 'volcano') return '#EF5350';
        if (theme.id === 'ocean') return '#42A5F5';
        return '#FFFFFF';
    }
    
    drawCaveExit(ctx) {
        // Draw new background first (handled by main loop, but we can ensure it)
        // Draw Mountain on LEFT
        ctx.save();
        
        // Mountain silhouette (flipped logic for left side)
        ctx.fillStyle = '#6D5C4D';
        ctx.beginPath();
        // Peak at 120 from left
        ctx.moveTo(0, 0); // Top left
        ctx.lineTo(120, 0); // Peak
        ctx.lineTo(200, GROUND_Y - 120); // Slope down
        ctx.lineTo(250, GROUND_Y); // Base
        ctx.lineTo(0, GROUND_Y); // Bottom left
        ctx.closePath();
        ctx.fill();
        
        // Darker layer
        ctx.fillStyle = '#5A4A3D';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(80, 0);
        ctx.lineTo(150, GROUND_Y - 100);
        ctx.lineTo(180, GROUND_Y);
        ctx.lineTo(0, GROUND_Y);
        ctx.closePath();
        ctx.fill();
        
        // Cave entrance (Left side)
        const caveWidth = 80;
        const caveHeight = 70;
        const caveY = GROUND_Y - 70;
        
        // Cave opening (Blackness extends from left)
        ctx.fillStyle = '#1A0F08';
        ctx.beginPath();
        ctx.moveTo(0, caveY);
        ctx.lineTo(caveWidth, caveY);
        ctx.arc(caveWidth, caveY + 30, 30, 1.5 * Math.PI, 0.5 * Math.PI, true); // Right curve
        ctx.lineTo(caveWidth, caveY + caveHeight);
        ctx.lineTo(0, caveY + caveHeight);
        ctx.fill();
        
        ctx.restore();
        
        // Draw character exiting
        if (player) {
            ctx.save();
            ctx.translate(this.characterX, this.characterY);
            const tempX = player.x;
            const tempY = player.y;
            player.x = 0;
            player.y = 0;
            player.draw(ctx);
            player.x = tempX;
            player.y = tempY;
            ctx.restore();
        }
        
        // Bright flash/fade overlay
        if (this.caveAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.caveAlpha * 0.5})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    drawLevelIntro(ctx) {
        // We are transitioning TO the next level, so show next level info
        const nextLevel = levelManager.currentLevel + 1;
        const theme = levelManager.getNextTheme();
        
        // Theme colors flood
        ctx.fillStyle = theme.skyTop;
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
        ctx.fillStyle = theme.groundTop;
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
        
        // Banner
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, canvas.height / 2 - 80, canvas.width, 160);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL ${nextLevel}`, canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(theme.name, canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Global transition manager
let transitionManager = new TransitionManager();


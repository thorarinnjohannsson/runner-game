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
        const duration = 5000; // 5 seconds
        const statDelay = 800; // Delay between stats
        
        // Update torches
        this.torches.forEach(torch => torch.update());
        
        // Reveal stats one by one
        const statsShouldShow = Math.floor(elapsed / statDelay);
        if (statsShouldShow > this.currentStatIndex && this.currentStatIndex < this.statsToShow.length) {
            this.currentStatIndex = statsShouldShow;
            
            // Create stone carve effect
            const y = 200 + this.currentStatIndex * 60;
            addEffect(createStoneCarveEffect(canvas.width / 2 - 100, y, 200));
            
            // Play carve sound
            if (typeof audioManager !== 'undefined') {
                audioManager.playSound('jump');
            }
            
            // If last stat (total), create celebration
            if (this.currentStatIndex === this.statsToShow.length) {
                addEffect(createCelebrationBurst(canvas.width / 2, y, 40));
            }
        }
        
        if (elapsed > duration) {
            this.nextPhase();
        }
    }
    
    updateAnticipation(elapsed) {
        const duration = 3000; // 3 seconds
        
        // Update torches
        this.torches.forEach(torch => torch.update());
        
        // Update countdown
        const newCountdown = 3 - Math.floor(elapsed / 1000);
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
        // Cave background
        ctx.fillStyle = '#1A0F08';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw torches
        this.torches.forEach(torch => torch.draw(ctx));
        
        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 10;
        ctx.fillText(`LEVEL ${levelManager.currentLevel} COMPLETE!`, canvas.width / 2, 100);
        ctx.shadowBlur = 0;
        
        // Stone tablet background
        const tabletX = canvas.width / 2 - 200;
        const tabletY = 150;
        ctx.fillStyle = '#5D4E37';
        ctx.fillRect(tabletX, tabletY, 400, 280);
        ctx.strokeStyle = '#3E2F1F';
        ctx.lineWidth = 4;
        ctx.strokeRect(tabletX, tabletY, 400, 280);
        
        // Stats carved in stone
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        
        for (let i = 0; i < Math.min(this.currentStatIndex, this.statsToShow.length); i++) {
            const stat = this.statsToShow[i];
            const y = tabletY + 60 + i * 60;
            
            if (stat.isTotal) {
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 32px Arial';
            } else {
                ctx.fillStyle = '#D4A574';
                ctx.font = 'bold 24px Arial';
            }
            
            ctx.fillText(stat.label + ':', tabletX + 40, y);
            ctx.textAlign = 'right';
            ctx.fillText(stat.value.toString(), tabletX + 360, y);
            ctx.textAlign = 'left';
        }
        
        ctx.textAlign = 'left';
    }
    
    drawAnticipation(ctx) {
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
        
        // Messages
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 10;
        ctx.fillText('PREPARE FOR', canvas.width / 2, canvas.height / 2 - 80);
        
        const nextTheme = levelManager.getNextTheme();
        ctx.font = 'bold 36px Arial';
        ctx.fillText(nextTheme.name, canvas.width / 2, canvas.height / 2 - 30);
        
        // Countdown
        if (this.countdown > 0) {
            ctx.font = 'bold 96px Arial';
            ctx.fillStyle = '#FF4444';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.strokeText(this.countdown.toString(), canvas.width / 2, canvas.height / 2 + 80);
            ctx.fillText(this.countdown.toString(), canvas.width / 2, canvas.height / 2 + 80);
        }
        
        ctx.shadowBlur = 0;
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


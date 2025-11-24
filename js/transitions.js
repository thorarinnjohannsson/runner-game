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
        this.mountainX = canvas.width + 200;
        this.caveAlpha = 0;
        this.statsRevealed = 0;
        this.currentStatIndex = 0;
        
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
        
        // Character runs forward
        this.characterX += 8;
        
        // Mountain approaches
        this.mountainX -= 6;
        
        // Particle trail
        if (Math.random() < 0.3) {
            addEffect(new DustParticle(this.characterX, this.characterY + 40));
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
            this.nextPhase();
        }
    }
    
    updateCaveExit(elapsed) {
        const duration = 2000; // 2 seconds
        
        // Fade out cave
        this.caveAlpha = Math.max(0, 1 - elapsed / 1000);
        
        // Character moves out
        this.characterX += 6;
        
        // Flash effect at start
        if (elapsed < 300) {
            addEffect(new ScreenFlash('#FFFFFF', 0.3));
        }
        
        if (elapsed > duration) {
            this.nextPhase();
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
        // Draw mountain in distance
        ctx.save();
        ctx.fillStyle = '#8B7355';
        ctx.beginPath();
        ctx.moveTo(this.mountainX, GROUND_Y);
        ctx.lineTo(this.mountainX + 100, GROUND_Y - 200);
        ctx.lineTo(this.mountainX + 200, GROUND_Y);
        ctx.fill();
        
        // Cave entrance
        ctx.fillStyle = '#2C1810';
        ctx.fillRect(this.mountainX + 80, GROUND_Y - 60, 40, 60);
        
        ctx.restore();
        
        // Draw character running
        if (player) {
            ctx.save();
            ctx.translate(this.characterX, this.characterY);
            player.drawSprite(ctx, true); // Running animation
            ctx.restore();
        }
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
            player.drawSprite(ctx, true);
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
        // Bright flash
        ctx.fillStyle = `rgba(255, 255, 255, ${this.caveAlpha * 0.5})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawLevelIntro(ctx) {
        const theme = levelManager.getCurrentTheme();
        
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
        ctx.fillText(`LEVEL ${levelManager.currentLevel}`, canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(theme.name, canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Global transition manager
let transitionManager = new TransitionManager();


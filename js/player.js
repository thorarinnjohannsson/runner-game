// PLAYER CHARACTER LOGIC

class Player {
    constructor(x, y, width, height, color, type = 'cat') {
        this.x = x;
        this.y = y;
        this.width = width * 1.5;  // 50% bigger
        this.height = height * 1.5; // 50% bigger
        this.color = color;
        this.name = '';
        this.type = type; // 'cat', 'frog', 'penguin', 'dog', 'rabbit'
        
        // Physics properties
        this.velocityY = 0;
        this.gravity = 0.6;
        this.isOnGround = false;
        this.jumpLevel = 0; // Current jump level for visual feedback
        this.jumpCount = 0; // Track number of jumps used
        this.maxJumps = 3; // Maximum jumps (1 ground + 2 air)
        
        // Jump power for different levels (index = jump level)
        this.jumpPowers = [0, -11, -15, -18, -21];
        
        // Scoring tracking
        this.lastClearType = 'ground'; // 'ground', 'aerial', 'platform'
        this.wasAtPeakOnClear = false;
        this.jumpsUsedForLastClear = 0;
        
        // Animation
        this.bounceOffset = 0;
        this.bounceSpeed = 0.15;
        
        // Running animation
        this.animationFrame = 0;
        this.animationSpeed = 0.15; // Controls animation speed
        this.legOffset = 0;
        this.armOffset = 0;
        
        // Running frame system for four-legged animation
        this.runningFrame = 0; // 0-3 for different leg positions
        this.runningFrameTimer = 0;
        this.runningFrameSpeed = 0.2; // Speed of frame cycling
        
        // Somersault animation
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.somersaultFrame = 0; // Current animation frame (0-4)
        this.somersaultProgress = 0; // Progress through animation cycle
    }
    
    // Execute a jump with given level (1-4)
    jump(level) {
        // Clamp level between 1-4
        level = Math.min(4, Math.max(1, level));
        
        // Ground jump
        if (this.isOnGround) {
            const easeMultiplier = 1 + (level * 0.05); // 5% boost per level
            this.velocityY = this.jumpPowers[level] * easeMultiplier;
            this.isOnGround = false;
            this.jumpLevel = level;
            this.jumpCount = 1; // First jump
            this.lastClearType = 'ground'; // Reset clear type on new jump
            
            // Start somersault rotation
            this.rotationSpeed = 0.15; // Rotation speed in radians per frame
            
            // Play jump sound
            if (typeof audioManager !== 'undefined') {
                audioManager.playSound('jump', level);
            }
            
            // Create jump particles
            if (typeof createJumpParticles === 'function') {
                createJumpParticles(this.x + this.width / 2, this.y + this.height, level);
            }
            return;
        }
        
        // Mid-air jump - check if we have jumps left
        if (this.jumpCount >= this.maxJumps) {
            // No more jumps available!
            return;
        }
        
        // Mid-air boost: give upward velocity boost
        // Stronger boost if timed at peak (when velocityY is near 0)
        const atPeak = Math.abs(this.velocityY) < 2;
        const boostPower = atPeak ? -10 : -8; // Stronger at peak
        
        this.velocityY = boostPower;
        this.jumpLevel = level;
        this.jumpCount++; // Increment jump count
        this.lastClearType = 'aerial'; // Mark as aerial jump
        this.wasAtPeakOnClear = atPeak; // Track if at peak
        
        // Add extra rotation speed for each air jump
        this.rotationSpeed += 0.12;
        
        // Play jump sound
        if (typeof audioManager !== 'undefined') {
            audioManager.playSound('jump', level);
        }
        
        // Create jump particles
        if (typeof createJumpParticles === 'function') {
            createJumpParticles(this.x + this.width / 2, this.y + this.height, level);
        }
    }
    
    // Update player physics
    update(groundY) {
        // Apply gravity with easing for smoother feel
        this.velocityY += this.gravity;
        
        // Update position
        this.y += this.velocityY;
        
        // Update somersault animation when in air
        if (!this.isOnGround && this.rotationSpeed > 0) {
            this.rotation += this.rotationSpeed;
            this.somersaultProgress = this.rotation;
            
            // Cycle through 5 frames (0-4) based on rotation progress
            // Complete one full somersault every 2*PI radians
            const fullCycle = Math.PI * 2;
            const frameProgress = (this.rotation % fullCycle) / fullCycle;
            this.somersaultFrame = Math.floor(frameProgress * 5) % 5;
        }
        
        // Ground collision
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.velocityY = 0;
            this.isOnGround = true;
            this.jumpLevel = 0; // Reset jump level when landing
            this.jumpCount = 0; // Reset jump count on landing
            
            // Reset rotation and somersault when landing
            this.rotation = 0;
            this.rotationSpeed = 0;
            this.somersaultFrame = 0;
            this.somersaultProgress = 0;
            
            // Landing particles removed - using speed lines instead
        } else {
            // Only set to false if not on an obstacle
            // (collision detection will set it to true if landing on obstacle)
            if (this.isOnGround && this.velocityY !== 0) {
                this.isOnGround = false;
            }
        }
        
        // Running animation bounce (only when on ground)
        if (this.isOnGround) {
            this.bounceOffset = Math.sin(Date.now() * this.bounceSpeed) * 2;
        } else {
            this.bounceOffset = 0;
        }
        
        // Create trail effect when jumping high
        if (!this.isOnGround && this.jumpLevel >= 2) {
            if (typeof createTrailParticle === 'function') {
                createTrailParticle(this.x + this.width / 2, this.y + this.height / 2, this.color);
            }
        }
    }
    
    // Draw player on canvas (Pixel Art)
    draw(ctx, forceRunning = false) {
        // Update animation frame
        const shouldAnimate = this.isOnGround || forceRunning;
        if (shouldAnimate) {
            this.animationFrame += this.animationSpeed;
            
            // Update running frame cycle (4 frames for four-legged gait)
            this.runningFrameTimer += this.runningFrameSpeed;
            if (this.runningFrameTimer >= 1) {
                this.runningFrame = (this.runningFrame + 1) % 4;
                this.runningFrameTimer = 0;
            }
        } else {
            // Jump pose
            this.animationFrame = 0;
        }
        
        // Calculate bounce for running
        const bounce = shouldAnimate ? Math.sin(this.animationFrame * 2) * 2 : 0;
        
        ctx.save();
        // Translate to player center
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + bounce);
        
        // Scale to 1.5x (50% bigger) and adjust offset
        const scale = 1.5; 
        const offsetX = -this.width / (2 * scale); // Center horizontally
        const offsetY = -this.height / (2 * scale) + 3; // Align vertically
        
        ctx.scale(scale, scale);
        ctx.translate(offsetX, offsetY);
        
        // Cat Colors (Default)
        const colors = {
            fur: '#E67E22',      // Orange
            furDark: '#D35400',  // Dark Orange (Shadow)
            furLight: '#F39C12', // Light Orange (Highlight)
            white: '#FFFFFF',
            black: '#2C3E50',
            nose: '#E74C3C'
        };
        
        const p = 4; // Pixel size
        
        // Check if we should draw somersault animation
        const showRunning = this.isOnGround || forceRunning;
        if (!showRunning && typeof window.SomersaultDrawer === 'function') {
            // Draw somersault frame
            window.SomersaultDrawer(ctx, this.type, colors, this.somersaultFrame, p);
        } else {
            // Normal running animation
            // Select drawing function based on type
            const drawFunc = window.CharacterDrawers && window.CharacterDrawers[this.type] 
                ? window.CharacterDrawers[this.type] 
                : window.CharacterDrawers['cat']; // Fallback
                
            drawFunc(ctx, colors, p, this.animationFrame, true, this.legOffset, this.runningFrame);
        }
        
        ctx.restore();
        
        // Draw jump counter when in air
        if (!this.isOnGround && this.jumpCount > 0) {
            const jumpsLeft = this.maxJumps - this.jumpCount;
            ctx.fillStyle = jumpsLeft > 0 ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 100, 100, 0.9)';
            ctx.font = 'bold 14px Arial';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.strokeText(`${jumpsLeft}`, this.x + 5, this.y - 10);
            ctx.fillText(`${jumpsLeft}`, this.x + 5, this.y - 10);
        }
    }
    
    // Get hitbox for collision detection
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    // Check if player can jump
    canJump() {
        // Can jump if on ground OR if we have mid-air jumps left
        return this.isOnGround || this.jumpCount < this.maxJumps;
    }
    
    // Check if at peak of jump
    isAtPeak() {
        return Math.abs(this.velocityY) < 2 && !this.isOnGround;
    }
    
    // Reset player position and state
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.isOnGround = false;
        this.jumpLevel = 0;
    }
}


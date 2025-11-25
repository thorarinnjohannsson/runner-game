// OBSTACLE MANAGEMENT
// Includes Obstacles and Collectables (Hearts)

// Collectable Heart Class
class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.collected = false;
        
        // Animation
        this.floatY = 0;
        this.floatSpeed = 0.1;
        this.floatOffset = Math.random() * Math.PI * 2;
    }
    
    update(speed) {
        this.x -= speed;
        // Floating animation
        this.floatY = Math.sin(Date.now() * 0.005 + this.floatOffset) * 5;
    }
    
    draw(ctx) {
        if (this.collected) return;
        
        const x = this.x;
        const y = this.y + this.floatY;
        const size = this.width;
        
        ctx.save();
        ctx.translate(x + size/2, y + size/2);
        
        // Draw Pixel Heart
        ctx.fillStyle = '#FF0000';
        const p = 3; // pixel size
        
        // Simple 8x8 heart shape scaled
        // 0 1 1 0 0 1 1 0
        // 1 1 1 1 1 1 1 1
        // 1 1 1 1 1 1 1 1
        // 0 1 1 1 1 1 1 0
        // 0 0 1 1 1 1 0 0
        // 0 0 0 1 1 0 0 0
        
        // Easier to just draw paths or rects for "pixel" look
        // Top humps
        ctx.fillRect(-9, -9, 6, 6);
        ctx.fillRect(3, -9, 6, 6);
        // Middle
        ctx.fillRect(-12, -3, 24, 6);
        // Bottom taper
        ctx.fillRect(-9, 3, 18, 3);
        ctx.fillRect(-6, 6, 12, 3);
        ctx.fillRect(-3, 9, 6, 3);
        
        // Shine
        ctx.fillStyle = '#FF9999';
        ctx.fillRect(-6, -6, 3, 3);
        
        ctx.restore();
    }
    
    getHitbox() {
        return {
            x: this.x,
            y: this.y + this.floatY,
            width: this.width,
            height: this.height
        };
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y, width, height, level, isFloating = false, isTerrain = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.level = level; // Height level (1-4)
        this.isFloating = isFloating;
        this.isTerrain = isTerrain;
        this.passed = false; // Whether player has passed this obstacle
        this.scored = false; // Whether we've awarded score for this obstacle
        this.closeCall = false; // Whether player barely cleared it
        
        // Color setup - use theme colors if available
        const theme = (typeof currentTheme !== 'undefined') ? currentTheme : {};
        
        if (isTerrain) {
            this.color = theme.groundBase || '#5D4037';
        } else if (isFloating) {
            this.color = theme.platformMain || '#6A5ACD';
        } else {
            this.color = theme.obstacleMain || this.getColorForLevel(level);
        }
        
        this.landedOn = false; // Track if player landed on it
    }
    
    // Get color based on level
    getColorForLevel(level) {
        const colors = ['#8B4513', '#A0522D', '#CD853F', '#DEB887'];
        return colors[level - 1] || colors[0];
    }
    
    // Update obstacle position
    update(speed) {
        this.x -= speed;
    }
    
    // Draw obstacle
    draw(ctx) {
        const theme = (typeof currentTheme !== 'undefined') ? currentTheme : {};
        
        if (this.isTerrain) {
            // Get base ground level for comparison
            const baseGroundY = (typeof GROUND_Y !== 'undefined') ? GROUND_Y : (ctx.canvas.height - 80);
            const elevation = baseGroundY - this.y; // How much elevated (positive = higher)
            // Steeper ramps: reduce width to make elevation changes more dramatic
            const rampWidth = Math.min(35, this.width * 0.1); // Steeper: max 35px or 10% of width (was 60px/15%)
            
            // Extend visual to bottom of screen to look like solid ground
            const bottomToFill = ctx.canvas.height - (this.y + this.height);
            
            // === SHADOW UNDER ELEVATED TERRAIN ===
            if (elevation > 0) {
                // Draw shadow on base ground before terrain starts
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                const shadowWidth = Math.min(this.width + rampWidth * 2, ctx.canvas.width);
                const shadowX = Math.max(0, this.x - rampWidth);
                ctx.fillRect(shadowX, baseGroundY, shadowWidth, 8);
            }
            
            // === LEFT RAMP (Transition from base ground to elevated terrain) ===
            if (elevation > 0 && this.x > 0) {
                // Draw ramp connecting base ground to elevated terrain
                ctx.fillStyle = theme.groundBase || '#8B4513';
                ctx.beginPath();
                ctx.moveTo(this.x - rampWidth, baseGroundY);
                ctx.lineTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.height + bottomToFill);
                ctx.lineTo(this.x - rampWidth, ctx.canvas.height);
                ctx.closePath();
                ctx.fill();
                
                // Ramp grass top
                ctx.fillStyle = theme.groundTop || '#66BB6A';
                ctx.beginPath();
                ctx.moveTo(this.x - rampWidth, baseGroundY);
                ctx.lineTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + 10);
                ctx.lineTo(this.x - rampWidth, baseGroundY + 10);
                ctx.closePath();
                ctx.fill();
                
                // Ramp side border
                ctx.strokeStyle = '#3E2723';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x - rampWidth, baseGroundY);
                ctx.lineTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.height + bottomToFill);
                ctx.stroke();
            }
            
            // === RIGHT RAMP (Transition from elevated terrain back to base ground) ===
            if (elevation > 0 && this.x + this.width < ctx.canvas.width) {
                // Draw ramp connecting elevated terrain back to base ground
                ctx.fillStyle = theme.groundBase || '#8B4513';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width, this.y);
                ctx.lineTo(this.x + this.width + rampWidth, baseGroundY);
                ctx.lineTo(this.x + this.width + rampWidth, ctx.canvas.height);
                ctx.lineTo(this.x + this.width, this.y + this.height + bottomToFill);
                ctx.closePath();
                ctx.fill();
                
                // Ramp grass top
                ctx.fillStyle = theme.groundTop || '#66BB6A';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width, this.y);
                ctx.lineTo(this.x + this.width + rampWidth, baseGroundY);
                ctx.lineTo(this.x + this.width + rampWidth, baseGroundY + 10);
                ctx.lineTo(this.x + this.width, this.y + 10);
                ctx.closePath();
                ctx.fill();
                
                // Ramp side border
                ctx.strokeStyle = '#3E2723';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x + this.width, this.y);
                ctx.lineTo(this.x + this.width + rampWidth, baseGroundY);
                ctx.lineTo(this.x + this.width + rampWidth, ctx.canvas.height);
                ctx.stroke();
            }
            
            // === HANDLE DEPRESSIONS (Terrain lower than base ground) ===
            if (elevation < 0) {
                // This is a depression/ditch - draw steep ramps down and walls
                const depressionDepth = Math.abs(elevation);
                
                // === LEFT RAMP DOWN (Steep transition from base ground into depression) ===
                if (this.x > 0) {
                    ctx.fillStyle = theme.groundBase || '#8B4513';
                    ctx.beginPath();
                    ctx.moveTo(this.x - rampWidth, baseGroundY);
                    ctx.lineTo(this.x, this.y);
                    ctx.lineTo(this.x, this.y + this.height + bottomToFill);
                    ctx.lineTo(this.x - rampWidth, ctx.canvas.height);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Ramp grass top
                    ctx.fillStyle = theme.groundTop || '#66BB6A';
                    ctx.beginPath();
                    ctx.moveTo(this.x - rampWidth, baseGroundY);
                    ctx.lineTo(this.x, this.y);
                    ctx.lineTo(this.x, this.y + 10);
                    ctx.lineTo(this.x - rampWidth, baseGroundY + 10);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Ramp side border
                    ctx.strokeStyle = '#3E2723';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(this.x - rampWidth, baseGroundY);
                    ctx.lineTo(this.x, this.y);
                    ctx.lineTo(this.x, this.y + this.height + bottomToFill);
                    ctx.stroke();
                }
                
                // === RIGHT RAMP UP (Steep transition from depression back to base ground) ===
                if (this.x + this.width < ctx.canvas.width) {
                    ctx.fillStyle = theme.groundBase || '#8B4513';
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width, this.y);
                    ctx.lineTo(this.x + this.width + rampWidth, baseGroundY);
                    ctx.lineTo(this.x + this.width + rampWidth, ctx.canvas.height);
                    ctx.lineTo(this.x + this.width, this.y + this.height + bottomToFill);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Ramp grass top
                    ctx.fillStyle = theme.groundTop || '#66BB6A';
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width, this.y);
                    ctx.lineTo(this.x + this.width + rampWidth, baseGroundY);
                    ctx.lineTo(this.x + this.width + rampWidth, baseGroundY + 10);
                    ctx.lineTo(this.x + this.width, this.y + 10);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Ramp side border
                    ctx.strokeStyle = '#3E2723';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width, this.y);
                    ctx.lineTo(this.x + this.width + rampWidth, baseGroundY);
                    ctx.lineTo(this.x + this.width + rampWidth, ctx.canvas.height);
                    ctx.stroke();
                }
                
                // Left wall (vertical edge)
                ctx.fillStyle = theme.soilDark || '#4D3222';
                ctx.fillRect(this.x - 6, baseGroundY, 6, depressionDepth);
                
                // Right wall (vertical edge)
                ctx.fillRect(this.x + this.width, baseGroundY, 6, depressionDepth);
                
                // Darker bottom to show depth
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                
                // Edge highlight on top of depression walls
                ctx.strokeStyle = '#3E2723';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x - 6, baseGroundY);
                ctx.lineTo(this.x - 6, baseGroundY + depressionDepth);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(this.x + this.width, baseGroundY);
                ctx.lineTo(this.x + this.width, baseGroundY + depressionDepth);
                ctx.stroke();
            }
            
            // === MAIN TERRAIN BODY ===
            // Soil body
            ctx.fillStyle = theme.groundBase || '#8B4513';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            if (bottomToFill > 0) {
                ctx.fillRect(this.x, this.y + this.height, this.width, bottomToFill);
            }
            
            // === ELEVATION INDICATOR (Darker when elevated) ===
            if (elevation > 20) {
                // Add darker overlay to show significant elevation
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            
            // Grass Top Layer
            ctx.fillStyle = theme.groundTop || '#66BB6A';
            ctx.fillRect(this.x, this.y, this.width, 12);
            
            // Pixelated Grass Edge (Checkerboard pattern) - more visible
            ctx.fillStyle = theme.groundDark || '#4CAF50';
            const pixelSize = 6;
            for (let i = 0; i < this.width; i += pixelSize) {
                if (Math.floor(i / pixelSize) % 2 === 0) {
                    ctx.fillRect(this.x + i, this.y, pixelSize, 12);
                }
            }
            
            // Dark Green Grass Border (thicker for visibility)
            ctx.fillStyle = theme.grassBorder || '#2E7D32';
            ctx.fillRect(this.x, this.y + 12, this.width, 5);
            
            // === SIDE BORDERS (Enhanced for clarity) ===
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 3; // Thicker borders
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.height + bottomToFill);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + this.width, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height + bottomToFill);
            ctx.stroke();
            
            // === TOP EDGE HIGHLIGHT (Shows elevation clearly) ===
            if (elevation > 0) {
                ctx.strokeStyle = '#5D4037';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.width, this.y);
                ctx.stroke();
            }
            
            return;
        }
        
        if (this.isFloating) {
            // Floating platform style (Wood/Log pixel style)
            // Main block
            ctx.fillStyle = theme.platformMain || '#8D6E63';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Wood grain / planks
            ctx.fillStyle = theme.platformDark || '#5D4037';
            for(let i=10; i<this.width; i+=30) {
                ctx.fillRect(this.x + i, this.y, 2, this.height);
            }
            
            // Top highlight
            ctx.fillStyle = theme.platformLight || '#A1887F';
            ctx.fillRect(this.x, this.y, this.width, 4);
            
            // Bottom shadow
            ctx.fillStyle = theme.platformShadow || '#4E342E';
            ctx.fillRect(this.x, this.y + this.height - 4, this.width, 4);
            
            // Border
            ctx.strokeStyle = '#3E2723';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            return;
        }

        // PIXEL BLOCK OBSTACLE (Standard)
        // Main Block Color
        ctx.fillStyle = theme.obstacleMain || '#A0522D';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        const borderSize = 4;
        
        // Light Top/Left (Bevel)
        ctx.fillStyle = theme.obstacleLight || '#CD853F';
        ctx.fillRect(this.x, this.y, this.width, borderSize);
        ctx.fillRect(this.x, this.y, borderSize, this.height);
        
        // Dark Bottom/Right (Bevel)
        ctx.fillStyle = theme.obstacleDark || '#5D4037';
        ctx.fillRect(this.x + this.width - borderSize, this.y, borderSize, this.height);
        ctx.fillRect(this.x, this.y + this.height - borderSize, this.width, borderSize);
        
        // Inner Face
        ctx.fillStyle = theme.obstacleFace || '#8B4513';
        ctx.fillRect(this.x + borderSize, this.y + borderSize, this.width - 2*borderSize, this.height - 2*borderSize);
        
        // Pixel Noise/Texture inside
        ctx.fillStyle = 'rgba(62, 39, 35, 0.3)'; // Semi-transparent dark spots
        
        // Simple deterministic noise pattern
        const innerW = this.width - 2*borderSize;
        const innerH = this.height - 2*borderSize;
        const startX = this.x + borderSize;
        const startY = this.y + borderSize;
        
        for(let i=0; i<innerW; i+=8) {
             for(let j=0; j<innerH; j+=8) {
                 // Create a checkerboard-like pattern or pseudo-random noise based on coords
                 if (Math.sin(i * j + this.x) > 0) {
                      ctx.fillRect(startX + i, startY + j, 4, 4);
                 }
             }
        }
        
        // Outer Border
        ctx.strokeStyle = '#3E2723'; // Very dark brown
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Inner screws/bolts (corners)
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(this.x + 6, this.y + 6, 4, 4);
        ctx.fillRect(this.x + this.width - 10, this.y + 6, 4, 4);
        ctx.fillRect(this.x + 6, this.y + this.height - 10, 4, 4);
        ctx.fillRect(this.x + this.width - 10, this.y + this.height - 10, 4, 4);
        
        // Draw level indicator text
        if (this.level > 1) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 16px Arial'; 
            ctx.textAlign = 'center';
            ctx.fillText(`${this.level}x`, this.x + this.width / 2, this.y + this.height/2 + 6);
            ctx.textAlign = 'left';
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
    
    // Check if obstacle is off screen
    isOffScreen() {
        return this.x + this.width < 0;
    }
}

// Obstacle spawning
let lastSpawnTime = 0;
let spawnInterval = 2000; // milliseconds

// Update all obstacles
function updateObstacles() {
    // Spawn new obstacles
    const now = Date.now();
    if (now - lastSpawnTime > spawnInterval) {
        spawnObstacle();
        lastSpawnTime = now;
    }
    
    // Update existing obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update(gameSpeed);
        
        // Check if player passed obstacle (for scoring)
        if (!obstacles[i].scored && obstacles[i].x + obstacles[i].width < player.x) {
            obstacles[i].passed = true;
            obstacles[i].scored = true;
            
            // Check for close call (player barely cleared it - within 10 pixels)
            const playerBottom = player.y + player.height;
            const obstacleTop = obstacles[i].y;
            const clearance = Math.abs(playerBottom - obstacleTop);
            obstacles[i].closeCall = clearance < 15;
            
            // Determine clear type based on player state
            let clearType = player.lastClearType;
            const jumpsUsed = player.jumpsUsedForLastClear || player.jumpCount;
            const wasAtPeak = player.wasAtPeakOnClear;
            
            // Calculate sophisticated score
            const scoreResult = calculateObstacleScore(
                obstacles[i],
                clearType,
                jumpsUsed,
                wasAtPeak
            );
            
            // Add to total score
            score += scoreResult.total;
            
            // Create score popup
            createScorePopup(
                obstacles[i].x + obstacles[i].width / 2,
                obstacles[i].y - 20,
                scoreResult.total,
                scoreResult.bonusText
            );
            
            // Increment combo
            if (!player.isOnGround) {
                comboTracker.increment();
                // Track multi-obstacle combo (clearing multiple obstacles in one jump)
                if (typeof multiObstacleTracker !== 'undefined') {
                    multiObstacleTracker.increment();
                }
            } else {
                // Reset multi-obstacle tracker when landing
                if (typeof multiObstacleTracker !== 'undefined') {
                    multiObstacleTracker.reset();
                }
            }
            
            // Play score sound
            if (typeof playSound === 'function') {
                playSound('score');
            }
            
            // Create small particle effect for clearing obstacle
            createParticleExplosion(obstacles[i].x, obstacles[i].y, '#44FF44');
            
            // Check for milestones
            checkMilestones(score);
        }
        
        // Remove off-screen obstacles
        if (obstacles[i].isOffScreen()) {
            obstacles.splice(i, 1);
        }
    }
}

// Helper: Find the ground level at a given x position (checks for terrain)
function getGroundLevelAtX(x) {
    const baseGroundY = (typeof GROUND_Y !== 'undefined') ? GROUND_Y : (canvas.height - 50);
    
    // Check if there's terrain at this x position
    for (let obstacle of obstacles) {
        if (obstacle.isTerrain) {
            // Check if x is within terrain bounds
            if (x >= obstacle.x && x <= obstacle.x + obstacle.width) {
                // Return the top of the terrain as the ground level
                return obstacle.y;
            }
        }
    }
    
    return baseGroundY;
}

// Spawn a new obstacle
function spawnObstacle() {
    const groundY = (typeof GROUND_Y !== 'undefined') ? GROUND_Y : (canvas.height - 50);
    const spawnX = canvas.width;

    // Check for Collectable Heart (Rare: 1 in 20, 5%)
    const heartChance = 0.05;
    if (Math.random() < heartChance && typeof spawnCollectable === 'function') {
        // Spawn heart at appropriate height based on ground level
        const effectiveGroundY = getGroundLevelAtX(spawnX);
        spawnCollectable(effectiveGroundY);
    }

    // Check for elevated terrain (elevated ground)
    const isTerrain = Math.random() < (typeof terrainChance !== 'undefined' ? terrainChance : 0);
    
    if (isTerrain) {
        // MINIMUM HEIGHT RULE: Terrain must be at least 50px higher or lower than base ground
        // This ensures elevation changes are always clearly visible
        const MIN_ELEVATION_CHANGE = 50; // Minimum pixels difference from base ground
        
        const width = Math.floor(Math.random() * 600) + 400; // 400-1000px wide
        
        // Determine if terrain goes up or down (50/50 chance)
        const goesUp = Math.random() < 0.5;
        
        let height;
        let terrainY;
        
        if (goesUp) {
            // Elevated terrain: minimum 50px above base ground
            height = Math.floor(Math.random() * 40) + MIN_ELEVATION_CHANGE; // 50-90px high
            terrainY = groundY - height; // Elevated above base ground
        } else {
            // Depressed terrain: minimum 50px below base ground
            height = Math.floor(Math.random() * 40) + MIN_ELEVATION_CHANGE; // 50-90px deep
            terrainY = groundY + MIN_ELEVATION_CHANGE; // Below base ground
        }
        
        const obstacle = new Obstacle(
            spawnX,
            terrainY,
            width,
            height,
            1,
            false,
            true // isTerrain
        );
        obstacles.push(obstacle);
        
        // Delay next spawn to prevent overlapping obstacles spawning inside the hill
        const speed = (typeof gameSpeed !== 'undefined') ? gameSpeed : 5;
        const extraDelay = (width / speed) * 16.6;
        lastSpawnTime += extraDelay;
        return;
    }

    // Get the effective ground level at spawn position (accounts for terrain)
    const effectiveGroundY = getGroundLevelAtX(spawnX);
    
    // Don't spawn regular obstacles or floating platforms if we're on elevated terrain
    // This prevents obstacles from appearing inside terrain blocks
    if (effectiveGroundY < groundY) {
        // We're on elevated terrain, skip spawning this time
        return;
    }

    // Determine if we should spawn a floating platform
    const isFloating = Math.random() < (typeof floatingChance !== 'undefined' ? floatingChance : 0);
    
    if (isFloating) {
        // Create floating platform
        const width = Math.floor(Math.random() * 100) + 80; // 80-180px wide
        const height = 20; // Fixed thickness
        
        // Calculate Y position to allow running under
        // Make sure it's above the effective ground level
        const minY = effectiveGroundY - 130; // Minimum height above ground
        const maxY = effectiveGroundY - 80;  // Maximum height above ground
        const y = Math.floor(Math.random() * (maxY - minY)) + minY;
        
        const obstacle = new Obstacle(
            spawnX,
            y,
            width,
            height,
            1, // Level irrelevant for floating
            true // isFloating
        );
        obstacles.push(obstacle);
        return;
    }

    const baseHeight = 30;
    const level = getRandomObstacleLevel();
    const height = baseHeight * level;
    const width = 20 + (level * 5);
    
    // Ground obstacle to the effective ground level
    const obstacle = new Obstacle(
        spawnX,
        effectiveGroundY - height,
        width,
        height,
        level,
        false
    );
    
    obstacles.push(obstacle);
}

// Spawn a Collectable Heart
function spawnCollectable(groundY) {
    // Spawn in air, reachable by jumping
    const y = groundY - 150 - (Math.random() * 50);
    // Add slight delay so it doesn't overlap exactly with obstacle x
    const x = canvas.width + 100; 
    
    if (typeof collectables !== 'undefined') {
        collectables.push(new Heart(x, y));
    }
}

// Get random obstacle level based on difficulty
function getRandomObstacleLevel() {
    const rand = Math.random();
    
    // Use difficulty to determine probability of higher levels
    if (rand > 1 - multiLevelChance) {
        // Multi-level obstacle
        const levels = [2, 2, 3, 3, 4]; // Weighted towards 2 and 3
        return levels[Math.floor(Math.random() * levels.length)];
    } else {
        // Single level
        return 1;
    }
}

// Draw all obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => obstacle.draw(ctx));
}

// Clear obstacles in a range (used after losing a life)
function clearObstaclesInRange(minX, maxX) {
    obstacles = obstacles.filter(obstacle => {
        return obstacle.x < minX || obstacle.x > maxX;
    });
}

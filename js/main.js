// MAIN GAME LOGIC AND LOOP

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants (will be updated based on canvas size)
let GROUND_Y = 320; // Will be recalculated
let PLAYER_START_X = 100;
let PLAYER_START_Y = 280; // Will be recalculated

// Setup responsive canvas
function setupResponsiveCanvas() {
    const size = getOptimalCanvasSize();
    canvas.width = size.width;
    canvas.height = size.height;
    
    // Update game constants based on canvas size
    updateGameDimensions();
}

// Update game dimensions when canvas size changes
function updateGameDimensions() {
    GROUND_Y = canvas.height - 80;
    PLAYER_START_X = 100;
    PLAYER_START_Y = GROUND_Y - 40;
    
    // Update player position if in game
    if (player) {
        player.y = Math.min(player.y, GROUND_Y - player.height);
    }
}

// Game states
const GAME_STATES = {
    START_SCREEN: 'START_SCREEN',
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    LEVEL_TRANSITION: 'LEVEL_TRANSITION',
    GAME_OVER: 'GAME_OVER'
};

// Pause management
let wasPausedByUser = false; // Track if pause was user-initiated vs life-loss
let pausedTime = 0; // Track time spent paused

// Game variables
let gameState = GAME_STATES.START_SCREEN;
let player = null;
let obstacles = [];
let collectables = []; // Track active collectables (Hearts)
let particles = []; // Particle effects
let trailParticles = []; // Trail particles
let ripples = []; // Touch ripple effects
let score = 0;
let lives = 3;
let startTime = 0;
let elapsedTime = 0;
let pauseCountdown = 0;
let countdownInterval = null;

// Screen shake effect
let screenShake = 0;
let shakeOffsetX = 0;
let shakeOffsetY = 0;
let groundScroll = 0; // Track ground texture scrolling

// Level transition variables
let levelTransitionCountdown = 0;
let levelTransitionStartTime = 0;
let showLevelIntro = false;
let levelIntroStartTime = 0;

// Milestone tracking
let milestones = {
    25: false,
    50: false,
    75: false,
    90: false
};
let lastMilestoneShown = 0;

// Selected character
let selectedCharacter = null;

// Character options (Pixel Art)
const characters = [
    { id: 'cat', name: 'Ginger', color: '#E67E22' }, // Default
    { id: 'wolf', name: 'Wolfie', color: '#607D8B' },
    { id: 'penguin', name: 'Waddle', color: '#263238' },
    { id: 'dog', name: 'Barky', color: '#8D6E63' },
    { id: 'rabbit', name: 'Cotton', color: '#F5F5F5' }
];

// Expose characters globally for UI
window.characters = characters;

// Random Name Generator
const ADJECTIVES = ['Speedy', 'Mega', 'Super', 'Tiny', 'Giant', 'Happy', 'Crazy', 'Wild', 'Brave', 'Quick', 'Pixel', 'Retro', 'Turbo', 'Neon', 'Hyper'];
const NOUNS = ['Runner', 'Dasher', 'Jumper', 'Hopper', 'Sprinter', 'Racer', 'Glider', 'Flyer', 'Dasher', 'Ninja', 'Hero', 'Legend', 'Master', 'Wizard', 'Bot'];

function generateRandomName() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj} ${noun}`;
}

// Initialize game
function init() {
    // Initialize player stats display
    if (typeof initPlayerStatsDisplay === 'function') {
        initPlayerStatsDisplay();
    }
    // Setup responsive canvas first
    setupResponsiveCanvas();
    
    // Start with start screen
    gameState = GAME_STATES.START_SCREEN;
    
    // Load saved character preference
    const savedCharIndex = localStorage.getItem('lastCharacterIndex');
    if (savedCharIndex !== null) {
        const index = parseInt(savedCharIndex);
        if (index >= 0 && index < characters.length) {
            selectedCharacter = characters[index];
        } else {
            selectedCharacter = characters[0];
        }
    } else {
        selectedCharacter = characters[0]; // Smart default
    }

    // Load or Generate Player Name
    let savedName = localStorage.getItem('lastPlayerName');
    if (!savedName) {
        savedName = generateRandomName();
        localStorage.setItem('lastPlayerName', savedName);
    }
    
    // Set input value if exists
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput) {
        nameInput.value = savedName;
    }
    
    // Set up input handler
    setupInput();
    
    // Set up UI event listeners
    setupUIListeners();
    
    // Start game loop
    gameLoop();
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply screen shake (only on desktop)
    if (screenShake > 0 && shouldUseScreenShake()) {
        shakeOffsetX = (Math.random() - 0.5) * screenShake;
        shakeOffsetY = (Math.random() - 0.5) * screenShake;
        screenShake *= 0.9; // Decay
        if (screenShake < 0.1) screenShake = 0;
        ctx.save();
        ctx.translate(shakeOffsetX, shakeOffsetY);
    }
    
    // Update background if playing
    if (gameState === GAME_STATES.PLAYING) {
        updateBackground();
    }
    
    // Draw background
    drawBackground();
    
    // Handle different game states
    switch (gameState) {
        case GAME_STATES.START_SCREEN:
            drawStartScreen();
            // Check if modal active
            if (gameState === 'HIGHSCORE_MODAL') {
               drawHighScoreModal();
            }
            break;
            
        case 'HIGHSCORE_MODAL':
            drawStartScreen(); // Draw bg
            drawHighScoreModal();
            break;
            
        case GAME_STATES.COUNTDOWN:
            updateCountdown();
            drawGameplay();
            drawCountdownOverlay();
            break;
            
        case GAME_STATES.PLAYING:
            updateGameplay();
            drawGameplay();
            // Draw effects
            if (typeof drawEffects !== 'undefined') {
                drawEffects(ctx);
            }
            // Draw level intro overlay if active
            if (showLevelIntro) {
                drawLevelIntro();
            }
            break;
            
        case GAME_STATES.PAUSED:
            drawGameplay();
            drawPauseOverlay();
            break;
            
        case GAME_STATES.LEVEL_TRANSITION:
            updateLevelTransition();
            // Don't draw gameplay (player/obstacles) to avoid ghosts/glitches
            // drawGameplay(); 
            
            // Draw transition managed by transitionManager
            if (typeof transitionManager !== 'undefined') {
                transitionManager.draw(ctx);
            }
            // Draw effects on top
            if (typeof drawEffects !== 'undefined') {
                drawEffects(ctx);
            }
            break;
            
        case GAME_STATES.GAME_OVER:
            drawGameplay();
            drawGameOverScreen();
            break;
    }
    
    // Restore context if shake was applied
    if (screenShake > 0 || shakeOffsetX !== 0 || shakeOffsetY !== 0) {
        ctx.restore();
        if (screenShake === 0) {
            shakeOffsetX = 0;
            shakeOffsetY = 0;
        }
    }
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Update background position
function updateBackground() {
    if (!parallaxBg) {
        initParallax();
    }
    
    // Update parallax
    parallaxBg.update(gameSpeed);
    
    // Move ground texture
    groundScroll += gameSpeed;
}

// Draw background
function drawBackground() {
    if (!parallaxBg) {
        initParallax();
    }
    
    // Draw parallax layers
    parallaxBg.draw(ctx, canvas.width, GROUND_Y);
    
    // Draw theme-specific ground
    drawGround();
}

// Draw theme-specific ground
function drawGround() {
    // Get theme colors
    const theme = (typeof currentTheme !== 'undefined') ? currentTheme : {
        groundBase: '#694528',
        soilLight: '#916643',
        soilDark: '#4D3222',
        groundTop: '#6ABE30',
        groundDark: '#37946E',
        grassBorder: '#4D3222'
    };

    // --- SOIL BASE ---
    ctx.fillStyle = theme.groundBase;
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    
    // --- SOIL TEXTURE (Grid-aligned squares) ---
    const soilColors = {
        light: theme.soilLight,
        dark: theme.soilDark
    };
    
    const tileSize = 20; // Size of grid cells
    const cols = Math.ceil(canvas.width / tileSize) + 1;
    const rows = Math.ceil((canvas.height - GROUND_Y) / tileSize);
    
    for (let col = 0; col < cols; col++) {
        // Calculate x position with scrolling
        let xOffset = (col * tileSize - (groundScroll % tileSize));
        
        const worldCol = Math.floor(groundScroll / tileSize) + col;
        const screenX = (worldCol * tileSize) - groundScroll;
        
        if (screenX < -tileSize || screenX > canvas.width) continue;

        for (let row = 0; row < rows; row++) {
            // Deterministic pseudo-random based on world grid position
            const seed = worldCol * 1234 + row * 5678;
            const rand = Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
            
            const y = GROUND_Y + 30 + (row * tileSize); // Start below grass
            if (y > canvas.height) break;
            
            // Draw scattered squares
            if (rand > 0.85) {
                // Light square
                ctx.fillStyle = soilColors.light;
                const size = 6 + (rand * 4); // 6-10px
                ctx.fillRect(screenX + 4, y + 4, size, size);
            } else if (rand < 0.15) {
                // Dark square
                ctx.fillStyle = soilColors.dark;
                const size = 6 + (rand * 4);
                ctx.fillRect(screenX + 8, y + 8, size, size);
            }
        }
    }

    // --- GRASS LAYER (Scrolling) ---
    const grassLight = theme.groundTop;
    const grassDark = theme.groundDark;
    const grassBorder = theme.grassBorder;
    
    // Grass is a repeating pattern. Let's define a block size.
    const blockWidth = 32; 
    const grassTopHeight = 16;
    
    const totalBlocks = Math.ceil(canvas.width / blockWidth) + 1;
    const startBlock = Math.floor(groundScroll / blockWidth);
    
    for (let i = 0; i < totalBlocks; i++) {
        const blockIndex = startBlock + i;
        const x = (blockIndex * blockWidth) - groundScroll;
        
        // 1. Top Solid Layer
        ctx.fillStyle = grassLight;
        ctx.fillRect(x, GROUND_Y, blockWidth, grassTopHeight);
        
        // 2. Decorative Edge (The "teeth" or "drips")
        const pixelSize = 4;
        const subBlocks = blockWidth / pixelSize; // 8 sub-blocks
        
        for (let j = 0; j < subBlocks; j++) {
            const subX = x + (j * pixelSize);
            
            const isEven = j % 2 === 0;
            
            if (isEven) {
                // Longer drip
                ctx.fillStyle = grassLight;
                ctx.fillRect(subX, GROUND_Y + grassTopHeight, pixelSize, pixelSize);
                
                // Shadow below it
                ctx.fillStyle = grassDark;
                ctx.fillRect(subX, GROUND_Y + grassTopHeight + pixelSize, pixelSize, pixelSize);
                
                // Dark border below shadow
                ctx.fillStyle = grassBorder;
                ctx.fillRect(subX, GROUND_Y + grassTopHeight + (pixelSize * 2), pixelSize, pixelSize);
            } else {
                // Shorter drip (just shadow)
                ctx.fillStyle = grassDark;
                ctx.fillRect(subX, GROUND_Y + grassTopHeight, pixelSize, pixelSize);
                
                // Dark border
                ctx.fillStyle = grassBorder;
                ctx.fillRect(subX, GROUND_Y + grassTopHeight + pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

// Draw Pixel Cloud
function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const pixelSize = 6;
    
    // Define cloud shape using a matrix of 1s (white)
    const shape = [
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0] 
    ];

    // Draw Shadow first (offset)
    ctx.fillStyle = '#D3E0EA'; // Light blue-grey
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                ctx.fillRect((c * pixelSize) + pixelSize, (r * pixelSize) + pixelSize, pixelSize, pixelSize);
            }
        }
    }

    // Draw Cloud Body
    ctx.fillStyle = '#FFFFFF';
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
            }
        }
    }
    
    ctx.restore();
}

// Draw Pixel Bush
function drawBush(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const pixelSize = 5;
    
    const shape = [
        [0,0,1,1,1,0,0],
        [0,1,1,1,1,1,0],
        [1,1,1,1,1,1,1],
        [1,1,2,2,2,1,1],
        [1,2,2,2,2,2,1]
    ];
    
    const cols = shape[0].length;
    const rows = shape.length;
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    
    // Offset to draw relative to bottom center
    const xOff = -width / 2;
    const yOff = -height;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const val = shape[r][c];
            if (val === 1) {
                ctx.fillStyle = '#43A047'; // Green
                ctx.fillRect(xOff + c * pixelSize, yOff + r * pixelSize, pixelSize, pixelSize);
            } else if (val === 2) {
                ctx.fillStyle = '#2E7D32'; // Dark Green
                ctx.fillRect(xOff + c * pixelSize, yOff + r * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    ctx.restore();
}

// Start a new game
function startNewGame() {
    // Reset game variables
    score = 0;
    lives = 3;
    obstacles = [];
    collectables = []; // Reset collectables
    startTime = Date.now();
    elapsedTime = 0;
    pausedTime = 0;
    wasPausedByUser = false;
    
    // Reset level system
    if (typeof levelManager !== 'undefined') {
        levelManager.reset();
        levelManager.startLevel(1, 0, 0);
        currentLevelStats.reset();
    }
    
    // Apply first theme
    if (typeof applyTheme !== 'undefined' && typeof getThemeForLevel !== 'undefined') {
        applyTheme(getThemeForLevel(1));
    }
    
    // Reset scoring system
    resetScoring();
    screenShake = 0;
    
    // Create player
    player = new Player(
        PLAYER_START_X,
        PLAYER_START_Y,
        30,
        40,
        selectedCharacter.color,
        selectedCharacter.id || 'cat'
    );
    
    // Save selected character
    const charIndex = characters.indexOf(selectedCharacter);
    if (charIndex !== -1) {
        localStorage.setItem('lastCharacterIndex', charIndex);
    }
    
    // Get player name from input
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput) {
        player.name = nameInput.value.trim() || 'Player';
        // Save for next time
        localStorage.setItem('lastPlayerName', player.name);
        // Hide input
        nameInput.style.display = 'none';
        nameInput.blur(); // Remove focus
    } else {
        player.name = 'Player';
    }
    
    // Reset difficulty
    resetDifficulty();
    
    // Start countdown
    gameState = GAME_STATES.COUNTDOWN;
    startCountdown();
    
    // Start music if enabled
    if (typeof audioManager !== 'undefined') {
        audioManager.startMusic();
    }
}

// Start countdown before game
function startCountdown() {
    let count = 3;
    pauseCountdown = count;
    
    countdownInterval = setInterval(() => {
        count--;
        pauseCountdown = count;
        
        if (count <= 0) {
            clearInterval(countdownInterval);
            gameState = GAME_STATES.PLAYING;
            startTime = Date.now(); // Reset start time after countdown
            
            // Track game start
            if (typeof Analytics !== 'undefined' && player) {
                Analytics.trackGameStart(
                    characters.find(c => c.id === player.type) || characters[0],
                    player.name
                );
            }
            
            // Start player stats tracking
            if (typeof PlayerStatsTracker !== 'undefined' && player) {
                PlayerStatsTracker.startTracking(player.name);
            }
        }
    }, 1000);
}

// Update countdown state
function updateCountdown() {
    // Just wait for the interval to finish
}

// Update gameplay
function updateGameplay() {
    // Don't update if paused by user
    if (wasPausedByUser) return;
    
    // Calculate elapsed time
    const currentTime = Date.now();
    const deltaTime = (currentTime - startTime - pausedTime) / 1000;
    const timeDelta = deltaTime - elapsedTime; // Time since last frame
    elapsedTime = deltaTime;
    
    // Update level intro
    if (showLevelIntro) {
        const introDuration = 2000; // 2 seconds
        if (Date.now() - levelIntroStartTime > introDuration) {
            showLevelIntro = false;
        }
    }
    
    // Update difficulty
    updateDifficulty(elapsedTime);
    
    // Update player
    if (player) {
        player.update(GROUND_Y);
        
        // Track if player lands on ground (reset combo)
        if (player.isOnGround && comboTracker.count > 0) {
            comboTracker.reset();
        }
        
    }
    
    // Update obstacles
    updateObstacles();
    
    // Update collectables (Hearts)
    updateCollectables();
    
    // Update particles
    updateParticles();
    
    // Update trail particles
    updateTrailParticles();
    
    // Update ripples
    updateRipples();
    
    // Update score popups
    updateScorePopups();
    
    // Check collisions
    checkCollisions();
    
    // Update time-based score
    updateTimeScore(timeDelta);
    
    // Update total score
    score = scoreStats.totalScore;
    
    // Check for level completion
    if (typeof levelManager !== 'undefined' && levelManager.isLevelComplete(score)) {
        triggerLevelTransition();
    }
    
    // Check for milestones
    checkProgressMilestones();
}

// Update collectables
function updateCollectables() {
    if (!collectables) return;
    
    for (let i = collectables.length - 1; i >= 0; i--) {
        const item = collectables[i];
        item.update(gameSpeed);
        
        // Collision detection with player
        if (!item.collected && !item.isOffScreen()) {
            // Simple box collision
            if (player.x < item.x + item.width &&
                player.x + player.width > item.x &&
                player.y < item.y + item.height &&
                player.y + player.height > item.y) {
                
                // Collect item
                item.collected = true;
                collectHeart(item);
                collectables.splice(i, 1);
                continue;
            }
        }
        
        // Remove off-screen items
        if (item.isOffScreen()) {
            collectables.splice(i, 1);
        }
    }
}

// Handle Heart Collection
function collectHeart(item) {
    // Increase lives (max 5)
    if (lives < 5) {
        lives++;
    } else {
        // Bonus points if full health
        scoreStats.bonusPoints += 500;
        createScorePopup(item.x, item.y, 500, "FULL HEALTH!");
    }
    
    // Create visual effects
    createScorePopup(item.x, item.y, 0, "+1 ❤️");
    createParticleExplosion(item.x + item.width/2, item.y + item.height/2, '#FF0000');
    
    // Play sound
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('powerup');
    }
}

// Draw gameplay elements
function drawGameplay() {
    // Draw ripples (at the back)
    drawRipples();
    
    // Draw trail particles (behind player)
    drawTrailParticles();
    
    // Draw particles (behind everything)
    drawParticles();
    
    // Draw player
    if (player) {
        // Force running animation in pause mode
        const forceRunning = (gameState === GAME_STATES.PAUSED);
        player.draw(ctx, forceRunning);
    }
    
    // Draw obstacles
    drawObstacles();
    
    // Draw collectables
    drawCollectables();
    
    // Draw score popups
    drawScorePopups();
    
    // Draw HUD
    if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) {
        drawHUD();
    }
    
    // Draw fullscreen button
    if (typeof drawFullscreenButton === 'function') {
        drawFullscreenButton();
    }
}

// Draw collectables
function drawCollectables() {
    if (!collectables) return;
    collectables.forEach(item => item.draw(ctx));
}

// Draw HUD (timer, score, lives)
function drawHUD() {
    const sizes = getMobileSizes();
    
    ctx.fillStyle = '#333';
    ctx.font = `bold ${sizes.hudSize}px Arial`;
    
    // Level indicator (top left)
    if (typeof levelManager !== 'undefined') {
        // Use cumulative scores for progress
        const currentTotal = score;
        const nextLevelTotal = levelManager.getCumulativePointsRequired();
        const progressPercent = levelManager.getCumulativeProgressPercent(score);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${isMobile ? 14 : 16}px Arial`;
        ctx.fillText(`LEVEL ${levelManager.currentLevel}`, 10, isMobile ? 20 : 25);
        
        // Progress bar
        const barWidth = isMobile ? 80 : 100;
        const barHeight = 8;
        const barX = 10;
        const barY = isMobile ? 25 : 30;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progress fill with glow effect when near completion
        const fillWidth = (progressPercent / 100) * barWidth;
        
        // Add glow when over 75%
        if (progressPercent >= 75) {
            const pulse = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
            ctx.shadowBlur = 10 * pulse;
            ctx.shadowColor = progressPercent >= 90 ? '#FF4444' : '#FFD700';
        }
        
        ctx.fillStyle = progressPercent >= 90 ? '#FF4444' : '#FFD700';
        ctx.fillRect(barX, barY, fillWidth, barHeight);
        ctx.shadowBlur = 0;
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Progress text - Show total score progress
        ctx.fillStyle = '#666';
        ctx.font = `${isMobile ? 10 : 12}px Arial`;
        ctx.fillText(`${currentTotal}/${nextLevelTotal}`, barX + barWidth + 5, barY + barHeight);
        
        // Screen border effect when near completion
        if (progressPercent >= 90) {
            drawProgressBorder(progressPercent);
        }
    }
    
    // Timer (below level)
    ctx.fillStyle = '#333';
    ctx.font = `bold ${sizes.hudSize}px Arial`;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    ctx.fillText(`⏱ ${timeStr}`, 10, isMobile ? 50 : 55);
    
    // Pause button (below timer)
    const pauseButtonX = 10;
    const pauseButtonY = isMobile ? 60 : 65;
    const pauseButtonWidth = isMobile ? 70 : 60;
    const pauseButtonHeight = isMobile ? 30 : 25;
    
    // Draw pause button
    ctx.fillStyle = wasPausedByUser ? '#FFD700' : '#4444FF';
    ctx.fillRect(pauseButtonX, pauseButtonY, pauseButtonWidth, pauseButtonHeight);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(pauseButtonX, pauseButtonY, pauseButtonWidth, pauseButtonHeight);
    
    // Button text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${isMobile ? 12 : 14}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(wasPausedByUser ? 'RESUME' : 'PAUSE', pauseButtonX + pauseButtonWidth / 2, pauseButtonY + pauseButtonHeight / 2 + 5);
    ctx.textAlign = 'left';
    
    // Store button bounds for click detection
    window.pauseButton = {
        x: pauseButtonX,
        y: pauseButtonY,
        width: pauseButtonWidth,
        height: pauseButtonHeight
    };
    
    // Combo display (top center) - only show if combo active
    if (comboTracker.active) {
        const comboText = comboTracker.display;
        ctx.save();
        
        // Pulse effect
        const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
        ctx.font = `bold ${Math.floor(sizes.hudSize * 1.2 * pulse)}px Arial`;
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        
        const comboX = canvas.width / 2;
        const comboY = isMobile ? 25 : 30;
        ctx.strokeText(comboText, comboX, comboY);
        ctx.fillText(comboText, comboX, comboY);
        
        ctx.restore();
    }
    
    // Score (top right)
    ctx.font = `bold ${sizes.hudSize}px Arial`;
    ctx.fillStyle = '#333';
    ctx.textAlign = 'right';
    ctx.fillText(`⭐ ${score}`, canvas.width - 10, isMobile ? 25 : 30);
    ctx.textAlign = 'left';
    
    // Lives (top center)
    ctx.textAlign = 'center';
    const hearts = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives)); // Support >3 lives
    ctx.fillText(hearts, canvas.width / 2, isMobile ? 25 : 30);
    ctx.textAlign = 'left';
    
    // Show tap count if player is tapping
    if (tapCount > 0 && player && player.isOnGround) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.font = `bold ${isMobile ? 20 : 24}px Arial`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 3;
        const tapText = `${'👆'.repeat(tapCount)} (${tapCount}x)`;
        ctx.strokeText(tapText, canvas.width / 2, isMobile ? 50 : 60);
        ctx.fillText(tapText, canvas.width / 2, isMobile ? 50 : 60);
        ctx.textAlign = 'left';
    }
    
    // Mobile-specific: Show "TAP to jump" hint at the start
    if (isMobile && elapsedTime < 3) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = `${sizes.instructionSize}px Arial`;
        ctx.textAlign = 'center';
        const alpha = 1 - (elapsedTime / 3); // Fade out
        ctx.globalAlpha = alpha;
        ctx.fillText('TAP anywhere to jump!', canvas.width / 2, canvas.height - 30);
        ctx.globalAlpha = 1.0;
        ctx.textAlign = 'left';
    }
}

// Draw pause overlay
function drawPauseOverlay() {
    // Darken screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (wasPausedByUser) {
        // User paused - show PAUSED text and score breakdown
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, 100);
        
        // Score breakdown box
        const boxY = 140;
        const boxHeight = 140;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 150, boxY, 300, boxHeight);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 2 - 150, boxY, 300, boxHeight);
        
        // Score breakdown
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('SCORE BREAKDOWN', canvas.width / 2, boxY + 25);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        const leftX = canvas.width / 2 - 130;
        const rightX = canvas.width / 2 + 130;
        
        // Stats
        ctx.fillText('Time:', leftX, boxY + 50);
        ctx.textAlign = 'right';
        ctx.fillText(`${scoreStats.timePoints} pts`, rightX, boxY + 50);
        
        ctx.textAlign = 'left';
        ctx.fillText(`Obstacles (x${scoreStats.obstaclesCleared}):`, leftX, boxY + 72);
        ctx.textAlign = 'right';
        ctx.fillText(`${scoreStats.obstaclePoints} pts`, rightX, boxY + 72);
        
        ctx.textAlign = 'left';
        ctx.fillText('Bonuses:', leftX, boxY + 94);
        ctx.textAlign = 'right';
        ctx.fillText(`${scoreStats.bonusPoints} pts`, rightX, boxY + 94);
        
        // Separator
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX, boxY + 102);
        ctx.lineTo(rightX, boxY + 102);
        ctx.stroke();
        
        // Total
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('TOTAL:', leftX, boxY + 125);
        ctx.textAlign = 'right';
        ctx.fillText(`${score} pts`, rightX, boxY + 125);
        
        // Resume instructions
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Press P to resume', canvas.width / 2, boxY + 170);
        ctx.font = '14px Arial';
        ctx.fillText(isMobile ? 'or tap PAUSE button' : '', canvas.width / 2, boxY + 195);
        
        // Audio Controls in Pause Menu
        if (typeof drawAudioControls === 'function') {
            drawAudioControls(canvas.width / 2 - 35, boxY + 210);
        }
        
        ctx.textAlign = 'left';
    } else {
        // Life lost countdown
        ctx.fillStyle = 'white';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pauseCountdown > 0 ? pauseCountdown : 'GO!', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left';
    }
}

// Draw countdown overlay
function drawCountdownOverlay() {
    // Darken screen slightly
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Display countdown
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pauseCountdown > 0 ? pauseCountdown : 'GO!', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
}

// Handle collision event
function onCollision() {
    lives--;
    
    // Reset combo on collision
    comboTracker.reset();
    
    // Screen shake effect
    screenShake = 15;
    
    // Play collision sound
    if (typeof audioManager !== 'undefined') audioManager.playSound('collision');
    
    // Create particle explosion at collision point
    createParticleExplosion(player.x + player.width / 2, player.y + player.height / 2, '#FF4444');
    
    if (lives <= 0) {
        gameState = GAME_STATES.GAME_OVER;
        if (typeof audioManager !== 'undefined') {
            audioManager.playSound('gameOver');
            audioManager.stopMusic();
        }
        
        // Stop player stats tracking
        if (typeof PlayerStatsTracker !== 'undefined') {
            PlayerStatsTracker.stopTracking();
        }
        
        // Save highscore with level, time, and obstacles cleared
        const currentLevel = (typeof levelManager !== 'undefined') ? levelManager.currentLevel : 1;
        saveHighScore(player.name, score, currentLevel, elapsedTime, scoreStats.obstaclesCleared);
        
        // Fetch global high scores for display on game over screen
        if (typeof getGlobalHighScores === 'function') {
            if (typeof isLoadingScores !== 'undefined') isLoadingScores = true;
            getGlobalHighScores().then(scores => {
                if (typeof globalScoresCache !== 'undefined') {
                    globalScoresCache = scores;
                }
                if (typeof isLoadingScores !== 'undefined') isLoadingScores = false;
                if (typeof lastScoreFetch !== 'undefined') lastScoreFetch = Date.now();
            }).catch(err => {
                console.warn('Failed to fetch global scores:', err);
                if (typeof isLoadingScores !== 'undefined') isLoadingScores = false;
            });
        }
        
        // Track game over
        if (typeof Analytics !== 'undefined' && player) {
            Analytics.trackGameOver({
                score: score,
                level: currentLevel,
                time: elapsedTime,
                obstaclesCleared: scoreStats.obstaclesCleared,
                characterType: player.type
            });
        }
        return;
    }
    
    // Pause game (from life loss, not user)
    gameState = GAME_STATES.PAUSED;
    wasPausedByUser = false;
    pauseCountdown = 3;
    
    // Clear obstacles near player
    clearObstaclesInRange(player.x, player.x + 300);
    
    const pauseStartTime = Date.now();
    
    // Start countdown
    countdownInterval = setInterval(() => {
        pauseCountdown--;
        
        if (pauseCountdown <= 0) {
            clearInterval(countdownInterval);
            gameState = GAME_STATES.PLAYING;
            pausedTime += Date.now() - pauseStartTime;
        }
    }, 1000);
}

// Toggle pause (user-initiated)
function togglePause() {
    if (gameState === GAME_STATES.PLAYING) {
        // Pause the game
        gameState = GAME_STATES.PAUSED;
        wasPausedByUser = true;
        pauseCountdown = 0; // No countdown for user pause
        pausedTime -= Date.now(); // Start tracking pause time
    } else if (gameState === GAME_STATES.PAUSED && wasPausedByUser) {
        // Unpause the game
        gameState = GAME_STATES.PLAYING;
        wasPausedByUser = false;
        pausedTime += Date.now(); // End tracking pause time
    }
}

// Particle system
class Particle {
    constructor(x, y, vx, vy, color, size, type = 'square') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.life = 1.0;
        this.decay = 0.02;
        this.type = type; // 'square', 'circle', 'star'
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // Gravity
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
    }
    
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'circle') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'star') {
            ctx.fillStyle = this.color;
            this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
        ctx.globalAlpha = 1.0;
    }
    
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Trail particle class (lighter, fades faster)
class TrailParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = 1.0;
        this.decay = 0.05;
        this.size = 8 + Math.random() * 4;
    }
    
    update() {
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.globalAlpha = this.life * 0.5;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Create particle explosion
function createParticleExplosion(x, y, color) {
    const particleCount = getParticleCount(15);
    const types = ['square', 'circle', 'star'];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 2; // Bias upward
        const size = 3 + Math.random() * 3;
        const type = types[Math.floor(Math.random() * types.length)];
        particles.push(new Particle(x, y, vx, vy, color, size, type));
    }
}

// Create jump particles
function createJumpParticles(x, y, level) {
    const particleCount = getParticleCount(3 + level);
    const colors = ['#FFD700', '#FFA500', '#FFFF00'];
    
    for (let i = 0; i < particleCount; i++) {
        const vx = (Math.random() - 0.5) * 2;
        const vy = Math.random() * 2;
        const size = 3 + Math.random() * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, vx, vy, color, size, 'star'));
    }
}

// Create landing particles
function createLandingParticles(x, y) {
    const particleCount = getParticleCount(5);
    const color = '#D2B48C';
    
    for (let i = 0; i < particleCount; i++) {
        const vx = (Math.random() - 0.5) * 3;
        const vy = -Math.random() * 2;
        const size = 2 + Math.random() * 2;
        particles.push(new Particle(x, y, vx, vy, color, size, 'circle'));
    }
}

// Create trail particle
function createTrailParticle(x, y, color) {
    // Only create trail occasionally for performance
    if (Math.random() > 0.3) return;
    trailParticles.push(new TrailParticle(x, y, color));
}

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
}

// Update trail particles
function updateTrailParticles() {
    for (let i = trailParticles.length - 1; i >= 0; i--) {
        trailParticles[i].update();
        if (trailParticles[i].isDead()) {
            trailParticles.splice(i, 1);
        }
    }
}

// Draw particles
function drawParticles() {
    particles.forEach(particle => particle.draw(ctx));
}

// Draw trail particles
function drawTrailParticles() {
    trailParticles.forEach(particle => particle.draw(ctx));
}

// Ripple effect class
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = isMobile ? 40 : 30;
        this.life = 1.0;
        this.speed = isMobile ? 3 : 2.5;
    }
    
    update() {
        this.radius += this.speed;
        this.life = 1 - (this.radius / this.maxRadius);
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.globalAlpha = this.life * 0.5;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Create ripple at touch/click location
function createRipple(x, y) {
    ripples.push(new Ripple(x, y));
}

// Update ripples
function updateRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        if (ripples[i].isDead()) {
            ripples.splice(i, 1);
        }
    }
}

// Draw ripples
function drawRipples() {
    ripples.forEach(ripple => ripple.draw(ctx));
}

// Check progress milestones
function checkProgressMilestones() {
    if (typeof levelManager === 'undefined') return;
    
    const progress = levelManager.getCumulativeProgressPercent(score);
    
    // Check each milestone
    [25, 50, 75, 90].forEach(milestone => {
        if (progress >= milestone && !milestones[milestone]) {
            milestones[milestone] = true;
            showMilestoneMessage(milestone);
        }
    });
}

// Show milestone message
function showMilestoneMessage(milestone) {
    let message = '';
    let color = '#FFD700';
    
    switch(milestone) {
        case 25:
            message = 'QUARTER WAY!';
            break;
        case 50:
            message = 'HALFWAY THERE!';
            break;
        case 75:
            message = 'FINAL STRETCH!';
            break;
        case 90:
            message = 'ALMOST THERE!';
            color = '#FF4444';
            break;
    }
    
    // Create popup
    createScorePopup(canvas.width / 2, canvas.height / 3, 0, message);
    
    // Create celebration particles
    if (typeof addEffect !== 'undefined' && typeof createCelebrationBurst !== 'undefined') {
        addEffect(createCelebrationBurst(canvas.width / 2, canvas.height / 3, 15));
    }
    
    // Play sound
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('powerup');
    }
    
    // Screen shake
    screenShake = 10;
}

// Reset milestones for new level
function resetMilestones() {
    milestones = { 25: false, 50: false, 75: false, 90: false };
    lastMilestoneShown = 0;
}

// Trigger level transition
function triggerLevelTransition() {
    // Save last level stats
    if (typeof lastLevelStats !== 'undefined' && typeof currentLevelStats !== 'undefined') {
        lastLevelStats.obstaclesCleared = scoreStats.obstaclesCleared;
        lastLevelStats.timePoints = scoreStats.timePoints - (levelManager.levelStartScore > 0 ? 0 : scoreStats.timePoints);
        lastLevelStats.obstaclePoints = scoreStats.obstaclePoints;
        lastLevelStats.bonusPoints = scoreStats.bonusPoints;
        lastLevelStats.startTime = levelManager.levelStartTime;
        lastLevelStats.endTime = elapsedTime;
    }
    
    // Track level completion
    if (typeof Analytics !== 'undefined' && typeof levelManager !== 'undefined') {
        Analytics.trackLevelComplete(levelManager.currentLevel, score, elapsedTime);
    }
    
    gameState = GAME_STATES.LEVEL_TRANSITION;
    
    // Start transition manager
    if (typeof transitionManager !== 'undefined') {
        transitionManager.start();
    }
}

// Update level transition
function updateLevelTransition() {
    // Update transition manager
    if (typeof transitionManager !== 'undefined') {
        transitionManager.update();
        
        // Check if transition is complete
        if (!transitionManager.active) {
            // Transition handles calling startNextLevel
        }
    }
    
    // Update effects
    if (typeof updateEffects !== 'undefined') {
        updateEffects();
    }
}

// Start next level
function startNextLevel() {
    // Advance level data
    if (typeof levelManager !== 'undefined') {
        levelManager.advanceLevel(score, elapsedTime);
        
        // Note: Theme already applied in TransitionManager.updateAnticipation
    }
    
    // Reset milestones
    resetMilestones();
    
    // Reset level-specific stats (but keep cumulative score)
    if (typeof currentLevelStats !== 'undefined') {
        currentLevelStats.reset();
    }
    
    // Clear all obstacles
    obstacles = [];
    collectables = [];
    
    // Clear effects
    if (typeof clearEffects !== 'undefined') {
        clearEffects();
    }
    
    // Give difficulty a slight boost but reset spawn timing
    if (typeof resetDifficultyForNewLevel !== 'undefined') {
        resetDifficultyForNewLevel();
    }
    
    // Reset player position to standard start
    if (player) {
        player.x = PLAYER_START_X;
        player.y = PLAYER_START_Y;
        player.velocityY = 0;
        player.jumpCount = 0;
    }
    
    // Return to playing state
    gameState = GAME_STATES.PLAYING;
    
    // Skip level intro after cave exit - start playing immediately
    // showLevelIntro = true;
    // levelIntroStartTime = Date.now();
}

// Draw progress border effect
function drawProgressBorder(progress) {
    const pulse = 0.5 + Math.sin(Date.now() * 0.015) * 0.5;
    const intensity = (progress - 90) / 10; // 0 to 1 from 90% to 100%
    
    ctx.save();
    ctx.strokeStyle = `rgba(255, 68, 68, ${intensity * pulse})`;
    ctx.lineWidth = 4 + intensity * 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF4444';
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    ctx.restore();
}

// Draw level intro (brief overlay at start of level)
function drawLevelIntro() {
    const elapsed = Date.now() - levelIntroStartTime;
    const duration = 2000;
    const fadeStart = 1500;
    
    // Fade out effect
    let alpha = 1.0;
    if (elapsed > fadeStart) {
        alpha = 1.0 - ((elapsed - fadeStart) / (duration - fadeStart));
    }
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Level number
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    
    const levelText = `LEVEL ${levelManager.currentLevel}`;
    ctx.strokeText(levelText, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(levelText, canvas.width / 2, canvas.height / 2 - 20);
    
    // Theme name
    const theme = levelManager.getCurrentTheme();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.strokeText(theme.name, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(theme.name, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.restore();
}

// Initialize game when page loads
window.addEventListener('load', init);

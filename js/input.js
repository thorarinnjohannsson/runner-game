// INPUT HANDLING - Multi-tap jump detection

// Input constants
const TAP_WINDOW = 250; // milliseconds between taps
const INSTANT_JUMP_DELAY = 50; // milliseconds - reduced delay for better responsiveness
let tapCount = 0;
let lastTapTime = 0;
let tapTimeout = null;
let jumpExecuted = false; // Track if we already jumped
const keyState = {}; // Track key press state to prevent holding

// Setup input listeners
function setupInput() {
    // Keyboard input
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Mouse/touch input on canvas
    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// Handle key up
function handleKeyUp(e) {
    keyState[e.code] = false;
    keyState[e.key] = false; // Clear both code and key to be safe
}

// Handle keyboard input
function handleKeyDown(e) {
    // Ignore if typing in an input field
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        if (e.key === 'Enter') {
            if (keyState[e.key]) return; // Prevent repeat on Enter too
            keyState[e.key] = true;
            
            // Allow Enter to start game from input
            document.activeElement.blur();
            if (gameState === GAME_STATES.START_SCREEN) {
                handleStartGame();
            }
        }
        return;
    }

    // Prevent key repeat
    if (keyState[e.code] || keyState[e.key]) return;
    keyState[e.code] = true;
    keyState[e.key] = true;

    // Only respond to spacebar
    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        
        // Only handle input during gameplay
        if (gameState === GAME_STATES.PLAYING) {
            handleTap();
        }
    }
    
    // P key to pause/unpause
    if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (gameState === GAME_STATES.PLAYING) {
            togglePause();
        } else if (gameState === GAME_STATES.PAUSED && pauseCountdown === 0) {
            // Only unpause if not in countdown from losing a life
            togglePause();
        }
    }
    
    // Enter key on start screen
    if (e.key === 'Enter' && gameState === GAME_STATES.START_SCREEN) {
        handleStartGame();
    }
    
    // Restart on game over - ENTER, R, or ESC
    if (gameState === GAME_STATES.GAME_OVER) {
        if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
            // Quick restart with ENTER or R
            e.preventDefault();
            gameState = GAME_STATES.START_SCREEN;
            selectedCharacter = null;
        } else if (e.key === 'Escape') {
            // ESC also returns to start screen
            e.preventDefault();
            gameState = GAME_STATES.START_SCREEN;
            selectedCharacter = null;
        }
    }
}

// Handle touch start events
function handleTouchStart(e) {
    e.preventDefault();
    
    // Handle gameplay taps
    if (gameState === GAME_STATES.PLAYING) {
        // Create ripple at touch location
        const coords = getTouchCoordinates(e, canvas);
        if (typeof createRipple === 'function') {
            createRipple(coords.x, coords.y);
        }
        handleTap();
    }
}

// Handle touch end (for UI interactions)
function handleTouchEnd(e) {
    e.preventDefault();
}

// Handle tap/click for multi-tap jump detection (with instant feedback)
function handleTap() {
    if (gameState !== GAME_STATES.PLAYING) return;
    if (!player) return;
    
    const now = Date.now();
    
    // Check if within tap window
    if (now - lastTapTime < TAP_WINDOW) {
        tapCount++;
        
        // Allow immediate jump upgrade even if already jumped
        if (jumpExecuted && tapCount <= 4) {
            // Cancel the previous timeout
            clearTimeout(tapTimeout);
            // Execute upgraded jump immediately (works in air too!)
            executeJump(tapCount);
            jumpExecuted = true;
            
            // Set a new timeout to reset
            tapTimeout = setTimeout(() => {
                tapCount = 0;
                jumpExecuted = false;
            }, TAP_WINDOW);
        }
    } else {
        // New tap sequence
        tapCount = 1;
        jumpExecuted = false;
    }
    
    lastTapTime = now;
    
    // If this is the first tap, execute immediately with reduced delay
    if (tapCount === 1) {
        clearTimeout(tapTimeout);
        
        // Execute first jump quickly for responsiveness
        tapTimeout = setTimeout(() => {
            if (!jumpExecuted) {
                executeJump(tapCount);
                jumpExecuted = true;
            }
            
            // Reset after window expires
            setTimeout(() => {
                tapCount = 0;
                jumpExecuted = false;
            }, TAP_WINDOW);
        }, INSTANT_JUMP_DELAY);
    }
}

// Execute jump with the given level (now works in air too!)
function executeJump(level) {
    if (player) {
        player.jump(level);
    }
}


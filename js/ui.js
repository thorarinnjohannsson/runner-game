// UI SCREENS - Start screen and Game Over screen

// Polyfill for roundRect if not available
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Draw start screen with "Player Card" layout
function drawStartScreen() {
    const mobile = isMobile || canvas.width < 600;
    const center = canvas.width / 2;
    const h = canvas.height;
    
    // Layout Logic:
    // Tight mode: For very short screens (iPhone landscape ~350px)
    // Compact mode: For standard desktop runner size (400px)
    const tight = h < 380;
    const compact = h <= 450; // Includes standard 400px desktop view
    
    // Layout Constants
    const headerY = tight ? 30 : (compact ? 40 : 60);
    
    // Card Position & Size
    // If tight/compact, move card up and shrink it
    const cardY = tight ? 50 : (compact ? 75 : 110);
    const cardWidth = mobile ? 320 : 400;
    // Shrink height in compact modes to make room for button
    const cardHeight = tight ? 180 : (compact ? 210 : 280);
    
    // Button Position
    const buttonY = cardY + cardHeight + (tight ? 15 : 25);
    
    // Internal Card Spacing (adjusted for new heights)
    const inputOffset = tight ? 30 : 40;
    const labelOffset = tight ? 75 : (compact ? 85 : 110);
    const charsOffset = tight ? 95 : (compact ? 110 : 140);
    const nameOffset = tight ? 150 : (compact ? 175 : 220);
    
    // Show name input & position it dynamically
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput) {
        if (nameInput.style.display !== 'block') {
            nameInput.style.display = 'block';
            if (!nameInput.value && localStorage.getItem('lastPlayerName')) {
                nameInput.value = localStorage.getItem('lastPlayerName');
            }
        }
        nameInput.style.top = `${cardY + inputOffset}px`;
    }
    
    // Update ripples
    if (typeof updateRipples === 'function') updateRipples();
    if (typeof drawRipples === 'function') drawRipples();
    
    // 1. Header
    ctx.fillStyle = '#333';
    ctx.font = `bold ${tight ? 28 : (mobile ? 36 : 40)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('RUNNER GAME', center, headerY);
    
    // 2. Player Card
    // Card Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(center - cardWidth/2, cardY, cardWidth, cardHeight, 15);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Character Selection Section
    ctx.fillStyle = '#333';
    ctx.font = `${tight ? 14 : 16}px Arial`;
    ctx.fillText('Select Runner:', center, cardY + labelOffset);
    
    // Draw Characters
    drawCardCharacterSelection(center, cardY + charsOffset);
    
    // Selected Character Name
    if (selectedCharacter) {
        ctx.fillStyle = '#444';
        ctx.font = `bold ${tight ? 16 : 18}px Arial`;
        ctx.fillText(selectedCharacter.name, center, cardY + nameOffset);
    }
    
    // 3. Start Button (Pulsing)
    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.03;
    drawCardStartButton(center, buttonY, pulse);
    
    // 4. Instructions
    // Draw only if enough space (hide on tight/compact screens to avoid clutter)
    if (h > 500) {
        drawInstructionIcons(center, h - 30);
    }
    
    ctx.textAlign = 'left';
}

// Draw character selection in card
function drawCardCharacterSelection(centerX, y) {
    const charSize = 50;
    const padding = 15;
    const totalWidth = (charSize * characters.length) + (padding * (characters.length - 1));
    const startX = centerX - (totalWidth / 2);
    
    characters.forEach((char, index) => {
        const x = startX + (index * (charSize + padding));
        
        // Animation for selected
        let bounce = 0;
        if (selectedCharacter === char) {
             bounce = Math.abs(Math.sin(Date.now() * 0.005)) * 5;
        }
        
        // Draw char
        ctx.fillStyle = char.color;
        ctx.fillRect(x, y - bounce, charSize, charSize);
        
        // Selection Box
        if (selectedCharacter === char) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 4, y - 4 - bounce, charSize + 8, charSize + 8);
        } else {
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, charSize, charSize);
        }
        
        // Update Hit Area
        char.hitArea = {
            x: x - 10,
            y: y - 10,
            width: charSize + 20,
            height: charSize + 20
        };
    });
}

// Draw pulsing start button
function drawCardStartButton(centerX, y, scale = 1) {
    const width = 200 * scale;
    const height = 50 * scale;
    const x = centerX - width/2;
    
    // Gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#45a049');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(76, 175, 80, 0.4)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 25);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('START RUN', centerX, y + 33);
    
    // Hit area
    window.startButton = {
        x: x,
        y: y,
        width: width,
        height: height
    };
}

// Draw simple instructions
function drawInstructionIcons(centerX, y) {
    ctx.fillStyle = '#888';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    const text = isMobile ? '👆 Tap to Jump' : '␣ Space / 👆 Tap to Jump';
    ctx.fillText(text, centerX, y);
}

// Draw game over screen
function drawGameOverScreen() {
    // Mobile/Layout detection
    const mobile = isMobile || canvas.width < 600;
    // Use side-by-side if we have enough width (e.g., tablet/desktop)
    const sideBySide = canvas.width >= 750; 

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // --- HEADER ---
    const titleSize = mobile ? 36 : 48;
    const nameSize = mobile ? 18 : 24;
    const headerY = mobile ? 40 : 60;
    
    ctx.fillStyle = '#FF4444';
    ctx.font = `bold ${titleSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, headerY);
    
    ctx.fillStyle = 'white';
    ctx.font = `${nameSize}px Arial`;
    ctx.fillText(`Player: ${player.name}`, canvas.width / 2, headerY + (mobile ? 30 : 40));

    // --- CONTENT ---
    let ctaY; // Y position for the Play Again button

    if (sideBySide) {
        // SIDE-BY-SIDE LAYOUT
        const contentY = headerY + (mobile ? 60 : 80);
        const boxWidth = 340;
        const boxHeight = 220;
        const gap = 40;
        const totalWidth = (boxWidth * 2) + gap;
        
        // Calculate centers for left and right panels
        const leftCenterX = (canvas.width / 2) - (boxWidth / 2) - (gap / 2);
        const rightCenterX = (canvas.width / 2) + (boxWidth / 2) + (gap / 2);

        // Draw Breakdown (Left)
        drawScoreBreakdownBox(leftCenterX, contentY, boxWidth, boxHeight);

        // Draw High Scores (Right) - encased in a box for symmetry
        drawHighScoresBox(rightCenterX, contentY, boxWidth, boxHeight);
        
        // New High Score Banner (Centered below both or integrated)
        if (isNewHighScore(score)) {
             ctx.fillStyle = '#FFD700';
             ctx.font = `bold 20px Arial`;
             ctx.fillText('🎉 NEW HIGH SCORE! 🎉', canvas.width / 2, contentY + boxHeight + 30);
             ctaY = contentY + boxHeight + 60;
        } else {
             ctaY = contentY + boxHeight + 40;
        }

    } else {
        // VERTICAL LAYOUT (Compact)
        const contentY = headerY + (mobile ? 50 : 60);
        const boxWidth = Math.min(360, canvas.width - 40);
        const boxHeight = 190; // Slightly shorter
        
        // Draw Breakdown
        drawScoreBreakdownBox(canvas.width / 2, contentY, boxWidth, boxHeight);
        
        // Draw High Scores (Compact list below)
        const highScoreY = contentY + boxHeight + 20;
        
        if (isNewHighScore(score)) {
            ctx.fillStyle = '#FFD700';
            ctx.font = `bold ${mobile ? 16 : 18}px Arial`;
            ctx.fillText('🎉 NEW HIGH SCORE! 🎉', canvas.width / 2, highScoreY);
            // Draw list below banner
            drawHighScoresList(canvas.width / 2, highScoreY + 25, mobile ? 3 : 5); // Show fewer on mobile
            ctaY = highScoreY + (mobile ? 100 : 140);
        } else {
            drawHighScoresList(canvas.width / 2, highScoreY, mobile ? 3 : 5);
            ctaY = highScoreY + (mobile ? 80 : 120);
        }
    }

    // --- CTA BUTTON ---
    // Ensure button doesn't go off screen
    const buttonHeight = mobile ? 60 : 50;
    const maxButtonY = canvas.height - buttonHeight - 20;
    const finalButtonY = Math.min(ctaY, maxButtonY);
    
    drawPlayAgainButton(finalButtonY);
    
    ctx.textAlign = 'left';
}

// Helper: Draw the Score Breakdown Box
function drawScoreBreakdownBox(centerX, y, width, height) {
    const leftX = centerX - (width / 2);
    const padding = 25;
    
    // Box Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(leftX, y, width, height);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftX, y, width, height);
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCORE BREAKDOWN', centerX, y + 30);
    
    // Content
    ctx.fillStyle = 'white';
    ctx.font = '15px Arial';
    ctx.textAlign = 'left';
    
    const contentLeft = leftX + padding;
    const contentRight = leftX + width - padding;
    const startContentY = y + 60;
    const lineH = 28;

    // Stats
    ctx.fillText('Survival Time:', contentLeft, startContentY);
    ctx.textAlign = 'right';
    ctx.fillText(`${scoreStats.timePoints} pts`, contentRight, startContentY);
    
    ctx.textAlign = 'left';
    ctx.fillText(`Obstacles (x${scoreStats.obstaclesCleared}):`, contentLeft, startContentY + lineH);
    ctx.textAlign = 'right';
    ctx.fillText(`${scoreStats.obstaclePoints} pts`, contentRight, startContentY + lineH);
    
    ctx.textAlign = 'left';
    ctx.fillText('Bonuses:', contentLeft, startContentY + lineH * 2);
    ctx.textAlign = 'right';
    ctx.fillText(`${scoreStats.bonusPoints} pts`, contentRight, startContentY + lineH * 2);
    
    // Separator
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(contentLeft, startContentY + lineH * 2 + 10);
    ctx.lineTo(contentRight, startContentY + lineH * 2 + 10);
    ctx.stroke();
    
    // Total
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL:', contentLeft, startContentY + lineH * 3 + 15);
    ctx.textAlign = 'right';
    ctx.fillText(`${score} pts`, contentRight, startContentY + lineH * 3 + 15);
    
    // Mini Stat
    ctx.font = '12px Arial';
    ctx.fillStyle = '#AAA';
    ctx.textAlign = 'center';
    ctx.fillText(`Best Combo: x${comboTracker.maxCombo}`, centerX, y + height - 15);
}

// Helper: Draw High Scores in a matching box (Side-by-Side layout)
function drawHighScoresBox(centerX, y, width, height) {
    const leftX = centerX - (width / 2);
    
    // Box Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(leftX, y, width, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftX, y, width, height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HIGH SCORES', centerX, y + 30);
    
    // List
    drawHighScoresList(centerX, y + 60, 5);
}

// Helper: Draw the list of high scores
function drawHighScoresList(centerX, startY, limit = 5) {
    const scores = getHighScores();
    const lineHeight = 24;
    
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    scores.slice(0, limit).forEach((scoreEntry, index) => {
        const y = startY + (index * lineHeight);
        const text = `${index + 1}. ${scoreEntry.name} - ${scoreEntry.score}`;
        
        if (scoreEntry.score === score && scoreEntry.name === player.name) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 14px Arial';
        } else {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
        }
        
        ctx.fillText(text, centerX, y);
    });
}

// Draw Play Again button (prominent, touch-friendly)
function drawPlayAgainButton(startY) {
    const mobile = isMobile || canvas.width < 600;
    
    // Button dimensions
    const buttonWidth = mobile ? 280 : 200;
    const buttonHeight = mobile ? 60 : 50;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    
    // Position relative to content above, or fallback to bottom if no startY provided
    const buttonY = startY || (mobile ? canvas.height - 130 : canvas.height - 120);
    
    // Button gradient background
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#45a049');
    
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    // Draw button
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Button border
    ctx.strokeStyle = '#3d8b40';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Button text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${mobile ? 22 : 24}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('PLAY AGAIN', canvas.width / 2, buttonY + buttonHeight / 2 + 8);
    
    // Secondary hint below button
    ctx.font = `${mobile ? 12 : 14}px Arial`;
    ctx.fillStyle = '#AAA';
    ctx.fillText('Press ENTER for quick restart', canvas.width / 2, buttonY + buttonHeight + 25);
    
    // Store button bounds for click detection
    window.playAgainButton = {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
    };
    
    ctx.textAlign = 'left';
}

// Setup UI event listeners (called after canvas is ready)
function setupUIListeners() {
    // Get canvas element
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Handle clicks on UI elements
    gameCanvas.addEventListener('click', handleUIClick);
    
    // Handle touch events for mobile
    gameCanvas.addEventListener('touchend', handleUITouch, { passive: false });
}

// Handle UI click
function handleUIClick(e) {
    const coords = getTouchCoordinates(e, canvas);
    
    // Create ripple effect
    createRipple(coords.x, coords.y);
    
    processUIInteraction(coords.x, coords.y);
}

// Handle UI touch
function handleUITouch(e) {
    e.preventDefault();
    
    if (e.changedTouches.length === 0) return;
    
    const coords = getTouchCoordinates(e, canvas);
    
    // Create ripple effect
    createRipple(coords.x, coords.y);
    
    processUIInteraction(coords.x, coords.y);
    
    // Haptic feedback
    triggerHaptic(10);
}

// Process UI interaction (works for both click and touch)
function processUIInteraction(x, y) {
    // Check pause button during gameplay
    if (gameState === GAME_STATES.PLAYING || (gameState === GAME_STATES.PAUSED && wasPausedByUser)) {
        if (window.pauseButton) {
            const btn = window.pauseButton;
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                togglePause();
                triggerHaptic(15);
                return;
            }
        }
    }
    
    // Start screen interactions
    if (gameState === GAME_STATES.START_SCREEN) {
        // Check character selection using stored hit areas
        characters.forEach((char) => {
            if (char.hitArea && 
                x >= char.hitArea.x && 
                x <= char.hitArea.x + char.hitArea.width &&
                y >= char.hitArea.y && 
                y <= char.hitArea.y + char.hitArea.height) {
                selectedCharacter = char;
                triggerHaptic(15); // Stronger feedback for selection
            }
        });
        
        // Check start button
        if (window.startButton && selectedCharacter) {
            const btn = window.startButton;
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                triggerHaptic(20); // Strong feedback for button
                handleStartGame();
            }
        }
    }
    
    // Game over screen - check Play Again button first
    if (gameState === GAME_STATES.GAME_OVER) {
        // Check Play Again button
        if (window.playAgainButton) {
            const btn = window.playAgainButton;
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                // Button clicked - restart game
                triggerHaptic(20); // Strong feedback
                gameState = GAME_STATES.START_SCREEN;
                // selectedCharacter = null; // Keep selection
                return;
            }
        }
        
        // Fallback: tap anywhere else to return to start
        gameState = GAME_STATES.START_SCREEN;
        // selectedCharacter = null; // Keep selection
        triggerHaptic(15);
    }
}

// Handle starting the game
function handleStartGame() {
    if (selectedCharacter) {
        startNewGame();
    }
}


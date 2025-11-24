// UI SCREENS - Start screen and Game Over screen

// Global state for async scores
let globalScoresCache = [];
let isLoadingScores = false;
let lastScoreFetch = 0;
let isEditingName = false; // Track if user is typing name

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

// Utility to draw soft panels used on the start screen
function drawSoftPanel(x, y, width, height, options = {}) {
    ctx.save();
    
    if (options.shadow !== false) {
        ctx.shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = options.shadowBlur ?? 12;
        ctx.shadowOffsetX = options.shadowOffsetX ?? 0;
        ctx.shadowOffsetY = options.shadowOffsetY ?? 6;
    }
    
    ctx.fillStyle = options.fill || 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = options.stroke || 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = options.lineWidth || 2;
    
    const radius = options.radius || 16;
    
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    
    if (!options.hideBorder) {
        ctx.stroke();
    }
    
    ctx.restore();
}

// Draw start screen with "Player Card" layout
function drawStartScreen() {
    const mobile = isMobile || canvas.width < 600;
    const center = canvas.width / 2;
    const h = canvas.height;
    
    const tight = h < 380;
    const compact = h <= 450;
    const headerY = tight ? 30 : (compact ? 40 : 60);
    
    const layoutWidth = Math.min(canvas.width - 40, mobile ? canvas.width - 20 : 540);
    const layoutX = center - layoutWidth / 2;
    const topY = tight ? 65 : (compact ? 85 : 110);
    const namePanelHeight = mobile ? 92 : 72;
    const charPanelHeight = mobile ? 180 : 155;
    const panelGap = mobile ? 22 : 16;
    
    const namePanelY = topY;
    const charPanelY = namePanelY + namePanelHeight + panelGap;
    const selectionLabelY = charPanelY - 0;
    const characterNameY = charPanelY + charPanelHeight - (mobile ? 8 : 16);
    const buttonY = charPanelY + charPanelHeight + (mobile ? 35 : 25);
    
    drawSoftPanel(layoutX, namePanelY, layoutWidth, namePanelHeight, {
        fill: 'rgba(255, 255, 255, 0.92)',
        stroke: 'rgba(0, 0, 0, 0.12)',
        radius: 18
    });
    
    drawSoftPanel(layoutX, charPanelY, layoutWidth, charPanelHeight, {
        fill: 'rgba(0, 0, 0, 0.35)',
        stroke: 'rgba(255, 255, 255, 0.2)',
        radius: 20
    });
    
    drawNameEntryUI(center, namePanelY + (mobile ? 28 : 24), layoutWidth);
    
    if (typeof updateRipples === 'function') updateRipples();
    if (typeof drawRipples === 'function') drawRipples();
    
    ctx.fillStyle = 'white';
    ctx.font = `24px "Press Start 2P"`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeText('RUNNER GAME', center, headerY);
    ctx.fillText('RUNNER GAME', center, headerY);
    
    drawAudioControls(canvas.width - 80, 20);
    drawHighScoreButton(20, 20);
    
    ctx.font = `bold ${tight ? 14 : 16}px "Press Start 2P"`;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeText('SELECT RUNNER', center, selectionLabelY);
    ctx.fillStyle = '#FFD700';
    ctx.fillText('SELECT RUNNER', center, selectionLabelY);
    
    const charRowTop = charPanelY + (mobile ? 32 : 26);
    drawCardCharacterSelection(center, charRowTop, {
        availableWidth: layoutWidth - 80,
        baseSize: mobile ? 64 : 56,
        padding: mobile ? 20 : 16
    });
    
    if (selectedCharacter) {
        ctx.font = `bold ${tight ? 18 : 22}px Arial`;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeText(selectedCharacter.name.toUpperCase(), center, characterNameY);
        ctx.fillStyle = 'white';
        ctx.fillText(selectedCharacter.name.toUpperCase(), center, characterNameY);
    }
    
    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.03;
    drawCardStartButton(center, buttonY, pulse);
}

// Draw Name Entry UI (Text mode vs Edit mode)
function drawNameEntryUI(centerX, y, panelWidth = 320) {
    const nameInput = document.getElementById('playerNameInput');
    const currentName = nameInput ? nameInput.value : (localStorage.getItem('lastPlayerName') || 'Player');
    const boxWidth = Math.max(180, Math.min(panelWidth - 80, 280));
    const boxHeight = 40;
    const boxX = centerX - boxWidth / 2;
    const diceSize = 36;
    const diceGap = 12;
    const panelRight = centerX + panelWidth / 2;
    const boxTop = y;
    const diceX = Math.min(boxX + boxWidth + diceGap, panelRight - diceSize - 12);
    const diceY = y;

    if (nameInput) {
        const widthPx = `${boxWidth}px`;
        if (nameInput.style.width !== widthPx) {
            nameInput.style.width = widthPx;
        }
    }
    
    ctx.fillStyle = '#5C6672';
    ctx.font = `10px "Press Start 2P"`;
    ctx.textAlign = 'left';
    ctx.fillText('PLAYER NAME', boxX, boxTop - 8);
    
    if (isEditingName) {
        // Show Input
        if (nameInput) {
            nameInput.style.display = 'block';
            nameInput.style.top = `${boxTop}px`;
            nameInput.style.width = `${boxWidth}px`;
            // Ensure focus if not already
            if (document.activeElement !== nameInput) {
                nameInput.focus();
            }
        }
    } else {
        // Hide Input
        if (nameInput) {
            nameInput.style.display = 'none';
        }
        
        // Draw Name Box (Click to edit)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(boxX, boxTop, boxWidth, boxHeight);
        ctx.strokeStyle = '#1F2933';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxTop, boxWidth, boxHeight);
        
        // Draw Name Text
        ctx.fillStyle = '#111';
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(currentName, centerX, boxTop + 28);
        
        // Draw Edit Icon (Pencil) - Right side of box
        const editX = boxX + boxWidth - 20;
        const editY = boxTop + boxHeight / 2;
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('✎', editX, editY + 5);
        
        // Draw Randomize Button (Dice) - Next to box
        ctx.fillStyle = '#2ECC71';
        ctx.fillRect(diceX, diceY, diceSize, diceSize);
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 3;
        ctx.strokeRect(diceX, diceY, diceSize, diceSize);
        
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎲', diceX + diceSize / 2, diceY + 26);
        ctx.textAlign = 'left';
        
        // Define Hit Areas
        window.nameBoxHit = { x: boxX, y: boxTop, width: boxWidth, height: boxHeight };
        window.randomizeHit = { x: diceX, y: diceY, width: diceSize, height: diceSize };
    }
}

// Draw character selection in card
function drawCardCharacterSelection(centerX, y, options = {}) {
    // Ensure characters array is available
    const charList = window.characters || (typeof characters !== 'undefined' ? characters : []);
    if (!charList || charList.length === 0) return;

    const availableWidth = options.availableWidth || canvas.width - 40;
    let charSize = options.baseSize || 60;
    let padding = options.padding || 20;
    let totalWidth = (charSize * charList.length) + (padding * (charList.length - 1));

    if (totalWidth > availableWidth) {
        const scale = availableWidth / totalWidth;
        charSize = Math.max(42, charSize * scale);
        padding = Math.max(10, padding * scale);
        totalWidth = (charSize * charList.length) + (padding * (charList.length - 1));
    }

    const startX = centerX - (totalWidth / 2);
    
    charList.forEach((char, index) => {
        const x = startX + (index * (charSize + padding));
        
        // Animation for selected
        let bounce = 0;
        if (selectedCharacter === char) {
             bounce = Math.abs(Math.sin(Date.now() * 0.005)) * 5;
        }
        
        // Selection Spotlight/Box
        if (selectedCharacter === char) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 18;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillRect(x - 6, y - 6 - bounce, charSize + 12, charSize + 12);
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 6, y - 6 - bounce, charSize + 12, charSize + 12);
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(x, y, charSize, charSize);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, charSize, charSize);
        }
        
        // Draw Character Sprite (Preview)
        // We create a dummy render function call to re-use the player drawing logic
        // Scale factor for preview
        const previewScale = 1.5;
        const p = 4; // standard pixel size
        
        ctx.save();
        // Center inside the box
        ctx.translate(x + charSize/2, y + charSize/2 - bounce);
        ctx.scale(previewScale, previewScale);
        // Adjust offset to center the sprite drawing which is usually relative to top-left
        ctx.translate(-15, -20); 
        
        const colors = {
            fur: char.color,
            // Generate variations if not provided (simple darkening/lightening)
            furDark: adjustColor(char.color, -20),
            furLight: adjustColor(char.color, 20),
            white: '#FFFFFF',
            black: '#2C3E50',
            nose: char.id === 'penguin' ? '#FF9800' : '#E74C3C'
        };
        
        // Select drawing function safely
        let drawFunc = null;
        if (window.CharacterDrawers) {
            drawFunc = window.CharacterDrawers[char.id] || window.CharacterDrawers['cat'];
        }
        
        // Fallback if drawFunc is still missing
        if (typeof drawFunc === 'function') {
            // Static pose
            drawFunc(ctx, colors, p, 0, true, 0);
        } else {
            // Fallback rectangle if drawing logic fails
            ctx.fillStyle = char.color;
            ctx.fillRect(0, 0, 30, 40);
        }
        
        ctx.restore();
        
        // Update Hit Area
        char.hitArea = {
            x: x - 10,
            y: y - 10,
            width: charSize + 20,
            height: charSize + 20
        };
    });
}

// Helper to darken/lighten hex color
function adjustColor(color, amount) {
    let usePound = false;
    if (color[0] == "#") {
        color = color.slice(1);
        usePound = true;
    }
    let num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amount;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amount;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6,'0');
}

// Draw pulsing start button
function drawCardStartButton(centerX, y, scale = 1) {
    const width = 200 * scale;
    const height = 50 * scale;
    const x = centerX - width/2;
    
    // Pixelated Button Style
    // Main color
    ctx.fillStyle = '#4CAF50'; 
    ctx.fillRect(x, y, width, height);
    
    // Highlights/Shadows (3D effect)
    const border = 4;
    
    // Light Top/Left
    ctx.fillStyle = '#81C784';
    ctx.fillRect(x, y, width, border);
    ctx.fillRect(x, y, border, height);
    
    // Dark Bottom/Right
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(x, y + height - border, width, border);
    ctx.fillRect(x + width - border, y, border, height);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial'; // Or use a pixel font if available
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('START RUN', centerX, y + 33);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
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
    // Use cached scores or fallback
    const scores = (globalScoresCache.length > 0) ? globalScoresCache : getHighScores();
    const lineHeight = 24;
    
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Show simple loading text if we think we're waiting
    if (scores.length === 0 && isLoadingScores) {
        ctx.fillStyle = '#AAA';
        ctx.fillText('Loading global scores...', centerX, startY + 20);
        return;
    }
    
    if (scores.length === 0) {
        ctx.fillStyle = '#AAA';
        ctx.fillText('No scores yet!', centerX, startY + 20);
        return;
    }
    
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
    
    // Handle Input Blur/Enter
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            isEditingName = false;
            localStorage.setItem('lastPlayerName', nameInput.value.trim() || 'Player');
        });
        
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                nameInput.blur(); // Will trigger blur handler above
            }
        });
    }
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
    
    // High Score Modal Interactions
    if (gameState === 'HIGHSCORE_MODAL') {
        // Check Close Button
        if (window.closeModalButton) {
            const btn = window.closeModalButton;
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                gameState = GAME_STATES.START_SCREEN;
                triggerHaptic(10);
                return;
            }
        }
        // Click outside to close
        gameState = GAME_STATES.START_SCREEN;
        return;
    }
    
    // Check Audio Controls (Available in Start Screen and Pause Menu)
    if ((gameState === GAME_STATES.START_SCREEN) || (gameState === GAME_STATES.PAUSED && wasPausedByUser)) {
        if (window.audioControls && typeof audioManager !== 'undefined') {
            const ac = window.audioControls;
            
            // Check Music
            if (x >= ac.music.x && x <= ac.music.x + ac.music.width &&
                y >= ac.music.y && y <= ac.music.y + ac.music.height) {
                audioManager.toggleMusic();
                triggerHaptic(10);
                return; // Stop propagation
            }
            
            // Check Sound
            if (x >= ac.sound.x && x <= ac.sound.x + ac.sound.width &&
                y >= ac.sound.y && y <= ac.sound.y + ac.sound.height) {
                audioManager.toggleSound();
                triggerHaptic(10);
                return; // Stop propagation
            }
        }
    }
    
    // Start screen interactions
    if (gameState === GAME_STATES.START_SCREEN) {
        // Check Name UI Interactions
        if (!isEditingName) {
            // Check Name Box (Enter Edit Mode)
            if (window.nameBoxHit && 
                x >= window.nameBoxHit.x && x <= window.nameBoxHit.x + window.nameBoxHit.width &&
                y >= window.nameBoxHit.y && y <= window.nameBoxHit.y + window.nameBoxHit.height) {
                
                isEditingName = true;
                triggerHaptic(10);
                return;
            }
            
            // Check Randomize Button
            if (window.randomizeHit && 
                x >= window.randomizeHit.x && x <= window.randomizeHit.x + window.randomizeHit.width &&
                y >= window.randomizeHit.y && y <= window.randomizeHit.y + window.randomizeHit.height) {
                
                // Generate new name
                if (typeof generateRandomName === 'function') {
                    const newName = generateRandomName();
                    const nameInput = document.getElementById('playerNameInput');
                    if (nameInput) {
                        nameInput.value = newName;
                        localStorage.setItem('lastPlayerName', newName);
                    }
                }
                triggerHaptic(15);
                return;
            }
        } else {
            // If editing, check if clicked outside to save
            // We let the blur event handle this usually, but we can force it here
            const nameInput = document.getElementById('playerNameInput');
            if (nameInput) {
                // If click is outside the input rect (approximate since input is DOM)
                // We can just rely on the fact that we processed a canvas click, meaning we likely clicked outside the input?
                // Actually, the input is on top of canvas. If we got here, we clicked canvas, so we clicked outside input.
                isEditingName = false;
                localStorage.setItem('lastPlayerName', nameInput.value.trim() || 'Player');
                nameInput.blur();
                return;
            }
        }

        // Check High Score Button
        if (window.highScoreButton) {
            const btn = window.highScoreButton;
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                
                // Open Modal and trigger fetch
                gameState = 'HIGHSCORE_MODAL';
                triggerHaptic(10);
                
                // Trigger fetch if old data
                if (Date.now() - lastScoreFetch > 60000) { // Cache for 1 min
                    isLoadingScores = true;
                    getGlobalHighScores().then(scores => {
                        globalScoresCache = scores;
                        isLoadingScores = false;
                        lastScoreFetch = Date.now();
                    });
                }
                return;
            }
        }

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

// Draw High Score Button
function drawHighScoreButton(x, y) {
    const width = 40;
    const height = 40;
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 2;
    ctx.fillText('🏆', x + width/2, y + 28);
    ctx.shadowBlur = 0;
    
    // Hit area
    window.highScoreButton = { x, y, width, height };
    ctx.textAlign = 'left';
}

// Draw High Score Modal
function drawHighScoreModal() {
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const width = Math.min(400, canvas.width - 40);
    const height = 500;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    
    // Modal Box
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 15);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LEADERBOARD', canvas.width/2, y + 50);
    
    // Close Button (X)
    ctx.fillStyle = '#FF4444';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('✕', x + width - 30, y + 40);
    window.closeModalButton = { x: x + width - 50, y: y + 10, width: 40, height: 40 };
    
    // List Content
    const scores = (globalScoresCache.length > 0) ? globalScoresCache : getLocalHighScores();
    
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    
    // Loading State
    if (isLoadingScores) {
         ctx.fillStyle = '#FFD700';
         ctx.fillText('Loading global scores...', canvas.width/2, y + 150);
    } else if (scores.length === 0) {
        ctx.fillText('No scores yet!', canvas.width/2, y + 150);
    } else {
        const startY = y + 100;
        const lineHeight = 35;
        
        scores.forEach((entry, i) => {
            if (i >= 10) return; // Show top 10
            
            const rank = i + 1;
            const color = rank === 1 ? '#FFD700' : (rank === 2 ? '#C0C0C0' : (rank === 3 ? '#CD7F32' : 'white'));
            
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.fillText(`${rank}. ${entry.name}`, x + 40, startY + i * lineHeight);
            
            ctx.textAlign = 'right';
            ctx.fillText(entry.score, x + width - 40, startY + i * lineHeight);
        });
    }
    
    ctx.textAlign = 'center';
    ctx.fillStyle = '#AAA';
    ctx.font = '14px Arial';
    ctx.fillText('Global scores sync automatically', canvas.width/2, y + height - 20);
    
    ctx.textAlign = 'left';
}

// Draw Audio Controls (Music & Sound toggles)
function drawAudioControls(x, y) {
    if (typeof audioManager === 'undefined') return;
    
    const size = 30;
    const gap = 10;
    
    // Music Toggle
    ctx.fillStyle = audioManager.musicEnabled ? '#4CAF50' : '#F44336';
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 5);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎵', x + size/2, y + 22);
    
    // Sound Toggle
    ctx.fillStyle = audioManager.soundEnabled ? '#4CAF50' : '#F44336';
    ctx.beginPath();
    ctx.roundRect(x + size + gap, y, size, size, 5);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = 'white';
    ctx.fillText('🔊', x + size + gap + size/2, y + 22);
    
    // Store hit areas
    window.audioControls = {
        music: { x: x, y: y, width: size, height: size },
        sound: { x: x + size + gap, y: y, width: size, height: size }
    };
    
    ctx.textAlign = 'left'; // Reset alignment
}

// Handle starting the game
function handleStartGame() {
    if (selectedCharacter) {
        startNewGame();
    }
}

// UI SCREENS - Start screen and Game Over screen

// Global state for async scores
let globalScoresCache = [];
let isLoadingScores = false;
let lastScoreFetch = 0;
let isEditingName = false; // Track if user is typing name

// Player stats display state
let activePlayerCount = 0;
let dailyPlayerCount = 0;
let lastStatsUpdate = 0;
let statsUpdateInterval = null;
let statsRealtimeSubscription = null;

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
    // Fetch global high scores on start screen (once, if cache is stale)
    if (typeof getGlobalHighScores === 'function' && (Date.now() - lastScoreFetch > 30000 || globalScoresCache.length === 0)) {
        isLoadingScores = true;
        getGlobalHighScores().then(scores => {
            globalScoresCache = scores;
            isLoadingScores = false;
            lastScoreFetch = Date.now();
        }).catch(err => {
            console.warn('Failed to fetch global scores:', err);
            isLoadingScores = false;
        });
    }
    
    const mobile = isMobile || canvas.width < 600;
    const center = canvas.width / 2;
    const h = canvas.height;
    
    // Layout Logic with better scaling for different heights
    const tight = h < 380;
    const compact = h <= 450;
    const veryCompact = h <= 520; // New breakpoint for desktop landscape
    
    const headerY = tight ? 25 : (compact ? 32 : (veryCompact ? 38 : 60));
    
    const layoutWidth = Math.min(canvas.width - 40, mobile ? canvas.width - 20 : 540);
    const layoutX = center - layoutWidth / 2;
    const panelCenterX = layoutX + layoutWidth / 2; // Center of the panel
    
    // Scale everything based on available height
    const topY = tight ? 45 : (compact ? 55 : (veryCompact ? 65 : 110));
    const namePanelHeight = tight ? 60 : (compact ? 65 : (veryCompact ? 68 : 72));
    const charPanelHeight = tight ? 130 : (compact ? 145 : (veryCompact ? 160 : 185));
    const panelGap = tight ? 10 : (compact ? 12 : (veryCompact ? 14 : 16));
    
    const namePanelY = topY;
    const charPanelY = namePanelY + namePanelHeight + panelGap;
    const selectionLabelY = charPanelY + (tight ? 16 : (compact ? 18 : (veryCompact ? 20 : 22)));
    const charRowTop = charPanelY + (tight ? 38 : (compact ? 42 : (veryCompact ? 46 : 52)));
    const characterNameY = charPanelY + charPanelHeight - (tight ? 20 : (compact ? 22 : (veryCompact ? 24 : 28)));
    const buttonY = charPanelY + charPanelHeight + (tight ? 15 : (compact ? 18 : (veryCompact ? 20 : 25)));
    
    drawSoftPanel(layoutX, namePanelY, layoutWidth, namePanelHeight, {
        fill: 'rgba(255, 255, 255, 0.92)',
        stroke: 'rgba(0, 0, 0, 0.12)',
        radius: veryCompact ? 14 : 18
    });
    
    drawSoftPanel(layoutX, charPanelY, layoutWidth, charPanelHeight, {
        fill: 'rgba(0, 0, 0, 0.35)',
        stroke: 'rgba(255, 255, 255, 0.2)',
        radius: veryCompact ? 16 : 20
    });
    
    drawNameEntryUI(panelCenterX, namePanelY + (tight ? 18 : (compact ? 20 : (veryCompact ? 22 : 24))), layoutWidth, {
        compact: tight || compact || veryCompact
    });
    
    if (typeof updateRipples === 'function') updateRipples();
    if (typeof drawRipples === 'function') drawRipples();
    
    ctx.fillStyle = 'white';
    ctx.font = `${tight ? 18 : (compact ? 20 : (veryCompact ? 22 : 24))}px "Press Start 2P"`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = tight ? 3 : 4;
    ctx.strokeText('ANIMAL JUMP', center, headerY);
    ctx.fillText('ANIMAL JUMP', center, headerY);
    
    drawAudioControls(canvas.width - 80, 20);
    drawHighScoreButton(20, 20);
    
    ctx.font = `bold ${tight ? 12 : (compact ? 13 : (veryCompact ? 14 : 16))}px "Press Start 2P"`;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = tight ? 3 : 4;
    ctx.textAlign = 'center';
    ctx.strokeText('SELECT RUNNER', panelCenterX, selectionLabelY);
    ctx.fillStyle = '#FFD700';
    ctx.fillText('SELECT RUNNER', panelCenterX, selectionLabelY);
    
    drawCardCharacterSelection(panelCenterX, charRowTop, {
        availableWidth: layoutWidth - 120,
        baseSize: tight ? 36 : (compact ? 40 : (veryCompact ? 44 : 46)),
        padding: tight ? 16 : (compact ? 18 : (veryCompact ? 20 : 24))
    });
    
    if (selectedCharacter) {
        ctx.font = `bold ${tight ? 14 : (compact ? 16 : (veryCompact ? 18 : 22))}px Arial`;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = tight ? 3 : 4;
        ctx.textAlign = 'center';
        ctx.strokeText(selectedCharacter.name.toUpperCase(), panelCenterX, characterNameY);
        ctx.fillStyle = 'white';
        ctx.fillText(selectedCharacter.name.toUpperCase(), panelCenterX, characterNameY);
    }
    
    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.03;
    drawCardStartButton(center, buttonY, pulse, { compact: tight || compact || veryCompact });
}

// Draw Name Entry UI (Text mode vs Edit mode)
function drawNameEntryUI(centerX, y, panelWidth = 320, options = {}) {
    const nameInput = document.getElementById('playerNameInput');
    const currentName = nameInput ? nameInput.value : (localStorage.getItem('lastPlayerName') || 'Player');
    const isCompact = options.compact || false;
    
    const boxWidth = Math.max(180, Math.min(panelWidth - 80, 280));
    const boxHeight = isCompact ? 32 : 40;
    const boxX = centerX - boxWidth / 2;
    const diceSize = isCompact ? 30 : 36;
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
    ctx.font = `${isCompact ? 8 : 10}px "Press Start 2P"`;
    ctx.textAlign = 'center';
    ctx.fillText('PLAYER NAME', centerX, boxTop - (isCompact ? 6 : 8));
    
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
        ctx.font = `${isCompact ? 13 : 16}px "Press Start 2P"`;
        ctx.textAlign = 'center';
        ctx.fillText(currentName, centerX, boxTop + (isCompact ? 22 : 28));
        
        // Draw Edit Icon (Pencil) - Right side of box
        const editX = boxX + boxWidth - 20;
        const editY = boxTop + boxHeight / 2;
        ctx.font = `${isCompact ? 13 : 16}px Arial`;
        ctx.textAlign = 'right';
        ctx.fillText('✎', editX, editY + 5);
        
        // Draw Randomize Button (Dice) - Next to box
        ctx.fillStyle = '#2ECC71';
        ctx.fillRect(diceX, diceY, diceSize, diceSize);
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 3;
        ctx.strokeRect(diceX, diceY, diceSize, diceSize);
        
        ctx.fillStyle = 'white';
        ctx.font = `${isCompact ? 16 : 20}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('🎲', diceX + diceSize / 2, diceY + (isCompact ? 22 : 26));
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
function drawCardStartButton(centerX, y, scale = 1, options = {}) {
    const isCompact = options.compact || false;
    const baseWidth = isCompact ? 160 : 200;
    const baseHeight = isCompact ? 42 : 50;
    
    const width = baseWidth * scale;
    const height = baseHeight * scale;
    const x = centerX - width/2;
    
    // Pixelated Button Style
    // Main color
    ctx.fillStyle = '#4CAF50'; 
    ctx.fillRect(x, y, width, height);
    
    // Highlights/Shadows (3D effect)
    const border = isCompact ? 3 : 4;
    
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
    ctx.font = `bold ${isCompact ? 16 : 20}px Arial`;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('START RUN', centerX, y + (isCompact ? 28 : 33));
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
        const gap = mobile ? 15 : 40;
        const maxTotalWidth = canvas.width - 40;
        const boxWidth = Math.min(340, (maxTotalWidth - gap) / 2);
        const boxHeight = mobile ? 240 : 280; // Increased to accommodate two-line entries
        
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
            // Draw list below banner - pass available width
            drawHighScoresList(canvas.width / 2, highScoreY + 30, mobile ? 3 : 5, boxWidth - 20);
            ctaY = highScoreY + (mobile ? 180 : 240); // Increased for two-line format
        } else {
            drawHighScoresList(canvas.width / 2, highScoreY, mobile ? 3 : 5, boxWidth - 20);
            ctaY = highScoreY + (mobile ? 150 : 200); // Increased for two-line format
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
    const mobile = isMobile || canvas.width < 600;
    const padding = mobile ? 15 : 25;
    
    // Box Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(leftX, y, width, height);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftX, y, width, height);
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = mobile ? 'bold 16px Arial' : 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCORE BREAKDOWN', centerX, y + (mobile ? 25 : 30));
    
    // Content
    ctx.fillStyle = 'white';
    ctx.font = mobile ? '13px Arial' : '15px Arial';
    ctx.textAlign = 'left';
    
    const contentLeft = leftX + padding;
    const contentRight = leftX + width - padding;
    const startContentY = y + (mobile ? 50 : 60);
    const lineH = mobile ? 24 : 28;

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
    ctx.font = mobile ? 'bold 18px Arial' : 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL:', contentLeft, startContentY + lineH * 3 + (mobile ? 12 : 15));
    ctx.textAlign = 'right';
    ctx.fillText(`${score} pts`, contentRight, startContentY + lineH * 3 + (mobile ? 12 : 15));
    
    // Mini Stat
    ctx.font = mobile ? '10px Arial' : '12px Arial';
    ctx.fillStyle = '#AAA';
    ctx.textAlign = 'center';
    ctx.fillText(`Best Combo: x${comboTracker.maxCombo}`, centerX, y + height - (mobile ? 10 : 15));
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
    const mobile = isMobile || canvas.width < 600;
    ctx.font = mobile ? 'bold 16px Arial' : 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HIGH SCORES', centerX, y + 30);
    
    // List - pass available width with extra padding for responsive layout
    const contentPadding = mobile ? 20 : 30;
    drawHighScoresList(centerX, y + 55, 5, width - contentPadding);
}

// Helper: Draw the list of high scores
function drawHighScoresList(centerX, startY, limit = 5, availableWidth = null) {
    // Use cached scores or fallback
    const scores = (globalScoresCache.length > 0) ? globalScoresCache : getHighScores();
    
    // Calculate responsive width - use availableWidth if provided, otherwise adapt to canvas
    const mobile = isMobile || canvas.width < 600;
    const maxWidth = availableWidth || Math.min(canvas.width - 40, mobile ? canvas.width - 20 : 500);
    // Increased padding significantly to prevent edge bleeding
    // Use larger padding: 25px on mobile, 40px on desktop
    const padding = mobile ? 25 : 40;
    const contentWidth = Math.max(150, maxWidth - (padding * 2));
    
    // Responsive font sizes
    const fontSize = mobile ? 12 : 14;
    const fontSizeBold = mobile ? 13 : 15;
    const fontSizeSmall = mobile ? 9 : 11;
    const lineHeight = mobile ? 36 : 42;
    
    ctx.font = `${fontSize}px Arial`;
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
        
        // Check if this is the current player's most recent score
        // We match by exact score, name, and check if it's very recent (within 1 second)
        const isCurrentRun = player && 
                           scoreEntry.name === player.name && 
                           scoreEntry.score === score &&
                           (scoreEntry.obstaclesCleared === scoreStats.obstaclesCleared || 
                            !scoreEntry.obstaclesCleared);
        
        // Calculate text positions based on available width with extra margin
        const leftX = centerX - (contentWidth / 2);
        const rightX = centerX + (contentWidth / 2);
        // Add significant margin on right side for score to prevent edge bleeding
        const rightMargin = mobile ? 10 : 15;
        const scoreRightX = rightX - rightMargin;
        
        // Ensure positions don't exceed bounds
        const minLeftX = centerX - (contentWidth / 2);
        const maxRightX = centerX + (contentWidth / 2) - rightMargin;
        
        // Line 1: Rank, Name, Score
        ctx.textAlign = 'left';
        ctx.font = isCurrentRun ? `bold ${fontSizeBold}px Arial` : `${fontSize}px Arial`;
        
        // Highlight background for current run
        if (isCurrentRun) {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
            ctx.fillRect(leftX - 5, y - 16, contentWidth + 10, lineHeight - 4);
        }
        
        ctx.fillStyle = isCurrentRun ? '#FFD700' : 'white';
        const rankIcon = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `${index + 1}.`));
        
        // Truncate name if too long - leave more space for score
        let displayName = scoreEntry.name;
        const maxNameLength = mobile ? 6 : 10;
        if (displayName.length > maxNameLength) {
            displayName = displayName.substring(0, maxNameLength - 1) + '…';
        }
        
        ctx.fillText(`${rankIcon} ${displayName}`, leftX, y);
        
        // Score on the right - use margin to prevent edge bleeding
        ctx.textAlign = 'right';
        // Use shorter text on mobile to save space
        const scoreText = mobile ? `${scoreEntry.score}` : `${scoreEntry.score}`;
        ctx.fillText(scoreText, scoreRightX, y);
        
        // Line 2: Level, Obstacles, Time (secondary info)
        ctx.font = `${fontSizeSmall}px Arial`;
        ctx.fillStyle = isCurrentRun ? '#FFD700' : '#AAA';
        ctx.textAlign = 'center';
        
        const levelText = scoreEntry.level ? `📊 Lvl ${scoreEntry.level}` : '';
        const obstaclesText = (scoreEntry.obstaclesCleared !== undefined && scoreEntry.obstaclesCleared !== null) 
            ? `⚡ ${scoreEntry.obstaclesCleared}` 
            : '';
        
        // Time formatting
        let timeText = '';
        if (scoreEntry.time) {
            const m = Math.floor(scoreEntry.time / 60);
            const s = Math.floor(scoreEntry.time % 60);
            timeText = `⏱ ${m}:${s.toString().padStart(2, '0')}`;
        }
        
        // Build second line with spacing based on available width
        const secondLineParts = [levelText, obstaclesText, timeText].filter(t => t);
        const separator = mobile ? ' • ' : '  •  ';
        const secondLine = secondLineParts.join(separator);
        
        // Truncate second line if too long
        ctx.save();
        ctx.font = `${fontSizeSmall}px Arial`;
        const metrics = ctx.measureText(secondLine);
        if (metrics.width > contentWidth - 10) {
            // If too long, show only first two parts
            const shortParts = secondLineParts.slice(0, 2);
            ctx.fillText(shortParts.join(separator), centerX, y + 15);
        } else {
            ctx.fillText(secondLine, centerX, y + 15);
        }
        ctx.restore();
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
                
                // Track character selection
                if (typeof Analytics !== 'undefined') {
                    Analytics.trackCharacterSelect(char);
                }
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
    
    const mobile = isMobile || canvas.width < 600;
    // Ensure modal stays well within canvas bounds
    // Use larger margins: at least 20px on mobile, 40px on desktop
    const minMargin = mobile ? 20 : 40;
    const maxHeightMargin = mobile ? 30 : 40;
    
    // Calculate max available width and height
    const maxAvailableWidth = canvas.width - (minMargin * 2);
    const maxAvailableHeight = canvas.height - (maxHeightMargin * 2);
    
    // Set modal dimensions - ensure they never exceed available space
    const preferredWidth = mobile ? Math.min(350, maxAvailableWidth) : Math.min(400, maxAvailableWidth);
    const preferredHeight = mobile ? Math.min(450, maxAvailableHeight) : Math.min(520, maxAvailableHeight);
    
    const width = Math.min(preferredWidth, maxAvailableWidth);
    const height = Math.min(preferredHeight, maxAvailableHeight);
    
    // Center the modal with proper margins
    const x = Math.max(minMargin, (canvas.width - width) / 2);
    const y = Math.max(maxHeightMargin / 2, (canvas.height - height) / 2);
    
    // Ensure modal doesn't exceed canvas bounds
    const finalX = Math.min(x, canvas.width - width - minMargin);
    const finalY = Math.min(y, canvas.height - height - maxHeightMargin / 2);
    
    // Modal Box
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.roundRect(finalX, finalY, width, height, mobile ? 10 : 15);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = mobile ? 'bold 22px Arial' : 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LEADERBOARD', finalX + width/2, finalY + (mobile ? 40 : 50));
    
    // Close Button (X) - ensure it's within bounds
    const closeButtonPadding = mobile ? 15 : 20;
    ctx.fillStyle = '#FF4444';
    ctx.font = mobile ? 'bold 20px Arial' : 'bold 24px Arial';
    ctx.fillText('✕', finalX + width - closeButtonPadding, finalY + (mobile ? 30 : 40));
    window.closeModalButton = { 
        x: finalX + width - (mobile ? 40 : 45), 
        y: finalY + 10, 
        width: mobile ? 30 : 35, 
        height: mobile ? 30 : 35 
    };
    
    // List Content - use responsive drawHighScoresList function
    const scores = (globalScoresCache.length > 0) ? globalScoresCache : getLocalHighScores();
    
    // Loading State
    if (isLoadingScores) {
        ctx.fillStyle = '#FFD700';
        ctx.font = mobile ? '14px Arial' : '16px Arial';
        ctx.fillText('Loading global scores...', finalX + width/2, finalY + 150);
    } else if (scores.length === 0) {
        ctx.fillStyle = 'white';
        ctx.font = mobile ? '14px Arial' : '16px Arial';
        ctx.fillText('No scores yet!', finalX + width/2, finalY + 150);
    } else {
        const startY = finalY + (mobile ? 80 : 100);
        const maxEntries = mobile ? 8 : 10;
        
        // Use the responsive drawHighScoresList function
        // Pass width minus extra padding to ensure content doesn't touch edges
        // Use larger padding: 50px on desktop, 30px on mobile
        const contentPadding = mobile ? 30 : 50;
        const contentWidth = Math.max(200, width - contentPadding);
        drawHighScoresList(finalX + width/2, startY, maxEntries, contentWidth);
    }
    
    ctx.textAlign = 'center';
    ctx.fillStyle = '#AAA';
    ctx.font = mobile ? '11px Arial' : '14px Arial';
    ctx.fillText('Global scores sync automatically', finalX + width/2, finalY + height - (mobile ? 15 : 20));
    
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

// Draw Level Transition Screen (NES-inspired)
function drawLevelTransitionScreen() {
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Get elapsed time for animation
    const elapsed = Date.now() - levelTransitionStartTime;
    const showStats = elapsed > 500; // Delay stats slightly
    const showCountdown = elapsed > 3000; // Countdown after 3 seconds
    
    // --- HEADER ---
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    const headerText = `LEVEL ${levelManager.currentLevel} COMPLETE!`;
    ctx.fillText(headerText, centerX, 80);
    
    // --- STATS PANEL ---
    if (showStats) {
        const panelWidth = 400;
        const panelHeight = 220;
        const panelX = centerX - panelWidth / 2;
        const panelY = 120;
        
        // Panel background
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        
        // Panel border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // Inner border for NES look
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX + 8, panelY + 8, panelWidth - 16, panelHeight - 16);
        
        // Stats title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('LEVEL STATS', centerX, panelY + 35);
        
        // Stats content
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        const leftX = panelX + 40;
        const rightX = panelX + panelWidth - 40;
        let lineY = panelY + 65;
        const lineHeight = 28;
        
        // Time
        const levelTime = Math.floor(lastLevelStats.duration);
        const minutes = Math.floor(levelTime / 60);
        const seconds = levelTime % 60;
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText('Time:', leftX, lineY);
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'right';
        ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, rightX, lineY);
        
        // Obstacles
        lineY += lineHeight;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText('Obstacles Cleared:', leftX, lineY);
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'right';
        ctx.fillText(`${lastLevelStats.obstaclesCleared}`, rightX, lineY);
        
        // Points
        lineY += lineHeight;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText('Level Score:', leftX, lineY);
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'right';
        ctx.fillText(`${levelManager.getPointsRequired()} pts`, rightX, lineY);
        
        // Separator
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX, lineY + 12);
        ctx.lineTo(rightX, lineY + 12);
        ctx.stroke();
        
        // Total score
        lineY += lineHeight + 10;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('TOTAL:', leftX, lineY);
        ctx.textAlign = 'right';
        ctx.fillText(`${score} pts`, rightX, lineY);
    }
    
    // --- NEXT LEVEL PREVIEW ---
    if (showCountdown) {
        const nextLevel = levelManager.currentLevel + 1;
        const nextTheme = levelManager.getNextTheme();
        
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('GET READY FOR', centerX, centerY + 80);
        
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`LEVEL ${nextLevel}`, centerX, centerY + 120);
        
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = getThemeColor(nextTheme);
        ctx.fillText(nextTheme.name, centerX, centerY + 150);
        
        // Countdown
        ctx.font = 'bold 72px Arial';
        ctx.fillStyle = '#FF4444';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        
        if (levelTransitionCountdown > 0) {
            ctx.strokeText(levelTransitionCountdown, centerX, centerY + 220);
            ctx.fillText(levelTransitionCountdown, centerX, centerY + 220);
        }
    }
    
    ctx.textAlign = 'left';
}

// Get representative color for theme
function getThemeColor(theme) {
    if (theme.id === 'desert') return '#FFA726';
    if (theme.id === 'night') return '#3F51B5';
    if (theme.id === 'ice') return '#4FC3F7';
    if (theme.id === 'volcano') return '#FF5722';
    if (theme.id === 'sky') return '#81D4FA';
    return '#6ABE30'; // grassland
}

// Handle starting the game
function handleStartGame() {
    if (selectedCharacter) {
        startNewGame();
    }
}

// Draw player stats below canvas
function drawPlayerStats() {
    if (typeof canvas === 'undefined' || !canvas) return;
    
    const statsDiv = document.getElementById('player-stats');
    if (!statsDiv) return;
    
    // Update stats text
    const statsText = `👥 ${activePlayerCount} playing now • 📊 ${dailyPlayerCount} played today`;
    statsDiv.textContent = statsText;
}

// Update player stats periodically
async function updatePlayerStats() {
    if (typeof SupabaseClient === 'undefined' || !SupabaseClient.initialized) {
        return;
    }
    
    try {
        // Update active player count
        const activeCount = await SupabaseClient.getActivePlayerCount();
        activePlayerCount = activeCount;
        
        // Update daily player count
        const dailyCount = await SupabaseClient.getDailyPlayerCount();
        dailyPlayerCount = dailyCount;
        
        // Update display
        drawPlayerStats();
        
        lastStatsUpdate = Date.now();
    } catch (e) {
        console.error('Error updating player stats:', e);
    }
}

// Initialize player stats display
function initPlayerStatsDisplay() {
    // Initial update
    updatePlayerStats();
    
    // Set up periodic updates (every 5 seconds)
    if (statsUpdateInterval) {
        clearInterval(statsUpdateInterval);
    }
    statsUpdateInterval = setInterval(() => {
        updatePlayerStats();
    }, 5000);
    
    // Set up Realtime subscription for active players (if available)
    if (typeof SupabaseClient !== 'undefined' && SupabaseClient.initialized) {
        if (statsRealtimeSubscription) {
            // Unsubscribe existing
            if (typeof statsRealtimeSubscription.unsubscribe === 'function') {
                statsRealtimeSubscription.unsubscribe();
            }
        }
        
        statsRealtimeSubscription = SupabaseClient.subscribeToActivePlayers((count) => {
            activePlayerCount = count;
            drawPlayerStats();
        });
    }
}

// Cleanup player stats display
function cleanupPlayerStatsDisplay() {
    if (statsUpdateInterval) {
        clearInterval(statsUpdateInterval);
        statsUpdateInterval = null;
    }
    
    if (statsRealtimeSubscription) {
        if (typeof statsRealtimeSubscription.unsubscribe === 'function') {
            statsRealtimeSubscription.unsubscribe();
        }
        statsRealtimeSubscription = null;
    }
}

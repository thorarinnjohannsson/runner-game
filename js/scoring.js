// SCORING ENGINE - Sophisticated scoring with combos, bonuses, and feedback

// Combo Tracker Class
class ComboTracker {
    constructor() {
        this.count = 0;
        this.multiplier = 1.0;
        this.maxCombo = 0;
        this.lastComboTime = 0;
    }
    
    increment() {
        this.count++;
        this.multiplier = Math.min(5.0, Math.pow(1.5, this.count - 1));
        this.maxCombo = Math.max(this.maxCombo, this.count);
        this.lastComboTime = Date.now();
    }
    
    reset() {
        this.count = 0;
        this.multiplier = 1.0;
    }
    
    get display() {
        return this.count > 1 ? `COMBO x${this.count}!` : '';
    }
    
    get active() {
        return this.count > 1;
    }
}

// Score Popup Class
class ScorePopup {
    constructor(x, y, points, bonusText) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.points = points;
        this.bonusText = bonusText; // "AERIAL!", "PERFECT!", etc.
        this.life = 1.0;
        this.velocityY = -1; // Float upward
        this.age = 0;
    }
    
    update() {
        this.y += this.velocityY;
        this.life -= 0.015;
        this.age++;
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        
        // Color based on points (green → yellow → gold → orange)
        let color = '#44FF44'; // Green for low
        if (this.points >= 200) color = '#FF8844'; // Orange for huge
        else if (this.points >= 100) color = '#FFD700'; // Gold for high
        else if (this.points >= 50) color = '#FFFF44'; // Yellow for medium
        
        // Main score
        ctx.fillStyle = color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        
        // Only show +points if > 0
        if (this.points > 0) {
            ctx.strokeText(`+${this.points}`, this.x, this.y);
            ctx.fillText(`+${this.points}`, this.x, this.y);
        }
        
        // Bonus text (smaller)
        if (this.bonusText) {
            // If points are 0 (milestone), make text larger and centered
            if (this.points === 0) {
                ctx.font = 'bold 32px Arial';
                ctx.fillStyle = '#FFD700'; // Gold
                ctx.strokeText(this.bonusText, this.x, this.y);
                ctx.fillText(this.bonusText, this.x, this.y);
            } else {
                // Normal bonus text below score
                ctx.font = 'bold 14px Arial';
                ctx.strokeText(this.bonusText, this.x, this.y + 22);
                ctx.fillText(this.bonusText, this.x, this.y + 22);
            }
        }
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Score Statistics Tracker
class ScoreStats {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.timePoints = 0;
        this.obstaclePoints = 0;
        this.bonusPoints = 0;
        this.obstaclesCleared = 0;
        this.totalJumps = 0;
        this.aerialClears = 0;
        this.platformLandings = 0;
        this.perfectTimings = 0;
        this.closeCalls = 0;
    }
    
    get totalScore() {
        return this.timePoints + this.obstaclePoints + this.bonusPoints;
    }
    
    get avgPointsPerObstacle() {
        return this.obstaclesCleared > 0 ? 
            Math.floor(this.obstaclePoints / this.obstaclesCleared) : 0;
    }
}

// Global scoring objects
let comboTracker = new ComboTracker();
let scorePopups = [];
let scoreStats = new ScoreStats();
let lastMilestone = 0;

// Point values
const POINTS = {
    // Base obstacle clear points
    obstacle: [0, 25, 50, 100, 200], // Index = obstacle level
    
    // Time survival
    perSecond: 5,
    
    // Jump type bonuses
    aerial: 20,
    perfect: 30,
    platform: 10,
    
    // Style bonuses
    efficient: 15,  // Using minimal jumps
    aggressive: 25, // Using all jumps
    closeCall: 40   // Barely clearing
};

// Milestones
const MILESTONES = [
    { score: 500, title: "Getting Started!", icon: "🌟" },
    { score: 1000, title: "Skilled Runner!", icon: "⭐" },
    { score: 2500, title: "Master Jumper!", icon: "🏅" },
    { score: 5000, title: "Legendary!", icon: "🏆" },
    { score: 10000, title: "UNSTOPPABLE!", icon: "👑" }
];

// Calculate score for clearing an obstacle
function calculateObstacleScore(obstacle, clearType, jumpsUsed, wasAtPeak) {
    // Base points by obstacle level
    const basePoints = POINTS.obstacle[obstacle.level] || 0;
    
    // Jump type bonus
    let jumpBonus = 0;
    let bonusText = '';
    
    if (clearType === 'aerial') {
        jumpBonus += POINTS.aerial;
        bonusText = 'AERIAL!';
    } else if (clearType === 'platform') {
        jumpBonus += POINTS.platform;
        bonusText = 'PLATFORM!';
    }
    
    if (wasAtPeak && clearType !== 'ground') {
        jumpBonus += POINTS.perfect - (clearType === 'aerial' ? POINTS.aerial : 0);
        bonusText = 'PERFECT!';
    }
    
    // Style bonus
    let styleBonus = 0;
    if (jumpsUsed === 1) {
        styleBonus = POINTS.efficient;
        bonusText = bonusText || 'EFFICIENT!';
    } else if (jumpsUsed === 3) {
        styleBonus = POINTS.aggressive;
        bonusText = bonusText || 'AGGRESSIVE!';
    }
    
    // Close call bonus
    if (obstacle.closeCall) {
        styleBonus += POINTS.closeCall;
        bonusText = 'CLOSE CALL!';
    }
    
    // Apply combo multiplier
    const subtotal = basePoints + jumpBonus + styleBonus;
    const total = Math.floor(subtotal * comboTracker.multiplier);
    
    // Update stats
    scoreStats.obstaclePoints += total;
    scoreStats.obstaclesCleared++;
    scoreStats.bonusPoints += Math.floor((jumpBonus + styleBonus) * comboTracker.multiplier);
    
    if (clearType === 'aerial') scoreStats.aerialClears++;
    if (clearType === 'platform') scoreStats.platformLandings++;
    if (wasAtPeak) scoreStats.perfectTimings++;
    if (obstacle.closeCall) scoreStats.closeCalls++;
    
    return {
        base: basePoints,
        jump: jumpBonus,
        style: styleBonus,
        combo: comboTracker.multiplier,
        total: total,
        bonusText: bonusText
    };
}

// Create score popup
function createScorePopup(x, y, points, bonusText) {
    scorePopups.push(new ScorePopup(x, y, points, bonusText));
}

// Update score popups
function updateScorePopups() {
    for (let i = scorePopups.length - 1; i >= 0; i--) {
        scorePopups[i].update();
        if (scorePopups[i].isDead()) {
            scorePopups.splice(i, 1);
        }
    }
}

// Draw score popups
function drawScorePopups() {
    scorePopups.forEach(popup => popup.draw(ctx));
}

// Check for milestone achievements
function checkMilestones(currentScore) {
    for (let milestone of MILESTONES) {
        if (currentScore >= milestone.score && lastMilestone < milestone.score) {
            lastMilestone = milestone.score;
            showMilestone(milestone);
            break;
        }
    }
}

// Show milestone celebration
function showMilestone(milestone) {
    // Create special popup at center
    createScorePopup(canvas.width / 2, canvas.height / 2, 0, `${milestone.icon} ${milestone.title}`);
    
    // Play special sound
    if (typeof playSound === 'function') {
        playSound('gameOver'); // Reuse as celebration sound
    }
    
    // Create particle burst
    if (typeof createParticleExplosion === 'function') {
        createParticleExplosion(canvas.width / 2, canvas.height / 2, '#FFD700');
    }
}

// Update time-based score
function updateTimeScore(deltaTime) {
    const pointsToAdd = Math.floor(deltaTime * POINTS.perSecond);
    if (pointsToAdd > 0) {
        scoreStats.timePoints += pointsToAdd;
    }
}

// Reset scoring for new game
function resetScoring() {
    comboTracker = new ComboTracker();
    scorePopups = [];
    scoreStats.reset();
    lastMilestone = 0;
}


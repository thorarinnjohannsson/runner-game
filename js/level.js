// LEVEL SYSTEM - Track level progression and manage level state

// Level state class
class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.levelStartScore = 0; // Score at the start of current level
        this.levelStartTime = 0;
        this.highestLevelReached = parseInt(localStorage.getItem('highestLevel')) || 1;
    }
    
    // Get points required to complete current level
    getPointsRequired() {
        return this.currentLevel * 1500; // Tripled for longer, more engaging levels
    }
    
    // Get points earned in current level
    getLevelProgress(currentScore) {
        return currentScore - this.levelStartScore;
    }
    
    // Check if level is complete
    isLevelComplete(currentScore) {
        return this.getLevelProgress(currentScore) >= this.getPointsRequired();
    }
    
    // Get progress percentage for HUD
    getProgressPercent(currentScore) {
        const progress = this.getLevelProgress(currentScore);
        const required = this.getPointsRequired();
        return Math.min(100, (progress / required) * 100);
    }
    
    // Start a new level
    startLevel(level, currentScore, currentTime) {
        this.currentLevel = level;
        this.levelStartScore = currentScore;
        this.levelStartTime = currentTime;
        
        // Update highest level reached
        if (level > this.highestLevelReached) {
            this.highestLevelReached = level;
            localStorage.setItem('highestLevel', level);
        }
    }
    
    // Get time spent in current level
    getLevelTime(currentTime) {
        return currentTime - this.levelStartTime;
    }
    
    // Advance to next level
    advanceLevel(currentScore, currentTime) {
        this.currentLevel++;
        this.levelStartScore = currentScore;
        this.levelStartTime = currentTime;
        
        // Update highest level reached
        if (this.currentLevel > this.highestLevelReached) {
            this.highestLevelReached = this.currentLevel;
            localStorage.setItem('highestLevel', this.currentLevel);
        }
    }
    
    // Reset for new game
    reset() {
        this.currentLevel = 1;
        this.levelStartScore = 0;
        this.levelStartTime = 0;
    }
    
    // Get current theme for this level
    getCurrentTheme() {
        return getThemeForLevel(this.currentLevel);
    }
    
    // Get next theme
    getNextTheme() {
        return getThemeForLevel(this.currentLevel + 1);
    }
}

// Global level manager instance
let levelManager = new LevelManager();

// Level-specific stats tracking
class LevelStats {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.obstaclesCleared = 0;
        this.timePoints = 0;
        this.obstaclePoints = 0;
        this.bonusPoints = 0;
        this.startTime = 0;
        this.endTime = 0;
    }
    
    get totalPoints() {
        return this.timePoints + this.obstaclePoints + this.bonusPoints;
    }
    
    get duration() {
        return this.endTime - this.startTime;
    }
    
    // Copy current game stats as level stats
    captureFromGameStats(gameStats, startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        // These are deltas from the level start
        this.obstaclesCleared = gameStats.obstaclesCleared;
        this.timePoints = gameStats.timePoints;
        this.obstaclePoints = gameStats.obstaclePoints;
        this.bonusPoints = gameStats.bonusPoints;
    }
}

// Current level stats
let currentLevelStats = new LevelStats();

// Store stats for last completed level (for transition screen)
let lastLevelStats = new LevelStats();


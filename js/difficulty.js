// DIFFICULTY SCALING

// Difficulty constants
const BASE_SPEED = 6.0; // Reduced from 6.5 for smoother start
const BASE_INTERVAL = 1400; // Decreased from 1600
const MAX_DIFFICULTY_TIME = 120; // Decreased from 150 (Scales faster)

// Current difficulty values
let gameSpeed = BASE_SPEED;
let multiLevelChance = 0.15; // Start at 15% chance
let floatingChance = 0.3; // Start at 30% chance
let terrainChance = 0; // Chance of elevated terrain

// Get difficulty multiplier based on time and level
function getDifficultyMultiplier(timeElapsed) {
    // Progress from 0 to 1 over MAX_DIFFICULTY_TIME
    const progress = Math.min(timeElapsed / MAX_DIFFICULTY_TIME, 1);
    
    // Gentler ease-in curve for smoother progression
    const easedProgress = Math.pow(progress, 1.5); // Cubic root for gentler curve
    
    // Base multiplier from 1x to 1.6x (Further reduced max speed scaling)
    let multiplier = 1 + easedProgress * 0.6;
    
    // Add level-based multiplier (1% per level for very gradual increase)
    // This ensures levels don't get too fast too quickly
    if (typeof levelManager !== 'undefined') {
        const levelBonus = 1 + (levelManager.currentLevel - 1) * 0.01;
        multiplier *= levelBonus;
    }
    
    // Cap max speed multiplier to 2.0x total (reduced from 2.5x)
    return Math.min(multiplier, 2.0);
}

// Update difficulty based on elapsed time and current level
function updateDifficulty(timeElapsed) {
    const mult = getDifficultyMultiplier(timeElapsed);
    const progress = Math.min(timeElapsed / MAX_DIFFICULTY_TIME, 1);
    
    // Update game speed
    gameSpeed = BASE_SPEED * mult;
    
    // Update spawn interval (decreases as speed increases to maintain density)
    // More gradual decrease to avoid overwhelming players
    spawnInterval = (BASE_INTERVAL * 0.95) / mult;
    
    // Update multi-level obstacle chance (15% to 70%) - reduced max
    // More gradual scaling for obstacle complexity
    multiLevelChance = 0.15 + (mult - 1) * 0.55; 
    
    // Update floating platform chance (30% to 65%) - reduced max
    // Ramps up more gradually
    floatingChance = 0.3 + progress * 0.35;
    
    // Update terrain chance (0% to 20%) - reduced max
    // Start introducing after 15% progress (slower)
    terrainChance = Math.max(0, (progress - 0.15) * 0.24);
}

// Reset difficulty (for new game)
function resetDifficulty() {
    gameSpeed = BASE_SPEED;
    spawnInterval = BASE_INTERVAL;
    multiLevelChance = 0.15;
    floatingChance = 0.3;
    terrainChance = 0;
    lastSpawnTime = Date.now();
}

// Reset difficulty for new level (slight boost but give player breathing room)
function resetDifficultyForNewLevel() {
    // Apply level multiplier but reset time-based scaling
    const levelBonus = (typeof levelManager !== 'undefined') ? (1 + (levelManager.currentLevel - 1) * 0.01) : 1;
    
    gameSpeed = BASE_SPEED * levelBonus;
    spawnInterval = (BASE_INTERVAL * 1.05) / levelBonus; // Start each level slightly easier
    multiLevelChance = 0.15 + (levelManager.currentLevel * 0.03); // Gentler initial complexity boost per level
    floatingChance = 0.3;
    terrainChance = 0;
    
    // Reset spawn timing
    lastSpawnTime = Date.now();
}


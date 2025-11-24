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
    
    // Ease-in curve for smoother progression
    const easedProgress = progress * progress;
    
    // Base multiplier from 1x to 2.0x (Reduced max speed scaling)
    let multiplier = 1 + easedProgress * 1.0;
    
    // Add level-based multiplier (2% per level instead of 4%)
    // This ensures levels don't get too fast too quickly
    if (typeof levelManager !== 'undefined') {
        const levelBonus = 1 + (levelManager.currentLevel - 1) * 0.02;
        multiplier *= levelBonus;
    }
    
    // Cap max speed multiplier to 2.5x total
    return Math.min(multiplier, 2.5);
}

// Update difficulty based on elapsed time and current level
function updateDifficulty(timeElapsed) {
    const mult = getDifficultyMultiplier(timeElapsed);
    const progress = Math.min(timeElapsed / MAX_DIFFICULTY_TIME, 1);
    
    // Update game speed
    gameSpeed = BASE_SPEED * mult;
    
    // Update spawn interval (decreases as speed increases to maintain density)
    // Made slightly more aggressive to increase density at lower speeds
    spawnInterval = (BASE_INTERVAL * 0.9) / mult;
    
    // Update multi-level obstacle chance (15% to 85%)
    // Increased scaling to rely heavily on obstacle complexity
    multiLevelChance = 0.15 + (mult - 1) * 0.8; 
    
    // Update floating platform chance (30% to 80%)
    // Ramps up significantly
    floatingChance = 0.3 + progress * 0.5;
    
    // Update terrain chance (0% to 30%)
    // Start introducing after 10% progress
    terrainChance = Math.max(0, (progress - 0.10) * 0.30);
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
    const levelBonus = (typeof levelManager !== 'undefined') ? (1 + (levelManager.currentLevel - 1) * 0.02) : 1;
    
    gameSpeed = BASE_SPEED * levelBonus;
    spawnInterval = BASE_INTERVAL / levelBonus;
    multiLevelChance = 0.15 + (levelManager.currentLevel * 0.05); // Initial complexity boost per level
    floatingChance = 0.3;
    terrainChance = 0;
    
    // Reset spawn timing
    lastSpawnTime = Date.now();
}


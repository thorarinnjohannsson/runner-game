// DIFFICULTY SCALING

// Difficulty constants
const BASE_SPEED = 6.5; // Increased from 5
const BASE_INTERVAL = 1400; // Decreased from 1600
const MAX_DIFFICULTY_TIME = 120; // Decreased from 150 (Scales faster)

// Current difficulty values
let gameSpeed = BASE_SPEED;
let multiLevelChance = 0.15; // Start at 15% chance
let floatingChance = 0.3; // Start at 30% chance
let terrainChance = 0; // Chance of elevated terrain

// Get difficulty multiplier based on time
function getDifficultyMultiplier(timeElapsed) {
    // Progress from 0 to 1 over MAX_DIFFICULTY_TIME
    const progress = Math.min(timeElapsed / MAX_DIFFICULTY_TIME, 1);
    
    // Ease-in curve for smoother progression
    const easedProgress = progress * progress;
    
    // Multiply from 1x to 2.5x
    return 1 + easedProgress * 1.5;
}

// Update difficulty based on elapsed time
function updateDifficulty(timeElapsed) {
    const mult = getDifficultyMultiplier(timeElapsed);
    const progress = Math.min(timeElapsed / MAX_DIFFICULTY_TIME, 1);
    
    // Update game speed
    gameSpeed = BASE_SPEED * mult;
    
    // Update spawn interval (faster spawning)
    spawnInterval = BASE_INTERVAL / mult;
    
    // Update multi-level obstacle chance (15% to 75%)
    multiLevelChance = 0.15 + (mult - 1) * 0.4;
    
    // Update floating platform chance (30% to 60%)
    floatingChance = 0.3 + progress * 0.3;
    
    // Update terrain chance (0% to 20%)
    // Start introducing after 15% progress
    terrainChance = Math.max(0, (progress - 0.15) * 0.25);
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


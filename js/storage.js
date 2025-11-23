// HIGH SCORE STORAGE with error handling and fallback

// Fallback in-memory storage
let memoryHighScores = [];

// Check if localStorage is available
function isStorageAvailable() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// Save a high score
function saveHighScore(name, score) {
    const scores = getHighScores();
    
    const newScore = {
        name: name || 'Anonymous',
        score: score,
        date: new Date().toLocaleDateString()
    };
    
    scores.push(newScore);
    
    // Sort by score (descending) and keep top 5
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, 5);
    
    if (isStorageAvailable()) {
        try {
            localStorage.setItem('runnerHighScores', JSON.stringify(topScores));
        } catch (e) {
            console.warn('Failed to save high scores to localStorage:', e);
            memoryHighScores = topScores; // Fallback
        }
    } else {
        memoryHighScores = topScores;
    }
}

// Get all high scores
function getHighScores() {
    if (isStorageAvailable()) {
        try {
            const scoresJson = localStorage.getItem('runnerHighScores');
            if (scoresJson) {
                const scores = JSON.parse(scoresJson);
                // Sync memory cache
                memoryHighScores = scores;
                return scores;
            }
        } catch (e) {
            console.warn('Failed to read high scores from localStorage:', e);
        }
    }
    
    return memoryHighScores || [];
}

// Check if score is a new high score
function isNewHighScore(score) {
    const scores = getHighScores();
    
    if (scores.length < 5) {
        return true;
    }
    
    return score > scores[scores.length - 1].score;
}

// Clear all high scores (for testing)
function clearHighScores() {
    if (isStorageAvailable()) {
        localStorage.removeItem('runnerHighScores');
    }
    memoryHighScores = [];
}


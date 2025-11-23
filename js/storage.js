// HIGH SCORE STORAGE with GLOBAL API support
// Uses a simple external API or local storage as fallback

// API Configuration
// Since we don't have a dedicated backend, we will simulate the structure 
// or use a free service like KV/Firebase if provided. 
// For now, we will stick to localStorage but structure it to be easily swapped.
// To share scores across devices, we would need a real backend.
// I will implement a mock "Global" storage using a shared key if possible, 
// but without a server, cross-device is impossible.
// HOWEVER, I can provide the code structure to Fetch from an endpoint.

const API_URL = ''; // Enter your API endpoint here if you have one (e.g., AWS Lambda / Firebase)

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

// Save a high score (Local + Global attempt)
async function saveHighScore(name, score) {
    // 1. Local Save
    const localScores = getLocalHighScores();
    const newScore = {
        name: name || 'Anonymous',
        score: score,
        date: new Date().toISOString()
    };
    
    localScores.push(newScore);
    localScores.sort((a, b) => b.score - a.score);
    const topLocal = localScores.slice(0, 10); // Keep top 10 locally
    
    if (isStorageAvailable()) {
        localStorage.setItem('runnerHighScores', JSON.stringify(topLocal));
    } else {
        memoryHighScores = topLocal;
    }

    // 2. Global Save (Placeholder for API)
    if (API_URL) {
        try {
            await fetch(`${API_URL}/scores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newScore)
            });
        } catch (e) {
            console.warn('Failed to save to global leaderboard', e);
        }
    }
}

// Get all high scores (Returns Local for now, Async ready for API)
async function getGlobalHighScores() {
    // If we had an API:
    if (API_URL) {
        try {
            const res = await fetch(`${API_URL}/scores`);
            const data = await res.json();
            return data; // Expecting array of objects
        } catch (e) {
            console.warn('Failed to fetch global scores', e);
            return getLocalHighScores(); // Fallback
        }
    }
    
    // Default to local
    return getLocalHighScores();
}

function getLocalHighScores() {
    if (isStorageAvailable()) {
        try {
            const scoresJson = localStorage.getItem('runnerHighScores');
            if (scoresJson) {
                return JSON.parse(scoresJson);
            }
        } catch (e) {
            console.warn('Failed to read high scores:', e);
        }
    }
    return memoryHighScores || [];
}

// For backward compatibility with synchronous calls in UI
function getHighScores() {
    return getLocalHighScores();
}

// Check if score is a new high score (Top 10)
function isNewHighScore(score) {
    const scores = getLocalHighScores();
    if (scores.length < 10) return true;
    return score > scores[scores.length - 1].score;
}

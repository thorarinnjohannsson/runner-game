// HIGH SCORE STORAGE with SUPABASE GLOBAL SUPPORT
// Uses Supabase for global scores and localStorage as fallback/offline cache

// Initialize Supabase
// You need to replace these with your actual Project URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; 
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Attempt initialization if client is available
if (typeof SupabaseClient !== 'undefined') {
    // Wait for user to input keys or check if they are set
    // In a real scenario, these would be constants or env vars
    // Since we are asking the user to provide them, we might need a way to input them.
    // For now, we will assume the user might edit this file or we prompt via console?
    // Actually, let's leave them as empty strings and let the user know.
    
    // IMPORTANT: Initialize with placeholders.
    // If you have the keys, replace them above.
    SupabaseClient.init(SUPABASE_URL, SUPABASE_KEY);
}

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
    // 1. Local Save (Always safe)
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

    // 2. Global Save via Supabase
    if (typeof SupabaseClient !== 'undefined' && SupabaseClient.initialized) {
        // Fire and forget - don't await to block UI
        SupabaseClient.submitScore(name || 'Anonymous', score).then(success => {
            if (success) console.log('Score submitted to global leaderboard');
        });
    }
}

// Get global high scores (Async)
async function getGlobalHighScores() {
    if (typeof SupabaseClient !== 'undefined' && SupabaseClient.initialized) {
        const scores = await SupabaseClient.getTopScores(10);
        if (scores && scores.length > 0) {
            return scores;
        }
    }
    
    // Fallback if offline or no keys
    return getLocalHighScores();
}

// Get local high scores (Sync)
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

// For backward compatibility/UI rendering (Sync default, mostly Local)
// UI should prefer calling getGlobalHighScores() when possible
function getHighScores() {
    return getLocalHighScores();
}

// Check if score is a new high score (Top 10 Local)
function isNewHighScore(score) {
    const scores = getLocalHighScores();
    if (scores.length < 10) return true;
    return score > scores[scores.length - 1].score;
}

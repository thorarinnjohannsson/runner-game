// HIGH SCORE STORAGE with SUPABASE GLOBAL SUPPORT
// Uses Supabase for global scores and localStorage as fallback/offline cache

// Initialize Supabase
// You need to replace these with your actual Project URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; 
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Attempt initialization if client is available and credentials are valid
if (typeof SupabaseClient !== 'undefined') {
    // Only initialize if URL and key are provided and not placeholders
    if (SUPABASE_URL && 
        SUPABASE_KEY && 
        SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && 
        SUPABASE_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
        SUPABASE_URL.startsWith('http')) {
        SupabaseClient.init(SUPABASE_URL, SUPABASE_KEY);
    } else {
        console.log('Supabase not configured - using local storage only. To enable global leaderboards, set SUPABASE_URL and SUPABASE_KEY in storage.js');
    }
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
async function saveHighScore(name, score, level = 1, time = 0, obstaclesCleared = 0) {
    // 1. Local Save (Always safe)
    const localScores = getLocalHighScores();
    const newScore = {
        name: name || 'Anonymous',
        score: score,
        level: level,
        time: time,
        obstaclesCleared: obstaclesCleared,
        date: new Date().toISOString()
    };
    
    localScores.push(newScore);
    
    // Sort: Primary Score (desc), Secondary Level (desc), Tertiary Obstacles (desc), Quaternary Time (asc)
    localScores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if ((b.level || 1) !== (a.level || 1)) return (b.level || 1) - (a.level || 1);
        if ((b.obstaclesCleared || 0) !== (a.obstaclesCleared || 0)) return (b.obstaclesCleared || 0) - (a.obstaclesCleared || 0);
        return (a.time || 0) - (b.time || 0);
    });
    
    const topLocal = localScores.slice(0, 10); // Keep top 10 locally
    
    if (isStorageAvailable()) {
        localStorage.setItem('runnerHighScores', JSON.stringify(topLocal));
    } else {
        memoryHighScores = topLocal;
    }

    // 2. Global Save via Supabase
    if (typeof SupabaseClient !== 'undefined' && SupabaseClient.initialized) {
        // Fire and forget - don't await to block UI
        SupabaseClient.submitScore(name || 'Anonymous', score, level, time, obstaclesCleared).then(success => {
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

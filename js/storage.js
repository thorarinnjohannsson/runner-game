// HIGH SCORE STORAGE with SUPABASE GLOBAL SUPPORT
// Uses Supabase for global scores and localStorage as fallback/offline cache

// Initialize Supabase
// You need to replace these with your actual Project URL and Anon Key
const SUPABASE_URL = 'https://mbaudgwntgrftpigoavr.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iYXVkZ3dudGdyZnRwaWdvYXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTMzMDQsImV4cCI6MjA3OTU2OTMwNH0.112kwdI6WaYDYj8zKC7_N3AsQuBYzzVmsQJ8j8KjVvg';

//pass ZqQyTSPXEa5nvuNX

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
async function saveHighScore(name, score, level = 1, time = 0, obstaclesCleared = 0, characterType = null) {
    // 1. Local Save (Always safe)
    const localScores = getLocalHighScores();
    const newScore = {
        name: name || 'Anonymous',
        score: score,
        level: level,
        time: time,
        obstaclesCleared: obstaclesCleared,
        characterType: characterType,
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
        SupabaseClient.submitScore(name || 'Anonymous', score, level, time, obstaclesCleared, characterType).then(success => {
            if (success) console.log('Score submitted to global leaderboard');
        });
    }
    
    // 3. Track high score achievement in Analytics
    if (typeof Analytics !== 'undefined' && Analytics.initialized) {
        const localScores = getLocalHighScores();
        const rank = localScores.findIndex(s => s.score === score && s.name === (name || 'Anonymous')) + 1;
        
        if (rank > 0 && rank <= 10) {
            // Track if it's a top 10 score
            Analytics.trackHighScore(rank, score, level);
        }
        
        // Also track as a custom event with more details
        Analytics.trackCustomEvent('score_saved', {
            'score': score,
            'level': level,
            'time': Math.floor(time),
            'obstacles_cleared': obstaclesCleared,
            'rank': rank > 0 ? rank : null,
            'is_new_high_score': rank === 1
        });
    }
}

// Get global high scores (Async)
async function getGlobalHighScores() {
    // Always try Supabase first if initialized
    if (typeof SupabaseClient !== 'undefined' && SupabaseClient.initialized) {
        try {
            const scores = await SupabaseClient.getTopScores(10);
            if (scores && scores.length > 0) {
                return scores;
            }
            // If Supabase returns empty array, still fall back to local
        } catch (e) {
            console.warn('Error fetching global scores from Supabase:', e);
            // Fall through to local fallback
        }
    }
    
    // Fallback if offline, not configured, or no scores from Supabase
    return getLocalHighScores();
}

// Get local high scores (Sync)
function getLocalHighScores() {
    if (isStorageAvailable()) {
        try {
            const scoresJson = localStorage.getItem('runnerHighScores');
            if (scoresJson) {
                const scores = JSON.parse(scoresJson);
                // Validate and fix any invalid dates - Safari compatible
                return scores.map(score => {
                    // Safari-compatible date validation
                    let dateValid = false;
                    if (score.date) {
                        try {
                            const dateObj = new Date(score.date);
                            // Check if date is valid using isNaN on the timestamp
                            dateValid = !isNaN(dateObj.getTime());
                        } catch (e) {
                            dateValid = false;
                        }
                    }
                    return {
                        ...score,
                        date: dateValid ? score.date : new Date().toISOString()
                    };
                });
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

// Utility: Clean up and validate existing localStorage data
// Call this once on page load to fix any corrupted data
function validateAndCleanStorage() {
    if (!isStorageAvailable()) return;
    
    try {
        const scoresJson = localStorage.getItem('runnerHighScores');
        if (scoresJson) {
            const scores = JSON.parse(scoresJson);
            let needsUpdate = false;
            
            // Validate each score entry
            const cleanedScores = scores.map(score => {
                const cleaned = { ...score };
                
                // Safari-compatible date validation
                let dateValid = false;
                if (score.date) {
                    try {
                        const dateObj = new Date(score.date);
                        dateValid = !isNaN(dateObj.getTime());
                    } catch (e) {
                        dateValid = false;
                    }
                }
                
                if (!dateValid) {
                    cleaned.date = new Date().toISOString();
                    needsUpdate = true;
                }
                
                // Ensure required fields have defaults
                if (typeof cleaned.level !== 'number') cleaned.level = 1;
                if (typeof cleaned.time !== 'number') cleaned.time = 0;
                if (typeof cleaned.obstaclesCleared !== 'number') cleaned.obstaclesCleared = 0;
                if (!cleaned.name) cleaned.name = 'Anonymous';
                
                return cleaned;
            });
            
            // Save cleaned data if changes were made
            if (needsUpdate) {
                localStorage.setItem('runnerHighScores', JSON.stringify(cleanedScores));
                console.log('High scores data validated and cleaned');
            }
        }
    } catch (e) {
        console.warn('Error validating storage:', e);
        // If completely corrupted, clear it
        try {
            localStorage.removeItem('runnerHighScores');
            console.log('Corrupted high scores data cleared');
        } catch (clearError) {
            console.error('Could not clear corrupted data:', clearError);
        }
    }
}

// Auto-run validation on script load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(validateAndCleanStorage, 100);
    });
}

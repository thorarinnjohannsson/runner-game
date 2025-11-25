// GOOGLE ANALYTICS TRACKING

const Analytics = {
    initialized: false,
    
    init() {
        // Check if gtag is loaded
        this.initialized = typeof gtag !== 'undefined';
        if (this.initialized) {
            console.log('Analytics initialized');
        }
    },
    
    // Track game start
    trackGameStart(character, playerName) {
        if (!this.initialized) return;
        
        gtag('event', 'game_start', {
            'character_type': character.id,
            'character_name': character.name,
            'player_name': playerName || 'Anonymous',
            'device_type': (typeof isMobile !== 'undefined' && isMobile) ? 'mobile' : 'desktop'
        });
    },
    
    // Track character selection
    trackCharacterSelect(character) {
        if (!this.initialized) return;
        
        gtag('event', 'character_selected', {
            'character_type': character.id,
            'character_name': character.name
        });
    },
    
    // Track game over
    trackGameOver(stats) {
        if (!this.initialized) return;
        
        gtag('event', 'game_over', {
            'final_score': stats.score,
            'final_level': stats.level,
            'time_survived': Math.floor(stats.time),
            'obstacles_cleared': stats.obstaclesCleared,
            'character_type': stats.characterType,
            'device_type': (typeof isMobile !== 'undefined' && isMobile) ? 'mobile' : 'desktop'
        });
    },
    
    // Track level completion
    trackLevelComplete(level, score, time) {
        if (!this.initialized) return;
        
        gtag('event', 'level_complete', {
            'level': level,
            'score': score,
            'time': Math.floor(time)
        });
    },
    
    // Track high score achievement
    trackHighScore(rank, score, level) {
        if (!this.initialized) return;
        
        gtag('event', 'high_score_achieved', {
            'rank': rank,
            'score': score,
            'level': level
        });
    },
    
    // Track obstacle collision
    trackObstacleHit(obstacleType, level, score) {
        if (!this.initialized) return;
        
        // Only track occasionally to avoid spam
        if (Math.random() > 0.1) return;
        
        gtag('event', 'obstacle_hit', {
            'obstacle_type': obstacleType,
            'level': level,
            'score': score
        });
    },
    
    // Track collectible pickup
    trackCollectible(type, level, score) {
        if (!this.initialized) return;
        
        gtag('event', 'collectible_pickup', {
            'type': type,
            'level': level,
            'score': score
        });
    },
    
    // Track pause
    trackPause(reason, time) {
        if (!this.initialized) return;
        
        gtag('event', 'game_paused', {
            'reason': reason, // 'user' or 'life_lost'
            'time': Math.floor(time)
        });
    },
    
    // Generic custom event tracker - use this for any custom events
    trackCustomEvent(eventName, eventParams = {}) {
        if (!this.initialized) return;
        
        // Add common context to all events
        const enrichedParams = {
            ...eventParams,
            'device_type': (typeof isMobile !== 'undefined' && isMobile) ? 'mobile' : 'desktop',
            'timestamp': new Date().toISOString()
        };
        
        gtag('event', eventName, enrichedParams);
    }
};

// Initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
    Analytics.init();
}


// PLAYER STATS TRACKING
// Tracks active sessions and manages lifecycle for player statistics

const PlayerStatsTracker = {
    sessionId: null,
    isTracking: false,
    heartbeatInterval: null,
    statsRecordId: null,
    
    // Generate or retrieve session ID
    getSessionId() {
        if (this.sessionId) return this.sessionId;
        
        // Try to get from sessionStorage first
        if (typeof sessionStorage !== 'undefined') {
            const stored = sessionStorage.getItem('player_session_id');
            if (stored) {
                this.sessionId = stored;
                return this.sessionId;
            }
        }
        
        // Generate new session ID
        this.sessionId = this.generateSessionId();
        
        // Store in sessionStorage
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('player_session_id', this.sessionId);
        }
        
        return this.sessionId;
    },
    
    // Generate unique session ID
    generateSessionId() {
        // Use crypto.randomUUID if available, otherwise fallback
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        
        // Fallback: timestamp + random
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Get device type
    getDeviceType() {
        if (typeof isMobile !== 'undefined' && isMobile) {
            return 'mobile';
        }
        return 'desktop';
    },
    
    // Start tracking a game session
    async startTracking(playerName) {
        if (this.isTracking) return; // Already tracking
        
        if (typeof SupabaseClient === 'undefined' || !SupabaseClient.initialized) {
            console.warn('Supabase not initialized, cannot track player stats');
            return;
        }
        
        const sessionId = this.getSessionId();
        const deviceType = this.getDeviceType();
        
        try {
            const result = await SupabaseClient.trackGameStart(sessionId, playerName, deviceType);
            if (result) {
                this.statsRecordId = result.id;
                this.isTracking = true;
                
                // Set up heartbeat (update every 30 seconds while playing)
                this.startHeartbeat();
                
                // Set up page unload handler
                this.setupUnloadHandler();
                
                // Set up visibility change handler (pause/resume)
                this.setupVisibilityHandler();
            }
        } catch (e) {
            console.error('Error starting player stats tracking:', e);
        }
    },
    
    // Stop tracking a game session
    async stopTracking() {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        this.stopHeartbeat();
        
        if (typeof SupabaseClient !== 'undefined' && SupabaseClient.initialized && this.sessionId) {
            try {
                await SupabaseClient.trackGameEnd(this.sessionId);
            } catch (e) {
                console.error('Error stopping player stats tracking:', e);
            }
        }
        
        this.statsRecordId = null;
    },
    
    // Start heartbeat mechanism (keeps session alive)
    startHeartbeat() {
        this.stopHeartbeat(); // Clear any existing interval
        
        this.heartbeatInterval = setInterval(() => {
            if (this.isTracking && this.sessionId && typeof SupabaseClient !== 'undefined' && SupabaseClient.initialized) {
                SupabaseClient.updateHeartbeat(this.sessionId).catch(e => {
                    console.error('Error updating heartbeat:', e);
                });
            }
        }, 30000); // Every 30 seconds
    },
    
    // Stop heartbeat
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    },
    
    // Set up page unload handler to ensure cleanup
    setupUnloadHandler() {
        // Remove existing handler if any
        if (this.unloadHandler) {
            window.removeEventListener('beforeunload', this.unloadHandler);
        }
        
        // Create new handler
        this.unloadHandler = () => {
            this.stopTracking();
        };
        
        window.addEventListener('beforeunload', this.unloadHandler);
    },
    
    // Set up visibility change handler (pause tracking when tab hidden)
    setupVisibilityHandler() {
        // Remove existing handler if any
        if (this.visibilityHandler) {
            document.removeEventListener('visibilitychange', this.visibilityHandler);
        }
        
        // Create new handler
        this.visibilityHandler = () => {
            if (document.hidden) {
                // Tab hidden - pause heartbeat but keep tracking
                this.stopHeartbeat();
            } else {
                // Tab visible - resume heartbeat if tracking
                if (this.isTracking) {
                    this.startHeartbeat();
                }
            }
        };
        
        document.addEventListener('visibilitychange', this.visibilityHandler);
    },
    
    // Cleanup all handlers
    cleanup() {
        this.stopTracking();
        
        if (this.unloadHandler) {
            window.removeEventListener('beforeunload', this.unloadHandler);
            this.unloadHandler = null;
        }
        
        if (this.visibilityHandler) {
            document.removeEventListener('visibilitychange', this.visibilityHandler);
            this.visibilityHandler = null;
        }
    }
};

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        PlayerStatsTracker.cleanup();
    });
}


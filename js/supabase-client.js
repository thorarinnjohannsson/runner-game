// SUPABASE CLIENT INTEGRATION
// Handles connection to Supabase backend for global high scores

const SupabaseClient = {
    client: null,
    url: null,
    key: null,
    initialized: false,
    
    // Initialize the client
    // Note: Credentials should ideally be environment variables, but for a client-side game 
    // using the Anon key with RLS (Row Level Security) is the standard pattern.
    init: function(url, key) {
        if (typeof supabase === 'undefined') {
            console.error('Supabase library not loaded!');
            return;
        }
        
        this.url = url;
        this.key = key;
        
        try {
            this.client = supabase.createClient(url, key);
            this.initialized = true;
            console.log('Supabase initialized successfully');
        } catch (e) {
            console.error('Failed to initialize Supabase:', e);
        }
    },
    
    // Fetch top scores
    getTopScores: async function(limit = 10) {
        if (!this.initialized) return [];
        
        try {
            const { data, error } = await this.client
                .from('high_scores')
                .select('player_name, score, level, time, obstacles_cleared, created_at')
                .order('score', { ascending: false })
                .order('level', { ascending: false })
                .order('obstacles_cleared', { ascending: false })
                .order('time', { ascending: true })
                .limit(limit);
                
            if (error) throw error;
            
            // Format for game compatibility
            return data.map(entry => ({
                name: entry.player_name,
                score: entry.score,
                level: entry.level || 1,
                time: entry.time || 0,
                obstaclesCleared: entry.obstacles_cleared || 0,
                date: entry.created_at
            }));
            
        } catch (e) {
            console.error('Error fetching high scores:', e);
            return [];
        }
    },
    
    // Submit a new score
    submitScore: async function(name, score, level = 1, time = 0, obstaclesCleared = 0, characterType = null) {
        if (!this.initialized) return false;
        
        try {
            const { data, error } = await this.client
                .from('high_scores')
                .insert([
                    { 
                        player_name: name, 
                        score: score,
                        level: level,
                        time: time,
                        obstacles_cleared: obstaclesCleared,
                        character_type: characterType
                    }
                ]);
                
            if (error) throw error;
            return true;
            
        } catch (e) {
            console.error('Error submitting score:', e);
            return false;
        }
    },
    
    // Player Stats Tracking Functions
    
    // Track game start - insert new active session
    trackGameStart: async function(sessionId, playerName, deviceType) {
        if (!this.initialized) return null;
        
        try {
            const { data, error } = await this.client
                .from('player_stats')
                .insert([
                    {
                        session_id: sessionId,
                        player_name: playerName || 'Anonymous',
                        is_active: true,
                        device_type: deviceType || 'unknown',
                        started_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();
                
            if (error) throw error;
            return data;
            
        } catch (e) {
            console.error('Error tracking game start:', e);
            return null;
        }
    },
    
    // Track game end - update session to inactive
    trackGameEnd: async function(sessionId) {
        if (!this.initialized) return false;
        
        try {
            const { data, error } = await this.client
                .from('player_stats')
                .update({
                    is_active: false,
                    ended_at: new Date().toISOString()
                })
                .eq('session_id', sessionId)
                .eq('is_active', true);
                
            if (error) throw error;
            return true;
            
        } catch (e) {
            console.error('Error tracking game end:', e);
            return false;
        }
    },
    
    // Get count of currently active players (with recent heartbeat)
    getActivePlayerCount: async function() {
        if (!this.initialized) return 0;
        
        try {
            // Only count sessions that have been updated in the last 2 minutes (120 seconds)
            // This filters out stale sessions that didn't properly clean up
            const twoMinutesAgo = new Date(Date.now() - 120000).toISOString();
            
            const { count, error } = await this.client
                .from('player_stats')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true)
                .gte('updated_at', twoMinutesAgo);
                
            if (error) throw error;
            return count || 0;
            
        } catch (e) {
            console.error('Error getting active player count:', e);
            return 0;
        }
    },
    
    // Get detailed active player info for debugging
    getActivePlayerDetails: async function() {
        if (!this.initialized) return [];
        
        try {
            const twoMinutesAgo = new Date(Date.now() - 120000).toISOString();
            
            const { data, error } = await this.client
                .from('player_stats')
                .select('session_id, player_name, device_type, started_at, updated_at, is_active')
                .eq('is_active', true)
                .order('updated_at', { ascending: false });
                
            if (error) throw error;
            
            // Filter to only recent sessions and add time since last update
            return (data || []).map(session => {
                const lastUpdate = new Date(session.updated_at);
                const now = new Date();
                const secondsAgo = Math.floor((now - lastUpdate) / 1000);
                
                return {
                    ...session,
                    secondsSinceUpdate: secondsAgo,
                    isRecent: secondsAgo < 120
                };
            });
            
        } catch (e) {
            console.error('Error getting active player details:', e);
            return [];
        }
    },
    
    // Clean up stale sessions (mark as inactive if no heartbeat in 2 minutes)
    cleanupStaleSessions: async function() {
        if (!this.initialized) return 0;
        
        try {
            const twoMinutesAgo = new Date(Date.now() - 120000).toISOString();
            
            const { data, error } = await this.client
                .from('player_stats')
                .update({ 
                    is_active: false,
                    ended_at: new Date().toISOString()
                })
                .eq('is_active', true)
                .lt('updated_at', twoMinutesAgo);
                
            if (error) throw error;
            
            const cleanedCount = data ? (Array.isArray(data) ? data.length : 1) : 0;
            if (cleanedCount > 0) {
                console.log(`🧹 Cleaned up ${cleanedCount} stale session(s)`);
            }
            
            return cleanedCount;
            
        } catch (e) {
            console.error('Error cleaning up stale sessions:', e);
            return 0;
        }
    },
    
    // Get count of unique players who played today
    getDailyPlayerCount: async function() {
        if (!this.initialized) return 0;
        
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayISO = today.toISOString();
            
            const { data, error } = await this.client
                .from('player_stats')
                .select('session_id')
                .gte('created_at', todayISO);
                
            if (error) throw error;
            
            // Count unique session_ids
            const uniqueSessions = new Set((data || []).map(row => row.session_id));
            return uniqueSessions.size;
            
        } catch (e) {
            console.error('Error getting daily player count:', e);
            return 0;
        }
    },
    
    // Subscribe to active player count changes (Realtime)
    subscribeToActivePlayers: function(callback) {
        if (!this.initialized) return null;
        
        try {
            const subscription = this.client
                .channel('active-players')
                .on('postgres_changes', 
                    {
                        event: '*',
                        schema: 'public',
                        table: 'player_stats',
                        filter: 'is_active=eq.true'
                    },
                    async () => {
                        // Fetch updated count when changes occur
                        const count = await this.getActivePlayerCount();
                        if (callback) callback(count);
                    }
                )
                .subscribe();
                
            return subscription;
            
        } catch (e) {
            console.error('Error setting up Realtime subscription:', e);
            return null;
        }
    },
    
    // Update heartbeat for active session (keep session alive)
    updateHeartbeat: async function(sessionId) {
        if (!this.initialized) return false;
        
        try {
            // Update updated_at timestamp to show session is still active
            // The updated_at column should auto-update via trigger, but we'll also update it explicitly
            const { error } = await this.client
                .from('player_stats')
                .update({
                    updated_at: new Date().toISOString()
                })
                .eq('session_id', sessionId)
                .eq('is_active', true);
                
            if (error) throw error;
            return true;
                
        } catch (e) {
            console.error('Error updating heartbeat:', e);
            return false;
        }
    }
};


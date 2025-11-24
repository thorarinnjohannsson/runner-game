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
                .select('player_name, score, created_at')
                .order('score', { ascending: false })
                .limit(limit);
                
            if (error) throw error;
            
            // Format for game compatibility
            return data.map(entry => ({
                name: entry.player_name,
                score: entry.score,
                date: entry.created_at
            }));
            
        } catch (e) {
            console.error('Error fetching high scores:', e);
            return [];
        }
    },
    
    // Submit a new score
    submitScore: async function(name, score) {
        if (!this.initialized) return false;
        
        try {
            const { data, error } = await this.client
                .from('high_scores')
                .insert([
                    { player_name: name, score: score }
                ]);
                
            if (error) throw error;
            return true;
            
        } catch (e) {
            console.error('Error submitting score:', e);
            return false;
        }
    }
};


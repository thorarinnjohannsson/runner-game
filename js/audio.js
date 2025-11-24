// AUDIO SYSTEM - Music Generator and Sound Manager

class AudioManager {
    constructor() {
        this.ctx = null;
        this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        
        // Music state
        this.isPlaying = false;
        this.nextNoteTime = 0;
        this.tick = 0; // 16th note counter
        this.tempo = 145; // High Energy Techno/Trance Tempo
        this.lookahead = 25.0; 
        this.scheduleAheadTime = 0.1;
        this.timerID = null;
        
        // --- Song Structure ---
        // Grid: 16th notes
        // q = 4 ticks, e = 2 ticks, s = 1 tick
        
        const s = 1; // 16th note (1 tick)
        const e = 2; // 8th note (2 ticks)
        const q = 4; // Quarter note (4 ticks)
        
        // 1. Main Riff (The "Hook") - D Minor
        // Matches the pattern user liked, adapted to 16th grid
        const riffPattern = (root) => [
            {n: root+'3', d: s}, {n: root+'3', d: s}, {n: root+'4', d: s}, {n: 'A4', d: s+s+s}, // D D ^D A...
            {n: 'G#4', d: e}, {n: 'G4', d: e}, {n: 'F4', d: e+e},
            {n: 'D4', d: s}, {n: 'F4', d: s}, {n: 'G4', d: s}
        ];
        // Note: The durations above need to sum to 16 ticks (1 bar) or similar to loop correctly.
        // Sum: 1+1+1+3 = 6. 2+2+4 = 8. 1+1+1 = 3. Total = 17?
        // Let's adjust to fit a 4/4 bar (16 ticks) tighter.
        // D(1) D(1) ^D(1) A(3) -> 6 ticks.
        // G#(2) G(2) F(2) -> 6 ticks. Total 12.
        // D(1) F(1) G(1) -> 3 ticks. Total 15. 
        // Add rest or sustain last note. Let's sustain G4 by 1 more tick.
        
        const createRiff = (base, octaveOffset = 0) => {
            // Helper to transpose the main melodic contour
            // Original: D, D, ^D, A, G#, G, F, D, F, G
            // Intervals relative to D: 0, 0, +12, +7, +6, +5, +3, 0, +3, +5
            const intervals = [0, 0, 12, 7, 6, 5, 3, 0, 3, 5];
            const durations = [s, s, s, 3, e, e, e, s, s, 2]; // Sum = 16
            
            return intervals.map((semitones, i) => {
                // Calculate note name logic roughly or just hardcode the variants
                // For simplicity in this generated system, we'll stick to the explicit definition approach
                return { n: null, d: durations[i] }; // Placeholder
            });
        };

        // explicit phrases for better control
        const phraseD = [
            {n: 'D4', d: s}, {n: 'D4', d: s}, {n: 'D5', d: s}, {n: 'A4', d: 3}, 
            {n: 'G#4', d: e}, {n: 'G4', d: e}, {n: 'F4', d: e},
            {n: 'D4', d: s}, {n: 'F4', d: s}, {n: 'G4', d: 2}
        ]; // 16 ticks
        
        const phraseC = [
            {n: 'C4', d: s}, {n: 'C4', d: s}, {n: 'D5', d: s}, {n: 'A4', d: 3}, 
            {n: 'G#4', d: e}, {n: 'G4', d: e}, {n: 'F4', d: e},
            {n: 'D4', d: s}, {n: 'F4', d: s}, {n: 'G4', d: 2}
        ];

        const phraseBb = [
            {n: 'A#3', d: s}, {n: 'A#3', d: s}, {n: 'D5', d: s}, {n: 'A4', d: 3}, 
            {n: 'G#4', d: e}, {n: 'G4', d: e}, {n: 'F4', d: e},
            {n: 'D4', d: s}, {n: 'F4', d: s}, {n: 'G4', d: 2}
        ];
        
        // 2. Bridge / Build-up
        // Rising Arps: F-A-C-E...
        const bridgePhrase = [
            {n: 'F4', d: e}, {n: 'A4', d: e}, {n: 'C5', d: e}, {n: 'E5', d: e},
            {n: 'G4', d: e}, {n: 'B4', d: e}, {n: 'D5', d: e}, {n: 'G5', d: e}
        ]; // 16 ticks

        // 3. Chorus - High energy, sustained
        const chorusPhrase = [
             {n: 'D5', d: 6}, {n: 'A4', d: 2}, {n: 'F4', d: 4}, {n: 'D4', d: 4},
             {n: 'A#4', d: 6}, {n: 'C5', d: 2}, {n: 'D5', d: 8}
        ]; // 32 ticks (2 bars) - wait, 6+2+4+4 = 16. 6+2+8 = 16. Yes.

        // --- SEQUENCE ---
        // Construct the full loop
        this.sequence = [
            // Intro (Riff A only, filtered?)
            ...phraseD, ...phraseD,
            // Full Riff
            ...phraseD, ...phraseC, ...phraseBb, ...phraseC,
            // Bridge
            ...bridgePhrase, ...bridgePhrase,
            // Chorus
            ...chorusPhrase, ...chorusPhrase
        ];

        // Flatten the sequence into a continuous stream of notes with absolute timing in ticks
        // actually, the scheduler is better suited to process the array step by step
        
        this.frequencies = this.createNoteTable();
        
        // Filters for dynamic automation
        this.cutoffLFO = 0;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    createNoteTable() {
        const notes = {};
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < names.length; j++) {
                const n = i * 12 + j + 12;
                const freq = 440 * Math.pow(2, (n - 69) / 12);
                notes[names[j] + i] = freq;
            }
        }
        return notes;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        localStorage.setItem('musicEnabled', this.musicEnabled);
        if (this.musicEnabled) this.startMusic();
        else this.stopMusic();
        return this.musicEnabled;
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);
        return this.soundEnabled;
    }

    startMusic() {
        if (!this.musicEnabled || this.isPlaying) return;
        this.init(); 
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        this.tick = 0;
        this.nextNoteTime = this.ctx.currentTime + 0.1;
        this.scheduler();
    }

    stopMusic() {
        this.isPlaying = false;
        clearTimeout(this.timerID);
    }

    scheduler() {
        if (!this.isPlaying) return;
        
        const secondsPerTick = (60.0 / this.tempo) / 4; // 16th note duration

        while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
            this.processTick(this.tick, this.nextNoteTime);
            this.nextNoteTime += secondsPerTick;
            this.tick++;
        }
        this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }

    processTick(tick, time) {
        // 1. DRUMS (The Backbone)
        // Four-on-the-floor Kick (0, 4, 8, 12)
        const beat16 = tick % 16;
        
        // Kick: Driving, punchy
        if (beat16 % 4 === 0) {
            this.triggerKick(time);
        }
        
        // Snare/Clap: On the 2 and 4 (ticks 4 and 12) - wait, kicks are on 0,4,8,12?
        // If Kick is 0,4,8,12, that's every beat.
        // Snare usually on 4 and 12 (beats 2 and 4).
        if (beat16 === 4 || beat16 === 12) {
            this.triggerSnare(time);
        }
        
        // Hi-Hats: Offbeats (2, 6, 10, 14) = Open Hat. Others = Closed.
        if (beat16 % 2 === 0) {
             // 16th note groove
             if (beat16 % 4 === 2) {
                 this.triggerHat(time, true); // Open (offbeat)
             } else {
                 this.triggerHat(time, false); // Closed
             }
        }

        // 2. MELODY & BASS SEQUENCER
        // We need to track where we are in the melody array.
        // Since melody notes have variable duration, we can't just use `tick`.
        // We need a pointer that advances only when the note duration expires.
        
        // Check if we should play the next note
        if (!this.noteEndTime || tick >= this.noteEndTime) {
            const noteData = this.sequence[this.currentNoteIndex % this.sequence.length];
            const durationTicks = noteData.d;
            
            // Play Note
            this.triggerLead(noteData.n, time, durationTicks);
            
            // Play Bass (Follows root of current phrase)
            // Simple logic: Map currentNoteIndex to phrase sections
            this.triggerBass(this.currentNoteIndex, time, durationTicks, beat16);

            // Advance
            this.currentNoteIndex++;
            this.noteEndTime = tick + durationTicks;
        }
    }

    triggerLead(noteName, time, durationTicks) {
        if (!noteName || !this.frequencies[noteName]) return;
        
        const duration = durationTicks * ((60.0 / this.tempo) / 4);
        
        // Modern Retro Lead: Square + Sawtooth + Lowpass
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'square';
        osc1.frequency.value = this.frequencies[noteName];

        osc2.type = 'sawtooth';
        osc2.detune.value = 8; // Detune for thickness
        osc2.frequency.value = this.frequencies[noteName];

        // Filter Movement
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, time);
        filter.frequency.exponentialRampToValueAtTime(500, time + 0.1);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(filter);
        filter.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + duration);
        osc2.stop(time + duration);
    }

    triggerBass(noteIndex, time, durationTicks, beat16) {
        // Bass follows the chord progression roughly
        // Phrase length is 10 notes in the riff... this index logic is tricky with variable lengths.
        // Let's assume a simple progression loop based on the total note count so far?
        // Easier: Bass plays a rhythmic pattern on a root note determined by `currentNoteIndex` ranges.
        
        // Riff Section (approx first 20 notes): D
        // Variation (next 20): C -> Bb
        // Let's simplify: Bass triggers on the Off-beat (ticks 2, 6, 10, 14) for "House" feel
        // OR rolling 16ths.
        
        if (beat16 % 2 !== 0) return; // Only trigger on 8th notes for driving feel

        let root = 'D2';
        const cycle = this.currentNoteIndex % 40;
        if (cycle >= 10 && cycle < 20) root = 'C2';
        if (cycle >= 20 && cycle < 30) root = 'A#1';
        if (cycle >= 30) root = 'C2'; // Turnaround

        if (this.frequencies[root]) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.value = this.frequencies[root];

            // Sidechain Simulation:
            // Bass is quieter when Kick hits (beats 0, 4, 8, 12)
            // Since we are triggering bass on 8th notes (0, 2, 4...), 
            // the ones on the beat (0,4) coincide with Kick.
            // We duck the volume on those, or emphasize the off-beat (2, 6).
            
            const isKickHit = (beat16 % 4 === 0);
            const vol = isKickHit ? 0.1 : 0.25; // Louder on offbeat
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, time);
            filter.frequency.linearRampToValueAtTime(1000, time + 0.1); // Pluck

            gain.gain.setValueAtTime(vol, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.2);
        }
    }

    triggerKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.2);
        
        gain.gain.setValueAtTime(0.6, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.2);
    }

    triggerSnare(time) {
        // White noise burst + tone
        this.createNoiseBurst(time, 0.1, 1000, 0.2);
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, time);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    triggerHat(time, open) {
        const dur = open ? 0.1 : 0.03;
        const vol = open ? 0.1 : 0.05;
        this.createNoiseBurst(time, dur, 5000, vol);
    }

    createNoiseBurst(time, duration, freq, vol) {
        if (!this.noiseBuffer) {
             const bSize = this.ctx.sampleRate * 2;
             const b = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
             const d = b.getChannelData(0);
             for (let i=0; i<bSize; i++) d[i] = Math.random() * 2 - 1;
             this.noiseBuffer = b;
        }
        
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = freq;
        const gain = this.ctx.createGain();
        
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        src.start(time);
        src.stop(time + duration);
    }

    playSound(type, intensity = 1) {
        if (!this.soundEnabled) return;
        this.init(); 
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        switch(type) {
            case 'jump':
                osc.frequency.setValueAtTime(200 + (intensity * 50), now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'collision':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'gameOver':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'score':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'powerup':
                // Rising magical chime
                osc.type = 'triangle';
                // Arpeggio effect rapidly
                osc.frequency.setValueAtTime(440, now); // A4
                osc.frequency.setValueAtTime(554, now + 0.05); // C#5
                osc.frequency.setValueAtTime(659, now + 0.1); // E5
                osc.frequency.setValueAtTime(880, now + 0.15); // A5
                
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                
                osc.start(now);
                osc.stop(now + 0.4);
                
                // Add a second oscillator for "sparkle" (high sine)
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(this.ctx.destination);
                
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, now);
                osc2.frequency.linearRampToValueAtTime(1760, now + 0.2);
                
                gain2.gain.setValueAtTime(0.05, now);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                
                osc2.start(now);
                osc2.stop(now + 0.3);
                break;
        }
    }
}

const audioManager = new AudioManager();

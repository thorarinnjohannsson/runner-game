// Character Drawing Functions (called by Player.draw)

// --- CAT (The classic orange one) ---
function drawCat(ctx, colors, p, animationFrame, isOnGround, legOffset) {
    // 1. TAIL (Animated)
    const tailWag = Math.sin(animationFrame * 3) * 4;
    ctx.fillStyle = colors.fur;
    // Tail base
    ctx.fillRect(-2 * p, (4 * p) + tailWag, 2 * p, 2 * p);
    // Tail tip
    ctx.fillRect(-3 * p, (3 * p) + tailWag, 2 * p, 2 * p);
    
    // 2. BACK LEGS (Left)
    ctx.fillStyle = colors.furDark;
    ctx.fillRect(2 * p + legOffset, 7 * p, 2 * p, 2 * p);
    
    // 3. BODY
    ctx.fillStyle = colors.fur;
    ctx.fillRect(2 * p, 4 * p, 6 * p, 3 * p); // Main body
    
    // Belly (Lighter)
    ctx.fillStyle = colors.furLight;
    ctx.fillRect(3 * p, 5 * p, 4 * p, 2 * p);
    
    // 4. FRONT LEGS (Right)
    ctx.fillStyle = colors.furDark;
    ctx.fillRect(6 * p - legOffset, 7 * p, 2 * p, 2 * p);
    
    // 5. HEAD
    ctx.fillStyle = colors.fur;
    ctx.fillRect(0, 0, 9 * p, 5 * p); // Big head box
    
    // Ears
    ctx.fillStyle = colors.fur;
    ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p); // Left Ear base
    ctx.fillRect(1 * p, -3 * p, 1 * p, 1 * p); // Left Ear tip
    
    ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p); // Right Ear base
    ctx.fillRect(7 * p, -3 * p, 1 * p, 1 * p); // Right Ear tip
    
    // Ear Insides
    ctx.fillStyle = colors.furDark;
    ctx.fillRect(1.5 * p, -1.5 * p, 1 * p, 1 * p);
    ctx.fillRect(6.5 * p, -1.5 * p, 1 * p, 1 * p);
    
    // 6. FACE DETAILS
    // Eyes
    ctx.fillStyle = colors.black;
    ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p); // Left Eye
    ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p); // Right Eye
    
    // Eye Shine
    ctx.fillStyle = colors.white;
    ctx.fillRect(2.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
    ctx.fillRect(6.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
    
    // Nose
    ctx.fillStyle = colors.nose;
    ctx.fillRect(4.5 * p - 1, 3 * p, 2, 2);
    
    // Whiskers
    ctx.fillStyle = colors.black;
    ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 1); // Left
    ctx.fillRect(7 * p, 3.5 * p, 1.5 * p, 1);   // Right
}

// --- WOLF (Replaces Frog) ---
function drawWolf(ctx, colors, p, animationFrame, isOnGround, legOffset) {
    // Wolf Palette
    const c = {
        fur: '#607D8B',      // Blue Grey
        dark: '#455A64',     // Dark Blue Grey
        light: '#90A4AE',    // Light Grey
        nose: '#263238',     // Almost Black
        eye: '#FFEB3B'       // Yellow Eyes
    };

    // Bushy Tail (Wagging)
    const tailWag = Math.sin(animationFrame * 3) * 3;
    ctx.fillStyle = c.dark;
    ctx.fillRect(-3 * p, (4 * p) + tailWag, 3 * p, 2 * p); // Base
    ctx.fillRect(-4 * p, (3 * p) + tailWag, 2 * p, 3 * p); // Fluff
    
    // Legs (Running)
    ctx.fillStyle = c.dark;
    ctx.fillRect(2 * p + legOffset, 7 * p, 2 * p, 2 * p); // Back
    ctx.fillRect(6 * p - legOffset, 7 * p, 2 * p, 2 * p); // Front
    
    // Body
    ctx.fillStyle = c.fur;
    ctx.fillRect(1 * p, 4 * p, 7 * p, 3 * p);
    
    // Chest/Belly (Lighter)
    ctx.fillStyle = c.light;
    ctx.fillRect(2 * p, 5 * p, 3 * p, 2 * p);
    
    // Head
    ctx.fillStyle = c.fur;
    ctx.fillRect(1 * p, 1 * p, 7 * p, 4 * p);
    
    // Pointy Ears
    ctx.fillStyle = c.fur;
    ctx.fillRect(1.5 * p, -1 * p, 2 * p, 2 * p); // Left Base
    ctx.fillRect(2 * p, -2.5 * p, 1 * p, 1.5 * p); // Left Tip
    
    ctx.fillRect(5.5 * p, -1 * p, 2 * p, 2 * p); // Right Base
    ctx.fillRect(6 * p, -2.5 * p, 1 * p, 1.5 * p); // Right Tip
    
    // Snout (Protruding slightly)
    ctx.fillStyle = c.light;
    ctx.fillRect(3 * p, 3.5 * p, 3 * p, 1.5 * p);
    ctx.fillStyle = c.nose;
    ctx.fillRect(4 * p, 3.5 * p, 1 * p, 1 * p);
    
    // Intense Eyes
    ctx.fillStyle = c.eye; // Yellow
    ctx.fillRect(2 * p, 2 * p, 1.5 * p, 1 * p);
    ctx.fillRect(5.5 * p, 2 * p, 1.5 * p, 1 * p);
    
    ctx.fillStyle = colors.black; // Pupil
    ctx.fillRect(2.5 * p, 2.2 * p, 0.5 * p, 0.6 * p);
    ctx.fillRect(6 * p, 2.2 * p, 0.5 * p, 0.6 * p);
}

// --- PENGUIN ---
function drawPenguin(ctx, colors, p, animationFrame, isOnGround, legOffset) {
    // Penguin Palette
    const c = {
        body: '#263238', // Dark Blue/Black
        belly: '#ECEFF1', // White-ish
        beak: '#FF9800', // Orange
        feet: '#FF9800'
    };

    // Feet (Waddling)
    ctx.fillStyle = c.feet;
    ctx.fillRect(2 * p + legOffset, 7 * p, 2 * p, 1 * p); // Left
    ctx.fillRect(5 * p - legOffset, 7 * p, 2 * p, 1 * p); // Right

    // Body (Oval-ish)
    ctx.fillStyle = c.body;
    ctx.fillRect(1 * p, 1 * p, 7 * p, 6 * p); // Main
    ctx.fillRect(2 * p, 0, 5 * p, 1 * p); // Top rounding

    // Belly (White Patch)
    ctx.fillStyle = c.belly;
    ctx.fillRect(2.5 * p, 3 * p, 4 * p, 4 * p);
    ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p); // Face white left
    ctx.fillRect(5 * p, 2 * p, 2 * p, 2 * p); // Face white right

    // Eyes
    ctx.fillStyle = colors.black;
    ctx.fillRect(2.5 * p, 2.5 * p, 0.8 * p, 0.8 * p);
    ctx.fillRect(5.5 * p, 2.5 * p, 0.8 * p, 0.8 * p);

    // Beak
    ctx.fillStyle = c.beak;
    ctx.fillRect(4 * p, 3.5 * p, 2 * p, 1 * p);

    // Wings (Flapping slightly)
    const flap = Math.sin(animationFrame * 5) * 2;
    ctx.fillStyle = c.body;
    ctx.beginPath();
    ctx.moveTo(1 * p, 4 * p);
    ctx.lineTo(-1 * p - flap, 5 * p);
    ctx.lineTo(1 * p, 6 * p);
    ctx.fill(); // Left Wing

    ctx.beginPath();
    ctx.moveTo(8 * p, 4 * p);
    ctx.lineTo(10 * p + flap, 5 * p);
    ctx.lineTo(8 * p, 6 * p);
    ctx.fill(); // Right Wing
}

// --- DOG ---
function drawDog(ctx, colors, p, animationFrame, isOnGround, legOffset) {
    // Dog Palette
    const c = {
        fur: '#8D6E63', // Brown
        dark: '#5D4037', // Dark Brown (Ears/Spots)
        nose: '#3E2723'
    };

    // Tail (Wagging fast)
    const wag = Math.sin(animationFrame * 8) * 3;
    ctx.fillStyle = c.dark;
    ctx.fillRect(-1 * p, 4 * p + wag, 1.5 * p, 3 * p);

    // Legs
    ctx.fillStyle = c.dark;
    ctx.fillRect(2 * p + legOffset, 7 * p, 1.5 * p, 2 * p);
    ctx.fillRect(6.5 * p - legOffset, 7 * p, 1.5 * p, 2 * p);

    // Body
    ctx.fillStyle = c.fur;
    ctx.fillRect(1 * p, 4 * p, 7 * p, 3 * p);

    // Head (Boxy)
    ctx.fillStyle = c.fur;
    ctx.fillRect(1 * p, 0 * p, 7 * p, 5 * p);

    // Floppy Ears
    ctx.fillStyle = c.dark;
    ctx.fillRect(0, 1 * p, 1.5 * p, 3 * p); // Left Ear
    ctx.fillRect(7.5 * p, 1 * p, 1.5 * p, 3 * p); // Right Ear

    // Face
    ctx.fillStyle = colors.black;
    ctx.fillRect(2.5 * p, 2 * p, 1 * p, 1 * p); // Eye L
    ctx.fillRect(5.5 * p, 2 * p, 1 * p, 1 * p); // Eye R

    // Snout
    ctx.fillStyle = '#D7CCC8'; // Light snout
    ctx.fillRect(3 * p, 3.5 * p, 3 * p, 1.5 * p);
    ctx.fillStyle = c.nose;
    ctx.fillRect(4 * p, 3.5 * p, 1 * p, 0.8 * p); // Nose
}

// --- RABBIT ---
function drawRabbit(ctx, colors, p, animationFrame, isOnGround, legOffset) {
    // Rabbit Palette
    const c = {
        fur: '#F5F5F5', // White/Cream
        shadow: '#E0E0E0',
        earInner: '#F48FB1', // Pink
    };

    // Bobbing tail
    ctx.fillStyle = c.fur;
    ctx.fillRect(-1 * p, 5.5 * p, 1.5 * p, 1.5 * p); // Fluffy tail

    // Legs (Big hopping feet)
    ctx.fillStyle = c.shadow;
    const jumpLeg = isOnGround ? 0 : -2; // Tuck legs in air
    ctx.fillRect(2 * p + legOffset, 7 * p + jumpLeg, 2 * p, 1.5 * p);
    ctx.fillRect(5 * p - legOffset, 7 * p + jumpLeg, 2 * p, 1.5 * p);

    // Body
    ctx.fillStyle = c.fur;
    ctx.fillRect(1.5 * p, 3.5 * p, 6 * p, 4 * p);

    // Head
    ctx.fillStyle = c.fur;
    ctx.fillRect(1 * p, 1 * p, 7 * p, 4 * p);

    // Ears (Long)
    const earWiggle = Math.sin(animationFrame * 2) * 2;
    
    // Left Ear
    ctx.fillStyle = c.fur;
    ctx.fillRect(2 * p, -3 * p, 1.5 * p, 4 * p);
    ctx.fillStyle = c.earInner;
    ctx.fillRect(2.5 * p, -2.5 * p, 0.5 * p, 3 * p);

    // Right Ear
    ctx.fillStyle = c.fur;
    ctx.fillRect(5.5 * p, -3 * p, 1.5 * p, 4 * p);
    ctx.fillStyle = c.earInner;
    ctx.fillRect(6 * p, -2.5 * p, 0.5 * p, 3 * p);

    // Face
    ctx.fillStyle = colors.black;
    ctx.fillRect(2 * p, 2.5 * p, 1 * p, 1 * p); // Eye L
    ctx.fillRect(6 * p, 2.5 * p, 1 * p, 1 * p); // Eye R
    
    // Nose (Pink triangle)
    ctx.fillStyle = c.earInner;
    ctx.fillRect(4.2 * p, 3.5 * p, 0.6 * p, 0.6 * p);
    
    // Teeth
    ctx.fillStyle = 'white';
    ctx.fillRect(4.2 * p, 4.2 * p, 0.6 * p, 0.8 * p);
}

// --- SOMERSAULT ANIMATION FRAMES ---
// These functions draw the character in different poses during a forward flip
// Frame 0: Jump start - legs tucked, preparing
// Frame 1: Quarter flip - body curling forward
// Frame 2: Half flip - upside down, fully curled
// Frame 3: Three-quarter flip - uncurling
// Frame 4: Landing prep - legs extending

function drawSomersaultFrame(ctx, type, colors, frame, p) {
    // Route to character-specific somersault drawer
    const drawers = {
        cat: drawCatSomersault,
        wolf: drawWolfSomersault,
        penguin: drawPenguinSomersault,
        dog: drawDogSomersault,
        rabbit: drawRabbitSomersault
    };
    
    const drawer = drawers[type] || drawCatSomersault;
    drawer(ctx, colors, frame, p);
}

// Cat Somersault Frames
function drawCatSomersault(ctx, colors, frame, p) {
    switch(frame) {
        case 0: // Jump start - legs tucked
            // Tail (tucked)
            ctx.fillStyle = colors.fur;
            ctx.fillRect(-1 * p, 5 * p, 2 * p, 2 * p);
            
            // Body (compact)
            ctx.fillRect(2 * p, 3 * p, 5 * p, 4 * p);
            
            // Belly
            ctx.fillStyle = colors.furLight;
            ctx.fillRect(3 * p, 4 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = colors.fur;
            ctx.fillRect(1 * p, 0, 7 * p, 4 * p);
            
            // Ears
            ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(1.5 * p, -1.5 * p, 1 * p, 1 * p);
            ctx.fillRect(6.5 * p, -1.5 * p, 1 * p, 1 * p);
            
            // Tucked legs
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 2 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = colors.nose;
            ctx.fillRect(4 * p, 3 * p, 2, 2);
            
            // Whiskers
            ctx.fillStyle = colors.black;
            ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 1);
            ctx.fillRect(6.5 * p, 3.5 * p, 1.5 * p, 1);
            break;
            
        case 1: // Quarter flip - curling forward
            // Tail (flowing behind)
            ctx.fillStyle = colors.fur;
            ctx.fillRect(-2 * p, 4 * p, 3 * p, 2 * p);
            
            // Body (horizontal, curling)
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Belly
            ctx.fillStyle = colors.furLight;
            ctx.fillRect(2 * p, 4 * p, 4 * p, 2 * p);
            
            // Head tucking down
            ctx.fillStyle = colors.fur;
            ctx.fillRect(6 * p, 5 * p, 3 * p, 3 * p);
            
            // Ear visible
            ctx.fillRect(7 * p, 4 * p, 2 * p, 1 * p);
            
            // Legs curled up
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye visible
            ctx.fillStyle = colors.black;
            ctx.fillRect(7 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(7.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = colors.nose;
            ctx.fillRect(7.5 * p, 7 * p, 2, 2);
            break;
            
        case 2: // Half flip - upside down
            // Tail (above)
            ctx.fillStyle = colors.fur;
            ctx.fillRect(3 * p, 0, 2 * p, 2 * p);
            
            // Body (compact ball)
            ctx.fillRect(2 * p, 2 * p, 5 * p, 5 * p);
            
            // Belly (upside down)
            ctx.fillStyle = colors.furLight;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 2 * p);
            
            // Head (upside down)
            ctx.fillStyle = colors.fur;
            ctx.fillRect(1 * p, 5 * p, 7 * p, 3 * p);
            
            // Ears (pointing down)
            ctx.fillRect(2 * p, 8 * p, 2 * p, 1 * p);
            ctx.fillRect(5 * p, 8 * p, 2 * p, 1 * p);
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(2.5 * p, 8 * p, 1 * p, 1 * p);
            ctx.fillRect(5.5 * p, 8 * p, 1 * p, 1 * p);
            
            // Legs tucked
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(2 * p, 1 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 1 * p, 2 * p, 2 * p);
            
            // Eyes (upside down)
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 6 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose (upside down)
            ctx.fillStyle = colors.nose;
            ctx.fillRect(4 * p, 5.5 * p, 2, 2);
            break;
            
        case 3: // Three-quarter flip - uncurling
            // Tail (flowing)
            ctx.fillStyle = colors.fur;
            ctx.fillRect(7 * p, 4 * p, 3 * p, 2 * p);
            
            // Body (horizontal, uncurling)
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Belly
            ctx.fillStyle = colors.furLight;
            ctx.fillRect(3 * p, 4 * p, 4 * p, 2 * p);
            
            // Head coming up
            ctx.fillStyle = colors.fur;
            ctx.fillRect(0, 1 * p, 3 * p, 3 * p);
            
            // Ear visible
            ctx.fillRect(0, 0, 2 * p, 1 * p);
            
            // Legs extending
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(6 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = colors.black;
            ctx.fillRect(1 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(1.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = colors.nose;
            ctx.fillRect(0.5 * p, 3 * p, 2, 2);
            break;
            
        case 4: // Landing prep - legs extending
            // Tail
            ctx.fillStyle = colors.fur;
            ctx.fillRect(-1 * p, 3 * p, 2 * p, 2 * p);
            
            // Body
            ctx.fillRect(2 * p, 2 * p, 5 * p, 4 * p);
            
            // Belly
            ctx.fillStyle = colors.furLight;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = colors.fur;
            ctx.fillRect(1 * p, 0, 7 * p, 3 * p);
            
            // Ears
            ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(1.5 * p, -1.5 * p, 1 * p, 1 * p);
            ctx.fillRect(6.5 * p, -1.5 * p, 1 * p, 1 * p);
            
            // Extended legs (ready to land)
            ctx.fillStyle = colors.furDark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 3 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 3 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 1 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 1 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 1.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 1.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = colors.nose;
            ctx.fillRect(4 * p, 2 * p, 2, 2);
            
            // Whiskers
            ctx.fillStyle = colors.black;
            ctx.fillRect(0.5 * p, 2.5 * p, 1.5 * p, 1);
            ctx.fillRect(6.5 * p, 2.5 * p, 1.5 * p, 1);
            break;
    }
}

// Wolf Somersault (similar structure, wolf-specific details)
function drawWolfSomersault(ctx, colors, frame, p) {
    const c = {
        fur: '#607D8B',
        dark: '#455A64',
        light: '#90A4AE',
        eye: '#FFEB3B',
        nose: '#263238'
    };
    
    switch(frame) {
        case 0: // Jump start
            // Bushy tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-2 * p, 5 * p, 3 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(2 * p, 3 * p, 5 * p, 4 * p);
            
            // Chest
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 4 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 0, 7 * p, 4 * p);
            
            // Pointed ears
            ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, -3 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, -3 * p, 1 * p, 1 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 2 * p);
            
            // Yellow eyes
            ctx.fillStyle = c.eye;
            ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p);
            
            // Pupils
            ctx.fillStyle = colors.black;
            ctx.fillRect(2.3 * p, 2.3 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.3 * p, 2.3 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 3 * p, 2, 2);
            break;
            
        case 1: // Quarter flip
            // Tail flowing
            ctx.fillStyle = c.dark;
            ctx.fillRect(-3 * p, 4 * p, 4 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Chest
            ctx.fillStyle = c.light;
            ctx.fillRect(2 * p, 4 * p, 4 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(6 * p, 5 * p, 3 * p, 3 * p);
            
            // Ear
            ctx.fillRect(7 * p, 4 * p, 2 * p, 1 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = c.eye;
            ctx.fillRect(7 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.black;
            ctx.fillRect(7.3 * p, 6.3 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(7.5 * p, 7 * p, 2, 2);
            break;
            
        case 2: // Half flip
            // Tail above
            ctx.fillStyle = c.dark;
            ctx.fillRect(3 * p, 0, 3 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(2 * p, 2 * p, 5 * p, 5 * p);
            
            // Chest (upside down)
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 5 * p, 7 * p, 3 * p);
            
            // Ears pointing down
            ctx.fillRect(2 * p, 8 * p, 2 * p, 1 * p);
            ctx.fillRect(5 * p, 8 * p, 2 * p, 1 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 1 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 1 * p, 2 * p, 2 * p);
            
            // Eyes
            ctx.fillStyle = c.eye;
            ctx.fillRect(2 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 6 * p, 1 * p, 1 * p);
            
            // Pupils
            ctx.fillStyle = colors.black;
            ctx.fillRect(2.3 * p, 6.3 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.3 * p, 6.3 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 5.5 * p, 2, 2);
            break;
            
        case 3: // Three-quarter flip
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(7 * p, 4 * p, 4 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Chest
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 4 * p, 4 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(0, 1 * p, 3 * p, 3 * p);
            
            // Ear
            ctx.fillRect(0, 0, 2 * p, 1 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(6 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = c.eye;
            ctx.fillRect(1 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.black;
            ctx.fillRect(1.3 * p, 2.3 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(0.5 * p, 3 * p, 2, 2);
            break;
            
        case 4: // Landing prep
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-2 * p, 3 * p, 3 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(2 * p, 2 * p, 5 * p, 4 * p);
            
            // Chest
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 0, 7 * p, 3 * p);
            
            // Ears
            ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, -3 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, -3 * p, 1 * p, 1 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 3 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 3 * p);
            
            // Eyes
            ctx.fillStyle = c.eye;
            ctx.fillRect(2 * p, 1 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 1 * p, 1 * p, 1 * p);
            
            // Pupils
            ctx.fillStyle = colors.black;
            ctx.fillRect(2.3 * p, 1.3 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.3 * p, 1.3 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 2 * p, 2, 2);
            break;
    }
}

// Penguin Somersault
function drawPenguinSomersault(ctx, colors, frame, p) {
    const c = {
        body: '#2C3E50',
        belly: 'white',
        beak: '#FF9800',
        feet: '#FF9800'
    };
    
    switch(frame) {
        case 0: // Jump start
            // Body
            ctx.fillStyle = c.body;
            ctx.fillRect(2 * p, 2 * p, 5 * p, 5 * p);
            
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 3 * p);
            
            // Flippers (wings)
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 2 * p, 3 * p);
            ctx.fillRect(6 * p, 3 * p, 2 * p, 3 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(3 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(5 * p, 2 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(3.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(5.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(3.5 * p, 3.5 * p, 2 * p, 1 * p);
            ctx.fillRect(4 * p, 4.5 * p, 1 * p, 0.5 * p);
            
            // Feet tucked
            ctx.fillRect(3 * p, 6.5 * p, 1.5 * p, 0.5 * p);
            ctx.fillRect(4.5 * p, 6.5 * p, 1.5 * p, 0.5 * p);
            break;
            
        case 1: // Quarter flip
            // Body horizontal
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(2 * p, 4 * p, 5 * p, 2 * p);
            
            // Flipper visible
            ctx.fillStyle = c.body;
            ctx.fillRect(6 * p, 2 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = colors.black;
            ctx.fillRect(6 * p, 4 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(6.2 * p, 4.2 * p, 0.4 * p, 0.4 * p);
            
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(7 * p, 5 * p, 1.5 * p, 1 * p);
            break;
            
        case 2: // Half flip
            // Body upside down
            ctx.fillStyle = c.body;
            ctx.fillRect(2 * p, 2 * p, 5 * p, 5 * p);
            
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 3 * p);
            
            // Flippers
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 4 * p, 2 * p, 3 * p);
            ctx.fillRect(6 * p, 4 * p, 2 * p, 3 * p);
            
            // Eyes upside down
            ctx.fillStyle = colors.black;
            ctx.fillRect(3 * p, 5 * p, 1 * p, 1 * p);
            ctx.fillRect(5 * p, 5 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(3.2 * p, 5.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(5.2 * p, 5.2 * p, 0.4 * p, 0.4 * p);
            
            // Beak upside down
            ctx.fillStyle = c.beak;
            ctx.fillRect(3.5 * p, 4 * p, 2 * p, 1 * p);
            
            // Feet above
            ctx.fillRect(3 * p, 1.5 * p, 1.5 * p, 0.5 * p);
            ctx.fillRect(4.5 * p, 1.5 * p, 1.5 * p, 0.5 * p);
            break;
            
        case 3: // Three-quarter flip
            // Body horizontal
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(2 * p, 4 * p, 5 * p, 2 * p);
            
            // Flipper
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 2 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 4 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 4.2 * p, 0.4 * p, 0.4 * p);
            
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(0.5 * p, 5 * p, 1.5 * p, 1 * p);
            break;
            
        case 4: // Landing prep
            // Body
            ctx.fillStyle = c.body;
            ctx.fillRect(2 * p, 2 * p, 5 * p, 5 * p);
            
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 3 * p);
            
            // Flippers
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 2 * p, 3 * p);
            ctx.fillRect(6 * p, 3 * p, 2 * p, 3 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(3 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(5 * p, 2 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(3.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(5.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(3.5 * p, 3.5 * p, 2 * p, 1 * p);
            ctx.fillRect(4 * p, 4.5 * p, 1 * p, 0.5 * p);
            
            // Feet extended for landing
            ctx.fillRect(3 * p, 7 * p, 1.5 * p, 1 * p);
            ctx.fillRect(4.5 * p, 7 * p, 1.5 * p, 1 * p);
            ctx.fillRect(2.5 * p, 8 * p, 2 * p, 0.5 * p);
            ctx.fillRect(4.5 * p, 8 * p, 2 * p, 0.5 * p);
            break;
    }
}

// Dog Somersault
function drawDogSomersault(ctx, colors, frame, p) {
    const c = {
        fur: '#8D6E63',
        dark: '#5D4037',
        light: '#A1887F',
        nose: '#3E2723'
    };
    
    switch(frame) {
        case 0: // Jump start
            // Tail wagging
            ctx.fillStyle = c.dark;
            ctx.fillRect(-2 * p, 4 * p, 2 * p, 3 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(2 * p, 3 * p, 5 * p, 4 * p);
            
            // Chest patch
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 4 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 0, 7 * p, 4 * p);
            
            // Floppy ears
            ctx.fillRect(0, 1 * p, 2 * p, 3 * p);
            ctx.fillRect(7 * p, 1 * p, 2 * p, 3 * p);
            
            // Legs tucked
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 2 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(3.5 * p, 3 * p, 2 * p, 1 * p);
            
            // Tongue
            ctx.fillStyle = '#FF6B9D';
            ctx.fillRect(4 * p, 4 * p, 1 * p, 0.5 * p);
            break;
            
        case 1: // Quarter flip
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-3 * p, 4 * p, 4 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Chest
            ctx.fillStyle = c.light;
            ctx.fillRect(2 * p, 4 * p, 4 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(6 * p, 5 * p, 3 * p, 3 * p);
            
            // Ear flopping
            ctx.fillRect(7 * p, 7 * p, 2 * p, 2 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = colors.black;
            ctx.fillRect(7 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(7.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(7.5 * p, 7 * p, 1.5 * p, 1 * p);
            break;
            
        case 2: // Half flip
            // Tail above
            ctx.fillStyle = c.dark;
            ctx.fillRect(3 * p, 0, 2 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(2 * p, 2 * p, 5 * p, 5 * p);
            
            // Chest upside down
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 5 * p, 7 * p, 3 * p);
            
            // Ears pointing down
            ctx.fillRect(0, 7 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, 7 * p, 2 * p, 2 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 1 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 1 * p, 2 * p, 2 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 6 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(3.5 * p, 7 * p, 2 * p, 1 * p);
            break;
            
        case 3: // Three-quarter flip
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(7 * p, 4 * p, 4 * p, 2 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Chest
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 4 * p, 4 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(0, 1 * p, 3 * p, 3 * p);
            
            // Ear
            ctx.fillRect(0, 3 * p, 2 * p, 2 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(6 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = colors.black;
            ctx.fillRect(1 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(1.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(0.5 * p, 3 * p, 1.5 * p, 1 * p);
            break;
            
        case 4: // Landing prep
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-2 * p, 3 * p, 2 * p, 3 * p);
            
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(2 * p, 2 * p, 5 * p, 4 * p);
            
            // Chest
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 3 * p, 3 * p, 2 * p);
            
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 0, 7 * p, 3 * p);
            
            // Ears
            ctx.fillRect(0, 1 * p, 2 * p, 3 * p);
            ctx.fillRect(7 * p, 1 * p, 2 * p, 3 * p);
            
            // Legs extended
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 3 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 3 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 1 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 1 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 1.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 1.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(3.5 * p, 2 * p, 2 * p, 1 * p);
            
            // Tongue
            ctx.fillStyle = '#FF6B9D';
            ctx.fillRect(4 * p, 3 * p, 1 * p, 0.5 * p);
            break;
    }
}

// Rabbit Somersault
function drawRabbitSomersault(ctx, colors, frame, p) {
    const c = {
        fur: '#E0E0E0',
        dark: '#BDBDBD',
        earInner: '#FFB6C1',
        nose: '#FF69B4'
    };
    
    switch(frame) {
        case 0: // Jump start
            // Fluffy tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(-1 * p, 5 * p, 2 * p, 2 * p);
            ctx.fillRect(-1.5 * p, 4.5 * p, 1 * p, 1 * p);
            
            // Body
            ctx.fillRect(2 * p, 3 * p, 5 * p, 4 * p);
            
            // Head
            ctx.fillRect(1 * p, 0, 7 * p, 4 * p);
            
            // Long ears
            ctx.fillRect(2 * p, -4 * p, 1.5 * p, 4 * p);
            ctx.fillRect(5.5 * p, -4 * p, 1.5 * p, 4 * p);
            
            // Ear insides
            ctx.fillStyle = c.earInner;
            ctx.fillRect(2.3 * p, -3.5 * p, 0.8 * p, 3 * p);
            ctx.fillRect(5.8 * p, -3.5 * p, 0.8 * p, 3 * p);
            
            // Legs tucked
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 2 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Pink nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 3 * p, 1 * p, 1 * p);
            
            // Whiskers
            ctx.fillStyle = colors.black;
            ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 1);
            ctx.fillRect(6.5 * p, 3.5 * p, 1.5 * p, 1);
            break;
            
        case 1: // Quarter flip
            // Tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(-2 * p, 4 * p, 2 * p, 2 * p);
            
            // Body
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Head
            ctx.fillRect(6 * p, 5 * p, 3 * p, 3 * p);
            
            // Ears flopping
            ctx.fillRect(7 * p, 3 * p, 4 * p, 1.5 * p);
            ctx.fillStyle = c.earInner;
            ctx.fillRect(7.5 * p, 3.3 * p, 3 * p, 0.8 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = colors.black;
            ctx.fillRect(7 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(7.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(7.5 * p, 7 * p, 1 * p, 1 * p);
            break;
            
        case 2: // Half flip
            // Tail above
            ctx.fillStyle = c.fur;
            ctx.fillRect(3 * p, 0, 2 * p, 2 * p);
            
            // Body
            ctx.fillRect(2 * p, 2 * p, 5 * p, 5 * p);
            
            // Head upside down
            ctx.fillRect(1 * p, 5 * p, 7 * p, 3 * p);
            
            // Ears pointing down
            ctx.fillRect(2 * p, 8 * p, 1.5 * p, 4 * p);
            ctx.fillRect(5.5 * p, 8 * p, 1.5 * p, 4 * p);
            
            // Ear insides
            ctx.fillStyle = c.earInner;
            ctx.fillRect(2.3 * p, 8.5 * p, 0.8 * p, 3 * p);
            ctx.fillRect(5.8 * p, 8.5 * p, 0.8 * p, 3 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 1 * p, 2 * p, 2 * p);
            ctx.fillRect(5 * p, 1 * p, 2 * p, 2 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 6 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 6 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 6.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 5.5 * p, 1 * p, 1 * p);
            break;
            
        case 3: // Three-quarter flip
            // Tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(7 * p, 4 * p, 2 * p, 2 * p);
            
            // Body
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            
            // Head
            ctx.fillRect(0, 1 * p, 3 * p, 3 * p);
            
            // Ears flopping forward
            ctx.fillRect(-4 * p, 2 * p, 4 * p, 1.5 * p);
            ctx.fillStyle = c.earInner;
            ctx.fillRect(-3.5 * p, 2.3 * p, 3 * p, 0.8 * p);
            
            // Legs
            ctx.fillStyle = c.dark;
            ctx.fillRect(6 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, 6 * p, 2 * p, 2 * p);
            
            // Eye
            ctx.fillStyle = colors.black;
            ctx.fillRect(1 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = colors.white;
            ctx.fillRect(1.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(0.5 * p, 3 * p, 1 * p, 1 * p);
            break;
            
        case 4: // Landing prep
            // Fluffy tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(-1 * p, 3 * p, 2 * p, 2 * p);
            ctx.fillRect(-1.5 * p, 2.5 * p, 1 * p, 1 * p);
            
            // Body
            ctx.fillRect(2 * p, 2 * p, 5 * p, 4 * p);
            
            // Head
            ctx.fillRect(1 * p, 0, 7 * p, 3 * p);
            
            // Ears back up
            ctx.fillRect(2 * p, -4 * p, 1.5 * p, 4 * p);
            ctx.fillRect(5.5 * p, -4 * p, 1.5 * p, 4 * p);
            
            // Ear insides
            ctx.fillStyle = c.earInner;
            ctx.fillRect(2.3 * p, -3.5 * p, 0.8 * p, 3 * p);
            ctx.fillRect(5.8 * p, -3.5 * p, 0.8 * p, 3 * p);
            
            // Legs extended
            ctx.fillStyle = c.dark;
            ctx.fillRect(2 * p, 6 * p, 2 * p, 3 * p);
            ctx.fillRect(5 * p, 6 * p, 2 * p, 3 * p);
            
            // Eyes
            ctx.fillStyle = colors.black;
            ctx.fillRect(2 * p, 1 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 1 * p, 1 * p, 1 * p);
            
            // Eye shine
            ctx.fillStyle = colors.white;
            ctx.fillRect(2.2 * p, 1.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 1.2 * p, 0.4 * p, 0.4 * p);
            
            // Pink nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 2 * p, 1 * p, 1 * p);
            
            // Whiskers
            ctx.fillStyle = colors.black;
            ctx.fillRect(0.5 * p, 2.5 * p, 1.5 * p, 1);
            ctx.fillRect(6.5 * p, 2.5 * p, 1.5 * p, 1);
            break;
    }
}

// Export functions for use in Player class
window.CharacterDrawers = {
    cat: drawCat,
    wolf: drawWolf,
    penguin: drawPenguin,
    dog: drawDog,
    rabbit: drawRabbit
};

window.SomersaultDrawer = drawSomersaultFrame;

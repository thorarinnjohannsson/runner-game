// Character Drawing Functions (Classic Simple Style)

// --- CAT (The classic orange one) ---
function drawCat(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    // Use legOffset for simple animation (ignore runningFrame for classic style)
    const legAnim = legOffset || 0;
    
    // 1. TAIL (Animated)
    const tailWag = Math.sin(animationFrame * 3) * 4;
    ctx.fillStyle = colors.fur || '#E67E22';
    
    // Tail base
    ctx.fillRect(-2 * p, (4 * p) + tailWag, 2 * p, 2 * p);
    // Tail tip
    ctx.fillRect(-3 * p, (3 * p) + tailWag, 2 * p, 2 * p);
    
    // 2. BACK LEGS (Left)
    ctx.fillStyle = colors.furDark || '#D35400';
    ctx.fillRect(2 * p + legAnim, 7 * p, 2 * p, 2 * p);
    
    // 3. BODY
    ctx.fillStyle = colors.fur || '#E67E22';
    ctx.fillRect(2 * p, 4 * p, 6 * p, 3 * p); // Main body
    
    // Belly (Lighter)
    ctx.fillStyle = colors.furLight || '#F39C12';
    ctx.fillRect(3 * p, 5 * p, 4 * p, 2 * p);
    
    // 4. FRONT LEGS (Right)
    ctx.fillStyle = colors.furDark || '#D35400';
    ctx.fillRect(6 * p - legAnim, 7 * p, 2 * p, 2 * p);
    
    // 5. HEAD
    ctx.fillStyle = colors.fur || '#E67E22';
    ctx.fillRect(0, 0, 9 * p, 5 * p); // Big head box
    
    // Ears
    ctx.fillStyle = colors.fur || '#E67E22';
    ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p); // Left Ear base
    ctx.fillRect(1 * p, -3 * p, 1 * p, 1 * p); // Left Ear tip
    
    ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p); // Right Ear base
    ctx.fillRect(7 * p, -3 * p, 1 * p, 1 * p); // Right Ear tip
    
    // Ear Insides
    ctx.fillStyle = colors.furDark || '#D35400';
    ctx.fillRect(1.5 * p, -1.5 * p, 1 * p, 1 * p);
    ctx.fillRect(6.5 * p, -1.5 * p, 1 * p, 1 * p);
    
    // 6. FACE DETAILS
    // Eyes
    ctx.fillStyle = colors.black || '#000000';
    ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p); // Left Eye
    ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p); // Right Eye
    
    // Eye Shine
    ctx.fillStyle = colors.white || '#FFFFFF';
    ctx.fillRect(2.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
    ctx.fillRect(6.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
    
    // Nose
    ctx.fillStyle = colors.nose || '#E74C3C';
    ctx.fillRect(4.5 * p - 1, 3 * p, 2, 2);
    
    // Whiskers
    ctx.fillStyle = colors.black || '#000000';
    ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 1); // Left
    ctx.fillRect(7 * p, 3.5 * p, 1.5 * p, 1);   // Right
}

// --- WOLF (Simple Grey - adapted from old style) ---
function drawWolf(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    const legAnim = legOffset || 0;
    
    // Wolf Palette
    const c = {
        fur: '#78909C',        // Medium grey
        dark: '#607D8B',       // Darker grey
        eye: '#FDD835',        // Yellow eyes
        nose: '#263238'        // Dark nose
    };
    
    // Tail
    const tailWag = Math.sin(animationFrame * 3) * 3;
    ctx.fillStyle = c.dark;
    ctx.fillRect(-2 * p, 4 * p + tailWag, 2 * p, 2 * p);
    
    // Legs
    ctx.fillStyle = c.dark;
    ctx.fillRect(2 * p + legAnim, 7 * p, 2 * p, 2 * p);
    ctx.fillRect(6 * p - legAnim, 7 * p, 2 * p, 2 * p);
    
    // Body
    ctx.fillStyle = c.fur;
    ctx.fillRect(1 * p, 4 * p, 7 * p, 3 * p);
    
    // Head
    ctx.fillStyle = c.fur;
    ctx.fillRect(1 * p, 0, 7 * p, 5 * p);
    
    // Ears (pointed)
    ctx.fillStyle = c.dark;
    ctx.fillRect(0, 0, 2 * p, 2.5 * p);
    ctx.fillRect(6 * p, 0, 2 * p, 2.5 * p);
    
    // Eyes
    ctx.fillStyle = c.eye;
    ctx.fillRect(2.5 * p, 2 * p, 1.5 * p, 1.5 * p);
    ctx.fillRect(4 * p, 2 * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = '#000000';
    ctx.fillRect(2.7 * p, 2.2 * p, p, p);
    ctx.fillRect(4.2 * p, 2.2 * p, p, p);
    
    // Muzzle
    ctx.fillStyle = '#ECEFF1';
    ctx.fillRect(2 * p, 3.5 * p, 4 * p, 1.5 * p);
    
    // Nose
    ctx.fillStyle = c.nose;
    ctx.fillRect(3.5 * p, 3.5 * p, p, p);
}

// --- PENGUIN ---
function drawPenguin(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    const legAnim = legOffset || 0;
    
    // Penguin Palette
    const c = {
        body: '#263238', // Dark Blue/Black
        belly: '#ECEFF1', // White-ish
        beak: '#FF9800', // Orange
        feet: '#FF9800'
    };
    
    // Feet (Waddling)
    ctx.fillStyle = c.feet;
    ctx.fillRect(2 * p + legAnim, 7 * p, 2 * p, 1 * p); // Left
    ctx.fillRect(5 * p - legAnim, 7 * p, 2 * p, 1 * p); // Right
    
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
    ctx.fillStyle = colors.black || '#000000';
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
function drawDog(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    const legAnim = legOffset || 0;
    
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
    ctx.fillRect(2 * p + legAnim, 7 * p, 1.5 * p, 2 * p);
    ctx.fillRect(6.5 * p - legAnim, 7 * p, 1.5 * p, 2 * p);
    
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
    ctx.fillStyle = colors.black || '#000000';
    ctx.fillRect(2.5 * p, 2 * p, 1 * p, 1 * p); // Eye L
    ctx.fillRect(5.5 * p, 2 * p, 1 * p, 1 * p); // Eye R
    
    // Snout
    ctx.fillStyle = '#D7CCC8'; // Light snout
    ctx.fillRect(3 * p, 3.5 * p, 3 * p, 1.5 * p);
    ctx.fillStyle = c.nose;
    ctx.fillRect(4 * p, 3.5 * p, 1 * p, 0.8 * p); // Nose
}

// --- RABBIT ---
function drawRabbit(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    const legAnim = legOffset || 0;
    
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
    ctx.fillRect(2 * p + legAnim, 7 * p + jumpLeg, 2 * p, 1.5 * p);
    ctx.fillRect(5 * p - legAnim, 7 * p + jumpLeg, 2 * p, 1.5 * p);
    
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
    ctx.fillStyle = colors.black || '#000000';
    ctx.fillRect(2 * p, 2.5 * p, 1 * p, 1 * p); // Eye L
    ctx.fillRect(6 * p, 2.5 * p, 1 * p, 1 * p); // Eye R
    
    // Nose (Pink triangle)
    ctx.fillStyle = c.earInner;
    ctx.fillRect(4.2 * p, 3.5 * p, 0.6 * p, 0.6 * p);
    
    // Teeth
    ctx.fillStyle = 'white';
    ctx.fillRect(4.2 * p, 4.2 * p, 0.6 * p, 0.8 * p);
}

// Somersault Functions (5 frames each) - Detailed to match characters

function drawCatSomersault(ctx, colors, frame, p) {
    const c = {
        fur: colors.fur || '#E67E22',
        dark: colors.furDark || '#D35400',
        light: colors.furLight || '#F39C12',
        black: colors.black || '#000000',
        white: colors.white || '#FFFFFF',
        nose: colors.nose || '#E74C3C'
    };
    
    switch(frame) {
        case 0: // Start - Jump position
            // Tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(-2 * p, 4 * p, 2 * p, 2 * p);
            ctx.fillRect(-3 * p, 3 * p, 2 * p, 2 * p);
            // Body
            ctx.fillRect(2 * p, 4 * p, 6 * p, 3 * p);
            // Belly
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 5 * p, 4 * p, 2 * p);
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(0, 0, 9 * p, 5 * p);
            // Ears
            ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, -3 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, -3 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.dark;
            ctx.fillRect(1.5 * p, -1.5 * p, 1 * p, 1 * p);
            ctx.fillRect(6.5 * p, -1.5 * p, 1 * p, 1 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.white;
            ctx.fillRect(2.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4.5 * p - 1, 3 * p, 2, 2);
            // Whiskers
            ctx.fillStyle = c.black;
            ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 1);
            ctx.fillRect(7 * p, 3.5 * p, 1.5 * p, 1);
            break;
        case 1: // Quarter rotation - horizontal
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Belly visible
            ctx.fillStyle = c.light;
            ctx.fillRect(2 * p, 3.5 * p, 5 * p, 1.5 * p);
            // Head (side view)
            ctx.fillStyle = c.fur;
            ctx.fillRect(6 * p, 1 * p, 3 * p, 4 * p);
            // Ear visible
            ctx.fillRect(7 * p, 0, 1.5 * p, 2 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(6.5 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.white;
            ctx.fillRect(6.7 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            break;
        case 2: // Half rotation - upside down
            // Tail (upside down)
            ctx.fillStyle = c.fur;
            ctx.fillRect(-2 * p, 2 * p, 2 * p, 2 * p);
            ctx.fillRect(-3 * p, 3 * p, 2 * p, 2 * p);
            // Body
            ctx.fillRect(2 * p, 2 * p, 6 * p, 3 * p);
            // Belly
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 1 * p, 4 * p, 2 * p);
            // Head (upside down)
            ctx.fillStyle = c.fur;
            ctx.fillRect(0, 4 * p, 9 * p, 5 * p);
            // Ears (upside down)
            ctx.fillRect(1 * p, 8 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, 9 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 8 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, 9 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.dark;
            ctx.fillRect(1.5 * p, 8.5 * p, 1 * p, 1 * p);
            ctx.fillRect(6.5 * p, 8.5 * p, 1 * p, 1 * p);
            // Eyes (upside down)
            ctx.fillStyle = c.black;
            ctx.fillRect(2 * p, 5 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 5 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.white;
            ctx.fillRect(2.2 * p, 5.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 5.2 * p, 0.4 * p, 0.4 * p);
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4.5 * p - 1, 4 * p, 2, 2);
            break;
        case 3: // Three-quarter rotation - horizontal (other side)
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Belly visible
            ctx.fillStyle = c.light;
            ctx.fillRect(2 * p, 3.5 * p, 5 * p, 1.5 * p);
            // Head (other side)
            ctx.fillStyle = c.fur;
            ctx.fillRect(0, 1 * p, 3 * p, 4 * p);
            // Ear visible
            ctx.fillRect(0, 0, 1.5 * p, 2 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(1.5 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.white;
            ctx.fillRect(1.7 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            break;
        case 4: // Landing - back to start position
            // Tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(-2 * p, 4 * p, 2 * p, 2 * p);
            ctx.fillRect(-3 * p, 3 * p, 2 * p, 2 * p);
            // Body
            ctx.fillRect(2 * p, 4 * p, 6 * p, 3 * p);
            // Belly
            ctx.fillStyle = c.light;
            ctx.fillRect(3 * p, 5 * p, 4 * p, 2 * p);
            // Head
            ctx.fillStyle = c.fur;
            ctx.fillRect(0, 0, 9 * p, 5 * p);
            // Ears
            ctx.fillRect(1 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(1 * p, -3 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, -2 * p, 2 * p, 2 * p);
            ctx.fillRect(7 * p, -3 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.dark;
            ctx.fillRect(1.5 * p, -1.5 * p, 1 * p, 1 * p);
            ctx.fillRect(6.5 * p, -1.5 * p, 1 * p, 1 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 2 * p, 1 * p, 1 * p);
            ctx.fillStyle = c.white;
            ctx.fillRect(2.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            ctx.fillRect(6.2 * p, 2.2 * p, 0.4 * p, 0.4 * p);
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4.5 * p - 1, 3 * p, 2, 2);
            // Whiskers
            ctx.fillStyle = c.black;
            ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 1);
            ctx.fillRect(7 * p, 3.5 * p, 1.5 * p, 1);
            break;
    }
}

function drawWolfSomersault(ctx, colors, frame, p) {
    const c = {
        fur: '#78909C',
        dark: '#607D8B',
        eye: '#FDD835',
        muzzle: '#ECEFF1',
        nose: '#263238',
        black: '#000000'
    };
    
    switch(frame) {
        case 0:
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-2 * p, 4 * p, 2 * p, 2 * p);
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 4 * p, 7 * p, 3 * p);
            // Head
            ctx.fillRect(1 * p, 0, 7 * p, 5 * p);
            // Ears
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 0, 2 * p, 2.5 * p);
            ctx.fillRect(6 * p, 0, 2 * p, 2.5 * p);
            // Muzzle
            ctx.fillStyle = c.muzzle;
            ctx.fillRect(2 * p, 3.5 * p, 4 * p, 1.5 * p);
            // Eyes
            ctx.fillStyle = c.eye;
            ctx.fillRect(2.5 * p, 2 * p, 1.5 * p, 1.5 * p);
            ctx.fillRect(4 * p, 2 * p, 1.5 * p, 1.5 * p);
            ctx.fillStyle = c.black;
            ctx.fillRect(2.7 * p, 2.2 * p, p, p);
            ctx.fillRect(4.2 * p, 2.2 * p, p, p);
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(3.5 * p, 3.5 * p, p, p);
            break;
        case 1:
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Head side view
            ctx.fillRect(6 * p, 1 * p, 3 * p, 4 * p);
            // Ear
            ctx.fillStyle = c.dark;
            ctx.fillRect(7 * p, 0, 2 * p, 2.5 * p);
            // Eye
            ctx.fillStyle = c.eye;
            ctx.fillRect(6.5 * p, 2 * p, 1.5 * p, 1.5 * p);
            ctx.fillStyle = c.black;
            ctx.fillRect(6.7 * p, 2.2 * p, p, p);
            break;
        case 2:
            // Tail (upside down)
            ctx.fillStyle = c.dark;
            ctx.fillRect(-2 * p, 2 * p, 2 * p, 2 * p);
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 2 * p, 7 * p, 3 * p);
            // Head (upside down)
            ctx.fillRect(1 * p, 4 * p, 7 * p, 5 * p);
            // Ears (upside down)
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 6.5 * p, 2 * p, 2.5 * p);
            ctx.fillRect(6 * p, 6.5 * p, 2 * p, 2.5 * p);
            // Muzzle
            ctx.fillStyle = c.muzzle;
            ctx.fillRect(2 * p, 4 * p, 4 * p, 1.5 * p);
            // Eyes (upside down)
            ctx.fillStyle = c.eye;
            ctx.fillRect(2.5 * p, 5 * p, 1.5 * p, 1.5 * p);
            ctx.fillRect(4 * p, 5 * p, 1.5 * p, 1.5 * p);
            ctx.fillStyle = c.black;
            ctx.fillRect(2.7 * p, 5.2 * p, p, p);
            ctx.fillRect(4.2 * p, 5.2 * p, p, p);
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(3.5 * p, 4 * p, p, p);
            break;
        case 3:
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Head other side
            ctx.fillRect(0, 1 * p, 3 * p, 4 * p);
            // Ear
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 0, 2 * p, 2.5 * p);
            // Eye
            ctx.fillStyle = c.eye;
            ctx.fillRect(1.5 * p, 2 * p, 1.5 * p, 1.5 * p);
            ctx.fillStyle = c.black;
            ctx.fillRect(1.7 * p, 2.2 * p, p, p);
            break;
        case 4:
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-2 * p, 4 * p, 2 * p, 2 * p);
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 4 * p, 7 * p, 3 * p);
            // Head
            ctx.fillRect(1 * p, 0, 7 * p, 5 * p);
            // Ears
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 0, 2 * p, 2.5 * p);
            ctx.fillRect(6 * p, 0, 2 * p, 2.5 * p);
            // Muzzle
            ctx.fillStyle = c.muzzle;
            ctx.fillRect(2 * p, 3.5 * p, 4 * p, 1.5 * p);
            // Eyes
            ctx.fillStyle = c.eye;
            ctx.fillRect(2.5 * p, 2 * p, 1.5 * p, 1.5 * p);
            ctx.fillRect(4 * p, 2 * p, 1.5 * p, 1.5 * p);
            ctx.fillStyle = c.black;
            ctx.fillRect(2.7 * p, 2.2 * p, p, p);
            ctx.fillRect(4.2 * p, 2.2 * p, p, p);
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(3.5 * p, 3.5 * p, p, p);
            break;
    }
}

function drawPenguinSomersault(ctx, colors, frame, p) {
    const c = {
        body: '#263238',
        belly: '#ECEFF1',
        beak: '#FF9800',
        black: '#000000'
    };
    
    switch(frame) {
        case 0:
            // Feet
            ctx.fillStyle = c.beak;
            ctx.fillRect(2 * p, 7 * p, 2 * p, 1 * p);
            ctx.fillRect(5 * p, 7 * p, 2 * p, 1 * p);
            // Body
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 1 * p, 7 * p, 6 * p);
            ctx.fillRect(2 * p, 0, 5 * p, 1 * p); // Top rounding
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(2.5 * p, 3 * p, 4 * p, 4 * p);
            ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p); // Face white left
            ctx.fillRect(5 * p, 2 * p, 2 * p, 2 * p); // Face white right
            // Wings
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 1.5 * p, 3 * p);
            ctx.fillRect(6.5 * p, 3 * p, 1.5 * p, 3 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2.5 * p, 2.5 * p, 0.8 * p, 0.8 * p);
            ctx.fillRect(5.5 * p, 2.5 * p, 0.8 * p, 0.8 * p);
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(4 * p, 3.5 * p, 2 * p, 1 * p);
            break;
        case 1:
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(2 * p, 4 * p, 5 * p, 2 * p);
            // Wing visible
            ctx.fillStyle = c.body;
            ctx.fillRect(6.5 * p, 2 * p, 1.5 * p, 2 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(6 * p, 4 * p, 0.8 * p, 0.8 * p);
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(7 * p, 5 * p, 1.5 * p, 1 * p);
            break;
        case 2:
            // Feet (upside down)
            ctx.fillStyle = c.beak;
            ctx.fillRect(2 * p, 0, 2 * p, 1 * p);
            ctx.fillRect(5 * p, 0, 2 * p, 1 * p);
            // Body (upside down)
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 1 * p, 7 * p, 6 * p);
            ctx.fillRect(2 * p, 6 * p, 5 * p, 1 * p); // Bottom rounding
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(2.5 * p, 2 * p, 4 * p, 4 * p);
            ctx.fillRect(2 * p, 4 * p, 2 * p, 2 * p); // Face white
            ctx.fillRect(5 * p, 4 * p, 2 * p, 2 * p);
            // Wings
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 2 * p, 1.5 * p, 3 * p);
            ctx.fillRect(6.5 * p, 2 * p, 1.5 * p, 3 * p);
            // Eyes (upside down)
            ctx.fillStyle = c.black;
            ctx.fillRect(2.5 * p, 5 * p, 0.8 * p, 0.8 * p);
            ctx.fillRect(5.5 * p, 5 * p, 0.8 * p, 0.8 * p);
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(4 * p, 4 * p, 2 * p, 1 * p);
            break;
        case 3:
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 4 * p);
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(2 * p, 4 * p, 5 * p, 2 * p);
            // Wing visible (other side)
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 2 * p, 1.5 * p, 2 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(2 * p, 2 * p, 0.8 * p, 0.8 * p);
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(0.5 * p, 5 * p, 1.5 * p, 1 * p);
            break;
        case 4:
            // Feet
            ctx.fillStyle = c.beak;
            ctx.fillRect(2 * p, 7 * p, 2 * p, 1 * p);
            ctx.fillRect(5 * p, 7 * p, 2 * p, 1 * p);
            // Body
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 1 * p, 7 * p, 6 * p);
            ctx.fillRect(2 * p, 0, 5 * p, 1 * p); // Top rounding
            // Belly
            ctx.fillStyle = c.belly;
            ctx.fillRect(2.5 * p, 3 * p, 4 * p, 4 * p);
            ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p); // Face white left
            ctx.fillRect(5 * p, 2 * p, 2 * p, 2 * p); // Face white right
            // Wings
            ctx.fillStyle = c.body;
            ctx.fillRect(1 * p, 3 * p, 1.5 * p, 3 * p);
            ctx.fillRect(6.5 * p, 3 * p, 1.5 * p, 3 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2.5 * p, 2.5 * p, 0.8 * p, 0.8 * p);
            ctx.fillRect(5.5 * p, 2.5 * p, 0.8 * p, 0.8 * p);
            // Beak
            ctx.fillStyle = c.beak;
            ctx.fillRect(4 * p, 3.5 * p, 2 * p, 1 * p);
            break;
    }
}

function drawDogSomersault(ctx, colors, frame, p) {
    const c = {
        fur: '#8D6E63',
        dark: '#5D4037',
        snout: '#D7CCC8',
        nose: '#3E2723',
        black: '#000000'
    };
    
    switch(frame) {
        case 0:
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-1 * p, 4 * p, 1.5 * p, 3 * p);
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 4 * p, 7 * p, 3 * p);
            // Head
            ctx.fillRect(1 * p, 0, 7 * p, 5 * p);
            // Floppy Ears
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 1 * p, 1.5 * p, 3 * p); // Left Ear
            ctx.fillRect(7.5 * p, 1 * p, 1.5 * p, 3 * p); // Right Ear
            // Snout
            ctx.fillStyle = c.snout;
            ctx.fillRect(3 * p, 3.5 * p, 3 * p, 1.5 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2.5 * p, 2 * p, 1 * p, 1 * p); // Eye L
            ctx.fillRect(5.5 * p, 2 * p, 1 * p, 1 * p); // Eye R
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 3.5 * p, 1 * p, 0.8 * p);
            break;
        case 1:
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Head side view
            ctx.fillRect(6 * p, 1 * p, 3 * p, 4 * p);
            // Ear visible
            ctx.fillStyle = c.dark;
            ctx.fillRect(7.5 * p, 1 * p, 1.5 * p, 3 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(6.5 * p, 2 * p, 1 * p, 1 * p);
            break;
        case 2:
            // Tail (upside down)
            ctx.fillStyle = c.dark;
            ctx.fillRect(-1 * p, 1 * p, 1.5 * p, 3 * p);
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 2 * p, 7 * p, 3 * p);
            // Head (upside down)
            ctx.fillRect(1 * p, 4 * p, 7 * p, 5 * p);
            // Ears (upside down)
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 5 * p, 1.5 * p, 3 * p);
            ctx.fillRect(7.5 * p, 5 * p, 1.5 * p, 3 * p);
            // Snout (upside down)
            ctx.fillStyle = c.snout;
            ctx.fillRect(3 * p, 4 * p, 3 * p, 1.5 * p);
            // Eyes (upside down)
            ctx.fillStyle = c.black;
            ctx.fillRect(2.5 * p, 5 * p, 1 * p, 1 * p);
            ctx.fillRect(5.5 * p, 5 * p, 1 * p, 1 * p);
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 4 * p, 1 * p, 0.8 * p);
            break;
        case 3:
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Head other side
            ctx.fillRect(0, 1 * p, 3 * p, 4 * p);
            // Ear visible
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 1 * p, 1.5 * p, 3 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(1.5 * p, 2 * p, 1 * p, 1 * p);
            break;
        case 4:
            // Tail
            ctx.fillStyle = c.dark;
            ctx.fillRect(-1 * p, 4 * p, 1.5 * p, 3 * p);
            // Body
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 4 * p, 7 * p, 3 * p);
            // Head
            ctx.fillRect(1 * p, 0, 7 * p, 5 * p);
            // Floppy Ears
            ctx.fillStyle = c.dark;
            ctx.fillRect(0, 1 * p, 1.5 * p, 3 * p); // Left Ear
            ctx.fillRect(7.5 * p, 1 * p, 1.5 * p, 3 * p); // Right Ear
            // Snout
            ctx.fillStyle = c.snout;
            ctx.fillRect(3 * p, 3.5 * p, 3 * p, 1.5 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2.5 * p, 2 * p, 1 * p, 1 * p); // Eye L
            ctx.fillRect(5.5 * p, 2 * p, 1 * p, 1 * p); // Eye R
            // Nose
            ctx.fillStyle = c.nose;
            ctx.fillRect(4 * p, 3.5 * p, 1 * p, 0.8 * p);
            break;
    }
}

function drawRabbitSomersault(ctx, colors, frame, p) {
    const c = {
        fur: '#F5F5F5',
        shadow: '#E0E0E0',
        earInner: '#F48FB1',
        black: '#000000'
    };
    
    switch(frame) {
        case 0:
            // Tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(-1 * p, 5.5 * p, 1.5 * p, 1.5 * p);
            // Body
            ctx.fillRect(1.5 * p, 3.5 * p, 6 * p, 4 * p);
            // Head
            ctx.fillRect(1 * p, 1 * p, 7 * p, 4 * p);
            // Ears (Long)
            ctx.fillRect(2 * p, -3 * p, 1.5 * p, 4 * p); // Left Ear
            ctx.fillRect(5.5 * p, -3 * p, 1.5 * p, 4 * p); // Right Ear
            // Inner ears (pink)
            ctx.fillStyle = c.earInner;
            ctx.fillRect(2.5 * p, -2.5 * p, 0.5 * p, 3 * p);
            ctx.fillRect(6 * p, -2.5 * p, 0.5 * p, 3 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2 * p, 2.5 * p, 1 * p, 1 * p); // Eye L
            ctx.fillRect(6 * p, 2.5 * p, 1 * p, 1 * p); // Eye R
            // Nose (Pink triangle)
            ctx.fillStyle = c.earInner;
            ctx.fillRect(4.2 * p, 3.5 * p, 0.6 * p, 0.6 * p);
            // Teeth
            ctx.fillStyle = 'white';
            ctx.fillRect(4.2 * p, 4.2 * p, 0.6 * p, 0.8 * p);
            break;
        case 1:
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Head side view
            ctx.fillRect(6 * p, 1 * p, 3 * p, 4 * p);
            // Ear visible
            ctx.fillRect(6.5 * p, -2 * p, 1.5 * p, 4 * p);
            ctx.fillStyle = c.earInner;
            ctx.fillRect(7 * p, -1.5 * p, 0.5 * p, 3 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(6.5 * p, 2 * p, 1 * p, 1 * p);
            break;
        case 2:
            // Tail (upside down)
            ctx.fillStyle = c.fur;
            ctx.fillRect(-1 * p, 1 * p, 1.5 * p, 1.5 * p);
            // Body (upside down)
            ctx.fillRect(1.5 * p, 1 * p, 6 * p, 4 * p);
            // Head (upside down)
            ctx.fillRect(1 * p, 4 * p, 7 * p, 4 * p);
            // Ears (upside down)
            ctx.fillRect(2 * p, 7 * p, 1.5 * p, 4 * p);
            ctx.fillRect(5.5 * p, 7 * p, 1.5 * p, 4 * p);
            ctx.fillStyle = c.earInner;
            ctx.fillRect(2.5 * p, 7.5 * p, 0.5 * p, 3 * p);
            ctx.fillRect(6 * p, 7.5 * p, 0.5 * p, 3 * p);
            // Eyes (upside down)
            ctx.fillStyle = c.black;
            ctx.fillRect(2 * p, 5 * p, 1 * p, 1 * p);
            ctx.fillRect(6 * p, 5 * p, 1 * p, 1 * p);
            // Nose
            ctx.fillStyle = c.earInner;
            ctx.fillRect(4.2 * p, 4 * p, 0.6 * p, 0.6 * p);
            // Teeth
            ctx.fillStyle = 'white';
            ctx.fillRect(4.2 * p, 3.5 * p, 0.6 * p, 0.8 * p);
            break;
        case 3:
            ctx.fillStyle = c.fur;
            ctx.fillRect(1 * p, 3 * p, 7 * p, 3 * p);
            // Head other side
            ctx.fillRect(0, 1 * p, 3 * p, 4 * p);
            // Ear visible
            ctx.fillRect(0, -2 * p, 1.5 * p, 4 * p);
            ctx.fillStyle = c.earInner;
            ctx.fillRect(0.5 * p, -1.5 * p, 0.5 * p, 3 * p);
            // Eye
            ctx.fillStyle = c.black;
            ctx.fillRect(1.5 * p, 2 * p, 1 * p, 1 * p);
            break;
        case 4:
            // Tail
            ctx.fillStyle = c.fur;
            ctx.fillRect(-1 * p, 5.5 * p, 1.5 * p, 1.5 * p);
            // Body
            ctx.fillRect(1.5 * p, 3.5 * p, 6 * p, 4 * p);
            // Head
            ctx.fillRect(1 * p, 1 * p, 7 * p, 4 * p);
            // Ears (Long)
            ctx.fillRect(2 * p, -3 * p, 1.5 * p, 4 * p); // Left Ear
            ctx.fillRect(5.5 * p, -3 * p, 1.5 * p, 4 * p); // Right Ear
            // Inner ears (pink)
            ctx.fillStyle = c.earInner;
            ctx.fillRect(2.5 * p, -2.5 * p, 0.5 * p, 3 * p);
            ctx.fillRect(6 * p, -2.5 * p, 0.5 * p, 3 * p);
            // Eyes
            ctx.fillStyle = c.black;
            ctx.fillRect(2 * p, 2.5 * p, 1 * p, 1 * p); // Eye L
            ctx.fillRect(6 * p, 2.5 * p, 1 * p, 1 * p); // Eye R
            // Nose (Pink triangle)
            ctx.fillStyle = c.earInner;
            ctx.fillRect(4.2 * p, 3.5 * p, 0.6 * p, 0.6 * p);
            // Teeth
            ctx.fillStyle = 'white';
            ctx.fillRect(4.2 * p, 4.2 * p, 0.6 * p, 0.8 * p);
            break;
    }
}

// Somersault dispatcher
function drawSomersaultFrame(ctx, type, colors, frame, p) {
    switch(type) {
        case 'cat':
            drawCatSomersault(ctx, colors, frame, p);
            break;
        case 'wolf':
            drawWolfSomersault(ctx, colors, frame, p);
            break;
        case 'penguin':
            drawPenguinSomersault(ctx, colors, frame, p);
            break;
        case 'dog':
            drawDogSomersault(ctx, colors, frame, p);
            break;
        case 'rabbit':
            drawRabbitSomersault(ctx, colors, frame, p);
            break;
        default:
            drawCatSomersault(ctx, colors, frame, p);
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

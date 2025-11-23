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

// --- FROG ---
function drawFrog(ctx, colors, p, animationFrame, isOnGround, legOffset) {
    // Color Palette Override
    const c = {
        skin: '#7CB342', // Green
        belly: '#AED581', // Light Green
        dark: '#558B2F', // Dark Green
        eye: '#263238', // Dark Grey
        cheek: '#F48FB1' // Pinkish
    };

    // Legs (Hopping)
    ctx.fillStyle = c.dark;
    // Back leg
    ctx.fillRect(1 * p + legOffset, 6 * p, 2 * p, 2 * p);
    // Front leg
    ctx.fillRect(6 * p - legOffset, 6 * p, 2 * p, 2 * p);

    // Body (Rounder)
    ctx.fillStyle = c.skin;
    ctx.fillRect(1 * p, 2 * p, 7 * p, 5 * p); // Main block

    // Belly
    ctx.fillStyle = c.belly;
    ctx.fillRect(2.5 * p, 4 * p, 4 * p, 2.5 * p);

    // Eyes (Protruding)
    ctx.fillStyle = c.skin;
    ctx.fillRect(1 * p, 0, 2.5 * p, 2 * p); // Left Eye Mount
    ctx.fillRect(5.5 * p, 0, 2.5 * p, 2 * p); // Right Eye Mount

    ctx.fillStyle = colors.black;
    ctx.fillRect(1.5 * p, 0.5 * p, 1 * p, 1 * p); // Left Pupil
    ctx.fillRect(6 * p, 0.5 * p, 1 * p, 1 * p); // Right Pupil

    // Wide Smile
    ctx.fillStyle = colors.black;
    ctx.fillRect(2 * p, 3.5 * p, 5 * p, 0.5 * p); // Mouth Line
    ctx.fillRect(1.5 * p, 3 * p, 0.5 * p, 0.5 * p); // Left corner
    ctx.fillRect(7 * p, 3 * p, 0.5 * p, 0.5 * p); // Right corner

    // Cheeks
    ctx.fillStyle = 'rgba(244, 143, 177, 0.6)';
    ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 1 * p);
    ctx.fillRect(7 * p, 3.5 * p, 1.5 * p, 1 * p);
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

// Export functions for use in Player class
window.CharacterDrawers = {
    cat: drawCat,
    frog: drawFrog,
    penguin: drawPenguin,
    dog: drawDog,
    rabbit: drawRabbit
};

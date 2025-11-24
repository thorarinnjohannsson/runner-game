// Character Drawing Functions (called by Player.draw)

// --- CAT (Realistic Orange Tabby) ---
function drawCat(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    // Detailed Cat Palette - Orange Tabby with stripes
    const c = {
        // Base fur colors
        furBase: '#E67E22',       // Orange base
        furMid: '#D35400',        // Mid-tone orange
        furDark: '#A04000',       // Dark orange/brown
        furDarkest: '#7D3C00',    // Darkest for outlines
        
        // Tabby stripes
        stripe: '#B85C00',        // Stripe color
        stripeDark: '#8B4500',    // Dark stripes
        
        // Belly/chest lighter
        belly: '#F39C12',         // Light orange
        bellyLight: '#F8B739',    // Lightest belly
        
        // Face details
        muzzle: '#FDEBD0',        // Cream muzzle
        nose: '#E74C3C',          // Pink nose
        
        // Eyes
        eyeGreen: '#27AE60',      // Green eyes
        eyeDark: '#1E8449',       // Dark green
        pupil: '#000000',
        eyeShine: '#FFFFFF',
        
        // Ears
        earInner: '#F8B739',
        
        // Paws
        pawPad: '#7D3C00'
    };

    // Tail animation (graceful swish)
    const tailSwish = Math.sin(animationFrame * 3) * 3;
    const tailY = 4 * p + tailSwish;
    
    // Draw tail (behind body) with stripes
    ctx.fillStyle = c.furBase;
    ctx.fillRect(-2 * p, tailY, 2 * p, p);
    ctx.fillRect(-3 * p, tailY - p, 2 * p, p);
    ctx.fillRect(-3.5 * p, tailY - 2 * p, 1.5 * p, p);
    
    // Tail stripes
    ctx.fillStyle = c.stripe;
    ctx.fillRect(-2.5 * p, tailY, p, p);
    ctx.fillRect(-3 * p, tailY - p, p, p);
    
    // Tail shadow
    ctx.fillStyle = c.furDark;
    ctx.fillRect(-2 * p, tailY + p, 1.5 * p, 0.5 * p);
    
    // LEGS - Four-legged running animation
    const legPositions = [
        { backLeft: 0, backRight: 2, frontLeft: 2, frontRight: 0 },
        { backLeft: 1, backRight: 1, frontLeft: 1, frontRight: 1 },
        { backLeft: 2, backRight: 0, frontLeft: 0, frontRight: 2 },
        { backLeft: 0.5, backRight: 0.5, frontLeft: 0.5, frontRight: 0.5 }
    ];
    
    const legPos = legPositions[runningFrame % 4];
    
    // Back legs (behind body)
    // Back Left Leg
    ctx.fillStyle = c.furMid;
    ctx.fillRect(2 * p + legPos.backLeft * p, 6.5 * p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(2 * p + legPos.backLeft * p, 8 * p, 1.5 * p, 0.5 * p); // Shadow
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(2 * p + legPos.backLeft * p, 8.5 * p, 1.5 * p, 0.5 * p); // Paw
    
    // Back Right Leg
    ctx.fillStyle = c.furMid;
    ctx.fillRect(4 * p + legPos.backRight * p, 6.5 * p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(4 * p + legPos.backRight * p, 8 * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(4 * p + legPos.backRight * p, 8.5 * p, 1.5 * p, 0.5 * p);
    
    // BODY - Detailed with stripes
    // Main body
    ctx.fillStyle = c.furBase;
    ctx.fillRect(p, 4 * p, 7 * p, 3.5 * p);
    
    // Body shading (top darker)
    ctx.fillStyle = c.furMid;
    ctx.fillRect(p, 4 * p, 7 * p, 1.5 * p);
    
    // Tabby stripes on back
    ctx.fillStyle = c.stripe;
    ctx.fillRect(2 * p, 4.5 * p, p, 2 * p);
    ctx.fillRect(4 * p, 4.5 * p, p, 2 * p);
    ctx.fillRect(6 * p, 4.5 * p, p, 2 * p);
    
    // Darker stripes
    ctx.fillStyle = c.stripeDark;
    ctx.fillRect(3 * p, 4.5 * p, 0.5 * p, 1.5 * p);
    ctx.fillRect(5 * p, 4.5 * p, 0.5 * p, 1.5 * p);
    
    // Belly (lighter, no stripes)
    ctx.fillStyle = c.belly;
    ctx.fillRect(2 * p, 6 * p, 5 * p, 1.5 * p);
    ctx.fillStyle = c.bellyLight;
    ctx.fillRect(3 * p, 6.5 * p, 3 * p, p);
    
    // Front legs (in front of body)
    // Front Left Leg
    ctx.fillStyle = c.furMid;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 6.5 * p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 8 * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 8.5 * p, 1.5 * p, 0.5 * p);
    
    // Front Right Leg
    ctx.fillStyle = c.furMid;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 6.5 * p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 8 * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 8.5 * p, 1.5 * p, 0.5 * p);
    
    // HEAD - Detailed
    // Main head shape
    ctx.fillStyle = c.furBase;
    ctx.fillRect(p, 0, 7 * p, 5 * p);
    
    // Head shading
    ctx.fillStyle = c.furMid;
    ctx.fillRect(p, 0, 7 * p, 2 * p);
    
    // Tabby "M" pattern on forehead
    ctx.fillStyle = c.stripe;
    ctx.fillRect(2 * p, p, p, 1.5 * p);
    ctx.fillRect(3.5 * p, 0.5 * p, p, p);
    ctx.fillRect(5 * p, p, p, 1.5 * p);
    
    // EARS - Triangular with tufts
    // Left Ear
    ctx.fillStyle = c.furMid;
    ctx.fillRect(1.5 * p, -2 * p, 2 * p, 2 * p);
    ctx.fillRect(2 * p, -2.5 * p, p, p);
    ctx.fillStyle = c.earInner;
    ctx.fillRect(2 * p, -1.5 * p, p, 1.5 * p);
    ctx.fillStyle = c.furDarkest;
    ctx.fillRect(1.5 * p, -2 * p, 2 * p, 0.5 * p);
    
    // Right Ear
    ctx.fillStyle = c.furMid;
    ctx.fillRect(5.5 * p, -2 * p, 2 * p, 2 * p);
    ctx.fillRect(6 * p, -2.5 * p, p, p);
    ctx.fillStyle = c.earInner;
    ctx.fillRect(6 * p, -1.5 * p, p, 1.5 * p);
    ctx.fillStyle = c.furDarkest;
    ctx.fillRect(5.5 * p, -2 * p, 2 * p, 0.5 * p);
    
    // MUZZLE/FACE
    ctx.fillStyle = c.muzzle;
    ctx.fillRect(2.5 * p, 3 * p, 4 * p, 2 * p);
    
    // Muzzle shading
    ctx.fillStyle = c.belly;
    ctx.fillRect(3 * p, 3.5 * p, 3 * p, 1 * p);
    
    // NOSE
    ctx.fillStyle = c.nose;
    ctx.fillRect(4 * p, 3.5 * p, p, p);
    // Nose highlight
    ctx.fillStyle = c.bellyLight;
    ctx.fillRect(4 * p, 3.5 * p, 0.5 * p, 0.5 * p);
    
    // EYES - Green cat eyes
    // Left Eye
    ctx.fillStyle = c.eyeGreen;
    ctx.fillRect(2 * p, 2 * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeDark;
    ctx.fillRect(2 * p, 2.5 * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pupil;
    ctx.fillRect(2.5 * p, 2.2 * p, 0.5 * p, p);
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(2.8 * p, 2.3 * p, 0.3 * p, 0.4 * p);
    
    // Right Eye
    ctx.fillStyle = c.eyeGreen;
    ctx.fillRect(5.5 * p, 2 * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeDark;
    ctx.fillRect(5.5 * p, 2.5 * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pupil;
    ctx.fillRect(6 * p, 2.2 * p, 0.5 * p, p);
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(6.3 * p, 2.3 * p, 0.3 * p, 0.4 * p);
    
    // WHISKERS
    ctx.fillStyle = colors.black;
    ctx.fillRect(0.5 * p, 3.5 * p, 2 * p, 0.5);
    ctx.fillRect(0.5 * p, 4 * p, 2 * p, 0.5);
    ctx.fillRect(6.5 * p, 3.5 * p, 2 * p, 0.5);
    ctx.fillRect(6.5 * p, 4 * p, 2 * p, 0.5);
    
    // Fur texture details
    ctx.fillStyle = c.furBase;
    ctx.fillRect(2.5 * p, 5 * p, 0.5 * p, 0.5 * p);
    ctx.fillRect(4.5 * p, 5.5 * p, 0.5 * p, 0.5 * p);
    ctx.fillRect(3 * p, p, 0.5 * p, 0.5 * p);
}

// --- WOLF (Realistic Grey Wolf) ---
function drawWolf(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    // Detailed Wolf Palette
    const c = {
        // Fur gradients
        furBase: '#78909C',       // Medium grey base
        furMid: '#607D8B',        // Mid grey
        furDark: '#455A64',       // Dark grey
        furDarkest: '#37474F',    // Darkest grey/black
        
        // Back darker (saddle marking)
        backDark: '#546E7A',
        backDarkest: '#455A64',
        
        // Chest/belly lighter
        chest: '#90A4AE',         // Light grey
        chestLight: '#B0BEC5',    // Lightest grey
        
        // Face/muzzle
        muzzle: '#ECEFF1',        // Almost white
        muzzleShade: '#CFD8DC',
        nose: '#263238',          // Black nose
        
        // Eyes
        eyeYellow: '#FDD835',     // Bright yellow
        eyeAmber: '#F9A825',      // Amber
        pupil: '#000000',
        eyeShine: '#FFFFFF',
        
        // Paws
        pawPad: '#37474F'
    };

    // Bushy tail (powerful swish)
    const tailSwish = Math.sin(animationFrame * 3) * 2;
    const tailY = 4 * p + tailSwish;
    
    // Draw bushy tail (behind body)
    ctx.fillStyle = c.furDark;
    ctx.fillRect(-3 * p, tailY, 3 * p, 2 * p);
    ctx.fillRect(-4 * p, tailY - p, 2 * p, 2 * p);
    ctx.fillRect(-4.5 * p, tailY - 1.5 * p, 1.5 * p, p);
    
    // Tail fur texture
    ctx.fillStyle = c.furMid;
    ctx.fillRect(-3.5 * p, tailY, 2 * p, p);
    ctx.fillRect(-4 * p, tailY - 0.5 * p, p, p);
    
    // Tail highlights
    ctx.fillStyle = c.chest;
    ctx.fillRect(-3 * p, tailY + 0.5 * p, p, 0.5 * p);
    
    // LEGS - Powerful four-legged gait
    const legPositions = [
        { backLeft: 0, backRight: 2, frontLeft: 2, frontRight: 0 },
        { backLeft: 1, backRight: 1, frontLeft: 1, frontRight: 1 },
        { backLeft: 2, backRight: 0, frontLeft: 0, frontRight: 2 },
        { backLeft: 0.5, backRight: 0.5, frontLeft: 0.5, frontRight: 0.5 }
    ];
    
    const legPos = legPositions[runningFrame % 4];
    
    // Back legs (muscular)
    // Back Left
    ctx.fillStyle = c.furMid;
    ctx.fillRect(2 * p + legPos.backLeft * p, 6.5 * p, 2 * p, 2.5 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(2 * p + legPos.backLeft * p, 6.5 * p, 2 * p, p); // Upper leg darker
    ctx.fillRect(2 * p + legPos.backLeft * p, 8.5 * p, 2 * p, 0.5 * p); // Shadow
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(2 * p + legPos.backLeft * p, 9 * p, 2 * p, 0.5 * p);
    
    // Back Right
    ctx.fillStyle = c.furMid;
    ctx.fillRect(4 * p + legPos.backRight * p, 6.5 * p, 2 * p, 2.5 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(4 * p + legPos.backRight * p, 6.5 * p, 2 * p, p);
    ctx.fillRect(4 * p + legPos.backRight * p, 8.5 * p, 2 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(4 * p + legPos.backRight * p, 9 * p, 2 * p, 0.5 * p);
    
    // BODY - Muscular with saddle marking
    // Main body
    ctx.fillStyle = c.furBase;
    ctx.fillRect(p, 4 * p, 8 * p, 4 * p);
    
    // Saddle marking (darker back)
    ctx.fillStyle = c.backDark;
    ctx.fillRect(p, 4 * p, 8 * p, 2 * p);
    ctx.fillStyle = c.backDarkest;
    ctx.fillRect(2 * p, 4 * p, 6 * p, p);
    
    // Body shading
    ctx.fillStyle = c.furDark;
    ctx.fillRect(p, 4 * p, 7 * p, 0.5 * p); // Top edge
    ctx.fillRect(p, 7 * p, 2 * p, p); // Bottom shadow
    
    // Chest/belly (lighter)
    ctx.fillStyle = c.chest;
    ctx.fillRect(2 * p, 6 * p, 5 * p, 2 * p);
    ctx.fillStyle = c.chestLight;
    ctx.fillRect(3 * p, 6.5 * p, 3 * p, p);
    
    // Fur texture on body
    ctx.fillStyle = c.furMid;
    ctx.fillRect(3 * p, 5 * p, 0.5 * p, 0.5 * p);
    ctx.fillRect(5 * p, 5.5 * p, 0.5 * p, 0.5 * p);
    ctx.fillRect(6.5 * p, 5 * p, 0.5 * p, 0.5 * p);
    
    // Front legs
    // Front Left
    ctx.fillStyle = c.furMid;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 6.5 * p, 2 * p, 2.5 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 8.5 * p, 2 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 9 * p, 2 * p, 0.5 * p);
    
    // Front Right
    ctx.fillStyle = c.furMid;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 6.5 * p, 2 * p, 2.5 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 8.5 * p, 2 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 9 * p, 2 * p, 0.5 * p);
    
    // HEAD - Powerful wolf head
    // Main head shape
    ctx.fillStyle = c.furBase;
    ctx.fillRect(p, 0, 8 * p, 5 * p);
    
    // Head shading (top darker)
    ctx.fillStyle = c.furMid;
    ctx.fillRect(p, 0, 8 * p, 2 * p);
    ctx.fillStyle = c.furDark;
    ctx.fillRect(p, 0, 7 * p, p);
    
    // EARS - Pointed, alert
    // Left Ear
    ctx.fillStyle = c.furMid;
    ctx.fillRect(1.5 * p, -2 * p, 2 * p, 2 * p);
    ctx.fillRect(2 * p, -2.5 * p, p, p);
    ctx.fillStyle = c.chest;
    ctx.fillRect(2 * p, -1.5 * p, p, 1.5 * p); // Inner ear
    ctx.fillStyle = c.furDarkest;
    ctx.fillRect(1.5 * p, -2 * p, 2 * p, 0.5 * p); // Ear edge
    
    // Right Ear
    ctx.fillStyle = c.furMid;
    ctx.fillRect(5.5 * p, -2 * p, 2 * p, 2 * p);
    ctx.fillRect(6 * p, -2.5 * p, p, p);
    ctx.fillStyle = c.chest;
    ctx.fillRect(6 * p, -1.5 * p, p, 1.5 * p);
    ctx.fillStyle = c.furDarkest;
    ctx.fillRect(5.5 * p, -2 * p, 2 * p, 0.5 * p);
    
    // MUZZLE/SNOUT - Protruding
    ctx.fillStyle = c.muzzle;
    ctx.fillRect(2.5 * p, 3 * p, 4 * p, 2 * p);
    ctx.fillStyle = c.muzzleShade;
    ctx.fillRect(2.5 * p, 4.5 * p, 4 * p, 0.5 * p);
    
    // NOSE - Black, prominent
    ctx.fillStyle = c.nose;
    ctx.fillRect(3.5 * p, 3.5 * p, 2 * p, 1.5 * p);
    // Nose highlight
    ctx.fillStyle = c.furMid;
    ctx.fillRect(4 * p, 3.5 * p, 0.5 * p, 0.5 * p);
    
    // EYES - Intense yellow wolf eyes
    // Left Eye
    ctx.fillStyle = c.eyeYellow;
    ctx.fillRect(2 * p, 1.5 * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeAmber;
    ctx.fillRect(2 * p, 2.5 * p, 1.5 * p, 0.5 * p); // Bottom darker
    ctx.fillStyle = c.pupil;
    ctx.fillRect(2.5 * p, 2 * p, 0.6 * p, p); // Vertical slit
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(2.8 * p, 2 * p, 0.3 * p, 0.4 * p);
    
    // Right Eye
    ctx.fillStyle = c.eyeYellow;
    ctx.fillRect(5.5 * p, 1.5 * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeAmber;
    ctx.fillRect(5.5 * p, 2.5 * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pupil;
    ctx.fillRect(6 * p, 2 * p, 0.6 * p, p);
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(6.3 * p, 2 * p, 0.3 * p, 0.4 * p);
    
    // Fur texture on head
    ctx.fillStyle = c.furBase;
    ctx.fillRect(3 * p, p, 0.5 * p, 0.5 * p);
    ctx.fillRect(5.5 * p, 1.5 * p, 0.5 * p, 0.5 * p);
}

// --- PENGUIN (Realistic Detailed) ---
function drawPenguin(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    // Detailed Penguin Palette
    const c = {
        // Body colors
        bodyBlack: '#1A237E',      // Deep blue-black
        bodyDark: '#0D1B2A',       // Darkest blue-black
        bodyShade: '#283593',      // Mid blue-black
        
        // Belly/chest white
        bellyWhite: '#FFFFFF',
        bellyShade: '#E8EAF6',
        bellyGrey: '#C5CAE9',
        
        // Beak/feet orange
        beakOrange: '#FF6F00',
        beakDark: '#E65100',
        beakLight: '#FF8F00',
        feetOrange: '#FF6F00',
        
        // Eyes
        eyeWhite: '#FFFFFF',
        eyeBlack: '#000000',
        eyeShine: '#FFFFFF',
        
        // Flippers
        flipperBlack: '#0D1B2A',
        flipperShade: '#1A237E'
    };

    // Waddle animation - body tilts side to side
    // Frame 0: Lean left, right foot forward
    // Frame 1: Center, both feet together
    // Frame 2: Lean right, left foot forward
    // Frame 3: Center, both feet together
    
    const waddlePositions = [
        { tilt: -1, leftFoot: 0, rightFoot: 1.5, bodyY: 0 },
        { tilt: 0, leftFoot: 0.5, rightFoot: 0.5, bodyY: -0.5 },
        { tilt: 1, leftFoot: 1.5, rightFoot: 0, bodyY: 0 },
        { tilt: 0, leftFoot: 0.5, rightFoot: 0.5, bodyY: -0.5 }
    ];
    
    const waddle = waddlePositions[runningFrame % 4];
    
    // FEET - Orange webbed feet
    // Left Foot
    ctx.fillStyle = c.feetOrange;
    ctx.fillRect(2.5 * p + waddle.leftFoot * p, 7.5 * p, 2 * p, p);
    ctx.fillRect(2 * p + waddle.leftFoot * p, 8 * p, 3 * p, 0.5 * p); // Webbing
    ctx.fillStyle = c.beakDark;
    ctx.fillRect(2.5 * p + waddle.leftFoot * p, 7.5 * p, 2 * p, 0.3 * p); // Shadow
    
    // Right Foot
    ctx.fillStyle = c.feetOrange;
    ctx.fillRect(4.5 * p + waddle.rightFoot * p, 7.5 * p, 2 * p, p);
    ctx.fillRect(4 * p + waddle.rightFoot * p, 8 * p, 3 * p, 0.5 * p);
    ctx.fillStyle = c.beakDark;
    ctx.fillRect(4.5 * p + waddle.rightFoot * p, 7.5 * p, 2 * p, 0.3 * p);
    
    // Apply waddle tilt to body
    ctx.save();
    ctx.translate(4.5 * p, 4 * p);
    ctx.rotate(waddle.tilt * 0.05); // Slight tilt
    ctx.translate(-4.5 * p, -4 * p + waddle.bodyY * p);
    
    // BODY - Rounded penguin shape
    // Main body (black back)
    ctx.fillStyle = c.bodyBlack;
    ctx.fillRect(p, p, 7 * p, 6.5 * p);
    ctx.fillRect(1.5 * p, 0.5 * p, 6 * p, p); // Top rounding
    ctx.fillRect(2 * p, 0, 5 * p, 0.5 * p); // Top curve
    
    // Body shading (darker on back)
    ctx.fillStyle = c.bodyDark;
    ctx.fillRect(p, p, 7 * p, 2 * p);
    ctx.fillRect(p, p, p, 5 * p); // Left side darker
    
    // Body highlights
    ctx.fillStyle = c.bodyShade;
    ctx.fillRect(2 * p, 2 * p, 5 * p, p);
    ctx.fillRect(6 * p, 3 * p, p, 3 * p); // Right side lighter
    
    // BELLY - White patch (distinctive penguin feature)
    ctx.fillStyle = c.bellyWhite;
    ctx.fillRect(2.5 * p, 3 * p, 4 * p, 4 * p);
    ctx.fillRect(3 * p, 2.5 * p, 3 * p, 0.5 * p); // Extend up
    
    // Belly shading
    ctx.fillStyle = c.bellyShade;
    ctx.fillRect(2.5 * p, 3 * p, 4 * p, p);
    ctx.fillRect(2.5 * p, 6.5 * p, 4 * p, 0.5 * p); // Bottom shadow
    
    // Belly highlights
    ctx.fillStyle = c.bellyWhite;
    ctx.fillRect(3.5 * p, 4 * p, 2 * p, 2 * p);
    
    // FLIPPERS/WINGS - Small, held at sides
    const flipperFlap = Math.sin(animationFrame * 4) * p;
    
    // Left Flipper
    ctx.fillStyle = c.flipperBlack;
    ctx.fillRect(0.5 * p, 3.5 * p, 1.5 * p, 3 * p);
    ctx.fillRect(0, 4 * p + flipperFlap, p, 2 * p);
    ctx.fillStyle = c.flipperShade;
    ctx.fillRect(p, 4 * p, 0.5 * p, 2.5 * p);
    
    // Right Flipper
    ctx.fillStyle = c.flipperBlack;
    ctx.fillRect(7 * p, 3.5 * p, 1.5 * p, 3 * p);
    ctx.fillRect(8 * p, 4 * p + flipperFlap, p, 2 * p);
    ctx.fillStyle = c.flipperShade;
    ctx.fillRect(7.5 * p, 4 * p, 0.5 * p, 2.5 * p);
    
    // HEAD - Part of body, no distinct neck
    // White face patches
    ctx.fillStyle = c.bellyWhite;
    ctx.fillRect(2 * p, 2 * p, 2 * p, 2 * p); // Left cheek
    ctx.fillRect(5 * p, 2 * p, 2 * p, 2 * p); // Right cheek
    
    // Face shading
    ctx.fillStyle = c.bellyShade;
    ctx.fillRect(2 * p, 2 * p, 2 * p, 0.5 * p);
    ctx.fillRect(5 * p, 2 * p, 2 * p, 0.5 * p);
    
    // EYES - Round, expressive
    // Left Eye
    ctx.fillStyle = c.eyeWhite;
    ctx.fillRect(2.5 * p, 2.5 * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeBlack;
    ctx.fillRect(3 * p, 3 * p, p, p);
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(3.3 * p, 3 * p, 0.4 * p, 0.4 * p);
    
    // Right Eye
    ctx.fillStyle = c.eyeWhite;
    ctx.fillRect(5 * p, 2.5 * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeBlack;
    ctx.fillRect(5.5 * p, 3 * p, p, p);
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(5.8 * p, 3 * p, 0.4 * p, 0.4 * p);
    
    // BEAK - Orange, triangular
    ctx.fillStyle = c.beakOrange;
    ctx.fillRect(3.5 * p, 4 * p, 2 * p, p);
    ctx.fillRect(4 * p, 4.5 * p, p, 0.5 * p); // Lower beak
    
    // Beak shading
    ctx.fillStyle = c.beakDark;
    ctx.fillRect(3.5 * p, 4 * p, 2 * p, 0.3 * p); // Top edge
    ctx.fillRect(4 * p, 4.7 * p, p, 0.3 * p); // Bottom line
    
    // Beak highlight
    ctx.fillStyle = c.beakLight;
    ctx.fillRect(4 * p, 4.2 * p, 0.5 * p, 0.3 * p);
    
    ctx.restore(); // Restore from waddle tilt
    
    // Texture details (feather hints)
    ctx.fillStyle = c.bodyShade;
    ctx.fillRect(2.5 * p, 2.5 * p, 0.5 * p, 0.5 * p);
    ctx.fillRect(6 * p, 3 * p, 0.5 * p, 0.5 * p);
}

// --- DOG (Realistic Detailed Version) ---
function drawDog(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    // Detailed Dog Palette (Based on reference image)
    const c = {
        // Body fur - multiple shades for depth
        furBase: '#A67C52',      // Medium brown base
        furMid: '#8B6F47',       // Mid-tone brown
        furDark: '#6B5638',      // Dark brown shadows
        furDarkest: '#4A3C2A',   // Darkest shadows/outlines
        
        // Chest/belly lighter tones
        chest: '#C9A882',        // Light tan chest
        chestLight: '#D4B896',   // Lightest chest highlight
        
        // Face details
        snout: '#B89968',        // Snout color
        snoutDark: '#9A7D50',    // Snout shadow
        nose: '#2C1810',         // Dark nose
        
        // Eyes
        eyeWhite: '#FFFFFF',
        eyeBrown: '#3E2723',
        eyeShine: '#FFFFFF',
        
        // Ears
        earOuter: '#6B5638',
        earInner: '#8B6F47',
        
        // Paws
        pawPad: '#4A3C2A',
        
        // Tongue
        tongue: '#FF6B9D'
    };

    // Tail wagging (synchronized with running)
    const tailWag = Math.sin(animationFrame * 6) * 2;
    const tailY = 4 * p + tailWag;
    
    // Draw tail (behind body)
    ctx.fillStyle = c.furDark;
    ctx.fillRect(-2 * p, tailY, 2 * p, p); // Tail base
    ctx.fillRect(-3 * p, tailY - p, 2 * p, p); // Tail mid
    ctx.fillStyle = c.furMid;
    ctx.fillRect(-3.5 * p, tailY - 2 * p, 1.5 * p, p); // Tail tip
    
    // Tail highlight
    ctx.fillStyle = c.furBase;
    ctx.fillRect(-2.5 * p, tailY - p, p, p);
    
    // LEGS - Four-legged running animation based on runningFrame
    // Frame 0: Front-left & back-right forward
    // Frame 1: All legs mid-stride
    // Frame 2: Front-right & back-left forward  
    // Frame 3: All legs bunched (gathering)
    
    const legPositions = [
        // Frame 0: Diagonal pair forward
        { backLeft: 0, backRight: 2, frontLeft: 2, frontRight: 0 },
        // Frame 1: Mid-stride
        { backLeft: 1, backRight: 1, frontLeft: 1, frontRight: 1 },
        // Frame 2: Opposite diagonal forward
        { backLeft: 2, backRight: 0, frontLeft: 0, frontRight: 2 },
        // Frame 3: Bunched/gathering
        { backLeft: 0.5, backRight: 0.5, frontLeft: 0.5, frontRight: 0.5 }
    ];
    
    const legPos = legPositions[runningFrame % 4];
    
    // Back legs (behind body)
    // Back Left Leg
    ctx.fillStyle = c.furDark;
    ctx.fillRect(2 * p + legPos.backLeft * p, 6 * p + p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furMid;
    ctx.fillRect(2 * p + legPos.backLeft * p, 6 * p + p, p, p); // Highlight
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(2 * p + legPos.backLeft * p, 8 * p + p, 1.5 * p, 0.5 * p); // Paw
    
    // Back Right Leg
    ctx.fillStyle = c.furDark;
    ctx.fillRect(4 * p + legPos.backRight * p, 6 * p + p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furMid;
    ctx.fillRect(4 * p + legPos.backRight * p, 6 * p + p, p, p); // Highlight
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(4 * p + legPos.backRight * p, 8 * p + p, 1.5 * p, 0.5 * p); // Paw
    
    // BODY - Detailed with shading
    // Main body shape
    ctx.fillStyle = c.furBase;
    ctx.fillRect(p, 4 * p, 8 * p, 4 * p);
    
    // Body shading (top/back darker)
    ctx.fillStyle = c.furMid;
    ctx.fillRect(p, 4 * p, 8 * p, 1.5 * p); // Back darker
    ctx.fillRect(p, 5.5 * p, p, 2 * p); // Left side darker
    
    // Body shadows (deepest)
    ctx.fillStyle = c.furDark;
    ctx.fillRect(p, 4 * p, 7 * p, p); // Top edge shadow
    ctx.fillRect(p, 7 * p, 2 * p, p); // Bottom shadow
    
    // Chest/belly (lighter, detailed)
    ctx.fillStyle = c.chest;
    ctx.fillRect(2 * p, 5.5 * p, 5 * p, 2.5 * p);
    
    // Chest highlight
    ctx.fillStyle = c.chestLight;
    ctx.fillRect(3 * p, 6 * p, 3 * p, 1.5 * p);
    
    // Front legs (in front of body)
    // Front Left Leg
    ctx.fillStyle = c.furDark;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 6 * p + p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furMid;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 6 * p + p, p, p); // Highlight
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(6 * p + legPos.frontLeft * p, 8 * p + p, 1.5 * p, 0.5 * p); // Paw
    
    // Front Right Leg
    ctx.fillStyle = c.furDark;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 6 * p + p, 1.5 * p, 2 * p);
    ctx.fillStyle = c.furMid;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 6 * p + p, p, p); // Highlight
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(7.5 * p + legPos.frontRight * p, 8 * p + p, 1.5 * p, 0.5 * p); // Paw
    
    // HEAD - Detailed and realistic
    // Main head shape
    ctx.fillStyle = c.furBase;
    ctx.fillRect(p, 0, 8 * p, 5 * p);
    
    // Head shading (top darker)
    ctx.fillStyle = c.furMid;
    ctx.fillRect(p, 0, 8 * p, 2 * p); // Top of head
    
    // Head shadows
    ctx.fillStyle = c.furDark;
    ctx.fillRect(p, 0, 7 * p, p); // Top edge
    ctx.fillRect(p, p, p, 2 * p); // Left side
    
    // EARS - Floppy, detailed
    // Left Ear (outer)
    ctx.fillStyle = c.earOuter;
    ctx.fillRect(0, p, 2 * p, 4 * p);
    // Left Ear (inner/lighter)
    ctx.fillStyle = c.earInner;
    ctx.fillRect(0.5 * p, 1.5 * p, p, 3 * p);
    // Left Ear shadow
    ctx.fillStyle = c.furDarkest;
    ctx.fillRect(0, p, 2 * p, 0.5 * p);
    
    // Right Ear (outer)
    ctx.fillStyle = c.earOuter;
    ctx.fillRect(7 * p, p, 2 * p, 4 * p);
    // Right Ear (inner/lighter)
    ctx.fillStyle = c.earInner;
    ctx.fillRect(7.5 * p, 1.5 * p, p, 3 * p);
    // Right Ear shadow
    ctx.fillStyle = c.furDarkest;
    ctx.fillRect(7 * p, p, 2 * p, 0.5 * p);
    
    // SNOUT - Detailed with shading
    ctx.fillStyle = c.snout;
    ctx.fillRect(2.5 * p, 3 * p, 4 * p, 2 * p);
    
    // Snout highlight (top/bridge)
    ctx.fillStyle = c.chest;
    ctx.fillRect(3 * p, 3 * p, 3 * p, p);
    
    // Snout shadow (bottom)
    ctx.fillStyle = c.snoutDark;
    ctx.fillRect(2.5 * p, 4.5 * p, 4 * p, 0.5 * p);
    
    // NOSE - Detailed
    ctx.fillStyle = c.nose;
    ctx.fillRect(3.5 * p, 3.5 * p, 2 * p, 1.5 * p);
    // Nose highlight (wet look)
    ctx.fillStyle = c.furMid;
    ctx.fillRect(4 * p, 3.5 * p, 0.5 * p, 0.5 * p);
    
    // EYES - Detailed with shine
    // Left Eye white
    ctx.fillStyle = c.eyeWhite;
    ctx.fillRect(2 * p, 1.5 * p, 1.5 * p, 1.5 * p);
    // Left Eye brown
    ctx.fillStyle = c.eyeBrown;
    ctx.fillRect(2.3 * p, 1.8 * p, p, p);
    // Left Eye pupil
    ctx.fillStyle = colors.black;
    ctx.fillRect(2.5 * p, 2 * p, 0.6 * p, 0.6 * p);
    // Left Eye shine
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(2.7 * p, 2 * p, 0.3 * p, 0.3 * p);
    
    // Right Eye white
    ctx.fillStyle = c.eyeWhite;
    ctx.fillRect(5.5 * p, 1.5 * p, 1.5 * p, 1.5 * p);
    // Right Eye brown
    ctx.fillStyle = c.eyeBrown;
    ctx.fillRect(5.7 * p, 1.8 * p, p, p);
    // Right Eye pupil
    ctx.fillStyle = colors.black;
    ctx.fillRect(5.9 * p, 2 * p, 0.6 * p, 0.6 * p);
    // Right Eye shine
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(6.1 * p, 2 * p, 0.3 * p, 0.3 * p);
    
    // MOUTH/TONGUE (happy dog!)
    const mouthOpen = Math.sin(animationFrame * 4) > 0.5;
    if (mouthOpen) {
        ctx.fillStyle = c.tongue;
        ctx.fillRect(4 * p, 4.5 * p, 1.5 * p, p);
    }
    
    // Fur texture details (small highlights for realism)
    ctx.fillStyle = c.furBase;
    ctx.fillRect(3 * p, 5 * p, 0.5 * p, 0.5 * p); // Body texture
    ctx.fillRect(5 * p, 5.5 * p, 0.5 * p, 0.5 * p);
    ctx.fillRect(4 * p, p, 0.5 * p, 0.5 * p); // Head texture
    ctx.fillRect(6 * p, 1.5 * p, 0.5 * p, 0.5 * p);
}

// --- RABBIT (Realistic Fluffy Bunny) ---
function drawRabbit(ctx, colors, p, animationFrame, isOnGround, legOffset, runningFrame = 0) {
    // Detailed Rabbit Palette
    const c = {
        // Fur colors
        furWhite: '#FAFAFA',      // Pure white
        furCream: '#F5F5F5',      // Cream white
        furGrey: '#EEEEEE',       // Light grey
        furShade: '#E0E0E0',      // Shadow grey
        furDark: '#BDBDBD',       // Dark grey
        
        // Ear inner pink
        earPink: '#FFB6C1',       // Light pink
        earPinkDark: '#FF8FA3',   // Darker pink
        
        // Nose/eyes
        nosePink: '#FF69B4',      // Bright pink
        eyeBlack: '#000000',
        eyeShine: '#FFFFFF',
        
        // Paws
        pawPad: '#FFB6C1'
    };

    // Hopping animation - bunches then extends
    // Frame 0: Bunched (preparing to hop)
    // Frame 1: Extending (pushing off)
    // Frame 2: Extended (in air/landing)
    // Frame 3: Bunching (gathering)
    
    const hopPositions = [
        { bodyY: 0, bodyStretch: 0, hindLegs: 0, frontLegs: 0, tailY: 0 },
        { bodyY: -0.5, bodyStretch: 0.5, hindLegs: 1, frontLegs: 0.5, tailY: -0.5 },
        { bodyY: 0, bodyStretch: 1, hindLegs: 2, frontLegs: 1.5, tailY: 0 },
        { bodyY: 0, bodyStretch: 0.3, hindLegs: 0.5, frontLegs: 0.3, tailY: 0 }
    ];
    
    const hop = hopPositions[runningFrame % 4];
    
    // FLUFFY TAIL - Cotton ball
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(-1.5 * p, 5 * p + hop.tailY * p, 2 * p, 2 * p);
    ctx.fillRect(-2 * p, 5.5 * p + hop.tailY * p, p, p); // Extra fluff
    ctx.fillStyle = c.furGrey;
    ctx.fillRect(-1 * p, 5.5 * p + hop.tailY * p, p, p); // Shading
    
    // HIND LEGS - Powerful hopping legs
    // Left Hind Leg
    ctx.fillStyle = c.furCream;
    ctx.fillRect(2 * p, 6 * p + hop.bodyY * p, 2 * p, 2.5 * p + hop.hindLegs * p);
    ctx.fillStyle = c.furShade;
    ctx.fillRect(2 * p, 6 * p + hop.bodyY * p, 2 * p, p); // Upper leg darker
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(2 * p, 8.5 * p + hop.hindLegs * p, 2 * p, 0.5 * p); // Paw pad
    
    // Right Hind Leg
    ctx.fillStyle = c.furCream;
    ctx.fillRect(5 * p, 6 * p + hop.bodyY * p, 2 * p, 2.5 * p + hop.hindLegs * p);
    ctx.fillStyle = c.furShade;
    ctx.fillRect(5 * p, 6 * p + hop.bodyY * p, 2 * p, p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(5 * p, 8.5 * p + hop.hindLegs * p, 2 * p, 0.5 * p);
    
    // BODY - Round, fluffy
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(1.5 * p, 3.5 * p + hop.bodyY * p, 6 * p, 3.5 * p + hop.bodyStretch * p);
    
    // Body shading (top/back)
    ctx.fillStyle = c.furGrey;
    ctx.fillRect(1.5 * p, 3.5 * p + hop.bodyY * p, 6 * p, p);
    ctx.fillRect(1.5 * p, 4.5 * p + hop.bodyY * p, p, 2 * p); // Left side
    
    // Body highlights (fluffy texture)
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(3 * p, 4.5 * p + hop.bodyY * p, 3 * p, 2 * p);
    
    // Fur texture details
    ctx.fillStyle = c.furCream;
    ctx.fillRect(3 * p, 5 * p + hop.bodyY * p, 0.5 * p, 0.5 * p);
    ctx.fillRect(5 * p, 5.5 * p + hop.bodyY * p, 0.5 * p, 0.5 * p);
    
    // FRONT LEGS/PAWS - Small, delicate
    // Left Front Paw
    ctx.fillStyle = c.furCream;
    ctx.fillRect(3 * p, 6.5 * p + hop.bodyY * p, 1.5 * p, 1.5 * p + hop.frontLegs * p);
    ctx.fillStyle = c.furShade;
    ctx.fillRect(3 * p, 7.5 * p + hop.frontLegs * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(3 * p, 8 * p + hop.frontLegs * p, 1.5 * p, 0.3 * p);
    
    // Right Front Paw
    ctx.fillStyle = c.furCream;
    ctx.fillRect(5 * p, 6.5 * p + hop.bodyY * p, 1.5 * p, 1.5 * p + hop.frontLegs * p);
    ctx.fillStyle = c.furShade;
    ctx.fillRect(5 * p, 7.5 * p + hop.frontLegs * p, 1.5 * p, 0.5 * p);
    ctx.fillStyle = c.pawPad;
    ctx.fillRect(5 * p, 8 * p + hop.frontLegs * p, 1.5 * p, 0.3 * p);
    
    // HEAD - Round, fluffy
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(p, p + hop.bodyY * p, 7 * p, 4 * p);
    
    // Head shading
    ctx.fillStyle = c.furGrey;
    ctx.fillRect(p, p + hop.bodyY * p, 7 * p, p);
    
    // Cheek fluff
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(0.5 * p, 2.5 * p + hop.bodyY * p, 2 * p, 2 * p); // Left cheek
    ctx.fillRect(6.5 * p, 2.5 * p + hop.bodyY * p, 2 * p, 2 * p); // Right cheek
    
    // EARS - Long, alert
    const earWiggle = Math.sin(animationFrame * 2) * p;
    
    // Left Ear
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(2 * p, -4 * p + hop.bodyY * p, 1.5 * p, 5 * p);
    ctx.fillRect(2 * p, -4.5 * p + earWiggle + hop.bodyY * p, p, p); // Ear tip
    ctx.fillStyle = c.earPink;
    ctx.fillRect(2.3 * p, -3.5 * p + hop.bodyY * p, 0.8 * p, 4 * p); // Inner ear
    ctx.fillStyle = c.furShade;
    ctx.fillRect(2 * p, -4 * p + hop.bodyY * p, 1.5 * p, 0.5 * p); // Ear edge
    
    // Right Ear
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(5.5 * p, -4 * p + hop.bodyY * p, 1.5 * p, 5 * p);
    ctx.fillRect(6 * p, -4.5 * p + earWiggle + hop.bodyY * p, p, p);
    ctx.fillStyle = c.earPink;
    ctx.fillRect(5.8 * p, -3.5 * p + hop.bodyY * p, 0.8 * p, 4 * p);
    ctx.fillStyle = c.furShade;
    ctx.fillRect(5.5 * p, -4 * p + hop.bodyY * p, 1.5 * p, 0.5 * p);
    
    // EYES - Large, expressive
    // Left Eye
    ctx.fillStyle = c.eyeBlack;
    ctx.fillRect(2 * p, 2.5 * p + hop.bodyY * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(2.5 * p, 2.7 * p + hop.bodyY * p, 0.5 * p, 0.5 * p);
    
    // Right Eye
    ctx.fillStyle = c.eyeBlack;
    ctx.fillRect(5.5 * p, 2.5 * p + hop.bodyY * p, 1.5 * p, 1.5 * p);
    ctx.fillStyle = c.eyeShine;
    ctx.fillRect(6 * p, 2.7 * p + hop.bodyY * p, 0.5 * p, 0.5 * p);
    
    // NOSE - Pink, triangular
    ctx.fillStyle = c.nosePink;
    ctx.fillRect(4 * p, 3.5 * p + hop.bodyY * p, p, p);
    ctx.fillRect(4.2 * p, 4 * p + hop.bodyY * p, 0.6 * p, 0.5 * p); // Nose bottom
    
    // Nose highlight
    ctx.fillStyle = c.earPink;
    ctx.fillRect(4.2 * p, 3.7 * p + hop.bodyY * p, 0.4 * p, 0.3 * p);
    
    // WHISKERS
    ctx.fillStyle = c.furDark;
    ctx.fillRect(0.5 * p, 3.5 * p + hop.bodyY * p, 1.5 * p, 0.5); // Left
    ctx.fillRect(0.5 * p, 4 * p + hop.bodyY * p, 1.5 * p, 0.5);
    ctx.fillRect(7 * p, 3.5 * p + hop.bodyY * p, 1.5 * p, 0.5); // Right
    ctx.fillRect(7 * p, 4 * p + hop.bodyY * p, 1.5 * p, 0.5);
    
    // TEETH - Cute buck teeth
    ctx.fillStyle = c.furWhite;
    ctx.fillRect(4 * p, 4.5 * p + hop.bodyY * p, 0.8 * p, p);
    ctx.fillStyle = c.furShade;
    ctx.fillRect(4.4 * p, 4.5 * p + hop.bodyY * p, 0.2 * p, p); // Gap between teeth
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

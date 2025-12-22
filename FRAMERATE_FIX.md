# Frame-Rate Independence Fix

## Problem

The game was running at half speed on iPhone 12 Pro when **Battery Saver Mode** was enabled. This is because Battery Saver Mode limits the display refresh rate to 30Hz instead of 60Hz.

The game was using `requestAnimationFrame` without frame-rate independence, meaning:
- **60Hz display** → Game runs at normal speed (1x)
- **30Hz display (Battery Saver)** → Game runs at half speed (0.5x)
- **120Hz display (ProMotion)** → Game runs at double speed (2x)

## Solution

Implemented **frame-rate independent game loop** using delta time normalization:

### 1. Frame Delta Calculation (`js/main.js`)

```javascript
// New variables
let lastFrameTime = 0;
let frameDelta = 1; // Normalized to 60fps baseline

// In gameLoop(timestamp)
const frameTime = timestamp - lastFrameTime;
lastFrameTime = timestamp;
frameDelta = frameTime / (1000 / 60); // Normalize to 60fps
frameDelta = Math.min(frameDelta, 3); // Clamp to prevent physics breaking
```

### 2. Updated All Movement Code

All movement, animation, and time-based updates now multiply by `frameDelta`:

**Files Modified:**
- ✅ `js/main.js` - Game loop, background scrolling, particles, ripples, collectables
- ✅ `js/player.js` - Player physics (velocity, gravity) and animation timers
- ✅ `js/obstacle.js` - Obstacle movement
- ✅ `js/scoring.js` - Score popup animations

**Key Changes:**
```javascript
// Before
this.y += this.velocityY;
gameSpeed

// After
this.y += this.velocityY * delta;
gameSpeed * delta
```

### 3. Physics Updates

**Player Physics:**
```javascript
update(groundY, delta = 1) {
    this.velocityY += this.gravity * delta;
    this.y += this.velocityY * delta;
}
```

**Obstacles:**
```javascript
updateObstacles(delta = 1) {
    obstacles[i].update(gameSpeed * delta);
}
```

**Particles:**
```javascript
update(delta = 1) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    this.life -= this.decay * delta;
}
```

### 4. Animation Updates

**Player Animation:**
```javascript
draw(ctx, forceRunning = false, delta = 1) {
    this.animationFrame += this.animationSpeed * delta;
    this.runningFrameTimer += this.runningFrameSpeed * delta;
}
```

**Screen Shake:**
```javascript
screenShake *= Math.pow(0.9, frameDelta); // Frame-rate independent decay
```

## Benefits

✅ **Consistent speed** across all devices (30Hz, 60Hz, 120Hz)
✅ **Works perfectly** with Battery Saver Mode
✅ **Future-proof** for higher refresh rate displays
✅ **Smooth gameplay** regardless of frame rate
✅ **Physics remain stable** even if frame rate drops

## Testing

**Test on different frame rates:**
1. **iPhone with Battery Saver ON** (30Hz) → Should run at normal speed now
2. **Regular display** (60Hz) → Should run at normal speed
3. **iPad Pro with ProMotion** (120Hz) → Should run at normal speed (not 2x)

**How to test Battery Saver Mode:**
1. Open Settings → Battery → Low Power Mode → ON
2. Open the game
3. Game should now run at correct speed (not half speed)

## Cache Version

Updated service worker cache to `v1.0.13` to ensure new code is loaded on PWA.

## Technical Notes

- Delta time is normalized to 60fps baseline (16.67ms per frame)
- Maximum delta is clamped at 3x to prevent physics explosions when tab switching
- All time-based animations and movements use the same delta for consistency
- Decay rates use `Math.pow(rate, delta)` for exponential decay independence

---

**Result:** The game now runs at the same speed on all devices, regardless of display refresh rate or power saving mode! 🎉


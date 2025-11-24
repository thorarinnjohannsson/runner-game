// VISUAL EFFECTS SYSTEM - Enhanced particles and animations

// Gold Coin Particle
class GoldCoin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = -Math.random() * 8 - 4;
        this.gravity = 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.life = 1.0;
        this.size = 12;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.life -= 0.01;
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Gold coin
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(-this.size/3, -this.size/3, this.size/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0 || this.y > canvas.height + 50;
    }
}

// Gem Sparkle Particle
class GemSparkle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = -Math.random() * 10 - 2;
        this.gravity = 0.3;
        this.color = color || ['#FF1493', '#00FFFF', '#FFD700', '#FF69B4'][Math.floor(Math.random() * 4)];
        this.life = 1.0;
        this.size = 8;
        this.twinkle = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= 0.015;
        this.twinkle += 0.2;
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life * (0.5 + Math.sin(this.twinkle) * 0.5);
        
        // Draw diamond shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();
        
        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Dust Particle (for stone carving effects)
class DustParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1.0;
        this.size = 3 + Math.random() * 3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= 0.02;
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life * 0.5;
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Speed Line (for running effect)
class SpeedLine {
    constructor(x, y) {
        this.x = x;
        this.y = y + (Math.random() - 0.5) * 30; // Vary vertical position
        this.length = 15 + Math.random() * 25; // 15-40px long
        this.width = 2 + Math.random() * 2; // 2-4px wide
        this.speed = -8 - Math.random() * 4; // Move backward (left)
        this.life = 1.0;
        this.decay = 0.03 + Math.random() * 0.02;
        this.opacity = 0.6 + Math.random() * 0.4;
    }
    
    update() {
        this.x += this.speed;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life * this.opacity;
        
        // Create gradient for speed line
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(200, 200, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(150, 150, 200, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.length, this.y, this.length, this.width);
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Impact Wave (for landing effect)
class ImpactWave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = 40;
        this.expandSpeed = 3;
        this.life = 1.0;
        this.decay = 0.04;
    }
    
    update() {
        this.radius += this.expandSpeed;
        this.life -= this.decay;
        
        if (this.radius >= this.maxRadius) {
            this.life = 0;
        }
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life * 0.6;
        
        // Draw expanding circle wave
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner glow
        ctx.globalAlpha = this.life * 0.3;
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Torch Flicker Effect
class TorchFlicker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.intensity = 0.8 + Math.random() * 0.2;
        this.flickerSpeed = 0.1 + Math.random() * 0.1;
        this.time = 0;
    }
    
    update() {
        this.time += this.flickerSpeed;
        this.intensity = 0.7 + Math.sin(this.time) * 0.15 + Math.random() * 0.15;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.intensity;
        
        // Flame body
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 40);
        gradient.addColorStop(0, '#FFA500');
        gradient.addColorStop(0.5, '#FF6347');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core
        ctx.fillStyle = '#FFFF00';
        ctx.globalAlpha = this.intensity * 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Screen Flash Effect
class ScreenFlash {
    constructor(color = '#FFFFFF', duration = 0.5) {
        this.color = color;
        this.duration = duration;
        this.life = 1.0;
        this.fadeSpeed = 1 / (duration * 60); // Assuming 60 FPS
    }
    
    update() {
        this.life -= this.fadeSpeed;
    }
    
    draw(ctx, width, height) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life * 0.7;
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Celebration Burst - creates multiple particles at once
function createCelebrationBurst(x, y, count = 30) {
    const effects = [];
    
    // Mix of coins and gems
    for (let i = 0; i < count; i++) {
        if (Math.random() < 0.6) {
            effects.push(new GoldCoin(x, y));
        } else {
            effects.push(new GemSparkle(x, y));
        }
    }
    
    return effects;
}

// Stone Carving Effect - dust particles when text appears
function createStoneCarveEffect(x, y, width) {
    const effects = [];
    const dustCount = 20;
    
    for (let i = 0; i < dustCount; i++) {
        effects.push(new DustParticle(
            x + Math.random() * width,
            y + Math.random() * 20 - 10
        ));
    }
    
    return effects;
}

// Global effects array
let globalEffects = [];

// Add effect to global array
function addEffect(effect) {
    if (Array.isArray(effect)) {
        globalEffects.push(...effect);
    } else {
        globalEffects.push(effect);
    }
}

// Update all effects
function updateEffects() {
    for (let i = globalEffects.length - 1; i >= 0; i--) {
        globalEffects[i].update();
        if (globalEffects[i].isDead && globalEffects[i].isDead()) {
            globalEffects.splice(i, 1);
        }
    }
}

// Draw all effects
function drawEffects(ctx) {
    globalEffects.forEach(effect => {
        if (effect.draw) {
            effect.draw(ctx);
        }
    });
}

// Clear all effects
function clearEffects() {
    globalEffects = [];
}


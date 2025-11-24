// PARALLAX BACKGROUND SYSTEM

class BackgroundLayer {
    constructor(speedMultiplier, drawFunction) {
        this.speedMultiplier = speedMultiplier;
        this.drawFunction = drawFunction;
        this.x = 0;
    }

    update(gameSpeed) {
        this.x -= gameSpeed * this.speedMultiplier;
        // Reset when off screen (assuming pattern repeats every canvas width)
        // We'll handle wrapping in draw
    }

    draw(ctx, canvasWidth, groundY) {
        // Draw twice to create infinite scroll effect
        // Pattern width is assumed to be canvasWidth for simplicity in this generative approach
        const patternWidth = canvasWidth;
        
        // Wrap x
        this.x = this.x % patternWidth;
        
        ctx.save();
        ctx.translate(this.x, 0);
        this.drawFunction(ctx, canvasWidth, groundY);
        ctx.restore();

        ctx.save();
        ctx.translate(this.x + patternWidth, 0);
        this.drawFunction(ctx, canvasWidth, groundY);
        ctx.restore();
        
        // If moving left (x is negative), we might need a third draw to cover the gap on the right edge 
        // if the wrap logic isn't perfect, but usually 2 is enough if we start at 0.
        // Let's ensure full coverage.
        if (this.x < 0) {
             ctx.save();
             ctx.translate(this.x + patternWidth * 2, 0);
             this.drawFunction(ctx, canvasWidth, groundY);
             ctx.restore();
        }
    }
}

class ParallaxBackground {
    constructor() {
        this.layers = [];
        this.initLayers();
    }

    initLayers() {
        // 0. SUN/MOON (Static, furthest back - drawn before clouds)
        this.layers.push(new BackgroundLayer(0, (ctx, width, groundY) => {
            // Draw sun or moon based on theme
            const theme = (typeof currentTheme !== 'undefined') ? currentTheme : {};
            const isNight = theme.isNight || false;
            
            // Position in upper right area
            const sunX = width * 0.85;
            const sunY = 80;
            const sunRadius = 40;
            
            if (isNight) {
                // Draw moon (white/grey)
                ctx.fillStyle = '#F5F5F5';
                ctx.beginPath();
                ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // Moon craters (darker spots)
                ctx.fillStyle = '#E0E0E0';
                ctx.beginPath();
                ctx.arc(sunX - 10, sunY - 5, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(sunX + 8, sunY + 10, 6, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Draw sun with glow
                // Outer glow
                const gradient = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 1.5);
                gradient.addColorStop(0, 'rgba(255, 220, 100, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 220, 100, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(sunX, sunY, sunRadius * 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                // Main sun body
                ctx.fillStyle = '#FFD700'; // Gold
                ctx.beginPath();
                ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // Highlight
                ctx.fillStyle = '#FFEB3B';
                ctx.beginPath();
                ctx.arc(sunX - 10, sunY - 10, sunRadius * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }));
        
        // 1. CLOUDS (Furthest, Slowest)
        this.layers.push(new BackgroundLayer(0.1, (ctx, width, groundY) => {
            // Sky is drawn separately as static background usually, but clouds move
            // Random cloud placement - strictly deterministic for looping
            const cloudColor = (typeof currentTheme !== 'undefined') ? currentTheme.cloudColor : '#FFFFFF';
            const originalFillStyle = ctx.fillStyle;
            // Temporarily set cloud colors for drawing
            drawCloud(width * 0.1, 80, 1.0);
            drawCloud(width * 0.4, 50, 0.8);
            drawCloud(width * 0.75, 90, 1.2);
            ctx.fillStyle = originalFillStyle;
        }));

        // 2. MOUNTAINS (Far, Slow)
        this.layers.push(new BackgroundLayer(0.2, (ctx, width, groundY) => {
            const mountainColor = (typeof currentTheme !== 'undefined') ? currentTheme.mountainColor : '#9EA7B8';
            const mountainSnow = (typeof currentTheme !== 'undefined') ? currentTheme.mountainSnow : '#FFFFFF';
            
            ctx.fillStyle = mountainColor;
            
            // Draw a few peaks
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(width * 0.2, groundY - 150);
            ctx.lineTo(width * 0.4, groundY);
            ctx.lineTo(width * 0.5, groundY - 100);
            ctx.lineTo(width * 0.8, groundY - 200);
            ctx.lineTo(width, groundY);
            ctx.fill();
            
            // Snow caps
            ctx.fillStyle = mountainSnow;
            ctx.beginPath();
            ctx.moveTo(width * 0.2, groundY - 150);
            ctx.lineTo(width * 0.2 + 20, groundY - 120);
            ctx.lineTo(width * 0.2 - 20, groundY - 120);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(width * 0.8, groundY - 200);
            ctx.lineTo(width * 0.8 + 25, groundY - 160);
            ctx.lineTo(width * 0.8 - 25, groundY - 160);
            ctx.fill();
        }));

        // 3. HILLS (Mid-distance)
        this.layers.push(new BackgroundLayer(0.4, (ctx, width, groundY) => {
            const hillColor = (typeof currentTheme !== 'undefined') ? currentTheme.hillColor : '#689F38';
            
            ctx.fillStyle = hillColor;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            
            // Rolling hills using bezier curves
            ctx.bezierCurveTo(width * 0.25, groundY - 100, width * 0.25, groundY, width * 0.5, groundY);
            ctx.bezierCurveTo(width * 0.75, groundY - 80, width * 0.75, groundY, width, groundY);
            
            ctx.lineTo(width, groundY);
            ctx.lineTo(0, groundY);
            ctx.fill();
        }));

        // 4. BUSHES (Closer)
        this.layers.push(new BackgroundLayer(1.0, (ctx, width, groundY) => {
            drawBush(width * 0.15, groundY, 0.9);
            drawBush(width * 0.45, groundY, 1.1);
            drawBush(width * 0.85, groundY, 1.0);
        }));
        
        // 5. GROUND (Closest, moves at game speed - handled by main loop mostly, but let's add detail here)
        // We might want to keep the ground render in main.js for collision visual sync, 
        // or move just the texture here.
    }

    update(gameSpeed) {
        this.layers.forEach(layer => layer.update(gameSpeed));
    }

    draw(ctx, canvasWidth, groundY) {
        // Sky Gradient (Static) - use theme colors
        const skyTop = (typeof currentTheme !== 'undefined') ? currentTheme.skyTop : '#5FB0E8';
        const skyBottom = (typeof currentTheme !== 'undefined') ? currentTheme.skyBottom : '#87CEEB';
        
        const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
        skyGradient.addColorStop(0, skyTop); 
        skyGradient.addColorStop(1, skyBottom);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvasWidth, groundY);

        // Draw parallax layers
        this.layers.forEach(layer => layer.draw(ctx, canvasWidth, groundY));
    }
}

// Global instance
let parallaxBg = null;

function initParallax() {
    parallaxBg = new ParallaxBackground();
}


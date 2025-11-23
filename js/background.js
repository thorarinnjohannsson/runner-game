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
        // 1. CLOUDS (Furthest, Slowest)
        this.layers.push(new BackgroundLayer(0.1, (ctx, width, groundY) => {
            // Sky is drawn separately as static background usually, but clouds move
            // Random cloud placement - strictly deterministic for looping
            drawCloud(width * 0.1, 80, 1.0);
            drawCloud(width * 0.4, 50, 0.8);
            drawCloud(width * 0.75, 90, 1.2);
        }));

        // 2. MOUNTAINS (Far, Slow)
        this.layers.push(new BackgroundLayer(0.2, (ctx, width, groundY) => {
            ctx.fillStyle = '#9EA7B8'; // Grey-blue mountains
            
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
            ctx.fillStyle = 'white';
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
            ctx.fillStyle = '#689F38'; // Dim green
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
        // Sky Gradient (Static)
        const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
        skyGradient.addColorStop(0, '#5FB0E8'); 
        skyGradient.addColorStop(1, '#87CEEB');
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


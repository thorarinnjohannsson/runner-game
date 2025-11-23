// MOBILE UTILITIES AND OPTIMIZATIONS

// Mobile detection
const MOBILE_BREAKPOINT = 768;
let isMobile = window.innerWidth < MOBILE_BREAKPOINT;
let isPortrait = window.innerHeight > window.innerWidth;

// Device capabilities
const hasTouch = 'ontouchstart' in window;
const devicePixelRatio = window.devicePixelRatio || 1;

// Update mobile detection on resize
function updateMobileDetection() {
    isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    isPortrait = window.innerHeight > window.innerWidth;
}

// Get optimal canvas size for current device
function getOptimalCanvasSize() {
    if (!isMobile) {
        // Desktop: keep standard size
        return { width: 800, height: 400 };
    }
    
    // Mobile: Scale to Fit logic
    // We simply take the full available space.
    // Game logic (gravity, spawn rates) might need minor tuning if aspect ratio is extreme,
    // but visual layout is the priority here.
    return { 
        width: window.innerWidth, 
        height: window.innerHeight 
    };
}

// Convert touch/mouse coordinates to canvas coordinates
function getTouchCoordinates(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    
    // Get the touch or mouse position
    let clientX, clientY;
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    
    // Get position relative to canvas display
    const displayX = clientX - rect.left;
    const displayY = clientY - rect.top;
    
    // Scale to canvas internal coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: Math.floor(displayX * scaleX),
        y: Math.floor(displayY * scaleY)
    };
}

// Haptic feedback (vibration)
function triggerHaptic(pattern = 10) {
    if (navigator.vibrate && isMobile) {
        navigator.vibrate(pattern);
    }
}

// Mobile-specific sizing
function getMobileSizes() {
    if (!isMobile) {
        return {
            charSize: 50,
            charSpacing: 120,
            charPadding: 0,
            buttonHeight: 50,
            buttonWidth: 200,
            titleSize: 48,
            subtitleSize: 16,
            buttonTextSize: 24,
            instructionSize: 16,
            hudSize: 20
        };
    }
    
    // Mobile sizes - larger touch targets
    return {
        charSize: 60,
        charSpacing: isPortrait ? 90 : 100,
        charPadding: 15, // Extra invisible tap area
        buttonHeight: 60,
        buttonWidth: Math.min(canvas.width * 0.85, 300),
        titleSize: isPortrait ? 28 : 36,
        subtitleSize: 12,
        buttonTextSize: 20,
        instructionSize: 13,
        hudSize: 16
    };
}

// Performance: reduce particles on mobile
function getParticleCount(baseCount) {
    return isMobile ? Math.floor(baseCount * 0.5) : baseCount;
}

// Performance: should we use screen shake?
function shouldUseScreenShake() {
    return !isMobile; // Disable on mobile to prevent issues
}

// Listen for orientation changes
window.addEventListener('resize', () => {
    updateMobileDetection();
    if (typeof setupResponsiveCanvas === 'function') {
        setupResponsiveCanvas();
    }
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        updateMobileDetection();
        if (typeof setupResponsiveCanvas === 'function') {
            setupResponsiveCanvas();
        }
    }, 100);
});


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
    
    // Mobile: Use viewport dimensions but ensure UI elements fit
    // Account for safe areas (notches, status bars, etc.) and browser UI
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate safe area insets (for devices with notches)
    const safeAreaTop = CSS.supports('padding-top: env(safe-area-inset-top)') 
        ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0 
        : 0;
    const safeAreaBottom = CSS.supports('padding-bottom: env(safe-area-inset-bottom)') 
        ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0 
        : 0;
    const safeAreaLeft = CSS.supports('padding-left: env(safe-area-inset-left)') 
        ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)')) || 0 
        : 0;
    const safeAreaRight = CSS.supports('padding-right: env(safe-area-inset-right)') 
        ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)')) || 0 
        : 0;
    
    // Account for browser UI (address bar, navigation bar, etc.)
    // Mobile browsers typically use ~56px for address bar, ~48px for bottom nav
    // Use visual viewport if available (more accurate for browser UI)
    const visualViewport = window.visualViewport;
    let effectiveWidth = viewportWidth;
    let effectiveHeight = viewportHeight;
    
    if (visualViewport) {
        // Visual viewport accounts for browser UI automatically
        effectiveWidth = visualViewport.width;
        effectiveHeight = visualViewport.height;
    } else {
        // Fallback: estimate browser UI space
        // Address bar: ~56px in portrait, ~0px when scrolled
        // Bottom nav: ~48px on Android, ~0px on iOS
        const browserUIHeight = isPortrait ? 56 : 0; // Conservative estimate
        const browserUIBottom = 48; // Android navigation bar
        
        // Adjust height to account for browser UI
        effectiveHeight = viewportHeight - browserUIHeight - browserUIBottom;
        effectiveHeight = Math.max(effectiveHeight, viewportHeight * 0.8); // Don't reduce too much
    }
    
    // Use effective dimensions but account for safe areas
    return { 
        width: Math.max(effectiveWidth - safeAreaLeft - safeAreaRight, viewportWidth * 0.95), 
        height: Math.max(effectiveHeight - safeAreaTop - safeAreaBottom, viewportHeight * 0.8),
        safeAreaTop,
        safeAreaBottom,
        safeAreaLeft,
        safeAreaRight
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

// Listen for orientation changes and viewport changes
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

// Listen for visual viewport changes (browser UI showing/hiding)
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        // Browser UI has changed (address bar hidden/shown)
        updateMobileDetection();
        if (typeof setupResponsiveCanvas === 'function') {
            setupResponsiveCanvas();
        }
        // Update metadata positions to account for new viewport
        if (typeof updateVersionAndStatsVisibility === 'function') {
            updateVersionAndStatsVisibility();
        }
    });
    
    window.visualViewport.addEventListener('scroll', () => {
        // Viewport scrolled (address bar may have moved)
        if (typeof updateVersionAndStatsVisibility === 'function') {
            updateVersionAndStatsVisibility();
        }
    });
}


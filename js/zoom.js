// Canvas Zoom Controls

// Canvas scale multiplier (1.0 = 100%, stored in localStorage)
let canvasScale = parseFloat(localStorage.getItem('canvasScale')) || 1.0;
const MIN_SCALE = 0.5; // 50% minimum
const MAX_SCALE = 2.0; // 200% maximum
const SCALE_STEP = 0.1; // 10% increments

// Make canvasScale available globally for UI display
if (typeof window !== 'undefined') {
    window.canvasScale = canvasScale;
}

// Apply zoom to canvas
function applyCanvasZoom() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    // Clamp scale to valid range
    canvasScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, canvasScale));
    
    // Update global reference
    if (typeof window !== 'undefined') {
        window.canvasScale = canvasScale;
    }
    
    // Save to localStorage
    localStorage.setItem('canvasScale', canvasScale.toString());
    
    // Apply CSS transform to scale the canvas visually
    // Keep internal resolution the same, just scale display
    canvas.style.transform = `scale(${canvasScale})`;
    canvas.style.transformOrigin = 'center center';
    
    // Update container to accommodate scaled canvas
    const container = document.getElementById('game-container');
    if (container) {
        // Adjust container to fit scaled canvas
        const baseWidth = canvas.width;
        const baseHeight = canvas.height;
        container.style.width = `${baseWidth * canvasScale}px`;
        container.style.height = `${baseHeight * canvasScale}px`;
    }
}

// Zoom in
function zoomIn() {
    canvasScale = Math.min(MAX_SCALE, canvasScale + SCALE_STEP);
    applyCanvasZoom();
    triggerHaptic(10);
}

// Zoom out
function zoomOut() {
    canvasScale = Math.max(MIN_SCALE, canvasScale - SCALE_STEP);
    applyCanvasZoom();
    triggerHaptic(10);
}

// Reset zoom to 100%
function resetZoom() {
    canvasScale = 1.0;
    applyCanvasZoom();
    triggerHaptic(10);
}

// Initialize zoom on page load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            applyCanvasZoom();
        }, 100);
    });
}


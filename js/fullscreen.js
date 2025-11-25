// Fullscreen functionality
let isFullscreen = false;

function toggleFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    // Try canvas element first (better for mobile)
    const canvas = document.getElementById('gameCanvas');
    const element = canvas || document.documentElement;
    
    // Check if fullscreen is supported
    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.log('Fullscreen error:', err);
            // Fallback to document element
            if (element !== document.documentElement && document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        });
    } else if (element.webkitRequestFullscreen) { // Safari/Chrome
        element.webkitRequestFullscreen();
    } else if (element.webkitRequestFullScreen) { // Older Safari
        element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    } else {
        // Mobile fallback: try to maximize viewport
        // iOS Safari doesn't support fullscreen API, so we'll just hide UI elements
        console.log('Fullscreen not supported on this device');
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) { // Older Safari
        document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', updateFullscreenState);
document.addEventListener('webkitfullscreenchange', updateFullscreenState);
document.addEventListener('mozfullscreenchange', updateFullscreenState);
document.addEventListener('MSFullscreenChange', updateFullscreenState);

function updateFullscreenState() {
    isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
    
    // Handle canvas resize if needed
    if (typeof setupResponsiveCanvas === 'function') {
        // Small delay to ensure browser has updated dimensions
        setTimeout(() => {
            setupResponsiveCanvas();
        }, 100);
    }
}


// COLLISION DETECTION

// Check collisions between player and obstacles
function checkCollisions() {
    if (!player) return;
    
    const playerBox = player.getHitbox();
    
    for (let obstacle of obstacles) {
        const obstacleBox = obstacle.getHitbox();
        
        // First check if they're overlapping at all
        if (checkRectCollision(playerBox, obstacleBox)) {
            // Determine collision direction
            const collisionSide = getCollisionSide(playerBox, obstacleBox, player.velocityY);
            
            // Only trigger collision if hitting the LEFT side
            if (collisionSide === 'left') {
                onCollision();
                return; // Only handle one collision per frame
            } else if (collisionSide === 'top') {
                // Landing on top - allow it, just stop falling
                player.y = obstacleBox.y - player.height;
                player.velocityY = 0;
                player.isOnGround = true;
                player.jumpCount = 0; // Reset jump count when landing on obstacle
                player.lastClearType = 'platform'; // Mark as platform landing
                
                // Mark obstacle as "landed on" so we don't keep triggering
                if (!obstacle.landedOn) {
                    obstacle.landedOn = true;
                    // Landing particles removed - using speed lines instead
                }
            } else if (collisionSide === 'bottom') {
                // Hit ceiling - stop upward momentum
                player.y = obstacleBox.y + obstacleBox.height;
                player.velocityY = 0;
                // No death, just bonk
            }
            // Right side collision is OK - player is passing over/past the obstacle
        }
    }
}

// Determine which side of the obstacle was hit
function getCollisionSide(playerBox, obstacleBox, playerVelocityY) {
    // Calculate overlap on each side
    const overlapLeft = (playerBox.x + playerBox.width) - obstacleBox.x;
    const overlapRight = (obstacleBox.x + obstacleBox.width) - playerBox.x;
    const overlapTop = (playerBox.y + playerBox.height) - obstacleBox.y;
    const overlapBottom = (obstacleBox.y + obstacleBox.height) - playerBox.y;
    
    // Find the minimum overlap to determine collision direction
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    
    // Check if landing on top (player is falling down onto obstacle)
    if (minOverlap === overlapTop && playerVelocityY > 0) {
        return 'top';
    }
    
    // Check if hitting from the left (running into obstacle)
    if (minOverlap === overlapLeft) {
        return 'left';
    }
    
    // Right side collision (passing over) - OK
    if (minOverlap === overlapRight) {
        return 'right';
    }
    
    // Check if hitting from bottom (jumping up into obstacle)
    // This happens when player jumps and hits the ceiling of a floating platform
    if (minOverlap === overlapBottom && playerVelocityY < 0) {
        return 'bottom';
    }
    
    // Fallback
    return 'left';
}

// Rectangle collision detection (AABB)
function checkRectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}



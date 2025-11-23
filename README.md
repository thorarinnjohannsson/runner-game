# Runner Game 🎮

A fun endless runner game built with vanilla JavaScript, HTML5 Canvas, and CSS. Perfect for parent-child coding projects!

## How to Play

1. Open `index.html` in any modern web browser
2. Select your character by clicking on one of the colored squares
3. Click the "START GAME" button
4. **Jump mechanics:**
   - Tap/click **once** = single jump (clears 1x obstacles)
   - Tap/click **twice quickly** = double jump (clears 2x obstacles)
   - Tap/click **3 times quickly** = triple jump (clears 3x obstacles)
   - Tap/click **4 times quickly** = quadruple jump (clears 4x obstacles)
5. You have **3 lives** - if you hit an obstacle, you lose a life and the game pauses briefly
6. Try to survive as long as possible and get a high score!

## Game Features

- ⭐ **Multi-tap jump system** - Quick tapping for higher jumps
- 💖 **3 lives system** - Pause and countdown after losing a life
- 📊 **Dynamic difficulty** - Game gets progressively harder over 2-3 minutes
- 🏆 **High score tracking** - Saves your top 5 scores locally
- 🎨 **5 character choices** - Each with unique colors
- ✨ **Particle effects** - Visual feedback for collisions and cleared obstacles
- 📱 **Mobile friendly** - Works with touch controls

## Controls

- **Keyboard:** Spacebar to jump
- **Mouse:** Click to jump
- **Touch:** Tap screen to jump

## Scoring

- **+10 points/second** for surviving
- **+10 points × obstacle level** for clearing each obstacle
  - 1x obstacle = 10 points
  - 2x obstacle = 20 points
  - 3x obstacle = 30 points
  - 4x obstacle = 40 points

## File Structure

```
/game/
├── index.html           # Main HTML file
├── styles.css           # Styling
├── README.md            # This file
└── js/
    ├── main.js          # Game loop and initialization
    ├── player.js        # Player character logic
    ├── obstacle.js      # Obstacle spawning and management
    ├── input.js         # Multi-tap jump detection
    ├── collision.js     # Collision detection
    ├── difficulty.js    # Difficulty scaling
    ├── ui.js            # Start screen and game over screen
    └── storage.js       # High score storage
```

## Kid-Friendly Customization Ideas

1. **Change character colors** - Edit the `characters` array in `js/main.js`
2. **Adjust jump height** - Modify `jumpPowers` array in `js/player.js`
3. **Change game speed** - Adjust `BASE_SPEED` in `js/difficulty.js`
4. **Modify obstacle colors** - Edit `getColorForLevel()` in `js/obstacle.js`
5. **Add new particle effects** - Customize `createParticleExplosion()` in `js/main.js`

## Tips for Parents

- **Start simple:** Play together and adjust difficulty if needed
- **Experiment:** Let your kid modify colors and speeds
- **Celebrate success:** High fives when they beat your high score!
- **Learn together:** Explain how the code works as you explore

## Future Enhancement Ideas

- 🔊 Add sound effects (jump, collision, game over)
- 🎵 Background music
- 🖼️ Replace rectangles with pixel art sprites
- 🌟 Power-ups (shield, slow motion, extra life)
- 🏅 Achievement system
- 👥 Two-player mode
- 🌈 More character options and animations
- 📊 Statistics tracking (total jumps, total distance, etc.)

## Technical Details

- **No dependencies** - Pure vanilla JavaScript
- **60 FPS game loop** using `requestAnimationFrame`
- **localStorage** for persistent high scores
- **Canvas API** for all rendering
- **Responsive design** for desktop and mobile

Enjoy building and playing! 🚀


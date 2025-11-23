# Getting Started with Your Runner Game 🎮

## Quick Start

Your game is ready to play! Here's how to start:

### Option 1: Simple Double-Click (Easiest)
1. Navigate to the `game` folder
2. Double-click on `index.html`
3. The game will open in your default browser

### Option 2: Local Server (Recommended)
1. Open Terminal/Command Prompt
2. Navigate to the game folder:
   ```bash
   cd /Users/thorarinnjohannsson/Sites/game
   ```
3. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```
4. Open your browser and go to: `http://localhost:8080`

## First Time Playing

### Controls
- **Spacebar** or **Click/Tap** anywhere to jump
- **Quick multiple taps** (within 250ms) for higher jumps:
  - 1 tap = Single jump (for 1x obstacles)
  - 2 taps = Double jump (for 2x obstacles)
  - 3 taps = Triple jump (for 3x obstacles)
  - 4 taps = Quadruple jump (for 4x obstacles)

### Game Flow
1. **Start Screen**: Pick a character color
2. **Countdown**: 3... 2... 1... GO!
3. **Play**: Jump over obstacles
4. **Hit Obstacle**: Lose 1 life, pause, countdown, continue
5. **Game Over**: See your score and high scores

## What Makes This Game Special

✅ **All features implemented:**
- Multi-tap jump system (1-4 taps)
- 3 lives with pause/countdown
- Progressive difficulty (gets harder over 2-3 min)
- High score tracking (top 5 saved locally)
- 5 character choices
- Particle effects on collisions
- Mobile touch support
- Responsive design

## Tips for Playing with Your Kid

### First Session
1. **Explore Together**: Click on different characters, try the jumps
2. **Learn the Controls**: Practice single jumps first
3. **Master Multi-Taps**: Work up to double, triple, quadruple jumps
4. **Compete**: Who can get the highest score?

### Fun Challenges
- **Beginner**: Survive 30 seconds
- **Intermediate**: Survive 1 minute
- **Advanced**: Survive 2 minutes
- **Expert**: Get on the high score board
- **Master**: Beat each other's high scores!

## Customization Ideas for Your Kid

### Easy Changes (Great for Kids!)

1. **Change Character Colors** (js/main.js, line ~25)
   ```javascript
   const characters = [
       { name: 'Red Runner', color: '#FF4444' },
       { name: 'Blue Bolt', color: '#4444FF' },
       // Add your own!
       { name: 'Pink Power', color: '#FF69B4' },
   ];
   ```

2. **Make Jumps Higher** (js/player.js, line ~15)
   ```javascript
   this.jumpPowers = [0, -11, -15, -18, -21];
   // Try: [0, -13, -17, -21, -25] for higher jumps!
   ```

3. **Change Game Speed** (js/difficulty.js, line ~3)
   ```javascript
   const BASE_SPEED = 4;
   // Try: 3 for slower, 5 for faster
   ```

4. **More Lives** (js/main.js, line ~29)
   ```javascript
   let lives = 3;
   // Try: 5 for easier game
   ```

### Medium Changes

5. **Obstacle Colors** (js/obstacle.js, line ~14)
   ```javascript
   getColorForLevel(level) {
       const colors = ['#8B4513', '#A0522D', '#CD853F', '#DEB887'];
       // Try rainbow colors!
   }
   ```

6. **Background Colors** (styles.css, line ~15)
   ```css
   background: linear-gradient(to bottom, #87CEEB, #E0F6FF);
   /* Try different colors! */
   ```

## Next Steps - Future Enhancements

### Sound Effects (Easy to Add!)
```javascript
// In main.js, add:
const jumpSound = new Audio('data:audio/wav;base64,...');
jumpSound.play(); // Play when jumping
```

### More Character Designs
- Draw pixel art characters
- Add animation frames for running
- Give characters names and abilities

### Power-Ups
- Shield (1 free hit)
- Slow motion (temporarily slow down)
- Extra life
- Double points

### Game Modes
- Time trial (survive for X seconds)
- Score challenge (reach X points)
- Limited jumps mode
- Night mode (darker colors)

## Troubleshooting

### Game won't load?
- Make sure all files are in the correct folders
- Check browser console (F12) for errors
- Try a different browser (Chrome, Firefox, Safari)

### Controls not working?
- Make sure you clicked on the canvas area
- Try refreshing the page
- Check if JavaScript is enabled

### High scores not saving?
- Make sure localStorage is enabled in browser
- Don't use private/incognito mode
- Clear browser cache if scores seem stuck

## Learning Opportunities

### For Kids to Explore:
- **Variables**: What happens when you change numbers?
- **Colors**: Try different hex codes (#RRGGBB)
- **Logic**: How does the collision detection work?
- **Math**: How is the score calculated?

### For Parents to Explain:
- **Game Loop**: How the game updates 60 times per second
- **Input Handling**: How multi-tap detection works
- **State Management**: How the game knows what screen to show
- **Data Persistence**: How high scores are saved locally

## Have Fun! 🎉

This game is yours to explore, modify, and enjoy. Don't be afraid to break things - you can always restore from the original files!

**Challenge**: Try to modify the game to make it uniquely yours before showing it to friends!

---

Built with ❤️ using vanilla JavaScript, HTML5 Canvas, and CSS
No frameworks, no dependencies, just pure code!


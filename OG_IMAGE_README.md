# Open Graph Preview Image

## Required File: `og-image.png`

The SEO tags are configured to use `og-image.png` as the preview image for social media sharing.

### Image Requirements:

- **Dimensions**: 1200 x 640 pixels (exact)
- **Format**: PNG (recommended) or JPG
- **Content**: Screenshot of the main game screen showing:
  - The start screen with character selection
  - "ANIMAL JUMP" title visible
  - Pixel-art style clearly visible
  - Game UI elements

### How to Create:

1. Start your game server: `npm start`
2. Open the game in your browser: `http://localhost:8000`
3. Make sure you're on the start screen (main menu)
4. Take a screenshot of the game
5. Crop/resize the screenshot to exactly **1200x640 pixels**
6. Save as `og-image.png` in the root directory
7. Ensure the image is optimized (under 1MB recommended)

### Testing:

After creating the image, test it:
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### Current URL in Tags:

The tags reference: `https://thorarinnjohannsson.github.io/runner-game/og-image.png`

This matches your GitHub Pages deployment URL.

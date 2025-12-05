# PWA Icons Needed

To complete the PWA setup with proper icons, create PNG versions of your app icon:

## Required Icons:

1. **icon-192.png** (192x192 pixels)
   - Used for Android home screen
   - Should have transparent or colored background

2. **icon-512.png** (512x512 pixels)
   - Used for Android splash screen
   - Should have transparent or colored background

3. **icon-maskable-512.png** (512x512 pixels) - OPTIONAL
   - For adaptive icons on Android
   - Needs safe zone (content within center 80%)

## Quick Creation Options:

### Option 1: Convert your SVG
Use an online tool like:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png

### Option 2: Use Figma/Canva
- Create 512x512 canvas
- Add your wolf/animal character
- Export as PNG at 192x192 and 512x512

### Option 3: Use favicon-wolfie.svg
Your existing `favicon-wolfie.svg` can be converted to PNG at these sizes.

## After Creating Icons:

Update `manifest.json` to reference the new PNG icons:

```json
"icons": [
  {
    "src": "icon-192.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "icon-512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "icon-maskable-512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable"
  }
]
```

## Note:

The PWA will work with your current SVG icons, but PNG icons provide better compatibility across all devices and platforms.


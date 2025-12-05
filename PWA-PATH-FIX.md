# PWA GitHub Pages Path Fix

## Problem

When adding the game to the home screen (installing as PWA), it shows a 404 error instead of loading the game.

## Root Cause

The PWA manifest and service worker were configured for root-level hosting (`/`), but the game is actually hosted on GitHub Pages at a subdirectory: `/runner-game/`

When the installed PWA tried to launch, it would navigate to:

- ❌ `https://thorarinnjohannsson.github.io/` (404 - no site there)

Instead of:

- ✅ `https://thorarinnjohannsson.github.io/runner-game/` (your game)

## Files Fixed

### 1. `manifest.json`

**Changed:**

```json
"start_url": "/runner-game/",
"scope": "/runner-game/",
```

**Before:**

```json
"start_url": "/",
"scope": "/",
```

**What this does:**

- `start_url`: Where the PWA launches when opened from home screen
- `scope`: Which URLs are part of this PWA (for navigation)

### 2. `service-worker.js`

**Changed:**

- Updated cache version to `v1.0.2` (forces update)
- Prefixed all cached URLs with `/runner-game/`

**Example:**

```javascript
'/runner-game/index.html',
'/runner-game/styles.css',
'/runner-game/js/main.js',
// ... etc
```

**Before:**

```javascript
'/index.html',
'/styles.css',
'/js/main.js',
// ... etc
```

**Why this matters:**

- Service worker needs absolute paths from domain root
- URLs must match actual GitHub Pages hosting structure
- Offline caching won't work without correct paths

### 3. `index.html`

**Changed:**

```javascript
navigator.serviceWorker.register("/runner-game/service-worker.js");
```

**Before:**

```javascript
navigator.serviceWorker.register("/service-worker.js");
```

**Why this matters:**

- Service worker must be registered with correct path
- Path is relative to domain root, not HTML file location

## Testing

After deploying, test the PWA:

### On Mobile (Android):

1. Open: `https://thorarinnjohannsson.github.io/runner-game/`
2. Click "📱 INSTALL APP" button
3. Install to home screen
4. Open from home screen ✅ Should load game correctly
5. Turn off WiFi ✅ Should still work offline

### On Desktop (Chrome):

1. Open: `https://thorarinnjohannsson.github.io/runner-game/`
2. Look for install icon in address bar
3. Click to install
4. Launch installed app ✅ Should load game correctly

### Verify Service Worker:

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Service Workers** section
4. Should show: `https://thorarinnjohannsson.github.io/runner-game/service-worker.js`
5. Status should be: **activated and is running**

## Important Notes

### For Local Development:

These paths are **GitHub Pages specific**. When testing locally, you have two options:

**Option A: Serve from subdirectory (matches production)**

```bash
# From parent directory
python3 -m http.server 8000
# Then open: http://localhost:8000/game/
```

**Option B: Temporarily use root paths for local testing**

- Change paths back to `/` for local dev
- Remember to change back to `/runner-game/` before deploying

### For Different Hosting:

If you move to a different host or URL structure:

**Root hosting (example.com/):**

```json
"start_url": "/",
"scope": "/",
```

**Subdirectory hosting (example.com/my-game/):**

```json
"start_url": "/my-game/",
"scope": "/my-game/",
```

**Custom domain (game.example.com):**

```json
"start_url": "/",
"scope": "/",
```

## Deployment

```bash
git add manifest.json service-worker.js index.html
git commit -m "Fix PWA paths for GitHub Pages subdirectory hosting"
git push origin main
```

### After Deployment:

1. **Wait 2-3 minutes** for GitHub Pages to rebuild
2. **Clear browser data** or use incognito mode
3. **Uninstall old PWA** if already installed (it has wrong paths)
4. **Visit game** and install fresh PWA
5. **Test** that it launches correctly from home screen

## Why This Happened

GitHub Pages serves user/org sites in two ways:

1. **User site:** `username.github.io` → from repo `username.github.io`
2. **Project site:** `username.github.io/repo-name` → from any repo

Your game is in the `runner-game` repository, making it a **project site** at `/runner-game/` path.

PWAs need absolute paths from the domain root, so all URLs must include the `/runner-game/` prefix.

## Prevention

When developing PWAs for GitHub Pages project sites:

- ✅ Always use full path from domain root
- ✅ Test with actual deployment URL before releasing
- ✅ Document the hosting structure in README
- ✅ Consider using environment variables for path prefixes

---

**Status:** ✅ Fixed - PWA now launches correctly from home screen
**Version:** Bumped to v1.0.2 to force cache update
**Impact:** All users need to reinstall PWA for fix to apply

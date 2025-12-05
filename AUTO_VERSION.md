# Auto-Versioning Setup

## How It Works

The project now has **automatic version management** using a git pre-commit hook.

### What Happens on Every Commit

1. **Auto-increment**: The `VERSION` file is automatically incremented (31, 32, 33, etc.)
2. **Git info captured**: Commit hash, date, and message are extracted
3. **version.json updated**: All version info is written to `version.json`
4. **Files staged**: Both files are automatically added to your commit

### No Manual Work Required

Just commit normally:
```bash
git add .
git commit -m "Your commit message"
git push
```

The version will automatically increment from v30 → v31 → v32, etc.

### What Gets Updated

**VERSION file:**
```
31
```

**version.json:**
```json
{
  "version": "31",
  "hash": "a1b2c3d",
  "date": "2025-12-05 17:30:00 +0100",
  "message": "Your commit message",
  "timestamp": 1764950400000
}
```

### Benefits

- ✅ No more manual version updates
- ✅ Version always in sync with commits
- ✅ Automatic on every commit
- ✅ Includes git metadata
- ✅ Works locally (no GitHub Actions needed)

### How It Was Set Up

The pre-commit hook is located at:
```
.git/hooks/pre-commit
```

This file is **not tracked by git** (git ignores the `.git` folder), so it only exists on your local machine. If you clone the repo on another machine, you'd need to recreate it.

### Testing It

Try making a commit right now:
```bash
git add .
git commit -m "Test auto-versioning"
```

You should see: `✅ Version auto-incremented to v31`

The version will appear in the game's bottom-left corner!


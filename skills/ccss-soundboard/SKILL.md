---
name: ccss-claude-code-audio-feedback
description: Use when setting up audio notifications for Claude Code hooks to get notified when tasks complete or when Claude needs attention. Works across Mac, Windows, and Linux.
---

# Claude Code Audio Feedback with Hooks

## Overview

Get audio notifications when Claude Code finishes tasks or needs your attention. Uses native platform audio tools (no npm dependencies).

## When to Use

- Working on multiple tasks while Claude processes in background
- Long-running operations where you need an audible cue
- Debugging sessions with frequent back-and-forth
- Any scenario where you might miss visual notifications

## Core Pattern

Three hooks respond to different events:

| Hook | Trigger | Use Case |
|------|---------|----------|
| `Notification` | Claude needs your input | "Come back, I have a question" |
| `Stop` | Claude finishes a task | "Done, review the changes" |
| `SubagentStop` | Subagent completes | "Background work finished" |

## Platform Audio Commands

```typescript
// Detect platform and play sound
const playSound = (filePath: string) => {
  const isMac = process.platform === 'darwin';
  const isWindows = process.platform === 'win32';

  if (isMac) {
    return `afplay "${filePath}"`;
  } else if (isWindows) {
    return `PowerShell -c (New-Object System.Media.SoundPlayer "${filePath}").PlaySync()`;
  } else {
    // Linux - try aplay first, then paplay
    return `aplay "${filePath}" 2>/dev/null || paplay "${filePath}"`;
  }
};
```

## Quick Setup

### 1. Create Hook Directory

```bash
mkdir -p ~/.claude/hooks
```

### 2. Add Sound Files

Place two `.wav` files in `~/.claude/hooks/`:

- `notification.wav` - Attention-grabbing sound for prompts
- `done.wav` - Completion sound

### 3. Configure Hooks

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": {
      "command": "npx tsx ~/.claude/hooks/notification.ts --notify"
    },
    "Stop": {
      "command": "npx tsx ~/.claude/hooks/stop.ts"
    },
    "SubagentStop": {
      "command": "npx tsx ~/.claude/hooks/subagent_stop.ts"
    }
  }
}
```

## Hook Implementation Files

Create these three TypeScript files in `~/.claude/hooks/`:

### notification.ts

```typescript
#!/usr/bin/env npx tsx
import { playSound, log, isNotify } from './shared';

const sound = 'notification.wav';

if (isNotify()) {
  log('Claude needs attention');
  playSound(sound);
}
```

### stop.ts

```typescript
#!/usr/bin/env npx tsx
import { playSound, log } from './shared';

const sound = 'done.wav';
log('Claude finished task');
playSound(sound);
```

### subagent_stop.ts

```typescript
#!/usr/bin/env npx tsx
import { playSound, log } from './shared';

const sound = 'done.wav';
log('Subagent finished');
playSound(sound);
```

### shared.ts

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const hooksDir = path.dirname(__filename);

export const playSound = (filename: string): void => {
  const filePath = path.join(hooksDir, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`Sound file not found: ${filePath}`);
    return;
  }

  const cmd = getPlayCommand(filePath);
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {
    console.error(`Failed to play sound: ${(e as Error).message}`);
  }
};

export const getPlayCommand = (filePath: string): string => {
  const platform = process.platform;

  if (platform === 'darwin') {
    return `afplay "${filePath}"`;
  } else if (platform === 'win32') {
    return `PowerShell -c (New-Object System.Media.SoundPlayer "${filePath}").PlaySync()`;
  } else {
    return `aplay "${filePath}" 2>/dev/null || paplay "${filePath}"`;
  }
};

export const log = (message: string): void => {
  const logFile = path.join(hooksDir, 'activity.log');
  const entry = { timestamp: new Date().toISOString(), message };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
};

export const isNotify = (): boolean => {
  return process.argv.includes('--notify');
};
```

## Common Mistakes

| Issue | Fix |
|-------|-----|
| Sound not playing | Verify `.wav` files exist in hooks directory |
| Windows PowerShell error | Enable PowerShell execution policy |
| Linux no sound | Install `aplay` (alsa-utils) or `paplay` (pulseaudio) |
| Hook not firing | Check `settings.json` has valid hook config |

## Testing

```bash
# Test notification hook
npx tsx ~/.claude/hooks/notification.ts --notify

# Test stop hook
npx tsx ~/.claude/hooks/stop.ts
```

## Source

Based on [Pascal Poredda's audio feedback system](https://www.pascal-poredda.com/blog/claude-code-audio-feedback-with-hooks)

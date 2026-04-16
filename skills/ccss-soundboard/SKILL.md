---
name: ccss-soundboard
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

## Hook → Sound Mapping (from `sounds.json`)

| Hook | Sound | Note |
|------|-------|------|
| `Elicitation` | `rizz.wav` | needs input |
| `Stop` | `pop.wav` | task done |
| `StopFailure` | `faa.wav` | task failed |
| `SessionStart` | `yeahbuddy.wav` | session starts |
| `SessionEnd` | `lightweight.wav` | session ends |

## Configuration

All hooks route through a single `play.ts` driven by `sounds.json`:

```json
{
  "Elicitation": { "sound": "pop", "checkFocus": true },
  "Stop": "rizz",
  "StopFailure": "faa",
  "SessionStart": "yeahbuddy",
  "SessionEnd": "lightweight"
}
```

Add to `settings.json`:

```json
{
  "hooks": {
    "Elicitation": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "npx tsx \"C:/Users/samlo/.claude/plugins/ccss/skills/ccss-soundboard/play.ts\" Elicitation" }] }],
    "Stop": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "npx tsx \"C:/Users/samlo/.claude/plugins/ccss/skills/ccss-soundboard/play.ts\" Stop" }] }],
    "StopFailure": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "npx tsx \"C:/Users/samlo/.claude/plugins/ccss/skills/ccss-soundboard/play.ts\" StopFailure" }] }],
    "SessionStart": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "npx tsx \"C:/Users/samlo/.claude/plugins/ccss/skills/ccss-soundboard/play.ts\" SessionStart" }] }],
    "SessionEnd": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "npx tsx \"C:/Users/samlo/.claude/plugins/ccss/skills/ccss-soundboard/play.ts\" SessionEnd" }] }]
  }
}
```

## Testing

```bash
npx tsx C:/Users/samlo/.claude/plugins/ccss/skills/ccss-soundboard/play.ts Stop
```

## Source

Based on [Pascal Poredda's audio feedback system](https://www.pascal-poredda.com/blog/claude-code-audio-feedback-with-hooks)

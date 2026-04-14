# CCSS - Claude Code Skill Set

Collection of skills for Claude Code covering frontend development, component orchestration, audio feedback, and more.

## Skills

| Skill | Description |
|-------|-------------|
| `ccss-frontend-dev-cycle` | Iterative frontend dev with Playwright visual testing |
| `ccss-navigation-recorder-automator` | Record/replay browser navigation flows |
| `ccss-component-orchestrator` | Find existing components for a task |
| `ccss-component-reverse-engineer` | Extract UI components from web pages |
| `ccss-integrating-react-components` | Generate React component integration docs |
| `ccss-enrich-github-readme` | Beautify GitHub READMEs with badges |
| `ccss-soundboard` | Audio notifications for Claude Code hooks |

## Installation

```json
{
  "extraKnownMarketplaces": {
    "ccss": {
      "source": {
        "source": "github",
        "repo": "your-username/ccss"
      }
    }
  }
}
```

Then enable in `enabledPlugins`:
```json
{
  "enabledPlugins": {
    "ccss": true
  }
}
```

## ccss-soundboard Setup

After enabling the plugin, configure sounds in `sounds.json`:

```json
{
  "Elicitation": { "sound": "pop", "checkFocus": true },
  "Stop": "rizz",
  "StopFailure": "faa",
  "SessionStart": "yeahbuddy",
  "SessionEnd": "lightweight"
}
```

Available sounds: `pop`, `rizz`, `faa`, `yeahbuddy`, `lightweight`, `wth`

## Development

Skills are in `skills/`, hooks in `hooks/`, agents in `agents/`.

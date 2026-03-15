# CCSS - Claude Code Sam Setup

[![License](https://img.shields.io/github/license/samCrock/ccss?style=flat&logo=github)](LICENSE)
![Last Commit](https://img.shields.io/github/last-commit/samCrock/ccss?logo=github)
![Commit Activity](https://img.shields.io/github/commit-activity/m/samCrock/ccss?logo=github)

Monorepo for personal AI assistant workflows and skills. Each skill lives in the `skills/` folder with consistent naming.

## Structure

```
ccss/
├── skills/
│   ├── ccss-onboarding/                    # This repo's guide
│   ├── ccss-frontend-dev-cycle/             # Iterative frontend dev
│   ├── ccss-navigation-recorder-automator/  # Record & replay navigation
│   └── ccss-enrich-github-readme/          # README enrichment
└── README.md
```

## Skills

| Skill | Description |
|-------|-------------|
| [ccss-onboarding](skills/ccss-onboarding/) | Repo onboarding guide |
| [ccss-frontend-dev-cycle](skills/ccss-frontend-dev-cycle/) | Iterative frontend dev with Playwright E2E |
| [ccss-navigation-recorder-automator](skills/ccss-navigation-recorder-automator/) | Record & replay navigation with Playwright |
| [ccss-enrich-github-readme](skills/ccss-enrich-github-readme/) | Enrich GitHub README (profiles & projects) |

## Adding a New Skill

```bash
# Create skill folder
mkdir skills/ccss-my-new-skill

# Add SKILL.md with frontmatter:
# ---
# name: "ccss-my-new-skill"
# description: "What it does. When to use it."
# ---
```

## Usage

Skills in `skills/` are automatically available to Claude Code via `~/.claude/skills/`.

---

⭐️ From [samCrock](https://github.com/samCrock)

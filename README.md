# CCSS - Claude Code Sam Setup

Monorepo for personal AI assistant workflows and skills. Each skill has independent git versioning via submodules.

## Structure

```
ccss/
├── skills/
│   ├── frontend-dev-cycle/        → GitHub repo with own versioning
│   └── navigation-recorder-automator/ → GitHub repo with own versioning
└── README.md
```

## Skills

| Skill | Remote | Description |
|-------|--------|-------------|
| frontend-dev-cycle | [GitHub](https://github.com/samCrock/frontend-dev-cycle) | Iterative frontend dev with Playwright E2E |
| navigation-recorder-automator | [GitHub](https://github.com/samCrock/navigation-recorder-automator) | Record & replay navigation with Playwright |

## Adding a New Skill

```bash
# Clone into skills/
git clone https://github.com/samCrock/my-new-skill.git skills/my-new-skill
```

## Usage

Symlink to `~/.claude/skills/`:

```bash
ln -s ~/ccss/skills/frontend-dev-cycle ~/.claude/skills/frontend-dev-cycle
```

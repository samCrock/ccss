---
name: "ccss-onboarding"
description: "Onboarding guide for the CCSS repository. Use when setting up the repo, adding new skills, or understanding the structure."
---

# CCSS Onboarding

## What This Repo Is

**ccss** (claude-code-sam-setup) is a monorepo for your personal AI assistant workflows, skills, and agents. Each item has its own git history and can be developed independently.

## Repository Structure

```
ccss/
├── skills/                    ← All skills in one repo
│   ├── ccss-onboarding/      ← This skill!
│   ├── ccss-frontend-dev-cycle/
│   ├── ccss-navigation-recorder-automator/
│   ├── ccss-enrich-github-readme/
│   └── ...more skills
├── docs/                      ← Shared documentation
├── resources/                 ← Shared templates, configs
└── README.md                  ← Entry point
```

## Key Concept: Single Repository

All skills live in one repository under `skills/`. No submodules - just folders with SKILL.md files.

---

## Using Skills in Claude Code

Skills in `skills/` are automatically available to Claude Code via the central `~/.claude/skills/` directory.

To add a new skill:
```bash
# Create or copy skill folder to skills/
mkdir -p skills/my-new-skill
```

---

## Adding a New Skill

### Step 1: Create the Skill Folder

```bash
# Create in skills directory
mkdir -p skills/my-new-skill
```

### Step 2: Create SKILL.md

```markdown
---
name: "My New Skill"
description: "What it does. When to use it."
---

# My New Skill

## What This Skill Does
[Description]
```

### Step 3: Commit to Git

```bash
git add skills/my-new-skill/
git commit -m "feat: add my-new-skill"
git push
```

---

## Development Workflow

### Local Development

1. **Make changes** in `skills/my-skill/`
2. **Commit:**
   ```bash
   git add skills/my-skill/
   git commit -m "feat: add new feature"
   ```
3. **Push:**
   ```bash
   git push
   ```

---

## Repository List

| Skill | Description |
|-------|-------------|
| ccss-onboarding | Repo onboarding guide |
| ccss-frontend-dev-cycle | Iterative frontend dev with Playwright E2E testing |
| ccss-navigation-recorder-automator | Record & replay navigation |
| ccss-enrich-github-readme | Enrich GitHub README (profiles & projects) |

---

## Troubleshooting

### Skill Not Appearing in Claude

**Check:**
1. Is it in `skills/` folder?
2. Does it have a valid `SKILL.md`?
3. Did you restart Claude Code?

```bash
# List skills
ls skills/
```

---

## Resources

- [Claude Code Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)

---

**Last Updated:** 2026-03-15
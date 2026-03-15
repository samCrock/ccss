---
name: "CCSS Onboarding"
description: "Onboarding guide for claude-code-sam-setup (ccss) repository. Use when setting up the repo, adding new skills, or understanding the monorepo structure with independent git versioning per skill."
---

# CCSS Onboarding

## What This Repo Is

**ccss** (claude-code-sam-setup) is a monorepo for your personal AI assistant workflows, skills, and agents. Each item has its own git history and can be developed independently.

## Repository Structure

```
ccss/
├── skills/                    ← Individual skill repos (each with own git)
│   ├── ccss-onboarding/       ← This skill!
│   ├── navigation-recorder-automator/
│   └── ...more skills
├── docs/                      ← Shared documentation
├── resources/                 ← Shared templates, configs
└── README.md                  ← Entry point
```

## Key Concept: Independent Git Versioning

Each skill/agent in `skills/` is its own git repository with:
- Own `.git` history
- Own GitHub remote (e.g., `https://github.com/youruser/navigation-recorder-automator`)
- Own versioning (semantic release, etc.)

The central repo is just an index that links to everything.

---

## Using Skills in Claude Code

### Option 1: Symlink (Recommended)

```bash
# Create symlink from ~/.claude/skills/ to your repo
ln -s ~/projects/ccss/skills/navigation-recorder-automator ~/.claude/skills/navigation-recorder-automator
```

### Option 2: Clone Per Skill

```bash
# Clone directly into ~/.claude/skills/
cd ~/.claude/skills/
git clone https://github.com/youruser/navigation-recorder-automator.git
```

---

## Adding a New Skill

### Step 1: Create the Skill

```bash
# Create in skills directory
mkdir -p skills/my-new-skill
cd skills/my-new-skill

# Initialize git (required for independent versioning)
git init
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

### Step 3: Create GitHub Remote

Use the GitHub MCP to create a repo, then:

```bash
# Add remote and push
git remote add origin https://github.com/youruser/my-new-skill.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 4: Update Central Index

Add your skill to the main README.md with a link.

---

## Development Workflow

### Local Development

1. **Make changes** in `skills/my-skill/`
2. **Commit locally:**
   ```bash
   cd skills/my-skill
   git add .
   git commit -m "feat: add new feature"
   ```
3. **Test locally** (symlink to ~/.claude/skills/)

### Push to Remote

```bash
cd skills/my-skill
git push origin main
```

### Sync Across Machines

```bash
# Pull latest from remote
git pull origin main
```

---

## Repository List

| Skill | Description | Remote |
|-------|-------------|--------|
| ccss-onboarding | Repo onboarding guide | [GitHub](https://github.com/SamLo/ccss-onboarding) |
| navigation-recorder-automator | Record & replay navigation | [GitHub](https://github.com/SamLo/navigation-recorder-automator) |
| frontend-dev-cycle | Iterative frontend dev with Playwright E2E testing | [GitHub](https://github.com/SamLo/frontend-dev-cycle) |

---

## Troubleshooting

### Skill Not Appearing in Claude

**Check:**
1. Is it in `~/.claude/skills/`?
2. Does it have a valid `SKILL.md`?
3. Did you restart Claude Code?

```bash
# Verify symlink
ls -la ~/.claude/skills/

# Or check cloned repo
cd ~/.claude/skills/navigation-recorder-automator
cat SKILL.md | head -5
```

### Git Push Fails

**Solution:**
```bash
# Check remote
git remote -v

# Set correct remote
git remote set-url origin https://github.com/youruser/repo-name.git
```

### Merge Conflicts in Subtree

Since each skill is independent, you shouldn't get subtree merge conflicts. If you do:
```bash
# Resolve in the skill's own directory
cd skills/my-skill
git merge origin/main
# Fix conflicts, then
git commit
git push
```

---

## Resources

- [Git Subtrees](https://docs.github.com/en/get-started/using-git/about-git-replace)
- [Claude Code Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [GitHub MCP](https://github.com/github/copilot-in-the-cli)

---

## Maintenance

### Update All Skills

```bash
# Pull latest for each skill
for dir in skills/*/; do
  echo "Updating $dir"
  cd "$dir"
  git pull origin main
  cd ../..
done
```

### Backup

Since each skill is on GitHub, your work is backed up. To backup everything at once:
```bash
git clone --recursive https://github.com/youruser/ccss.git
```

---

**Last Updated:** 2024-01-15
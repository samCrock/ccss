---
name: "ccss-enrich-github-readme"
description: "Enrich GitHub README.md for both profiles and projects. Use when user wants to beautify, enhance, or upgrade their GitHub profile README with stats/trophies OR project README with badges, CI/CD status, downloads, and documentation widgets."
---

# Enrich GitHub README

## What This Skill Does
Transforms a basic GitHub README into a visually stunning, information-rich document. Supports both:
- **Profile READMEs** - Personal profile repositories (named same as username)
- **Project READMEs** - Any repository's root README

Automatically detects existing content and enhances it without losing original information.

## Prerequisites
- GitHub account
- For profile README: repository named same as username (public)
- For project README: any public or private repository
- No coding required - all widgets are dynamic/embedded

---

## Quick Start

### Which README Type?

| Type | Location | Best For |
|------|----------|----------|
| **Profile** | `username/username` repo | Personal branding, skills showcase |
| **Project** | Any repo's root | Documentation, demos, downloads |

### Basic Enrichment
1. Provide the current README.md content
2. Specify which widgets to include (or let skill select popular ones)
3. Skill generates enhanced README with widgets embedded

### Widget Categories

| Category | Profile Widgets | Project Widgets |
|----------|----------------|-----------------|
| **Stats** | GitHub Stats, Top Languages, Streak | GitHub Stats (repo), Last Commit |
| **Badges** | Shields.io, Profile Trophy, Skills | Version, Downloads, License |
| **Social** | Twitter, LinkedIn, Spotify | - |
| **CI/CD** | - | Build Status, Tests, Coverage |
| **Quality** | - | CodeQL, Linter, Bundle Size |
| **Activity** | WakaTime, Visitor Counter | Commit Activity, Contributors |

---

## Level 2: Popular Widgets Reference

### 1. GitHub Stats Card
```markdown
[![GitHub Stats](https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&theme=radical&hide_border=true&ring_color=58a6ff&card_width=100%)](https://github.com/anuraghazra/github-readme-stats)
```

### 2. Top Languages Card
```markdown
[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_USERNAME&layout=compact&theme=radical&hide_border=true)](https://github.com/anuraghazra/github-readme-stats)
```

### 3. GitHub Streak Stats
```markdown
[![GitHub Streak](https://streak-stats.demolab.com/?user=YOUR_USERNAME&theme=radical&hide_border=true&fire=FF585858&stroke=58a6ff&ring=58a6ff)](https://git.io/streak-stats)
```

### 4. Profile Trophy
```markdown
[![Trophy](https://github-trophies.vercel.app/rank?username=YOUR_USERNAME&theme=radical&hide_border=true)](https://github.com/ryo-ma/github-profile-trophy)
```

### 5. WakaTime Stats
```markdown
[![WakaTime](https://github-readme-stats.vercel.app/api/wakatime?username=YOUR_USERNAME&theme=radical&hide_border=true)](https://github.com/anuraghazra/github-readme-stats)
```

---

## Level 3: Project README Widgets

Project READMEs have different needs than profiles. Use these widgets to showcase project info.

### Project Badges (Shields.io)

**Package Version & Downloads:**
```markdown
![npm version](https://img.shields.io/npm/v/YOUR_PACKAGE?style=flat&logo=npm)
![npm downloads](https://img.shields.io/npm/dm/YOUR_PACKAGE?style=flat&logo=npm)
![npm license](https://img.shields.io/npm/l/YOUR_PACKAGE?style=flat)
```

**Build & CI Status:**
```markdown
![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?logo=github)
![Tests](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/test.yml?logo=github)
![Coverage](https://img.shields.io/coveralls/github/OWNER/REPO?logo=coveralls)
```

**Code Quality:**
```markdown
![CodeQL](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/codeql.yml?label=CodeQL)
![Linter](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/lint.yml?label=Lint)
![Bundle Size](https://img.shields.io/bundlephobia/min/YOUR_PACKAGE)
```

**Language & Platform:**
```markdown
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
```

### Project Stats Cards

**GitHub Stats (for any repo):**
```markdown
[![GitHub Stats](https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&repo=YOUR_REPO&theme=radical&hide_border=true&show_icons=true)](https://github.com/anuraghazra/github-readme-stats)
```

**Last Commit Activity:**
```markdown
![Last Commit](https://img.shields.io/github/last-commit/OWNER/REPO?logo=github)
![Commit Activity](https://img.shields.io/github/commit-activity/m/OWNER/REPO?logo=github)
```

### Demo & Preview Widgets

**Live Demo:**
```markdown
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=flat)](https://your-demo-url.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel)](https://vercel.com)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=flat&logo=netlify)](https://netlify.com)
```

**Preview Image:**
```markdown
<p align="center">
  <img src="https://your-preview-image-url.png" alt="Project Preview" width="600"/>
</p>
```

### Installation & Usage Badges

**Package Managers:**
```markdown
[![NPM](https://img.shields.io/badge/NPM-%23CB3837?style=flat&logo=npm&logoColor=white)](https://npmjs.com/)
[![Yarn](https://img.shields.io/badge/Yarn-%232C8EBB?style=flat&logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![PyPI](https://img.shields.io/badge/PyPI-%23007DCC?style=flat&logo=pypi&logoColor=white)](https://pypi.org/)
[![Cargo](https://img.shields.io/badge/Cargo-%23DEA584?style=flat&logo=rust&logoColor=white)](https://crates.io/)
```

**Quick Install:**
```bash
npm install YOUR_PACKAGE
# or
yarn add YOUR_PACKAGE
# or
pip install YOUR_PACKAGE
```

### Social Proof

**Stars & Forks:**
```markdown
[![Stars](https://img.shields.io/github/stars/OWNER/REPO?style=flat&logo=github)](https://github.com/OWNER/REPO/stargazers)
[![Forks](https://img.shields.io/github/forks/OWNER/REPO?style=flat&logo=github)](https://github.com/OWNER/REPO/network/members)
[![Watchers](https://img.shields.io/github/watchers/OWNER/REPO?style=flat&logo=github)](https://github.com/OWNER/REPO/watchers)
```

**License:**
```markdown
[![License](https://img.shields.io/github/license/OWNER/REPO?logo=github)](LICENSE)
```

---

## Level 3: Complete Widget Gallery

### Badges (Shields.io)

**Dynamic Badge (GitHub followers):**
```markdown
[![Followers](https://img.shields.io/github/followers/YOUR_USERNAME?style=flat&logo=github)](https://github.com/YOUR_USERNAME)
```

**Static Badges:**
```markdown
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
```

### Social Links with Icons
```markdown
<a href="https://twitter.com/YOUR_TWITTER">
  <img src="https://img.shields.io/badge/Twitter-%231DA1F2?style=flat&logo=twitter&logoColor=white" />
</a>
<a href="https://linkedin.com/in/YOUR_LINKEDIN">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" />
</a>
<a href="mailto:YOUR_EMAIL">
  <img src="https://img.shields.io/badge/Gmail-D14836?style=flat&logo=gmail&logoColor=white" />
</a>
```

### Visitor Counter
```markdown
![Visitor](https://visitor-badge.laobi.icu/badge?page_id=YOUR_USERNAME.profile&style=flat&hide_border=true)
```

### Spotify Now Playing
```markdown
[![Spotify](https://spotify-github-profile.vercel.app/api/view?uid=YOUR_SPOTIFY_UID&cover_image=true&redirect=true)](https://spotify-github-profile.vercel.app)
```

### GitHub Profile Summary Cards
```markdown
[![Profile Summary](https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=YOUR_USERNAME&theme=radical)](https://github.com/vn7n24fzkq/github-profile-summary-cards)
```

---

## Step-by-Step Guide

### Step 1: Identify README Type
Determine if it's a **profile** or **project** README:
- Profile: Located in `username/username` repo
- Project: Located in any other repository

### Step 2: Analyze Current README
Identify existing content:
- **Profile**: Personal bio/intro, tech stack, social links, stats/badges
- **Project**: Description, installation, usage, features, license

### Step 3: Select Widgets
Choose based on README type and goals:

**For Profile READMEs:**
- **Showcase skills**: Stats cards + Top Languages + Skills badges
- **Show activity**: Streak + WakaTime + Profile Trophy
- **Professional**: LinkedIn + Email + Company + Stats
- **Personal**: Social links + Spotify + Visitor counter

**For Project READMEs:**
- **Package info**: Version + Downloads + License
- **CI/CD**: Build status + Tests + Coverage
- **Quality**: CodeQL + Linter + Bundle size
- **Social proof**: Stars + Forks + Contributors
- **Quick start**: Installation + Usage code snippets

### Step 4: Arrange Layout
Recommended order:
1. Header (banner/greeting)
2. Quick stats (mini cards)
3. About me section
4. Tech stack (badges)
5. Stats section (full cards)
6. Social links
7. Footer (visitor counter)

### Step 5: Generate & Test
1. Replace `YOUR_USERNAME` placeholder
2. Test in GitHub preview
3. Commit changes

---

## Project README Templates

### Standard Project README
```markdown
# Project Name

[![npm version](https://img.shields.io/npm/v/YOUR_PACKAGE?style=flat&logo=npm)](https://www.npmjs.com/package/YOUR_PACKAGE)
[![npm downloads](https://img.shields.io/npm/dm/YOUR_PACKAGE?style=flat&logo=npm)](https://www.npmjs.com/package/YOUR_PACKAGE)
[![License](https://img.shields.io/github/license/OWNER/REPO?logo=github)](LICENSE)

> One-line description of what your project does

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick Start

### Installation

npm install YOUR_PACKAGE
# or
yarn add YOUR_PACKAGE

### Usage

import { yourExport } from 'YOUR_PACKAGE';

const result = yourExport();

## Documentation

For full documentation, visit [docs](./docs)

## Demo

[Live Demo](https://your-demo-url.com)

## Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&repo=YOUR_REPO&show_icons=true&theme=radical&hide_border=true" height="180" alt="stats" />
</p>

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](./LICENSE) for details.
```

### CLI/Tool Project
```markdown
# CLI Name

[![npm version](https://img.shields.io/npm/v/YOUR_PACKAGE?style=flat&logo=npm)](https://www.npmjs.com/package/YOUR_PACKAGE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?logo=github)](https://github.com/OWNER/REPO/actions)
[![License](https://img.shields.io/github/license/OWNER/REPO?logo=github)](LICENSE)

> One-line description of your CLI tool

## Install

npm install -g YOUR_PACKAGE

## Usage

your-cli --option value

## Commands

| Command | Description |
|---------|-------------|
| `cmd1` | Description 1 |
| `cmd2` | Description 2 |

## Examples

# Example 1
your-cli command1

# Example 2
your-cli command2 --flag
```

---

## Complete Enriched README Template

```markdown
# 👋 Hi there, I'm [Your Name]!

> [Your tagline or one-liner about yourself]

### 🔧 Technologies & Tools

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
<!-- Add more badges... -->

### 📊 GitHub Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=radical&hide_border=true" height="180" alt="stats" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_USERNAME&layout=compact&theme=radical&hide_border=true" height="180" alt="languages" />
</p>

### 🔥 Streak

<p align="center">
<img src="https://streak-stats.demolab.com/?user=YOUR_USERNAME&theme=radical&hide_border=true" alt="streak" />
</p>

### 🏆 Trophy

<p align="center">
<img src="https://github-trophies.vercel.app/rank?username=YOUR_USERNAME&theme=radical&hide_border=true&no-frame=false" alt="trophy" />
</p>

### 📫 Connect with Me

[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2?style=flat&logo=twitter&logoColor=white)](https://twitter.com/YOUR_TWITTER)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_LINKEDIN)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=flat&logo=gmail&logoColor=white)](mailto:YOUR_EMAIL)

---
⭐️ From [YOUR_USERNAME](https://github.com/YOUR_USERNAME)
```

---

## Advanced Widgets

### Snake Animation (GitHub Contributions)
```markdown
![Snake](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-contribution-grid-snake.svg)
```
Setup: Create a repo named `YOUR_USERNAME` and enable GitHub Actions

### GitHub Activity Graph
```markdown
[![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=YOUR_USERNAME&theme=radical&hide_border=true)](https://github.com/ashutosh00710/github-readme-activity-graph)
```

### Quote Generator
```markdown
![Quote](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical)
```

### Gists Embed
```markdown
<script src="https://gist.github.com/YOUR_USERNAME/gist_id.json"></script>
```

---

## Theme Options

Available themes for stats cards:
- `radical`, `tokyonight`, `dracula`, `merko`
- `gruvbox`, `gruvbox_`, `monokai`
- `onedark`, `cobalt`, `synthwave`
- `highcontrast`, `github_dark`, `github`

---

## Troubleshooting

### Widgets Not Loading
- Verify username/repo is correct
- Check repository is public
- Wait 1-2 minutes for cache refresh

### Images Too Large
- Use `&card_width=xxx` parameter
- Wrap in `<p align="center">` for centering

### Theme Not Applying
- Ensure `&theme=THEME_NAME` parameter
- Check spelling (case-sensitive)

### Project README Specific
- **Badge wrong repo**: Ensure `OWNER/REPO` format is correct
- **Workflow badges fail**: Verify workflow filename matches exactly (e.g., `ci.yml` not `ci.yaml`)
- **NPM badges fail**: Use exact package name (check npmjs.com)
- **Stats for repo**: Use `&repo=REPO_NAME` parameter (not needed for profile)

---

## Resources

- [awesome-github-profile-readme](https://github.com/abhisheknaiidu/awesome-github-profile-readme) - Curated list
- [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats)
- [Shields.io](https://shields.io/) - Badge creator
- [DevIcons](https://devicon.dev/) - Developer icons

**Created**: 2026-03-15
**Category**: GitHub
**Difficulty**: Beginner

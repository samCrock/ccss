---
name: using-ccss
description: Use when starting any frontend development task, component work, audio feedback setup, or when user asks about available ccss skills
---

# CCSS Skills

CCSS (Claude Code Skill Set) is a collection of skills for frontend development, component orchestration, audio feedback, and more.

## Available Skills

| Skill | When to Use |
|-------|-------------|
| `ccss-frontend-dev-cycle` | Iterative frontend development with Playwright visual testing |
| `ccss-navigation-recorder-automator` | Record and replay user navigation flows |
| `ccss-component-orchestrator` | Find existing components for a task |
| `ccss-component-reverse-engineer` | Analyze a web page to extract UI components |
| `ccss-integrating-react-components` | Generate integration docs for React components |
| `ccss-enrich-github-readme` | Beautify GitHub README with badges and widgets |
| `ccss-soundboard` | Audio notifications for Claude Code hooks |

## Skill Descriptions

### ccss-frontend-dev-cycle
Iterative frontend development loop using Playwright for visual testing and feedback. Use when developing UI features, iterating on designs, or performing visual QA on frontend applications.

### ccss-navigation-recorder-automator
Uses Playwright's built-in codegen and trace viewing to record user navigation and extract automation patterns. Use when creating test automation from browser sessions, recording user flows, or generating navigation tests.

### ccss-component-orchestrator
Use when given a frontend development task and needing to identify which existing components can serve that need — gallery, navigation, tooltip, scrollable grid, modal, header, card, and similar UI goals.

### ccss-component-reverse-engineer
Analyze a web page URL to extract and document distinct UI components for recreation — identifies interactive elements, behavioral patterns, DOM changes, and CSS mechanisms. Part of the CCSS skill suite alongside ccss-frontend-dev-cycle.

### ccss-integrating-react-components
Use when writing or updating integration docs for any React component in the project — new component, imported shadcn component, third-party component, or when a component's public interface changes.

### ccss-enrich-github-readme
Enrich GitHub README.md for both profiles and projects. Use when user wants to beautify, enhance, or upgrade their GitHub profile README with stats/trophies OR project README with badges, CI/CD status, downloads, and documentation widgets.

### ccss-soundboard
Audio notifications for Claude Code hooks. Set up sound mappings for Elicitation, Stop, StopFailure, SessionStart, SessionEnd, and more.

## Usage

Invoke relevant skills using the `Skill` tool:
- `Skill("ccss-frontend-dev-cycle")`
- `Skill("ccss-component-orchestrator")`
- etc.

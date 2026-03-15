---
name: "ccss-navigation-recorder-automator"
description: "Uses Playwright's built-in codegen and trace viewing to record user navigation and extract automation patterns. Use when creating test automation from browser sessions, recording user flows, or generating navigation tests."
---

# Navigation Recorder Automator

## What This Skill Does

This skill leverages Playwright's native recording capabilities to capture user navigation, then extracts patterns and generates reusable automation code. It uses Playwright's built-in `codegen` tool and trace files rather than custom formats.

## Prerequisites

- Node.js 18+
- Playwright installed (`npm install -D @playwright/test`)
- Playwright browsers installed (`npx playwright install`)

## Quick Start

```bash
# Record a new navigation session
npx playwright codegen --target=typescript -o tests/recorded/my-test.spec.ts

# Or record to a specific file with browser options
npx playwright codegen --browser=chromium --viewport-size=1280,720 https://your-app.com
```

---

## Recording Methods

### Method 1: Playwright Codegen (Recommended)

```bash
# Basic recording
npx playwright codegen https://your-app.com

# With TypeScript output
npx playwright codegen --target=typescript -o tests/my-test.spec.ts

# Record specific interactions only
npx playwright codegen --only-include-events=click,fill,navigation
```

### Method 2: Trace Recording

Enable tracing in your tests to capture detailed navigation:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
});
```

Then view traces with:
```bash
npx playwright show-trace trace.zip
```

### Method 3: Browser Extension

Use the Playwright extension for Chrome/Firefox to record manually:
1. Install Playwright extension from Chrome Web Store
2. Click record → perform actions → click stop
3. Export as Playwright test

---

## Pattern Extraction from Traces

### Extracting Events from Trace Files

Playwright traces contain all navigation events. Use the trace viewer to:

1. **Replay the trace** - See exactly what user did
2. **Extract selectors** - Copy generated locators
3. **Identify patterns** - Spot repeated navigation chains

### Converting Traces to Test Code

```bash
# Convert trace to simplified JSON
npx playwright trace export --format=json trace.zip > trace-events.json

# Or use the Playwright CLI to list events
npx playwright trace龙  # (interactive mode)
```

---

## Step-by-Step Guide

### Step 1: Start Recording

```bash
npx playwright codegen --target=typescript -o tests/recorded/login-flow.spec.ts
```

This opens a browser where you can interact with your app.

### Step 2: Perform User Actions

Navigate, click, fill forms - Playwright records everything.

### Step 3: Stop Recording

Press the stop button in the codegen toolbar. Your test is saved.

### Step 4: Review and Refine

Generated code uses Playwright's smart selectors:

```typescript
// Generated (may need improvement)
await page.click('#nav-dashboard');

// Better (use Playwright's locators)
await page.getByRole('link', { name: 'Dashboard' }).click();
await page.getByLabel('Search').fill('query');
await page.getByText('Submit').click();
```

### Step 5: Extract Patterns

Once you have multiple recordings, identify common patterns:

| Pattern | Example |
|---------|---------|
| Login → Dashboard | Auth flow reused across tests |
| Search → Filter → Select | E-commerce flows |
| Form → Validate → Submit | CRUD operations |

Create reusable functions:

```typescript
// tests/utils/navigation-patterns.ts
export async function loginAsUser(page: Page, credentials: Credentials) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Password').fill(credentials.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

export async function searchAndSelect(page: Page, query: string) {
  await page.getByPlaceholder('Search').fill(query);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('networkidle');
  await page.locator('.results .item').first().click();
}
```

---

## Configuration

### codegen.config.json

```json
{
  "outputDir": "tests/recorded",
  "testDir": "tests",
  "locators": "getBy",
  "includeActions": ["click", "fill", "check", "uncheck", "selectOption"],
  "excludeActions": ["hover", "scroll"]
}
```

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npx playwright codegen` | Start interactive recording |
| `npx playwright codegen --help` | See all options |
| `npx playwright test --trace` | Run with trace recording |
| `npx playwright show-trace` | View recorded traces |

---

## Common Codegen Options

```bash
# Browser options
--browser=chromium|firefox|webkit
--viewport-size=1280,720
--device-scale-factor=2

# Output options
--target=javascript|typescript|pytest|java
--output=/path/to/test.spec.ts

# Filtering
--only-include-events=click,fill
--exclude-events=hover,mouseover

# Authentication
--cookie=name=value
--storage-state=auth.json
```

---

## Troubleshooting

### Issue: Generated Selectors Are Fragile
**Solution**: Use Playwright's built-in locators instead:
```typescript
// Bad
await page.click('#submit-btn-x123');

// Good
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@example.com');
await page.getByPlaceholder('Enter password').fill('secret');
```

### Issue: Recording Too Many Events
**Solution**: Filter events during recording:
```bash
npx playwright codegen --only-include-events=click,fill,navigation
```

### Issue: Need to Replay with Different Data
**Solution**: Parameterize the generated test:
```typescript
test.describe('User flows', () => {
  test.each([
    { email: 'user1@test.com', name: 'User One' },
    { email: 'user2@test.com', name: 'User Two' },
  ])('should login as $name', async ({ email }) => {
    await page.getByLabel('Email').fill(email);
    // ...
  });
});
```

---

## Resources

- [Playwright Codegen](https://playwright.dev/docs/codegen)
- [Locators](https://playwright.dev/docs/locators)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Test Generator](https://playwright.dev/docs/test-generator)

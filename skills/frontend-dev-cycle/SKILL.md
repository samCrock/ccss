---
name: "Frontend Dev Cycle"
description: "Iterative frontend development loop using Playwright for visual testing and feedback. Use when developing UI features, iterating on designs, or performing visual QA on frontend applications."
---

# Frontend Dev Cycle

## What This Skill Does

Runs an iterative frontend development cycle: code changes → Playwright E2E test → visual feedback → improvements → repeat. Provides structured approach to visual QA and UI iteration.

## Prerequisites

- Playwright MCP server configured and running
- Frontend app running on localhost
- Browser accessibility for screenshots

## Quick Start

```bash
# 1. Navigate to the page
mcp__playwright__browser_navigate --url "http://localhost:3001"

# 2. Take a screenshot
mcp__playwright__browser_take_screenshot --filename "screenshot.png" --type "png"

# 3. Analyze and provide feedback
# (Manual analysis of screenshot)

# 4. Make code changes

# 5. Repeat
```

---

## The Dev Cycle Process

### Phase 1: Capture Current State

1. **Navigate** to the page under test
2. **Take** a full-page screenshot
3. **Interact** with key elements (buttons, forms, navigation)
4. **Capture** each state/flow

### Phase 2: Analyze & Feedback

For each screenshot, provide structured feedback:

```
## Visual Feedback for [Page/Component]

### Issues Found
| Priority | Element | Issue | Suggested Fix |
|----------|---------|-------|---------------|
| HIGH | Button | No hover state | Add :hover styles |
| MEDIUM | Card | Too much padding | Reduce to 16px |

### Strengths
- Clean color scheme
- Good contrast

### Next Steps
1. Fix HIGH priority issues
2. Re-test
3. Move to MEDIUM
```

### Phase 3: Implement & Iterate

1. Make targeted code changes
2. Re-run tests
3. Compare screenshots
4. Document improvements

---

## Common Test Scenarios

### Homepage Testing
```javascript
// Navigate to homepage
await page.goto('http://localhost:3001');

// Capture
await page.screenshot({ path: 'homepage.png', fullPage: true });

// Test CTA button
await page.click('button:has-text("CREATE SESSION")');
await page.waitForURL(/\/.*-.*-.*-.*-.*/);
await page.screenshot({ path: 'game-session.png' });
```

### Responsive Testing
```javascript
// Mobile viewport
await page.setViewportSize({ width: 375, height: 812 });
await page.screenshot({ path: 'mobile.png' });

// Tablet viewport
await page.setViewportSize({ width: 768, height: 1024 });
await page.screenshot({ path: 'tablet.png' });

// Desktop
await page.setViewportSize({ width: 1280, height: 800 });
await page.screenshot({ path: 'desktop.png' });
```

### Interaction Testing
```javascript
// Hover states
await page.hover('button.primary');
await page.screenshot({ path: 'button-hover.png' });

// Focus states
await page.click('input');
await page.screenshot({ path: 'input-focus.png' });

// Disabled states
await page.screenshot({ path: 'button-disabled.png' });
```

---

## Visual Analysis Checklist

### Layout
- [ ] Proper alignment and spacing
- [ ] Responsive behavior across viewports
- [ ] No overflow or clipping
- [ ] Consistent margins/padding

### Typography
- [ ] Readable font sizes
- [ ] Proper line heights
- [ ] Consistent weights
- [ ] Good contrast ratios

### Colors
- [ ] Consistent palette usage
- [ ] Proper state colors (hover, active, disabled)
- [ ] Sufficient contrast
- [ ] Theme consistency

### Components
- [ ] Button states visible
- [ ] Form validation states
- [ ] Loading states
- [ ] Error states

### Animations
- [ ] Smooth transitions
- [ ] No jank or stutter
- [ ] Appropriate durations

---

## Feedback Template

Use this structure for providing feedback:

```markdown
## Visual Feedback: [Page Name]

### Screenshot
![screenshot](path/to/screenshot.png)

### Issues

#### HIGH Priority
- **[Element]**: [Issue description]
  - Current: [what it looks like]
  - Expected: [what it should look like]

#### MEDIUM Priority
- **[Element]**: [Issue description]

#### LOW Priority
- **[Element]**: [Issue description]

### Good Practices Observed
- [ ] Element uses theme colors correctly
- [ ] Spacing is consistent
- [ ] Good visual hierarchy

### Recommended Actions
1. [First fix]
2. [Second fix]
3. [Third fix]

### Estimated Effort
- Quick wins: X issues
- Medium effort: Y issues
- Major changes: Z issues
```

---

## Automation Scripts

### Quick Full Test
```javascript
// Run all basic tests
const pages = ['/', '/game-test', '/play/test'];
for (const path of pages) {
  await page.goto(`http://localhost:3001${path}`);
  await page.screenshot({ path: `${path.replace('/', '')}-full.png`, fullPage: true });
}
```

### Before/After Comparison
```javascript
// Capture before changes
await page.goto('http://localhost:3001');
await page.screenshot({ path: 'before.png' });

// ... make code changes ...

// Capture after
await page.goto('http://localhost:3001');
await page.screenshot({ path: 'after.png' });
```

---

## Troubleshooting

### Issue: Page not loading
- **Solution**: Check if dev server is running on expected port
- **Command**: `curl http://localhost:3001`

### Issue: Screenshot is blank
- **Solution**: Wait for page to fully load
- **Code**: `await page.waitForLoadState('networkidle');`

### Issue: Elements not found
- **Solution**: Use more specific selectors
- **Tip**: Check accessibility tree with `mcp__playwright__browser_snapshot`

### Issue: Visual differences
- **Cause**: May be due to viewport, timing, or state
- **Solution**: Ensure consistent setup before each screenshot

---

## Related Skills

- [superpowers:brainstorming](../brainstorming/) - For design iteration planning
- [superpowers:writing-plans](../writing-plans/) - For implementation planning
- [ui-ux-pro-max](../ui-ux-pro-max/) - For design guidance

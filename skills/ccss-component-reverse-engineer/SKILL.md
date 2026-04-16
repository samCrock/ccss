---
name: "ccss-component-reverse-engineer"
description: "Analyze a web page URL to extract and document distinct UI components for recreation — identifies interactive elements, behavioral patterns, DOM changes, and CSS mechanisms. Part of the CCSS skill suite alongside ccss-frontend-dev-cycle."
---

# Component Reverse Engineer (CCSS)

Reverse-engineer UI components from any URL for recreation. Analyzes visual behavior, DOM mutations, and CSS mechanisms to produce implementation-ready component documentation.

## When to Use

- Building UI without access to source code
- Recreating components from design references
- Understanding animation/interaction mechanisms
- Extracting behavioral patterns from existing sites
- Documenting component behavior for implementation

## Core Workflow

```dot
digraph component_reengineering {
    "Navigate to URL" [shape=box];
    "Capture baseline state" [shape=box];
    "Identify scroll zones" [shape=box];
    "Document each component" [shape=box];
    "Analyze interactions" [shape=box];
    "Produce recreation guide" [shape=box];

    "Navigate to URL" -> "Capture baseline state";
    "Capture baseline state" -> "Identify scroll zones";
    "Identify scroll zones" -> "Document each component";
    "Document each component" -> "Analyze interactions";
    "Analyze interactions" -> "Produce recreation guide";
}
```

## Phase 0: Design Token Extraction

Run immediately after page load (before scrolling or interacting). Uses `page.evaluate()` to walk the DOM and collect all computed styles.

### 0.1 Collect All Computed Styles

Collect raw design tokens from every element on the page:

```javascript
await page.evaluate(() => {
  const elements = document.querySelectorAll('*');
  const tokens = {
    colors: new Set(),
    fontFamilies: new Set(),
    fontSizes: new Set(),
    fontWeights: new Set(),
    lineHeights: new Set(),
    spacing: new Set(),
    borderRadii: new Set(),
    boxShadows: new Set(),
    cssVars: new Map(),
    gradients: [],
    zIndexes: new Set(),
    transitions: new Set(),
  };

  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    ['color', 'backgroundColor', 'borderColor', 'boxShadow'].forEach(prop => {
      const val = style[prop];
      if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent') {
        tokens.colors.add(val);
      }
    });
    tokens.fontFamilies.add(style.fontFamily);
    tokens.fontSizes.add(style.fontSize);
    tokens.fontWeights.add(style.fontWeight);
    tokens.lineHeights.add(style.lineHeight);
    ['padding', 'margin', 'gap'].forEach(prop => {
      const val = style[prop];
      if (val && val !== '0px') tokens.spacing.add(val);
    });
    tokens.borderRadii.add(style.borderRadius);
    if (style.boxShadow && style.boxShadow !== 'none') {
      tokens.boxShadows.add(style.boxShadow);
    }
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (prop.startsWith('--')) {
        tokens.cssVars.set(prop, style.getPropertyValue(prop));
      }
    }
    if (style.backgroundImage.includes('gradient')) {
      tokens.gradients.push({ selector: '', value: style.backgroundImage });
    }
    if (style.zIndex && style.zIndex !== 'auto') {
      tokens.zIndexes.add(style.zIndex);
    }
    if (style.transition && style.transition !== 'none') {
      tokens.transitions.add(style.transition);
    }
  });

  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [k, v instanceof Set ? [...v] : v instanceof Map ? Object.fromEntries(v) : v])
  );
});
```

### 0.2 Deduplicate and Classify Colors

```javascript
await page.evaluate(() => {
  const toHex = (c) => {
    if (!c || c.startsWith('#')) return c;
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return c;
    return '#' + [m[1],m[2],m[3]].map(x => parseInt(x).toString(16).padStart(2,'0')).join('');
  };
  const colors = [...new Set([...document.querySelectorAll('*')].map(el =>
    toHex(window.getComputedStyle(el).color)
  ).filter(c => c))];
  return { colors };
});
```

### 0.3 Extract Typography Scale

```javascript
await page.evaluate(() => {
  const elements = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,button,input,label,li,td,th')]
    .map(el => ({
      tag: el.tagName.toLowerCase(),
      fontSize: window.getComputedStyle(el).fontSize,
      fontFamily: window.getComputedStyle(el).fontFamily,
      fontWeight: window.getComputedStyle(el).fontWeight,
      lineHeight: window.getComputedStyle(el).lineHeight,
      letterSpacing: window.getComputedStyle(el).letterSpacing,
    }));
  const scale = [...new Map(elements.map(e => [e.fontSize, e])).values()];
  return scale.sort((a,b) => parseFloat(a.fontSize) - parseFloat(b.fontSize));
});
```

### 0.4 Extract CSS Variables (Full Map)

```javascript
await page.evaluate(() => {
  const vars = {};
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (prop.startsWith('--')) {
        vars[prop] = style.getPropertyValue(prop).trim();
      }
    }
  });
  return vars;
});
```

### 0.5 Detect Design System Base Unit

```javascript
await page.evaluate(() => {
  const spacingVals = [...new Set([...document.querySelectorAll('*')].map(el => {
    const s = window.getComputedStyle(el);
    const m = s.margin.match(/(\d+)px/);
    return m ? parseInt(m[1]) : null;
  }).filter(Boolean))];
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const base = spacingVals.length > 1 ? spacingVals.reduce(gcd) : 4;
  return base;
});
```

### 0.6 Extract Grid and Flex Layout Patterns

```javascript
await page.evaluate(() => {
  const layouts = { grids: 0, flexContainers: 0, gaps: new Set(), gridColumns: new Set(), containerWidths: new Set() };
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.display === 'grid') {
      layouts.grids++;
      layouts.gridColumns.add(style.gridTemplateColumns);
      layouts.gaps.add(style.gap);
    }
    if (style.display === 'flex') {
      layouts.flexContainers++;
      layouts.gaps.add(style.gap);
    }
    if (style.maxWidth && style.maxWidth !== 'none') {
      layouts.containerWidths.add(style.maxWidth);
    }
  });
  return {
    grids: layouts.grids,
    flexContainers: layouts.flexContainers,
    uniqueGaps: [...layouts.gaps],
    uniqueContainerWidths: [...layouts.containerWidths],
  };
});
```

### 0.7 Extract Gradients

```javascript
await page.evaluate(() => {
  const gradients = [];
  document.querySelectorAll('*').forEach(el => {
    const bg = window.getComputedStyle(el).backgroundImage;
    if (bg.includes('gradient')) {
      gradients.push({ selector: '', value: bg });
    }
  });
  return [...new Map(gradients.map(g => [g.value, g])).values()];
});
```

### 0.8 Extract Z-Index Map

```javascript
await page.evaluate(() => {
  const zLayers = { base: [], sticky: [], dropdown: [], modal: [], overlay: [], tooltip: [] };
  document.querySelectorAll('*').forEach(el => {
    const z = window.getComputedStyle(el).zIndex;
    const pos = window.getComputedStyle(el).position;
    if (z && z !== 'auto') {
      const layer = pos === 'fixed' || pos === 'sticky' ? 'sticky' : parseInt(z) > 1000 ? 'overlay' : 'base';
      zLayers[layer].push({ element: el.tagName, zIndex: z });
    }
  });
  return zLayers;
});
```

### 0.9 Extract Inline SVGs

```javascript
await page.evaluate(() => {
  const svgs = [...document.querySelectorAll('svg')].map(s => ({
    viewBox: s.getAttribute('viewBox'),
    fill: window.getComputedStyle(s).fill,
    stroke: window.getComputedStyle(s).stroke,
    size: `${s.getBoundingClientRect().width}x${s.getBoundingClientRect().height}`,
    d: s.querySelector('path')?.getAttribute('d')?.slice(0, 50),
  }));
  return [...new Map(svgs.map(s => [s.d, s])).values()];
});
```

### 0.10 Extract Font Sources

```javascript
await page.evaluate(() => {
  const fonts = new Set();
  document.querySelectorAll('*').forEach(el => {
    fonts.add(window.getComputedStyle(el).fontFamily);
  });
  const googleFonts = [...document.querySelectorAll('link[href*="fonts.googleapis"]')]
    .map(l => l.href).filter(Boolean);
  return { fontFamilies: [...fonts], googleFonts };
});
```

### 0.11 Extract Image Style Patterns

```javascript
await page.evaluate(() => {
  const images = [...document.querySelectorAll('img')].map(img => ({
    src: img.src,
    aspectRatio: `${img.getBoundingClientRect().width}/${img.getBoundingClientRect().height}`,
    objectFit: window.getComputedStyle(img).objectFit,
    borderRadius: window.getComputedStyle(img).borderRadius,
    filter: window.getComputedStyle(img).filter,
  }));
  return images;
});
```

### 0.12 Accumulate Tokens

After running all Phase 0 extractions, accumulate these tokens for use in later phases:

```
Design Tokens Collected:
- colors: N unique values (primary, secondary, neutral)
- typography: N font sizes (h1–body scale)
- spacing base unit: Npx
- border radii: N unique values
- box shadows: N unique values
- CSS variables: N custom properties
- gradients: N unique gradients
- z-index layers: N layers mapped
- SVG icons: N unique icons
- font sources: Google Fonts + fallbacks
- image patterns: N images (aspect ratios)
- layout: N grids, N flex containers, N container widths
```

## Phase 1: Page Capture

### Initial Navigation
1. Navigate to URL with `browser_navigate`
2. Wait for `networkidle` state
3. Take full-page screenshot (baseline)
4. Capture accessibility snapshot for DOM structure

### Viewport标准化
Test at consistent viewport sizes:
- Desktop: 1280x800
- Tablet: 768x1024
- Mobile: 375x812

```javascript
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(url);
await page.waitForLoadState('networkidle');
```

## Phase 2: Component Identification

### Identify Scroll Zones

As you scroll down the page, note distinct **regions** that appear:

1. **Sticky headers/nav** - elements that persist during scroll
2. **Parallax sections** - backgrounds that move at different rates
3. **Reveal zones** - content that animates into view on scroll
4. **Sticky sidebars** - elements fixed to viewport edges
5. **Modal triggers** - elements that open overlays

For each zone, capture:
- Screenshot at entry
- Screenshot at mid-scroll
- Screenshot at exit
- DOM structure before/during/after

### Pattern Detection

Watch for these component types:

| Pattern | Visual Cue | DOM Indicator |
|---------|-----------|---------------|
| **Carousel/Slider** | Items slide horizontally | Transform, translateX changes |
| **Accordion** | Content expands vertically | Height, max-height changes |
| **Tabs** | Content swaps without page change | Display, visibility changes |
| **Modal** | Overlay + centered content | Opacity, pointer-events, z-index |
| **Tooltip** | Small popup on hover | Position, display toggle |
| **Dropdown** | Menu appears below button | Transform: translateY |
| **Parallax** | Background moves slower | Transform: translateY with offset |
| **Sticky** | Element stays in viewport | Position: sticky, fixed |
| **Lazy load** | Content appears as scrolling | Intersection Observer triggers |

## Phase 3: Interaction Analysis

### Hover Behavior
```javascript
// Capture hover state for each interactive element
await page.hover('selector');
await page.waitForTimeout(200); // Wait for transition
await page.screenshot({ path: 'hover-state.png' });
```

### Click/Active Behavior
```javascript
await page.click('selector');
await page.screenshot({ path: 'active-state.png' });
```

### Drag Behavior (for Carousels/Sliders)
```javascript
// Test drag interactions
const element = await page.locator('selector');
const box = await element.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 100, box.y + box.height / 2);
await page.mouse.up();
await page.screenshot({ path: 'post-drag.png' });
```

### Scroll-Triggered Behavior
```javascript
// Monitor scroll position
await page.evaluate(() => {
  window.addEventListener('scroll', () => {
    console.log('Scroll:', window.scrollY);
  });
});
```

## Phase 4: DOM Monitoring

### Monitor Style Changes

Use `browser_evaluate` to watch CSS changes:

```javascript
await page.evaluate(() => {
  const target = document.querySelector('selector');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        console.log('Attribute changed:', mutation.attributeName);
        console.log('New value:', target.style.cssText);
      }
    });
  });
  observer.observe(target, { attributes: true, subtree: true });
});
```

### Track Transform Changes

```javascript
await page.evaluate(() => {
  const target = document.querySelector('.element');
  setInterval(() => {
    const style = window.getComputedStyle(target);
    console.log('Transform:', style.transform);
    console.log('Translate:', style.translate);
  }, 100);
});
```

### Capture Pseudo-class States

```javascript
// Force pseudo-states for inspection
await page.evaluate(() => {
  const el = document.querySelector('selector');
  // Check what styles apply on hover
  el.matches(':hover'); // triggers hover state
});
```

## Phase 5: Component Documentation

For each component identified, document:

### Component Card Template

```markdown
### [Component Name]

**Type:** [Carousel | Accordion | Modal | Tooltip | etc.]

**Trigger:** [What activates it - hover, click, scroll, load]

**Visual Behavior:**
- Default: [screenshot reference]
- Hover: [screenshot reference]
- Active: [screenshot reference]
- Disabled: [if applicable]

**DOM Structure:**
```html
[structural HTML]
```

**Key CSS Properties:**
| Property | Value | Purpose |
|----------|-------|---------|
| display | flex | Layout |
| transform | translateX(-20px) | Animation |
| opacity | 0 | Visibility |

**Animation Details:**
- Duration: [ms]
- Easing: [cubic-bezier or ease]
- Property: [what animates]

**State Changes:**
| State | DOM Change | CSS Change |
|-------|------------|------------|
| Default | - | opacity: 1 |
| Hover | class added | opacity: 0.8, box-shadow appears |
| Active | class added | transform: scale(0.98) |

**Recreation Notes:**
[Implementation hints]
```

## Phase 6: Parallax-Specific Analysis

When you observe parallax effects:

1. **Identify parallax layers** - multiple backgrounds at different depths
2. **Calculate parallax ratio** - how much does each layer move per scroll unit
3. **Capture transition points** - when does parallax start/stop

```javascript
// Measure parallax behavior
await page.evaluate(() => {
  let lastScroll = 0;
  let observations = [];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      observations.push({
        scrollY: window.scrollY,
        elementTop: entry.boundingClientRect.top,
        elementBottom: entry.boundingClientRect.bottom,
        ratio: entry.intersectionRatio
      });
    });
  });

  document.querySelectorAll('[data-parallax]').forEach(el => {
    observer.observe(el);
  });

  window.addEventListener('scroll', () => {
    const scrollDelta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    // Log scroll delta for analysis
  }, { passive: true });
});
```

## Phase 7: Carousel-Specific Analysis

For carousels/sliders:

1. **Identify navigation** - arrows, dots, swipe, scroll
2. **Test each navigation type**
3. **Measure item dimensions** - width, gap, visible count
4. **Check loop behavior** - infinite or bounded
5. **Capture autoplay timing** - if applicable

```javascript
// Analyze carousel mechanics
await page.evaluate(() => {
  const carousel = document.querySelector('.carousel');
  const track = carousel.querySelector('.carousel-track');
  const items = track.querySelectorAll('.carousel-item');

  console.log('Items:', items.length);
  console.log('Item width:', items[0].getBoundingClientRect().width);
  console.log('Track transform:', window.getComputedStyle(track).transform);

  // Check for data attributes indicating position
  const activeItem = track.querySelector('.active');
  if (activeItem) {
    console.log('Active index:', [...items].indexOf(activeItem));
  }
});
```

## Phase 8: WCAG Accessibility Scoring

For every foreground/background color pair found in interactive elements and text, calculate WCAG contrast ratio and grade it.

### 8.1 Collect Text/Interactive Element Color Pairs

```javascript
await page.evaluate(() => {
  const pairs = [];
  const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, input, label, li, td, th');
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const fg = style.color;
    const bg = style.backgroundColor;
    if (fg && bg && fg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgba(0, 0, 0, 0)') {
      pairs.push({ selector: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''), fg, bg });
    }
  });
  return pairs;
});
```

### 8.2 WCAG Contrast Ratio Formula

```
WCAG Contrast Ratio (relative luminance):
L = 0.2126 * R + 0.7152 * G + 0.0722 * B
(convert sRGB to linear: if sRGB > 0.03928, ((sRGB+0.055)/1.055)^2.4, else sRGB/12.92)
Contrast = (L1 + 0.05) / (L2 + 0.05)  where L1 = lighter, L2 = darker

WCAG thresholds:
- AA Normal text: 4.5:1
- AA Large text: 3:1
- AAA Normal text: 7:1
- AAA Large text: 4.5:1
- AA UI components: 3:1
```

### 8.3 Contrast Ratio Calculator

```javascript
await page.evaluate(() => {
  const toLinear = (c) => {
    const s = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!s) return 0;
    const [r,g,b] = [parseInt(s[1]),parseInt(s[2]),parseInt(s[3])].map(v => {
      v /= 255;
      return v > 0.03928 ? Math.pow((v+0.055)/1.055, 2.4) : v/12.92;
    });
    return 0.2126*r + 0.7152*g + 0.0722*b;
  };
  const contrast = (fg, bg) => {
    const l1 = Math.max(toLinear(fg), toLinear(bg));
    const l2 = Math.min(toLinear(fg), toLinear(bg));
    return (l1 + 0.05) / (l2 + 0.05);
  };
  // Get pairs from Phase 8.1 and score each
  return { totalPairs: 0, passing: 0, failing: 0, score: '0%' };
});
```

### 8.4 Accessibility Score Report

Present findings as:

```markdown
## WCAG Accessibility Score

**Overall:** XX% (N/N pairs passing)

| Element | FG | BG | Ratio | AA Normal | AA Large | AAA Normal | AAA Large |
|---------|----|----|-------|-----------|----------|-------------|-----------|
| body text | #333 | #fff | 12.6:1 | ✓ | ✓ | ✓ | ✓ |
| button | #fff | #0066cc | 4.2:1 | ✗ | ✓ | ✗ | ✓ |

**Failing pairs** (below AA 4.5:1):
1. [list failing selectors with their ratios and suggested fixes]
```

## Phase 9: Design Quality Scoring

Rate the site's design across 7 categories. Score each 0-100, then average for an overall grade.

### Scoring Criteria

| Category | What to Score | Score Calculation |
|----------|--------------|-------------------|
| **Color Discipline** | Unique colors used (5-15 = 100, >30 = 0) | clamp(100 - (uniqueColors - 15) * 5, 0, 100) |
| **Typography** | Consistent type scale, Google Fonts used | Count unique fontFamilies; 1-3 = 100, 4-6 = 60, 7+ = 20 |
| **Spacing System** | Consistent base unit (4/8px grid = 100) | Based on GCD of spacing values |
| **Shadows** | Shadow discipline (1-3 unique = 100, >8 = 0) | clamp(100 - (uniqueShadows - 3) * 20, 0, 100) |
| **Border Radii** | Consistent radii (1-5 unique = 100, >15 = 0) | clamp(100 - (uniqueRadii - 5) * 8, 0, 100) |
| **Accessibility** | WCAG AA passing pairs | % of pairs passing AA 4.5:1 |
| **Tokenization** | CSS variables used for design values | Count vars starting with --; >20 = 100, >10 = 60, <=10 = 20 |

### Grade Scale

```
A:  85-100  (excellent)
B:  70-84   (good)
C:  55-69   (average)
D:  40-54   (below average)
F:   0-39   (poor)
```

### Score Presentation

```markdown
## Design Quality Score: 68/100 (Grade: C)

| Category | Score | Bar |
|----------|-------|-----|
| Color Discipline     | 80 | ████████░░░░░░░░░░░ |
| Typography           | 60 | ██████░░░░░░░░░░░░░ |
| Spacing System       | 100| ████████████████████|
| Shadows              | 40 | ████░░░░░░░░░░░░░░░ |
| Border Radii         | 70 | ███████░░░░░░░░░░░░ |
| Accessibility        | 94 | ████████████░░░░░░░ |
| Tokenization         | 50 | █████░░░░░░░░░░░░░░ |

**Top Issues:**
1. Too many unique box shadows (8 found — consolidate to 3)
2. 6 font families — limit to 3 max
3. 4 failing WCAG contrast pairs
```

## Phase 10: Multi-Format Output Generation

Using the tokens collected in Phase 0, generate output files via `Write` tool. Run after all extraction phases are complete.

### 10.1 Output File Naming Convention

```
{url-slug}-design-language.md      (already handled by existing skill)
{url-slug}-design-tokens.json
{url-slug}-tailwind.config.js
{url-slug}-variables.css
{url-slug}-figma-variables.json
{url-slug}-theme.js
```

URL slug: `stripe.com` → `stripe-com`

### 10.2 W3C Design Tokens JSON

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "primary": { "$value": "#0066CC", "$type": "color" },
    "secondary": { "$value": "#555555", "$type": "color" }
  },
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" }
  },
  "typography": {
    "fontFamily": { "$value": "Inter, sans-serif", "$type": "fontFamily" },
    "fontSize": { "$value": "16px", "$type": "dimension" }
  },
  "shadow": {
    "sm": { "$value": "0 1px 2px rgba(0,0,0,0.1)", "$type": "shadow" }
  }
}
```

### 10.3 Tailwind CSS Config

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#555555',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px',
      },
      borderRadius: {
        sm: '2px', md: '4px', lg: '8px', xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.1)',
        md: '0 4px 8px rgba(0,0,0,0.15)',
      },
    },
  },
};
```

### 10.4 CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary: #0066CC;
  --color-secondary: #555555;
  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-base: 16px;
  /* Spacing */
  --spacing-unit: 4px;
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.1);
  /* Radii */
  --radius-sm: 2px;
  --radius-md: 4px;
}
```

### 10.5 Figma Variables JSON

```json
{
  "version": "1.0",
  "variables": {
    "colors": [
      { "name": "primary", "values": { "light": "#0066CC", "dark": "#3388EE" } }
    ]
  },
  "variableCollections": [
    {
      "name": "Primitive",
      "modes": [{ "name": "Mode 1" }],
      "variables": []
    }
  ]
}
```

### 10.6 React Theme (JavaScript)

```javascript
// theme.js
export const theme = {
  colors: {
    primary: '#0066CC',
    secondary: '#555555',
  },
  fonts: {
    sans: "'Inter', system-ui, sans-serif",
    mono: "'Fira Code', monospace",
  },
  spacing: [4, 8, 16, 24, 32, 48, 64],
  radii: [2, 4, 8, 16],
  shadows: [
    '0 1px 2px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.15)',
  ],
};
```

### 10.7 Write All Files

Create output directory and write files via `Write` tool:

```bash
# Create output directory
mkdir -p design-extract
```

Then write each file using the templates above. Substitute placeholder values (e.g., `#0066CC`) with actual values extracted in Phase 0.

### 10.8 Integration with designlang

After running Phase 0 through Phase 10, offer the user:
- The markdown recreation guide (existing output)
- The design token files (new output)
- Copy `*-tailwind.config.js` into their project
- Open `*-preview.html` in browser (from Phase 11)

## Phase 11: Visual HTML Preview

Generate a self-contained `*-preview.html` file that renders all extracted tokens visually for browser-based review.

### HTML Preview Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Preview: {url}</title>
  <style>
    :root {
      /* CSS vars from Phase 0 */
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-family); padding: 32px; background: #fafafa; }
    h1 { font-size: 2rem; margin-bottom: 24px; }
    h2 { font-size: 1.5rem; margin: 24px 0 12px; }
    section { background: white; padding: 24px; margin-bottom: 16px; border-radius: 8px; box-shadow: var(--shadow-sm); }
    .swatch { display: inline-block; width: 80px; height: 80px; border-radius: 4px; margin: 4px; vertical-align: middle; }
    .swatch-label { font-size: 11px; display: block; text-align: center; margin-top: 4px; }
    .type-sample { margin: 8px 0; }
    .shadow-sample { width: 80px; height: 40px; background: white; margin: 4px; border-radius: 4px; display: inline-block; }
    .a11y-pass { color: green; } .a11y-fail { color: red; }
    table { width: 100%; border-collapse: collapse; }
    td, th { padding: 8px; border: 1px solid #ddd; text-align: left; }
    tr.pass { background: #e8f5e9; } tr.fail { background: #ffebee; }
  </style>
</head>
<body>
  <h1>Design Preview: {url}</h1>

  <section id="colors">
    <h2>Color Palette ({n} colors)</h2>
    <!-- Color swatches injected from Phase 0 -->
  </section>

  <section id="typography">
    <h2>Typography Scale</h2>
    <!-- Type scale injected from Phase 0 -->
  </section>

  <section id="spacing">
    <h2>Spacing System ({base}px base)</h2>
    <!-- Spacing samples -->
  </section>

  <section id="shadows">
    <h2>Box Shadows ({n} unique)</h2>
    <!-- Shadow samples -->
  </section>

  <section id="radii">
    <h2>Border Radii ({n} unique)</h2>
    <!-- Radius samples -->
  </section>

  <section id="a11y">
    <h2>WCAG Accessibility ({score})</h2>
    <!-- Contrast table from Phase 8 -->
  </section>

  <section id="score">
    <h2>Design Quality Score: {overall}/100 (Grade: {grade})</h2>
    <!-- Score bars from Phase 9 -->
  </section>
</body>
</html>
```

### Inject Dynamic Content

Before writing the file, substitute placeholders with actual extracted data:
- `{url}` — original URL
- `{n} colors` — count from Phase 0 color extraction
- Color swatches — render each color as `<div class="swatch" style="background:{hex}"><span class="swatch-label">{hex}</span></div>`
- Typography scale — render each level as `<p class="type-sample" style="font-size:{size}; font-weight:{weight}">{tag}: {size} / {weight}</p>`
- `{base}px base` — from Phase 0.5
- `{score}` — from Phase 8
- `{overall}/100` and `{grade}` — from Phase 9

## Phase 12: Responsive Multi-Breakpoint Capture

Test the site at 4 standard viewports and record exactly what changes per breakpoint.

### Viewport Matrix

| Label | Width | Height | Typical Device |
|-------|-------|--------|----------------|
| Mobile | 375 | 812 | iPhone |
| Tablet | 768 | 1024 | iPad |
| Desktop | 1280 | 800 | Laptop |
| Wide | 1920 | 1080 | Desktop |

### Capture Strategy

For each viewport, navigate, wait for idle, then extract:

```javascript
const viewports = [
  { label: 'mobile', width: 375, height: 812 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 800 },
  { label: 'wide', width: 1920, height: 1080 },
];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `screenshot-${vp.label}.png` });
  const vpData = await page.evaluate(() => {
    return {
      navDisplay: window.getComputedStyle(document.querySelector('nav') || document.body).display,
      maxWidth: window.getComputedStyle(document.body).maxWidth,
      gridCols: window.getComputedStyle(document.querySelector('[class*="grid"]') || document.body).gridTemplateColumns,
      hamburgerVisible: !![document.querySelector('[class*="hamburger"]')],
      h1FontSize: window.getComputedStyle(document.querySelector('h1') || document.body).fontSize,
    };
  });
  console.log(vp.label, JSON.stringify(vpData));
}
```

### Breakpoint Diff Report

Present as:

```markdown
## Responsive Behavior

### Breakpoint Changes (4 viewports, N changes detected)

| Property | 375px | 768px | 1280px | 1920px |
|----------|-------|-------|--------|--------|
| Nav display | none (hamburger) | flex | flex | flex |
| Grid columns | 1 | 2 | 3 | 4 |
| H1 font size | 32px | 40px | 48px | 56px |
| Container max-width | 100% | 720px | 1200px | 1400px |
| Sidebar | hidden | visible | visible | visible |

### Identified Breakpoints
- **Mobile → Tablet (768px):** Nav hamburger → full nav, grid 1 → 2 cols
- **Tablet → Desktop (1280px):** Grid 2 → 3 cols, H1 grows
- **Desktop → Wide (1920px):** Container widens, grid stays 3 cols
```

### Responsive Component-Specific Capture

For nav, grid, and card components, record computed styles at each viewport:

```javascript
await page.evaluate(() => {
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]') || document.body;
  const style = window.getComputedStyle(nav);
  return {
    display: style.display,
    position: style.position,
    flexDirection: style.flexDirection,
    visibility: style.visibility,
    zIndex: style.zIndex,
  };
});
```

## Phase 13: Dark Mode Detection

Detect whether the site supports dark mode and extract the dark color palette.

### 13.1 Check for Dark Mode Indicators

```javascript
await page.evaluate(() => {
  const styleSheets = [...document.styleSheets];
  const mediaQueries = [];
  styleSheets.forEach(ss => {
    try {
      [...ss.cssRules].forEach(rule => {
        if (rule.type === CSSRule.MEDIA_RULE && rule.conditionText?.includes('dark')) {
          mediaQueries.push(rule.conditionText);
        }
      });
    } catch(e) {}
  });

  const darkClasses = [...document.querySelectorAll('[class*="dark"]')];
  const darkVars = [...document.querySelectorAll('*')].map(el => {
    const style = window.getComputedStyle(el);
    for (let i = 0; i < style.length; i++) {
      const p = style[i];
      if (p.includes('dark') || p.includes('--dark')) return p;
    }
  }).filter(Boolean);

  return { mediaQueries, darkClasses: darkClasses.length, darkVarNames: [...new Set(darkVars)] };
});
```

### 13.2 Simulate Dark Mode

```javascript
// Force dark mode by injecting CSS
await page.evaluate(() => {
  const style = document.createElement('style');
  style.textContent = '@media (prefers-color-scheme: dark) { body { background: #111; color: #fff; } }';
  document.head.appendChild(style);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshot-dark.png' });
```

### 13.3 Extract Dark Palette

```javascript
await page.evaluate(() => {
  const darkColors = new Set();
  [...document.querySelectorAll('*')].forEach(el => {
    const s = window.getComputedStyle(el);
    if (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') {
      darkColors.add(s.backgroundColor);
    }
    if (s.color && s.color !== 'rgba(0, 0, 0, 0)') {
      darkColors.add(s.color);
    }
  });
  return [...darkColors];
});
```

### 13.4 Dark Mode Report

```markdown
## Dark Mode Support

**Detected:** Yes/No

**Dark Mode Mechanism:**
- [ ] `prefers-color-scheme: dark` media query found
- [ ] `.dark` class toggled on body
- [ ] `[data-theme="dark"]` attribute

**Dark Palette ({n} colors):**
| Light | Dark | Usage |
|-------|------|-------|
| #ffffff | #111111 | Background |
| #0066CC | #3388EE | Primary |
```

## Output Format

Produce a structured recreation guide:

```markdown
# Component Recreation Guide: [Page Name]

## URL
[original URL]

## Viewport Tested
[1280x800 / 768x1024 / 375x812]

---

## Components Identified

### 1. [Hero Section]
[Component card as above]

### 2. [Navigation Bar]
[Component card]

### 3. [Talent Cards Grid]
[Component card]

[... continue for each component]

---

## CSS Variables Identified
[Collect any CSS custom properties found]

## Animation Timing
| Component | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Header fade | 300ms | ease-out | scroll |
| Card hover | 200ms | cubic-bezier(0.4, 0, 0.2, 1) | hover |

## Implementation Priority
1. [Most complex/time-sensitive component]
2. [Next priority]
...
```

## Common Mistakes

1. **Not capturing enough states** - hover, active, disabled all matter
2. **Missing transition timing** - assume instant when it's animated
3. **Ignoring pseudo-elements** - ::before, ::after often used for decorations
4. **Forgetting scroll-linked animations** - parallax uses scroll events, not just CSS
5. **Not testing navigation** - carousels need arrow/dot/swipe all tested

## Integration with Other Skills

- **ccss-frontend-dev-cycle** - Use for iterative visual testing
- **superpowers:writing-plans** - Convert recreation guide into implementation tasks
- **frontend-design** - For design token extraction

## Quick Reference

| Tool | Purpose |
|------|---------|
| `browser_navigate` | Load URL |
| `browser_snapshot` | Get accessibility tree |
| `browser_take_screenshot` | Capture visual states |
| `browser_evaluate` | Run JS for DOM monitoring |
| `browser_hover` | Trigger hover states |
| `browser_click` | Trigger click states |
| `browser_resize` | Test responsive behavior |
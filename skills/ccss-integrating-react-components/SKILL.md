---
name: ccss-integrating-react-components
description: Use when writing or updating integration docs for any React component in the project — new component, imported shadcn component, third-party component, or when a component's public interface changes.
---

# ccss-integrating-react-components

Generate a standardized `integration.<name>.md` co-located next to every React component in the project. Same structure for every component regardless of origin (local, shadcn, third-party).

## When to Use

Trigger when ANY of these apply:
- A new React component is created in the project
- An imported component (shadcn, third-party, fork) has no `integration.<name>.md` co-located with it
- An existing component's public interface changes (prop added/removed/changed)
- Another skill explicitly asks for component metadata

## Output File

```
integration.<kebab-case-name>.md
```
Co-located in the same directory as the component file.

Naming: `integration.sphere-image-grid.md`, `integration.logo.md` — use the shortest unambiguous name in kebab-case. Do not prefix with the component's source folder.

## File Structure

Eight sections. Omit sections with nothing to document — never write an empty header.

### 1. Frontmatter (YAML)

```yaml
---
component: <exportedName>
tags: [<lowercase, comma-separated keywords — max 10>]
source: <local | shadcn | <package-name>>
---
```

- `component`: exact exported name from the source file (`SphereImageGrid`, `Logo`)
- `tags`: lowercase keywords the orchestrator uses to match components to tasks. Include verbs and nouns. Bad: `["ui", "component"]`. Good: `["gallery", "3d", "sphere", "image-grid", "drag-rotate", "fibonacci"]`
- `source`: `local` for project-owned, `shadcn` for shadcn/ui, otherwise the package name (`@radix-ui/react-dialog`)

### 2. Overview

1-3 sentences. Plain language. Describe the component's purpose and core concept. Do not repeat the exported name.

### 3. Orchestrator Metadata

```yaml
### orchestrator
input: <what the component requires to render meaningfully>
output: <what the component renders (DOM elements, React nodes)>
slots: [<named slot / children props, or "none">]
state: [<component-owned state names the consumer should know, or "none">]
interactions: [<keyboard, mouse, touch, drag — everything the component handles internally>]
```

Examples:
```yaml
### orchestrator
input: Array of ImageData objects with src and alt
output: Absolutely-positioned <img> elements arranged in 3D space
slots: none
state: rotation (x/y), velocity, hoveredIndex, isDragging
interactions: drag-to-rotate (mouse), momentum physics, auto-rotation, image click
```

If a field has no content, write `none` — do not omit the field.

### 4. Usage

Two required parts:

**Import**
```tsx
import { ComponentName } from '@/components/<path>'  // or relative path
```

**Minimal example** — use realistic prop values, not placeholders:
```tsx
<ComponentName
  propA="real-value"
  propB={42}
  onEvent={handleEvent}
/>
```

### 5. Props

Table format:

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `propA` | `string` | yes | — | What it does |
| `propB` | `number` | no | `0` | What it does |

If no props: write `This component has no props — it renders statically.`

List every prop from the interface. Include the `ImageData` (or equivalent) interface if used.

### 6. Theming

Two required parts:

**CSS token overrides** — list every CSS custom property the component uses. Describe the token's *intent*, not its value. Do not write raw Tailwind class names.

Example:
```
--color-gold-primary  Accent/highlight color for interactive elements and borders
--color-void          Dark page background / fallback surface
--font-display        Display typeface for headings and labels
```

**`className` passthrough** — state clearly whether the component accepts `className` and where it is forwarded:

- Accepts `className` → show how to use it and name the target element
- Does not accept `className` → state: `This component does not accept a className prop. To apply custom styles, override the CSS custom properties listed above.`

### 7. Accessibility

Cover all that apply:
- **Keyboard**: Tab, Enter, Escape, ArrowLeft/Right, etc. — list every key
- **ARIA**: roles, labels, aria-* states used
- **Focus**: does it manage focus internally?
- **Screen reader**: anything notable

If no keyboard or ARIA behavior: write `No keyboard or ARIA interactions.`

### 8. Dependencies

List everything the component requires to run:

```
**Hooks**: `useCursorTooltip` (from `hooks/useCursorTooltip.ts`)
**Peer libraries**: `framer-motion`
**Stores**: `useHomeStore` (Zustand, from `store/homeStore.ts`)
**Data files**: none
**Assets**: none
```

Use `none` for categories with nothing to list.

## Workflow

```
1. Locate the component file (.tsx or .ts)
2. Read it fully — extract:
     - exported name(s)
     - props interface
     - all imports (hooks, libs, stores, data files)
     - CSS custom properties used inline or via class names
     - keyboard/ARIA behavior (search for onKeyDown, role=, aria-)
     - interaction surface (onClick, onDrag, onPointer, onTouch, etc.)
3. Check if integration doc already exists (skip if current and complete)
4. Generate all 8 sections, omit empty ones
5. Run the validation checklist
6. Write integration.<kebab-case-name>.md co-located with the component
```

## Validation Checklist

Before writing each file, confirm every item:

- [ ] Frontmatter `component` name matches the exported name exactly
- [ ] `tags` are lowercase, specific, under 10
- [ ] Orchestrator metadata fields are all present (use `none` if empty)
- [ ] Import path is correct (`@/` path alias or relative — verify against tsconfig/jsconfig)
- [ ] Props table covers every prop in the interface
- [ ] At least one usage example with real prop values
- [ ] Theming section lists at least one CSS token OR explicitly states none apply
- [ ] `className` passthrough behavior is documented
- [ ] Accessibility section covers keyboard + ARIA
- [ ] All dependencies are listed (hooks, libs, stores, data)
- [ ] Sections with no content are omitted, not empty
- [ ] No raw Tailwind class names in the theming section — use semantic descriptions

## Common Mistakes

### Tailwind classes in theming section
**Wrong**: `bg-void`, `text-gold-primary`, `rounded-lg`
**Right**: "Dark surface background", "Accent/highlight color for interactive elements", "Standard corner radius"

### Vague tags
**Wrong**: `["ui", "component", "button"]`
**Right**: `["button", "action-trigger", "form-submit", "accessible"]`

### Skipping keyboard interactions
Interactive components (gallery, drag interfaces) have critical keyboard behavior. Always document ArrowLeft/ArrowRight, Escape, Enter.

### Wrong import paths
If the project uses `@/` path aliases, write `from '@/components/CursorTooltip'` — do not guess relative paths.

### Missing hooks as dependencies
`CursorTooltip` depends on `useCursorTooltip`. If you list the component but miss the hook, another agent will import the component without its dependency and it will break.

### Skipping empty sections
An empty "## Theming" with just "none" is fine — write `**Theming**: none` inline. But omit the section heading entirely if there is nothing at all to document.

## Reference: Integration Doc Naming

| Component | Filename |
|---|---|
| `CursorTooltip` | `integration.cursor-tooltip.md` |
| `FullscreenGallery` | `integration.fullscreen-gallery.md` |
| `SphereImageGrid` | `integration.sphere-image-grid.md` |
| `Logo` | `integration.logo.md` |
| `ImageCard` | `integration.image-card.md` |
| `MasonryGallery` | `integration.masonry-gallery.md` |
| `Header` | `integration.header.md` |
| `ScrollingGrid` | `integration.scrolling-grid.md` |
| `Button` (shadcn) | `integration.button.md` |
| `Dialog` (radix) | `integration.dialog.md` |

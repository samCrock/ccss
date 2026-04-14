---
name: ccss-component-orchestrator
description: Use when given a frontend development task and needing to identify which existing components can serve that need — gallery, navigation, tooltip, scrollable grid, modal, header, card, and similar UI goals.
---

# ccss-component-orchestrator

Given a frontend task, read all `integration.*.md` files in the project and return a ranked list of relevant components with rationale. The bridge between "I need to build X" and "here are the documented components that serve X".

## When to Use

Trigger when the user or another agent describes a feature, UI pattern, or interaction goal — and the system needs to identify which existing components fit.

Examples:
- "Add a gallery for product photos"
- "Build a header with nav links"
- "Add a scrollable grid of talent cards"
- "Create a tooltip that follows the cursor"
- "3D image sphere the user can drag to rotate"
- "Full-screen lightbox for browsing images"

If no `integration.*.md` files exist in the project, trigger `ccss-integrating-react-components` to generate them first.

## Process

```
1. Scan for all integration.*.md files
     → Glob: integration.*.md in component directories
     → Common locations: app/components/, components/, ui/, lib/components/
2. For each file, parse:
     - frontmatter (component, tags, source)
     - orchestrator metadata block (input, output, slots, state, interactions)
3. Score each component against the task:
     - tag overlap: how many task keywords appear in component tags
     - input/output fit: does the component accept and produce what the task needs?
     - interaction match: does it handle the required interactions?
     - dependency feasibility: are required libs/stores present?
4. Rank by composite score
5. Return top N candidates (cap at 5)
```

## Scoring Method

**Tag score**: Count tag matches. "gallery" in task + "gallery" in component tags = +1. Case-insensitive, substring match. Each matched tag = 1 point.

**Input/output score**:
- Task needs X as input → component accepts X → +1
- Task needs Y as output → component produces Y → +1
- Partial match → +0.5

**Interaction score**:
- Task mentions interaction (drag, scroll, click, tooltip) → component lists it → +1
- Task mentions keyboard nav → component handles it → +1

**Ranking thresholds**:
- High: 3+ combined points
- Medium: 2 points
- Low: 1 point
- None: 0 points

Dependencies do not affect score but are flagged in the rationale.

## Output Format

```markdown
## Suggested Components

**1. SphereImageGrid** — High match
`app/components/integration.sphere-image-grid.md`
Rationale: Renders images in a 3D drag-to-rotate sphere. Input matches (array of ImageData with src/alt). Handles drag-rotate natively. Zero runtime npm deps beyond React.
Key props: `images`, `onImageClick`, `dragSensitivity`, `autoRotate`

**2. MasonryGallery** — Medium match
`app/components/integration.masonry-gallery.md`
Rationale: Responsive multi-column image grid with hover effects. Simpler than SphereImageGrid. Does not handle 3D or drag-rotate.
Key props: `photos`, `talentName`, `onPhotoClick`
```

If no components score as relevant:
```markdown
No components match the task. The task may require a new component.
Consider triggering ccss-integrating-react-components to document it after implementation.
```

## Orchestrator Metadata Reference

The orchestrator reads this block from each `integration.*.md`:

```yaml
### orchestrator
input: <what the component requires to render>
output: <what the component renders>
slots: [<named slots, or "none">]
state: [<internal state names, or "none">]
interactions: [<keyboard, mouse, touch, drag interactions>]
```

Handle missing fields as `none`. Do not error on malformed YAML.

## Common Mistakes

### Matching on tags only
A component with matching tags may still be wrong if its input/output doesn't fit. Always consider input/output alongside tags.

### Ignoring dependencies
A component may score well but require `framer-motion` or a Zustand store not present in the project. Flag this in the rationale.

### Too many results
Cap at 5 candidates. Add `...and N more` if additional candidates exist.

### Low match = wrong component
Distinguish between "fits partially" and "doesn't fit". A low-scoring component may still be the right call for a simpler implementation. Name the limitation explicitly.

### Not reading the full metadata block
The orchestrator metadata is what powers matching. Reading only the Overview or tags is insufficient. Parse all fields.

## Reference: Integration Doc Locations

The orchestrator searches these directories by default. If components live elsewhere, scan that directory:
- `app/components/`
- `components/`
- `ui/`
- `lib/components/`
- `src/components/`

Use a broad glob: `**/integration.*.md`.

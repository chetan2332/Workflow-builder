# Flowstack UI — Design System & Development Standards

## Stack

- **React 19** + **TypeScript** (strict, bundler moduleResolution)
- **Tailwind CSS v4** via `@tailwindcss/vite` — `@import "tailwindcss"` in `index.css`. No `tailwind.config.js`. `@apply` works only for structural utilities (flex, rounded-*), NOT arbitrary value classes.
- **React Flow** (`@xyflow/react` v12) for the canvas editor
- **TanStack Query v5** for all server state
- **React Router v7** for routing
- **Lucide React** for all icons
- **CodeMirror** (`@uiw/react-codemirror`) for code/JSON fields
- **react-oidc-context** + **Cognito OIDC** for auth
- **nanoid** for IDs
- Dev port: **5173** (`vite --port 5173`)
- Monorepo: `pnpm` workspaces + Turborepo. Always run `pnpm` from root, never `npm`.

---

## Day & Night Theme System

Two distinct "natural" palettes paired as a Day/Night identity. Theme is stored in `localStorage` under key `fs-theme` and applied as `data-theme="light"` or `data-theme="dark"` on `<html>`. An anti-FOUC script in `index.html` sets the attribute before React hydrates.

**Warm Paper (light)** — tactile, organic, printed. Cream backgrounds, earthy muted node colors, burnt sienna accent.  
**Mineral (dark)** — high-performance, iOS-grade warm dark grays, Apple green accent.

**Semantic continuity:** node category hue assignments are the same across both themes (purple=Trigger, blue/teal=Code, amber/sienna=Flow). Colors are tuned per theme but the meaning never changes.

### Theme hook

```ts
import { useTheme } from '../hooks/useTheme';
const { theme, toggle, setTheme } = useTheme();
// theme: 'light' | 'dark'
// toggle(): flip
// setTheme('dark'): explicit set
```

### Toggle placement

- **Sign-in page**: fixed top-right `btn-icon`, `Sun/Moon` icon from lucide-react
- **Sidebar**: bottom-right of the user row, `size={12}` Moon/Sun icon

### CodeMirror theme

Reads `document.documentElement.getAttribute('data-theme')` at render time.  
`isDark ? 'dark' : 'light'` — matches the token surface.

---

## Design tokens

All tokens live in `src/index.css`. Two blocks: `:root, [data-theme="light"]` and `[data-theme="dark"]`. Theme-invariant tokens (fonts, radius) are set once on `:root`. Never hardcode hex values or font names in components — always reference a token.

### Backgrounds

```
           Light (Warm Paper)   Dark (Mineral)
--bg:       #FAF8F4              #1C1C1E   ← iOS warm dark
--surface:  #FFFFFF              #2C2C2E
--surface-2:#F4F1EC              #3A3A3C
--surface-3:#EDE9E2              #48484A
```

### Borders

```
           Light       Dark
--border:        #E8E4DC    #3A3A3C
--border-subtle: #F0EDE7    #2C2C2E
```

### Text hierarchy

```
           Light       Dark
--text-1:  #1A1814     #F5F5F7   ← Apple off-white
--text-2:  #6B6560     #8E8E93
--text-3:  #A8A49E     #636366
```

### Accent

```
           Light                    Dark
--accent:      #B5622A (sienna)     #E8932A (warm amber — same family, brightened)
--accent-dim:  rgba(181,98,42,0.08) rgba(232,147,42,0.10)
--accent-glow: rgba(181,98,42,0.18) rgba(232,147,42,0.22)
```

Both themes use white text on the primary button — sienna and amber are both dark enough to pass WCAG AA against white. Green moves to `--success` only.

**Thematic link:** sienna → amber is the same hue family shifted warmer and brighter for dark surfaces. The Day/Night switch feels like the same fire in different light.

### Node category colors (semantic hue continuity)

```
           Light                     Dark
Trigger    #7B6FA0 (muted lavender)  #BF5AF2 (system purple)
Code       #3D7A6F (aged teal)       #0A84FF (system blue)
Flow       #B5622A (sienna)          #FF9F0A (system amber)
Other      #8A8A82 (warm gray)       #8E8E93 (system gray)
```

Both themes use `--cat-*-dim: rgba(..., 0.10–0.12)` for node backgrounds.

### Semantic

```
           Light     Dark
--success: #16A34A   #30D158
--warning: #D97706   #FF9F0A
--danger:  #DC2626   #FF453A
```

### Typography (theme-invariant)

```
--font-display: 'Space Grotesk'   ← headings, brand wordmark, page titles
--font-body:    'Inter'           ← all body text, buttons, inputs
--font-mono:    'JetBrains Mono'  ← labels, badges, timestamps, code, system state
```

Fonts are loaded via `<link>` in `index.html` (parallel load, not CSS `@import`).

### Radius (theme-invariant)

```
--radius-sm:   4px
--radius-md:   8px   ← buttons, inputs, most interactive elements
--radius-lg:   12px  ← cards, panels
--radius-xl:   16px  ← modals, large containers
--radius-full: 9999px ← badges, pills, dots
```

### Shadows

```
           Light                          Dark
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06)   0 1px 3px rgba(0,0,0,0.40)
--shadow-md: 0 4px 16px rgba(0,0,0,0.08)  0 4px 16px rgba(0,0,0,0.50)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.10)  0 8px 32px rgba(0,0,0,0.60)
```

Overlay backdrop: `--overlay-bg` — `rgba(26,24,20,0.50)` light / `rgba(0,0,0,0.65)` dark.

---

## Typography classes

| Class | Font | Size | Weight | Use |
|---|---|---|---|---|
| `.t-display` | Space Grotesk | (set inline) | 600 | Page-level headings |
| `.t-heading` | Space Grotesk | 1rem | 600 | Section headings |
| `.t-label` | JetBrains Mono | 0.625rem | 500 | ALL CAPS section labels, nav dividers |
| `.t-body` | Inter | 0.875rem | 400 | Body copy |
| `.t-small` | Inter | 0.75rem | 400 | Secondary text |
| `.t-tiny` | Inter | 0.6875rem | 400 | Faint helper text |
| `.t-mono` | JetBrains Mono | 0.75rem | 400 | Timestamps, IDs, type indicators |

Rule: `--font-mono` with ALL CAPS and letter-spacing is the system's "instrument panel" voice — use it for labels, timestamps, node type strings, status readouts. Never use it for body copy.

---

## Component classes

### Buttons

Always combine `.btn` with a size class and a variant class:

```tsx
<button className="btn btn-primary btn-md">Save</button>
<button className="btn btn-secondary btn-sm">Cancel</button>
<button className="btn btn-ghost btn-sm">Format</button>
<button className="btn btn-danger btn-md">Delete</button>
<button className="btn-icon"><Trash2 size={14} /></button>
```

Sizes: `.btn-sm` · `.btn-md` · `.btn-lg`  
Variants: `.btn-primary` · `.btn-secondary` · `.btn-ghost` · `.btn-danger` · `.btn-icon`

- Light: white text on sienna. Dark: `#1C1C1E` text on green. Both pass WCAG AA.
- `.btn-icon` is for standalone icon buttons (no label). `padding: 0.375rem`, no border.

### Inputs

```tsx
<label className="input-label" htmlFor="field-id">Label text</label>
<input className="input" id="field-id" ... />
```

### Cards / surfaces

```tsx
<div className="card">...</div>          // surface + border + radius-lg
<div className="card-raised">...</div>   // surface-2 + border + radius-lg
```

### Badges

```tsx
<span className="badge badge-draft">draft</span>
<span className="badge badge-active">active</span>
<span className="badge badge-trigger">Trigger</span>
```

All badges: JetBrains Mono, ALL CAPS, 0.6rem, pill shape.

### Tabs

```tsx
<div className="tab-bar">
  <button className={`tab${active === 'a' ? ' active' : ''}`}>Tab A</button>
</div>
```

### Navigation items

```tsx
<NavLink to="/workflows" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
  <Workflow size={15} />
  Workflows
</NavLink>
```

### Overlay / modal

```tsx
<div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
  <div className="card animate-in" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
    {children}
  </div>
</div>
```

### Theme toggle button

Use `btn-icon` + `Sun` or `Moon` from lucide-react. Size 15px in page context, 12px in sidebar row.

---

## Node category system

Every node has a `NodeCategory` enum value. Both themes share hue assignments — colors are adapted per theme but the category → hue mapping never changes.

Node visual structure:
- Background: `linear-gradient(${dim}, ${dim}), var(--surface)` — tints the opaque white/dark surface so grid dots never show through
- Border: `${categoryColor}${alpha}` (resting, alpha=`70` hex in light / `40` in dark), full color (selected), `--danger` (unsatisfied)
- Selected: `0 0 0 2px ${color}50, 0 4px 20px ${color}30` box shadow + `scale(1.04)`
- Icon at `size * 0.4`, category color stroke

Canvas dot-grid: `gap=24`, `size=1.5`, `color="var(--border)"`.

---

## File structure

```
src/
  index.css              ← dual theme tokens + all utility classes
  main.tsx               ← AuthProvider > QueryClientProvider > AppRouter
  router.tsx             ← createBrowserRouter (login, /, /workflows/:id, /executions)
  vite-env.d.ts
  shell/
    AppShell.tsx         ← Cognito OIDC, sidebar, sign-in, theme toggle
  routes/
    WorkflowsListPage.tsx
    WorkflowEditorPage.tsx
    ExecutionsPage.tsx
    LoginPage.tsx
  api/
    client.ts / workflows.ts / execution.ts / auth.ts
  hooks/
    useTheme.ts          ← theme state, localStorage persistence, DOM attribute
    useWorkflows.ts / useWorkflow.ts / useNodeDefinitions.ts / useExecute.ts
  utils/
    workflowTransform.ts
  features/
    workflow-editor/
      EditorTopBar.tsx
      NodeLibraryDrawer.tsx
      Canvas.tsx
      workflowValidation.ts
      nodes/
        NodeShapes.tsx / index.tsx / DummyNode.tsx / useDummyNodes.ts
      dialog/
        NodeConfigDialog.tsx / SchemaBuilder.tsx
      fields/
        types.ts / fieldComponentMap.ts
        StringField / NumberField / BooleanField / SelectField / TextareaField
        CodeField / JsonField / KeyValueField / CasesField / InputField
        CredentialRefField / FileField
        CodeMirrorEditor.tsx  ← reads data-theme attr for 'dark'|'light' CM theme
```

---

## Layout patterns

### Shell layout (non-editor routes)

```
┌──────────────┬────────────────────────────────┐
│ Sidebar 220px│ <main> scrollable content area  │
│              │ padding: 2rem 2.5rem            │
└──────────────┴────────────────────────────────┘
```

### Editor layout

```
┌────────────────────────────────────────────────┐
│ EditorTopBar  h:48px                           │
├──────────┬─────────────────────────────────────┤
│ Library  │ Canvas (flex-1)                     │
│ w:256px  │ dot-grid on --bg                    │
└──────────┴─────────────────────────────────────┘
```

### NodeConfigDialog layout

```
88vw × 86vh, max-width 1100px
Header h:52 | Config flex-1 + Handles w:280 | Footer h:~52
```

---

## Coding rules

### CSS in components

Inline `style` for one-off values. Classes from `index.css` for recurring patterns. No new CSS files.

```tsx
// Good
<div style={{ color: 'var(--text-2)', fontSize: '0.8125rem' }}>
<button className="btn btn-primary btn-md">

// Bad — hardcoded hex
<div style={{ color: '#8796AF' }}>
```

### Tailwind

Only structural layout utilities (`flex`, `items-center`, `gap-*`). No color classes. No `tailwind.config.js`.

### Hover states on divs

```tsx
onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--text-3)'}
onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
```

### Icons

Always `lucide-react`. 13–15px inline/button, 20px empty states. Reduce `strokeWidth` to 1.75 inside nodes.

---

## Copy standards

- Sentence case everywhere.
- Active verbs: "Save", "Run node", "Create & open", "Sign out".
- Empty states are invitations: "No workflows yet. Create your first to get started."
- Error messages say what happened and how to fix it.
- `flowstack` lowercase in UI wordmark. `Flowstack` only in `<title>`.

---

## What not to do

- Do not add third-party UI libraries (shadcn, radix, chakra).
- Do not use `@import` for fonts in CSS.
- Do not reference hardcoded Tailwind color classes.
- Do not create `tailwind.config.js`.
- Do not use `npm` — `pnpm` from repo root only.
- Do not store theme in React state only — it must also be on `document.documentElement` and in `localStorage` to avoid FOUC and persist across sessions.
- Do not add a third theme block to `index.css` without updating both the `useTheme` hook and the anti-FOUC script in `index.html`.

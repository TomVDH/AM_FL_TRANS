---
name: AM Translations Helper
description: Theatrical precision tool for Asses & Masses performance dialogue localization
colors:
  canvas: "#111827"
  surface: "#1f2937"
  surface-raised: "#374151"
  ink: "#f9fafb"
  ink-secondary: "#9ca3af"
  border: "#4b5563"
  border-subtle: "#374151"
  provenance-json: "#2563eb"
  provenance-json-muted: "#dbeafe"
  provenance-xlsx: "#059669"
  provenance-xlsx-muted: "#dcfce7"
  provenance-character: "#9333ea"
  provenance-character-muted: "#f3e8ff"
  provenance-action: "#dc2626"
  provenance-action-muted: "#fee2e2"
  error: "#f87171"
  success: "#34d399"
  warning: "#fbbf24"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.011em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "-0.011em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.011em"
  dialogue:
    fontFamily: "'Pixelify Sans', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sharp: "3px"
  md: "6px"
  lg: "10px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#e5e7eb"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  button-danger:
    backgroundColor: "{colors.provenance-action}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "8px 16px"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "16px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "10px 16px"
---

# Design System: AM Translations Helper

## 1. Overview

**Creative North Star: "The Rehearsal Room"**

The Rehearsal Room is where the work actually happens. Not the stage, not the programme, not the lobby — the room with the marked-up scripts, the chalk marks on the floor, the director's coffee cup. It is stripped of decoration but deeply inhabited. Every mark on every surface is there because someone needed it. Nothing is there for show.

That is the governing logic of this tool. The translation content — the dialogue, the character voices, the editorial decisions — is the performance. The interface is the room it happens in. The tool exists to make the work possible, not to be noticed. Design earns its place by accelerating decisions, not by impressing anyone.

At the same time, this room belongs to AM. The theatrical sensibility of Asses & Masses inflects the tool's character: the confidence of the layout, the authority of the type, the precise functional color of a stage manager's notation system. AM-flavored without being AM-costumed.

**Key Characteristics:**

- Dark canvas primary — long sessions, focused work, editorial atmosphere
- Ink-on-surface hierarchy: very high contrast, no mid-tone muddiness
- A single Provenance System for color: four semantic colors that tag data origins, used nowhere else
- Sharp geometry: 3px radius everywhere, flat borders, no softening
- Type-first: all hierarchy is expressed through weight and scale, never color alone
- Uppercase labels as the voice of the tool; sentence-case for content

## 2. Colors: The Rehearsal Room Palette

The palette is a considered dark — not atmospheric, not posturing. Ink-white on stage-dark, with a four-color provenance notation system as the only saturated accent layer.

### Primary (Dark Mode — the canonical experience)

- **Stage Dark** (`#111827`): The canvas. Page background. Never surfaces. This is the floor of the rehearsal room.
- **Scene Gray** (`#1f2937`): The wall. Card backgrounds, panel surfaces, sidebar fills. One stop above the floor.
- **Lift Gray** (`#374151`): Surface-raised state. Hover backgrounds, selected states, elevated panels.

### Neutral

- **Rehearsal White** (`#f9fafb`): Primary ink. All body text, headings, labels.
- **Director's Dust** (`#9ca3af`): Secondary ink. Help text, metadata, disabled labels.
- **Mark Gray** (`#4b5563`): Borders. 1px strokes on cards, inputs, separators.
- **Trace Gray** (`#374151`): Subtle borders. Nested containers, dividers within surfaces.

### The Provenance System

The only saturated colors in the tool. Each marks the origin of translation data — used exclusively for that semantic purpose and never as general accent or brand decoration.

- **Call Sheet Blue** (`#2563eb` / muted: `#dbeafe`): JSON / API data origin. Applied to highlight tags, data-source indicators.
- **Stage Manager Green** (`#059669` / muted: `#dcfce7`): XLSX / spreadsheet data. Applied to Excel-sourced cell highlights.
- **Character Purple** (`#9333ea` / muted: `#f3e8ff`): Character canon data. Applied to codex-linked content.
- **Cue Red** (`#dc2626` / muted: `#fee2e2`): Action required / clickable. Applied to interactive provenance tags and danger states.

### Semantic Feedback

- **Error** (`#f87171`): Validation errors, destructive confirmations.
- **Success** (`#34d399`): Completion states, successful saves.
- **Warning** (`#fbbf24`): Non-blocking alerts, ambiguous states.

### Light Mode (alternate, not primary)

Light mode inverts the canvas-surface-ink hierarchy: background becomes `#f9fafb`, surface becomes `#ffffff`, primary text becomes `#111827`, borders become `#000000`. The Provenance System colors remain identical across both modes.

### Named Rules

**The Provenance Rule.** The four provenance colors — blue, green, purple, red — are reserved exclusively for tagging data sources. Using call-sheet blue as a generic link color or cue red as a general warning violates the notation system's semantic integrity.

**The One-Temperature Rule.** All UI chrome is achromatic. Warmth and saturation are provenance signals, not interface decoration. If a new element wants color, the question is: which data type does it represent?

## 3. Typography

**Primary Font:** System sans-serif stack — Inter (when loaded), BlinkMacSystemFont, Segoe UI, Roboto, system-ui. The tool never ships a custom display font for UI; the system stack is the instrument.

**Dialogue Font:** Pixelify Sans (400–700). Loaded via Next.js `next/font/google`. Used exclusively inside the ConversationView game-dialogue surface. Not a brand font — a costume for a specific screen.

**Accent Font:** Playfair Display (400, 700). Used once: the version badge in the footer. Serif as a signal of craft, not a typographic system.

**Character:** The system sans is used without apology — at high weight and tight tracking, it is authoritative. Headings punch at 900 weight. The contrast between display weight and body weight is the primary hierarchy signal, not size alone.

### Hierarchy

- **Display** (900 weight, clamp(1.5rem → 2.25rem), 1.2 line-height, −0.025em): Screen titles, wizard step headers. Rare.
- **Headline** (700 weight, 1.25rem, 1.3 line-height, −0.025em): Section headings, panel titles.
- **Title** (700 weight, 1rem, 1.4 line-height, −0.011em): Card titles, collapsed panel labels, named items.
- **Body** (400 weight, 0.875rem, 1.7 line-height, −0.011em): Translation content, dialogue text, descriptions. Max line length: 75ch.
- **Label** (900 weight, 0.75rem, 1.2 line-height, uppercase, 0.05em tracking): Button text, column headers, status badges, all tool-voice text. Uppercase weight carries the authority of the interface without raising the visual footprint.

### Named Rules

**The Two-Voice Rule.** The tool speaks in two typefaces and they never mix on the same surface. System sans is the tool's voice — headings, labels, body copy, UI. Pixelify Sans is the game's voice — dialogue bubbles in ConversationView only. Playfair Display is a signature, not a system.

**The Weight-Before-Size Rule.** Hierarchy is established first through weight contrast (900 vs 400), then through size. A 0.75rem label at 900 weight outranks a 1rem body text at 400. Never add a font size step to fix hierarchy that weight can handle.

## 4. Elevation

The system is primarily flat. Surfaces distinguish themselves from the canvas through background color shifts (`canvas` → `surface` → `surface-raised`), not shadow depth. Shadows are a response to state, not a resting condition.

### Shadow Vocabulary

- **Ambient low** (`box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05)`): Cards at rest — barely-there lift.
- **Interactive mid** (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`): Hover state on elevated cards, open dropdowns.
- **Lifted high** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`): Modal-adjacent panels, overlay surfaces.
- **Gamepad solid** (`box-shadow: 0 6px 0 0 #111827`): Exclusive to dialogue mode. A hard offset — a 3D button affordance that signals the game-surface register. Used nowhere else.

### Named Rules

**The Flat-at-Rest Rule.** No surface has a shadow unless it has responded to user state (hover, focus, open). Resting elevation is communicated by background tint only.

**The Gamepad Exception.** The `0 6px 0 0` hard shadow is architectural, not decorative. It exists only inside ConversationView to signal the dialogue surface's distinctiveness from the tool shell. Importing it elsewhere breaks the system's register hierarchy.

## 5. Components

### Buttons

Buttons are the tool's most opinionated surface. They speak in the tool's voice: all-caps, black weight, sharp corners, no softening. The lift (+−2px Y translate on hover) is the only permitted movement.

- **Shape:** Sharp corners (3px radius, hardcoded — never more)
- **Primary:** White-on-dark (`#f9fafb` background in dark mode on `#111827` text reversed — wait, primary in dark mode is white bg/dark text: bg `#f9fafb`, text `#111827`). Padding: 8px 16px (sm) / 8px 16px (md) / 12px 24px (lg). Hover: bg `#e5e7eb`.
- **Secondary:** Surface background (`#1f2937`), white text, 1px `#4b5563` border. Hover: `#374151` bg.
- **Outline:** Transparent bg, `#6b7280` border, white text. Hover: `#1f2937` bg.
- **Ghost:** Transparent bg and border, white text. Hover: `#1f2937` bg. Shadow stripped entirely.
- **Danger:** `#dc2626` bg, white text. Hover: `#b91c1c`. Semantically a provenance-action color — reserved for destructive confirmations.
- **All variants:** `font-weight: 900`, `text-transform: uppercase`, `letter-spacing: 0.05em` (wide tracking), `transition: all 0.2s`. Hover: `translateY(-2px)` + shadow step up. Active: `scale(0.985)`.

### Cards / Containers

Cards mark territory — a bounded surface holding related content. They are distinguished by border, not shadow.

- **Corner Style:** 3px radius. Never softened.
- **Background:** `#1f2937` (scene gray) in dark mode; `#ffffff` in light mode.
- **Border:** 1px solid `#000000` (light) / `#4b5563` (dark). Black border is load-bearing — it asserts boundary without shadow.
- **Shadow Strategy:** Ambient low at rest; interactive mid on hover (elevated variant only). Bordered variant: no shadow.
- **Internal Padding:** 16px (md) by default. Scale to 24px for prominent cards.

### Inputs / Fields

Inputs are recessive — they should not announce themselves, only activate on focus.

- **Style:** `#1f2937` background, `#6b7280` border (1px), `#f9fafb` text, no radius beyond 3px.
- **Focus:** 2px `#6b7280` ring, border shifts to `#6b7280`. Subtle — the focus signal is honest, not theatrical.
- **Error:** Border and ring shift to `#ef4444`. Error message in `#f87171` below field.
- **Disabled:** Background `#374151`, text `#6b7280`. Clearly inert, not hidden.
- **Sizes:** sm (py-1.5 px-3 text-sm) / md (py-2.5 px-4 text-base) / lg (py-3 px-5 text-lg).

### Navigation / Toolbar

No persistent nav bar. The tool is three views in a linear wizard flow: SetupWizard → ConversationView → CompletionSummary. Within-view navigation uses a toolbar strip — flat `#1f2937` surface, icon+label buttons in ghost style, active state via `#374151` background.

### Dialogue Bubbles (Signature Component)

The ConversationView surface is the tool's signature — where the Rehearsal Room drops into game-dialogue mode. The register shifts: Pixelify Sans, 3D offset shadows, rounded-on-one-corner bubbles.

- **Font:** Pixelify Sans exclusively. Never system sans inside a bubble.
- **Shape:** 10px radius with one corner flattened toward the speaker (game-chat convention).
- **Shadow:** `0 6px 0 0 #111827` — the gamepad solid. Structural, not decorative.
- **Entrance:** `gamepadSlideIn` (0.35s, cubic-bezier spring) on mount.
- **Character labels:** Uppercase, 0.75rem, system sans — the tool's voice labeling the game's voice.

### Provenance Highlight Tags (Signature Component)

Inline `<span>` tags applied to translation cells to mark data source. The visual anchor of the entire Provenance System.

- **JSON (blue):** `background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe`
- **XLSX (green):** `background: #dcfce7; color: #065f46; border: 1px solid #bbf7d0`
- **Character (purple):** `background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff`
- **Action/clickable (red):** `background: #fee2e2; color: #991b1b; border: 1px solid #fecaca`
- All: `border-radius: 4px`, `font-size: 0.75rem`, `padding: 1px 5px`.
- Hover: tooltip appears above tag (custom CSS tooltip, no JS dependency). Color inverts to solid bg.

## 6. Do's and Don'ts

### Do:

- **Do** use the Provenance System colors — call-sheet blue, stage-manager green, character purple, cue red — exclusively for their designated data-origin roles. Their meaning is their value.
- **Do** use sharp corners (3px) on every interactive element. The sharp geometry is a system commitment.
- **Do** set `font-weight: 900` and `text-transform: uppercase` for all button labels, column headers, and tool-voice labels. The tool speaks in block capitals.
- **Do** lead with weight contrast before size contrast when establishing typographic hierarchy.
- **Do** treat dark mode as the primary experience. Light mode is a supported alternate, not the baseline.
- **Do** animate with `ease-out` curves (cubic-bezier(0.34, 1.56, 0.64, 1) for spring entrances; ease-out-quart for state transitions). Exits faster than entrances.
- **Do** keep the Pixelify Sans font confined to ConversationView dialogue bubbles. That screen has its own register.

### Don't:

- **Don't** use generic SaaS cream — white cards, `#f3f4f6` backgrounds, blue primary CTAs. This is the anti-reference from PRODUCT.md. If the interface reads like a Stripe component, it's wrong.
- **Don't** use Excel or enterprise admin aesthetics — flat gray row tables, dense uniform grids, 2010-era utility styling. The tool handles spreadsheet data; it must not look like one.
- **Don't** use dark for posture. The dark canvas exists because the user works in long focused sessions. If a dark treatment can't be justified by that sentence, it's atmospheric and should be cut.
- **Don't** add border-radius beyond 6px to interactive elements (buttons, inputs, chips). `border-radius: 10px` and above is reserved for dialogue bubbles only.
- **Don't** use call-sheet blue (`#2563eb`) as a generic link or brand accent. It is a provenance signal for JSON data. Using it decoratively corrupts the notation system.
- **Don't** use gradient text (`background-clip: text`). Prohibited absolutely.
- **Don't** add side-stripe borders (`border-left` > 1px as a colored card accent). Rewrite with full borders, background tints, or leading icons.
- **Don't** add shadows to resting surfaces. Ambient low (`0 1px 2px`) is the maximum at rest for elevated-variant cards. Everything else is flat until interacted with.
- **Don't** mix Pixelify Sans into the tool-shell UI. It crosses the register boundary and blurs the signal that game-mode is active.

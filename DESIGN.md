# James Cafe Design System

## Creative Direction

**Scene:** A lovingly maintained 1980s Tokyo capsule machine has been rolled
into a bright technology conference and stocked with tiny bags of home-roasted
coffee.

The interface is a physical object, not a dashboard. Its red-orange enamel body,
cyan event panel, cream plastic, chrome fittings, halftone shadows, and bold
Japanese signage should feel tactile and stage-ready. AI Dev Day's deep blue and
cyan identify the event; warm coral belongs to the machine and coffee.

## Color

Full-palette strategy. Use OKLCH values only.

```css
--color-bg: oklch(0.97 0.012 247);
--color-surface: oklch(1 0 0);
--color-ink: oklch(0.19 0.055 269);
--color-muted: oklch(0.43 0.045 266);
--color-primary: oklch(0.62 0.22 36);
--color-primary-dark: oklch(0.43 0.18 31);
--color-event-blue: oklch(0.30 0.19 283);
--color-event-cyan: oklch(0.87 0.16 180);
--color-yellow: oklch(0.88 0.17 91);
--color-chrome: oklch(0.80 0.012 248);
```

The primary coral fills the machine body. Event blue anchors text, shadows, and
structural surfaces. Cyan signals live status and selected controls. Yellow is
reserved for the winning moment and a few capsule shells.

## Typography

- Display and Japanese signage: **Dela Gothic One**, heavy, compact, playful.
- Interface and body: **Zen Kaku Gothic New**, 500–900.
- Use system sans-serif fallbacks. Headings are balanced and never exceed 6rem.
- English display copy may use all caps sparingly; Japanese stays naturally set.

## Shape & Material

- Machine panels use 18–28px radii with hard event-blue outlines and offset
  shadows, evoking molded plastic and screen-printed signage.
- Buttons and inputs are tactile, with 2–3px outlines and a clear pressed state.
- Capsules are two-color spheres with a horizontal seam, specular highlight, and
  a small name label. Names stay readable and truncate gracefully.
- The winner dialog is a stage spotlight, not another card.

## Layout

Desktop uses a two-part composition: concise participation copy and form on the
left, dominant machine on the right. Mobile places the form first and preserves
the complete machine below it. Spacing is fluid and the main experience remains
usable within one to two phone viewports.

## Motion

Capsules drift subtly within the chamber. A draw turns the chrome knob, agitates
the chamber, then drops one capsule through the chute before revealing the
winner. Motion uses fast exponential easing and never gates content. Under
reduced motion, the sequence becomes a short crossfade with no continuous
movement or confetti.

## Voice

Warm, concise, and lightly theatrical. English and Japanese copy communicate
the same intent rather than translating word-for-word. Avoid jargon in primary
actions; explain the GitHub issue handoff immediately beside the form.

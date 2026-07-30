# Design System: DAMRI x Art Zine Philosophy

## Core Philosophy
The UI follows an "art zine" editorial style combined with the official DAMRI corporate identity. The design must feel handcrafted, using color-blocking instead of shadows, and relying heavily on typography for decoration. No sharp corners allowed.

## Color Tokens
- `{colors.primary}`: `#FFC627` (DAMRI Yellow). The ONLY accent color. Used strictly for the primary CTA button and inline links. Never use it as a large background or decorative element. Maximum one prominent yellow element per viewport.
- `{colors.canvas}`: `#f9f7f3` (Warm Cream). The default page background. NEVER use pure white for page backgrounds.
- `{colors.surface-dark}`: `#003B70` (DAMRI Navy). Replaces dark/black backgrounds. Used for full-bleed hero bands, prominent feature cards, and the footer.
- `{colors.surface-card}`: `#ffffff` (Pure White). Used ONLY for individual content cards (e.g., Schedule Cards) sitting on top of the cream canvas.
- `{colors.ink}`: `#001A33` (Deep Navy/Ink). Default text color for body and headings. 

## Typography Stack
1. **Display (Headlines)**: `Bricolage Grotesque` (or similar heavy grotesque). Used for massive hero text (up to 128px) with `lineHeight: 1.0` and negative letter-spacing.
2. **Body/UI**: `Inter` or `Basier Square`. Used for all body text, buttons, and metadata.
3. **Data/Code**: `JetBrains Mono`. Used strictly for license plates, technical data, and time/schedules.

## Shapes & Geometry
- `{rounded.full}` (9999px / Pill shape): Mandatory for ALL interactive elements (Buttons, Inputs, Status Badges, Avatars).
- `{rounded.md}` (10px) to `{rounded.lg}` (16px): Mandatory for all content cards and containers.
- **Rule**: NO SHARP CORNERS (0px radius) anywhere, except for full-bleed bands (like the footer).

## Elevation
- DO NOT use drop shadows (`shadow-md`, etc.) on the cream canvas. 
- Separation is created using 1px borders (`border-hairline`) or color-blocking (Cream vs Navy).
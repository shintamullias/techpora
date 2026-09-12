# Techpora Visual Theme Refresh — Stage 1

## Scope
Update only the global visual system and existing decorative presentation. Preserve all routing, copy, pricing, business data, article content, and SEO metadata.

## Changes
1. Recalibrate the existing light and dark semantic tokens around vivid royal blue, near-black navy ink, and clean neutral surfaces while preserving accessible contrast.
2. Keep Fira Sans and DM Serif Display unchanged.
3. Remove gradient heading text, blurred glow decorations, and gradient image/CTA surfaces from existing presentation code.
4. Replace the homepage’s uneven bento treatment with a uniform card grid while preserving its wording and interactions.
5. Retain rounded buttons/cards, replacing palette-specific rings and glow shadows with flat borders and `shadow-sm`.
6. Verify the relevant source patterns, then capture desktop and mobile screenshots of the live preview.

## Files Expected to Change
- `src/styles.css`
- `src/routes/index.tsx`
- `src/routes/sewa-macbook.tsx`
- `src/components/AreaPage.tsx`
- `src/components/JakartaHub.tsx`

## Technical Notes
All colors remain semantic OKLCH variables using the current `:root` and `.dark` architecture. No metadata or content values will be edited.

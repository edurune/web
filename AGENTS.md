# Web client

- Build and review interface work in Storybook.

## Styling

- Use semantic tokens from `src/ui/tokens/` for component colours, sizes, and durations.
- Do not use raw `var()` expressions in components.
- Use relative imports.
- Keep primitive styles out of the CSS reset.
- Style Base UI component state through data attributes.

## Sound

- Declare sound cues with `data-uisfx` attributes wherever an element can carry them.
- Choose cues by action, using `press` as the fallback.
- Add hover cues only to browsing surfaces.

## Data and API

- Use the generated API client and query keys. Do not edit files under `src/api/generated`.
- Invalidate affected queries from the mutation that changed them.
- Do not call `fetchQuery` after a mutation.
- Display translated business errors instead of raw server messages.

## Translation

- Translate shared item names and descriptions from `@edurune/art` at render time.
- Keep screen copy in screens.
- Pass copy to primitives as props, except for labels derived from server enums.
- Translate labels derived from server enums in the primitive.
- Never translate "EduRune".

## Visual language

- Use flat fills without shadows or decorative gradients.
- Use an ink contour and a thick bottom edge for depth.
- Put the thick bottom edge only on pressables and raised surfaces.
- Move the complete button face on press without changing its layout box.
- Draw focus with an offset `outline`.
- Use Phosphor for interface chrome.
- Use the authored combat set for game concepts.
- Never tint combat art.

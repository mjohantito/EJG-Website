---
name: ejg-design
description: Use this skill to generate well-branded interfaces and assets for EH! JADI GA? (an Indonesian tour agency for Gen Z — private trips, open trips, glamping, corporate trips), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# EH! JADI GA? — Design skill

Read the `README.md` file within this skill first. It contains the brand voice, content rules, the 4-color palette, type system, spacing/radii/shadows, iconography, and content do's & don'ts.

Then explore the other available files:

- `colors_and_type.css` — all design tokens (CSS variables). Start here for any build.
- `fonts/` — Plus Jakarta Sans (variable + italic).
- `assets/` — logos, marks.
- `ui_kits/website/` — React/JSX UI kit for the mobile web marketing site, with 6 interactive click-through screens: Home, Explore, Trip detail, Booking, Confirmation, Glamping.
- `preview/` — small design-system cards (colors, type, spacing, components). Useful as a visual vocabulary reference when picking tokens.

## How to use this skill

**If creating visual artifacts** (slides, mocks, throwaway prototypes, landing pages, marketing screens, social posts, etc):
- Copy needed assets out of this skill folder (logo, fonts, any imagery).
- Create static HTML (or React-in-HTML) files for the user to view.
- Import `colors_and_type.css` to get all tokens; reference `ui_kits/website/components.jsx` and `styles.css` for ready component patterns.

**If working on production code**:
- Copy the CSS tokens into the product's own theme file — don't import from here.
- Read the README's CONTENT FUNDAMENTALS + VISUAL FOUNDATIONS sections to become an expert in designing with this brand.
- Use UI-kit components as a fidelity reference, not a code source — the kit is cosmetic, not production-hardened.

## When invoked without guidance

If the user invokes this skill without any other context, ask them:

1. What are you building? (landing page, social post, booking flow, slide deck, ad, etc.)
2. Which product is it for? (private trip, open trip, glamping, corporate, or the brand overall)
3. Desktop or mobile-first? (default mobile-first — this is a Gen Z brand)
4. Formal tone (corporate surface) or casual tone (consumer surface)?
5. Indonesian, English, or mixed? (default: Indonesian-first with natural English code-switching)

Then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need. Always follow the brand voice rules (warm, humble, a bit cheeky, never salesy) and the 4-color restraint (ink / matahari / kertas / putih only, no decorative hues).

# EH! JADI GA? — Website UI Kit

Mobile-web-first recreation of the EH! JADI GA? tour agency site. Gen Z audience, Indonesian copy, playful-but-professional tone.

## What's inside

- `index.html` — Click-thru prototype showing Home → Trip detail → Booking → Confirmation flow on mobile, plus a glamping list screen.
- `App.jsx` — Root router / mock navigation state.
- `HomeScreen.jsx` — Hero, category pills, featured trips, glamping teaser.
- `ExploreScreen.jsx` — All trips with filters.
- `TripDetailScreen.jsx` — Itinerary, inclusions, price, book CTA.
- `GlampingScreen.jsx` — Properties list.
- `BookingScreen.jsx` — Passenger count, dates, contact.
- `ConfirmationScreen.jsx` — Success state.
- `components.jsx` — Shared: `PhoneFrame`, `TopBar`, `BottomTabs`, `TripCard`, `GlampCard`, `Button`, `Chip`, `Pill`, `SectionHeader`, `BottomCTA`, `Icon`.

## Caveats

- The original repo (`mjohantito/EJG-Website`) returned a 409, so this kit is a visual interpretation based on the brand brief + logo, not a port of existing code. When the real codebase is available, re-align components to match.
- Photos are placeholder color blocks with location labels — swap with real travel photography.
- Icons use Lucide (inline SVG).

## Viewing
Open `ui_kits/website/index.html`. Click the phone frame to navigate between screens; use the tab bar + buttons as in a real app.

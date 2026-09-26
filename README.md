# G Developments — React + Tailwind

A React (Vite) + Tailwind CSS build of the G Developments site, converted from the design canvas.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`.

## Structure

- `src/pages/` — one file per route: `Home`, `Communities`, `Philosophy`, `Contact`, `ProjectDetail`
- `src/components/` — shared `Nav` (with working mobile menu) and `Footer`
- `public/images/` — the real project renders you provided, plus one stock interior placeholder
- Routing is `react-router-dom`; styling is Tailwind utility classes with a small set of custom tokens in `tailwind.config.js` (`champagne`, `muted`, `obsidian`, the `Manrope` font)

## Interactive bits carried over from the design

- Mobile nav toggle (`Nav.jsx`)
- Global footprint map — click a pin to swap the preview card (`Home.jsx`)
- Communities filter tabs (`Communities.jsx`)
- Contact form — client-side only, swaps to a confirmation state on submit (`Contact.jsx`). Wire up `handleSubmit` to your real backend/email service before going live.

## Known placeholders

- `[TOTAL UNITS]` and `[HEAD OFFICE ADDRESS]` still need real values.
- `ProjectDetail.jsx` is built out for Seashell only, as the template for the other two projects — duplicate and adapt it for Seashell Playa and G Cairo when you have their copy/specs.
- The interior photo (`public/images/interior.jpg`) is a stock placeholder, not a real G Developments asset — swap it out when available.

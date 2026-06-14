# Jain Pilgrimage Guide — Design Spec

**Date:** 2026-06-14
**Status:** Approved (ready for implementation planning)

## 1. Summary

A small, local-only web application that lists the 24 Jain Tirthankaras as an
interactive grid. Clicking a Tirthankara opens a **modal** showing its full
details (birthplace, significance, travel info, accommodation, nearby
attractions). Content is stored in a single `data.json` file. A separate,
admin-only panel — backed by a tiny local Node server — lets an administrator
add/edit/delete entries and save them back to `data.json` without hand-editing
JSON.

The project is run locally only; there is no online deployment requirement.

## 2. Goals

- Display all 24 Tirthankaras in a clean, responsive grid.
- Show complete per-Tirthankara details in a modal on click.
- Keep all content in one editable JSON file (`data.json`).
- Provide an admin panel to manage that content through a form UI.
- Stay simple: vanilla HTML/CSS/JS for the public site; a dependency-free Node
  script for the admin backend.

## 3. Non-Goals (out of scope for v1)

From the README "Future Enhancements" list — explicitly **not** built now:

- Search / filter on the public site.
- Multi-language support.
- User reviews and ratings.
- Route planning.
- Online booking for stays.
- Image upload from the admin panel (admin references a filename instead).
- Online hosting / deployment / authentication on the admin panel.

The data-driven structure leaves room to add these later.

## 4. Architecture Overview

A static client-side public site plus an isolated, admin-only local backend.
The two share `data.json` on disk and never communicate directly.

```
Jain-Pilgrimage-Guide/
├── index.html          # public site (static)
├── style.css           # public site styles
├── script.js           # renders grid + modal from data.json
├── data.json           # shared content — read by site, written by admin
├── images/             # Tirthankara images (placeholder fallback if missing)
└── admin/              # everything admin-only, isolated here
    ├── server.js       # tiny Node backend: serves admin UI + reads/writes data.json
    ├── admin.html      # admin form UI
    ├── admin.js        # load entries, edit, POST to save
    └── admin.css       # admin styles
```

### Responsibilities

| File            | Responsibility                                                                 |
|-----------------|--------------------------------------------------------------------------------|
| `index.html`    | Page shell: header/intro, empty `#grid` container, hidden modal markup.        |
| `style.css`     | Responsive grid, card styling, modal overlay, Jain flag color palette (§7), mobile. |
| `script.js`     | Fetch `data.json`; render grid cards; open/populate/close modal; fallbacks.    |
| `data.json`     | Single source of content — a JSON array of Tirthankara objects.                |
| `images/`       | Optional image files; site falls back to a styled placeholder if missing.      |
| `admin/server.js`| Node (built-in `http`+`fs`) server: serves admin UI, returns and writes data. |
| `admin/admin.html`| Admin form UI shell.                                                         |
| `admin/admin.js`| Load entries from backend, edit in form, POST updated array to `/save`.        |
| `admin/admin.css`| Admin styles.                                                                 |

## 5. How It Runs (two independent local modes)

Browsers block `fetch()` of local files over `file://`, so the site must be
served. The two modes are independent and share only the `data.json` file.

1. **Viewing the public site** — open `index.html` via VS Code **Live Server**
   (or any static server) on localhost. `script.js` calls `fetch('data.json')`,
   which works under a server. No backend required just to view.

2. **Editing data** — run `node admin/server.js`, open the admin URL
   (`http://localhost:3000`), edit, and click **Save**. The backend writes
   `data.json` at the project root. Refresh the public site to see changes.

The admin backend is needed **only** when editing content.

## 6. Data Model

`data.json` is a JSON array of Tirthankara objects. One object per Tirthankara:

```json
{
  "id": 1,
  "name": "Rishabhanatha",
  "altName": "Adinatha",
  "symbol": "Bull",
  "image": "images/01.jpg",
  "birthplace": "Ayodhya",
  "significance": "Why this place is famous; historical & religious significance.",
  "travel": {
    "location": "Full location / address.",
    "mapsLink": "https://maps.google.com/...",
    "distanceFromCities": "Distance from nearby major cities.",
    "transport": "Available modes of transportation."
  },
  "accommodation": [
    { "name": "Stay name", "type": "Dharamshala", "contact": "Phone / details" }
  ],
  "nearbyAttractions": [
    "Nearby temple or historical place",
    "Another nearby attraction"
  ]
}
```

### Field notes

- `id` — unique integer, managed automatically by the admin panel.
- `name` — required.
- `altName`, `symbol` — optional (alternate name and emblem / lanchhana).
- `image` — a path/filename under `images/`; if the file is absent or fails to
  load, the site shows a styled placeholder.
- `accommodation` — array (zero or more rows); empty arrays render a
  "Information coming soon" note rather than a blank gap.
- `nearbyAttractions` — array of strings; same empty-state behavior.

### Seed content

`data.json` ships seeded with the **first 3 Tirthankaras** (Rishabhanatha,
Ajitanatha, Sambhavanatha) following the **Digambara** tradition. The remaining
entries are added later through the admin panel (sequential `id`s continue from
4). Verifiable facts — **name**, **emblem**, **birthplace**, and
**significance** — are real; travel logistics and accommodation contacts are
clearly-marked **placeholders** so nothing reads as fake authoritative data.

Tradition note: the Digambara tradition differs from Śvetāmbara on points such
as Mallinatha (19th) being male and Mahavira renouncing without marrying;
emblems and birthplaces of the early Tirthankaras are common to both.

## 7. Visual Theme — Jain Flag Color Palette

The UI palette derives from the five colors of the **Jain flag**, which
represent the Panch-Parmeshthi (five supreme beings) and the five great vows.
Stripe order top-to-bottom on the flag: White, Red, Yellow/Saffron, Green, and
Dark Blue (rendered Black in some depictions).

| Flag color   | Represents (Parmeshthi) | Vow             | Theme hex            | UI role                                              |
|--------------|-------------------------|-----------------|----------------------|------------------------------------------------------|
| White        | Arihant                 | Non-violence    | `#FFFFFF` (bg `#FBF8F1`) | Page & card/surface backgrounds                  |
| Red          | Siddha                  | Truth           | `#D81E27`            | Primary buttons, links, active states, accents       |
| Yellow/Saffron| Acharya                | Non-stealing    | `#F2A900`            | Hover, highlights, card top accent stripe, focus ring|
| Green        | Upadhyaya               | Chastity        | `#1A8A3C`            | Success states (admin "Saved"), tags/badges          |
| Dark Blue    | Sadhu / Sadhvi          | Non-possession  | `#16236B`            | Header, footer, headings, primary text               |

Wikipedia lists no official hex codes; the values above are chosen shades of
the canonical flag colors, tuned for web legibility.

### Application principles

- **White/off-white dominates.** The bold flag colors are used as accents so the
  page stays clean and readable rather than garish.
- Body text uses a near-black `#1F2430`; headings and the header/footer bands use
  `--jain-blue`.
- Colors are defined once as CSS custom properties in `:root`
  (`--jain-white`, `--jain-blue`, `--jain-red`, `--jain-saffron`, `--jain-green`,
  plus `--bg`, `--text`) and referenced throughout, so the theme is changeable in
  one place.
- **Decorative flag stripe:** a thin five-color band (in flag order) sits under
  the site header as a subtle tie-in to the Jain flag.
- Maintain sufficient contrast (e.g., white text on blue/red, dark text on
  saffron/white) for accessibility.

## 8. Public Site Behavior

### Data flow

On load, `script.js` fetches `data.json`, then for each object builds a
clickable card (image-or-placeholder + name) into `#grid`. Clicking a card
calls `openModal(id)`, which fills the modal's sections from that object and
shows it.

### Modal sections (all README fields)

- Header: name + alt name + emblem.
- Image (or placeholder).
- Birthplace (Janmabhoomi).
- Significance / why famous.
- Travel: location, **Google Maps link**, distance, transport.
- Accommodation: list of stays with type and contact.
- Nearby attractions: list.

### Close behavior

The modal closes via the ✕ button, clicking the backdrop, and the `Esc` key.

### Error / edge handling

- **Missing/failed image** → styled placeholder card (number + name) so cards
  always render even with no image files present.
- **Empty optional field/array** → that sub-section shows "Information coming
  soon" instead of a blank space.
- **`data.json` fails to load** → a friendly on-page message (e.g., "Could not
  load data — make sure the site is served via a local server").

### Accessibility

`alt` text on images, keyboard-focusable cards, `Esc` to close, and focus moved
into the modal when opened.

## 9. Admin Panel

### Backend (`admin/server.js`)

Node using only built-in `http` and `fs` modules — **no `npm install`**, run
with `node admin/server.js`. It resolves `data.json` to the project root
regardless of the launch directory, creates the file if missing, and writes
atomically. Endpoints:

| Method | Path            | Action                                            |
|--------|-----------------|---------------------------------------------------|
| GET    | `/` (+ assets)  | Serves `admin.html`, `admin.js`, `admin.css`.     |
| GET    | `/data.json`    | Reads and returns the current data from disk.     |
| POST   | `/save`         | Writes the full updated array to `../data.json`.  |

Responses return clear success/error status (e.g., JSON `{ ok: true }` or an
error message with an appropriate HTTP status).

### UI (`admin/admin.html` + `admin.js` + `admin.css`)

- Loads all entries from `GET /data.json` into an editable list.
- **Add / Edit / Delete** a Tirthankara.
- Form fields mirror the data model: name, alt name, emblem, image path,
  birthplace, significance, travel (location, Google Maps link, distance,
  transport), accommodation (repeatable name/type/contact rows), nearby
  attractions (repeatable string rows).
- **Save** → `POST /save` writes `data.json`.
- Validation: `name` required; `id` assigned/managed automatically; basic
  feedback on save success/failure.
- Image handling: admin types the relative image **path** (e.g.
  `images/01.jpg`) and places the file in `images/` manually (no upload UI in
  v1).

## 10. Verification

No automated test framework — the public site is vanilla static and the backend
is a tiny script. Verification is manual:

**Public site (via Live Server):**
- All 24 cards render from `data.json`.
- Clicking each card opens the matching modal with correct content.
- All three close methods work (✕, backdrop, `Esc`).
- Google Maps link opens.
- Layout reflows correctly on mobile widths.
- Missing-image and missing-field fallbacks display as designed.

**Admin (via `node admin/server.js`):**
- Admin UI loads existing entries from disk.
- Add, edit, and delete each work in the form.
- **Save** writes `data.json` on disk (verify file contents change).
- Refreshing the public site reflects the saved changes.
- Saving invalid input (missing required name) is rejected with feedback.

## 11. Open Questions / Assumptions

- Backend runtime is **Node** (zero external dependencies). Python is a possible
  swap if requested later — same endpoints.
- Public site is viewed through a local static server (Live Server); double-
  clicking `index.html` is not supported because of the `file://` fetch block.
- Admin panel has no authentication — acceptable because it is local-only.
- The fifth Jain-flag color is rendered as **dark blue** (`#16236B`); some
  depictions use black. Easily switched since it is a single CSS variable.

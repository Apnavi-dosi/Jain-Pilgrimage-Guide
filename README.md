# Jain Pilgrimage Guide

## Project Description
Jain Pilgrimage Guide is a web application designed to provide detailed information about the 24 Jain Tirthankaras and their associated pilgrimage sites. The platform aims to help devotees and tourists explore important Jain religious destinations with ease.

## Objectives
- To spread awareness about Jain heritage and pilgrimage sites.
- To provide verified information related to all 24 Tirthankaras.
- To assist users in planning their pilgrimage journeys.

## Features

### Home Page
- Display photographs of all 24 Tirthankaras.
- Easy navigation through an interactive interface.

### Tirthankara Information
On clicking a Tirthankara's image, users can view:
- Name of the Tirthankara
- Birthplace (Janmabhoomi)
- Historical and religious significance
- Why the place is famous

### Travel Information
- Exact location details
- Google Maps link
- Distance from nearby cities
- Available modes of transportation

### Accommodation Details
- Nearby Jain Dharamshalas
- Jain-friendly hotels and stays
- Contact details (if available)

### Nearby Attractions
- Historical places around the pilgrimage site
- Other Jain temples nearby

## Future Enhancements
- Multi-language support
- User reviews and ratings
- Route planning feature
- Online booking for Jain stays

## Technologies Used
- HTML
- CSS
- JavaScript
- GitHub
- VS Code

## Running Locally

This project is run locally only (no online deployment).

### View the site
The site reads `data.json` with `fetch()`, which browsers block on `file://`.
Serve it through a local server instead of double-clicking `index.html`:

- **VS Code:** install the *Live Server* extension, right-click `index.html` → "Open with Live Server", or
- **Python:** run `python -m http.server 5500` in the project root, then open `http://localhost:5500/`.

### Edit the content (admin panel)
1. From the project root, run: `node admin/server.js` (requires Node 18+, no install needed).
2. Open `http://localhost:3000` in your browser.
3. Add / edit / delete Tirthankaras in the form, then click **Save all** — this writes `data.json`.
4. Refresh the public site to see the changes, then commit `data.json` to git.

### Run the backend tests
`node --test admin/data-store.test.js`

### Add images
Drop image files into `images/` and set each Tirthankara's **Image path** (e.g. `images/04.jpg`) in the admin panel. If an image is missing, the site shows a numbered placeholder.

## Team Members
- Apnavi Jain
- Amit Jain
- Anmol Jain

## Status
This project is currently under development. The public site and a local admin panel are functional, seeded with the first 3 Tirthankaras (Digambara tradition); remaining entries are added through the admin panel.

# Jain Pilgrimage Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-only website that lists Jain Tirthankaras in a grid and opens a modal with full details on click, plus an isolated local admin panel (Node backend) for editing the shared `data.json`.

**Architecture:** A static, framework-free public site (`index.html` + `style.css` + `script.js`) reads `data.json` via `fetch()` and renders a grid + detail modal. An isolated `admin/` folder holds a zero-dependency Node HTTP server (`admin/server.js`) plus a form UI (`admin.html`/`admin.css`/`admin.js`) that reads and writes the same root `data.json`. The two run independently and share only the file on disk.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JavaScript (ES5-compatible, no build step), Node.js (built-in `http`/`fs`, no npm dependencies), Node's built-in `node:test` runner for backend unit tests.

**Spec:** `docs/superpowers/specs/2026-06-14-jain-pilgrimage-guide-design.md`

**Commit convention:** End every commit message with the trailer:
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
Work happens on branch `design/site-and-admin-panel` (already created).

**Seed-data note:** Only the first 3 Tirthankaras (Digambara tradition) are seeded now; the rest are added later through the admin panel. Verifiable facts (name, emblem, birthplace, significance) are real; travel logistics and accommodation contacts are intentionally clearly-marked placeholders to avoid presenting unverified information as authoritative.

---

## File Structure

```
Jain-Pilgrimage-Guide/
├── index.html              # CREATE (Task 2) — public site shell + modal markup
├── style.css               # MODIFY (Task 3) — currently empty; full Jain-flag theme
├── script.js               # MODIFY (Task 4) — currently empty; fetch + grid + modal
├── data.json               # CREATE (Task 1) — 3 seed Tirthankaras
├── images/
│   └── .gitkeep            # CREATE (Task 1) — keep empty folder in git
├── admin/
│   ├── data-store.js        # CREATE (Task 5) — read/validate/write data (testable)
│   ├── data-store.test.js   # CREATE (Task 5) — node:test unit tests
│   ├── server.js            # CREATE (Task 6) — HTTP server: serve UI + /data.json + /save
│   ├── admin.html           # CREATE (Task 7) — admin form UI shell
│   ├── admin.css            # CREATE (Task 7) — admin styles
│   └── admin.js             # CREATE (Task 7) — load/edit/add/delete/save
├── README.md               # MODIFY (Task 8) — add run instructions
└── docs/superpowers/...    # specs + this plan
```

Each file has one responsibility. The public-site files never import admin code; the admin files live entirely under `admin/`. `data-store.js` isolates all file I/O and validation so it can be unit-tested without starting the server.

---

## Task 1: Seed data and images folder

**Files:**
- Create: `data.json`
- Create: `images/.gitkeep`

- [ ] **Step 1: Create the empty images folder marker**

Create `images/.gitkeep` with empty content (this keeps the otherwise-empty folder tracked by git).

- [ ] **Step 2: Create `data.json` with the first 3 Tirthankaras (Digambara tradition)**

Create `data.json`:

```json
[
  {
    "id": 1,
    "name": "Rishabhanatha",
    "altName": "Adinatha",
    "symbol": "Bull",
    "image": "images/01.jpg",
    "birthplace": "Ayodhya",
    "significance": "The first Tirthankara of Jainism, revered in the Digambara tradition as Adinatha, the 'First Lord'. Born in Ayodhya into the Ikshvaku lineage, he is credited with teaching humanity agriculture, crafts, writing, and social order before renouncing worldly life. He is traditionally said to have attained nirvana at Mount Kailash (Ashtapada).",
    "travel": {
      "location": "Ayodhya, Uttar Pradesh, India",
      "mapsLink": "https://www.google.com/maps/search/?api=1&query=Ayodhya",
      "distanceFromCities": "Placeholder: distances from nearby cities (e.g. Lucknow). Verify and update via the admin panel.",
      "transport": "Placeholder: nearest airport and railway station. Verify and update via the admin panel."
    },
    "accommodation": [
      { "name": "Placeholder Jain Dharamshala, Ayodhya", "type": "Dharamshala", "contact": "Add verified contact" }
    ],
    "nearbyAttractions": [
      "Jain temples marking Tirthankara birthplaces in Ayodhya",
      "Sarayu River ghats"
    ]
  },
  {
    "id": 2,
    "name": "Ajitanatha",
    "altName": "",
    "symbol": "Elephant",
    "image": "images/02.jpg",
    "birthplace": "Ayodhya",
    "significance": "The second Tirthankara, born in Ayodhya into the Ikshvaku dynasty. His emblem is the elephant. Like most Tirthankaras of this tradition, he is believed to have attained nirvana at Shikharji (Sammed Shikhar) in present-day Jharkhand.",
    "travel": {
      "location": "Ayodhya, Uttar Pradesh, India",
      "mapsLink": "https://www.google.com/maps/search/?api=1&query=Ayodhya",
      "distanceFromCities": "Placeholder: distances from nearby cities. Verify and update via the admin panel.",
      "transport": "Placeholder: nearest airport and railway station. Verify and update via the admin panel."
    },
    "accommodation": [
      { "name": "Placeholder Jain Dharamshala, Ayodhya", "type": "Dharamshala", "contact": "Add verified contact" }
    ],
    "nearbyAttractions": [
      "Jain temples marking Tirthankara birthplaces in Ayodhya",
      "Sarayu River ghats"
    ]
  },
  {
    "id": 3,
    "name": "Sambhavanatha",
    "altName": "",
    "symbol": "Horse",
    "image": "images/03.jpg",
    "birthplace": "Shravasti",
    "significance": "The third Tirthankara, born in Shravasti. His emblem is the horse. He is traditionally believed to have attained nirvana at Shikharji (Sammed Shikhar).",
    "travel": {
      "location": "Shravasti, Uttar Pradesh, India",
      "mapsLink": "https://www.google.com/maps/search/?api=1&query=Shravasti",
      "distanceFromCities": "Placeholder: distances from nearby cities. Verify and update via the admin panel.",
      "transport": "Placeholder: nearest airport and railway station. Verify and update via the admin panel."
    },
    "accommodation": [
      { "name": "Placeholder Jain Dharamshala, Shravasti", "type": "Dharamshala", "contact": "Add verified contact" }
    ],
    "nearbyAttractions": [
      "Ancient Shravasti archaeological ruins",
      "Placeholder: nearby Jain temple"
    ]
  }
]
```

- [ ] **Step 3: Verify the JSON is valid and has 3 entries**

Run: `node -e "const d=JSON.parse(require('fs').readFileSync('data.json','utf8'));console.log('entries:',d.length,'ids:',d.map(x=>x.id).join(','))"`
Expected: `entries: 3 ids: 1,2,3`

- [ ] **Step 4: Commit**

```bash
git add data.json images/.gitkeep
git commit -m "Add seed data.json with first 3 Tirthankaras (Digambara)"
```

---

## Task 2: Public site HTML shell

**Files:**
- Create: `index.html` (overwrites the existing 313-byte skeleton)

Note: `style.css` and `script.js` already exist as empty files, so this page loads with no 404s; the grid stays empty until Task 4.

- [ ] **Step 1: Write `index.html`**

Replace the entire contents of `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jain Pilgrimage Guide</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="site-header">
    <h1>Jain Pilgrimage Guide</h1>
    <p>Explore the birthplaces of the Tirthankaras</p>
  </header>
  <div class="flag-stripe" aria-hidden="true">
    <span class="s-white"></span><span class="s-red"></span>
    <span class="s-saffron"></span><span class="s-green"></span>
    <span class="s-blue"></span>
  </div>

  <div id="error" class="error-banner" role="alert"></div>

  <main>
    <div id="grid" class="grid" aria-label="List of Tirthankaras"></div>
  </main>

  <!-- Detail modal -->
  <div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-name">
    <div class="modal-box">
      <div class="modal-head">
        <button class="modal-close" id="modal-close" type="button" aria-label="Close">&times;</button>
        <h2 id="modal-name"></h2>
        <div class="alt" id="modal-alt"></div>
      </div>
      <div class="modal-body" id="modal-body"></div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the page loads**

Start a static server from the project root (pick one):
- VS Code: right-click `index.html` → "Open with Live Server", or
- Run: `python -m http.server 5500` then open `http://localhost:5500/`

Expected: the page shows the blue header "Jain Pilgrimage Guide", the intro line, and (after Task 3) a colored flag stripe. The grid area is empty for now. Open the browser console — there should be no errors (empty `script.js`).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add public site HTML shell and modal markup"
```

---

## Task 3: Public site theme (Jain flag palette)

**Files:**
- Modify: `style.css` (currently empty)

- [ ] **Step 1: Write `style.css`**

Replace the entire contents of `style.css` with:

```css
:root {
  --jain-white: #ffffff;
  --jain-blue: #16236b;
  --jain-red: #d81e27;
  --jain-saffron: #f2a900;
  --jain-green: #1a8a3c;
  --bg: #fbf8f1;
  --text: #1f2430;
  --muted: #6b6f76;
  --radius: 12px;
  --shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  --maxw: 1100px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

/* Header */
.site-header {
  background: var(--jain-blue);
  color: #fff;
  text-align: center;
  padding: 28px 16px 18px;
}
.site-header h1 { margin: 0 0 6px; font-size: 1.9rem; }
.site-header p { margin: 0; opacity: 0.85; }

/* Decorative Jain flag stripe (white, red, saffron, green, blue) */
.flag-stripe { height: 6px; display: flex; }
.flag-stripe span { flex: 1; }
.flag-stripe .s-white { background: var(--jain-white); }
.flag-stripe .s-red { background: var(--jain-red); }
.flag-stripe .s-saffron { background: var(--jain-saffron); }
.flag-stripe .s-green { background: var(--jain-green); }
.flag-stripe .s-blue { background: var(--jain-blue); }

/* Grid */
main { max-width: var(--maxw); margin: 0 auto; padding: 28px 16px 48px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 18px;
}
.card {
  background: #fff;
  border-radius: var(--radius);
  border-top: 4px solid var(--jain-saffron);
  box-shadow: var(--shadow);
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card:hover, .card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
  outline: 2px solid var(--jain-saffron);
}
.card .thumb {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--jain-blue), #2b3a8c);
  color: #fff;
}
.card .thumb img { width: 100%; height: 100%; object-fit: cover; }
.card .thumb .placeholder { font-size: 2rem; font-weight: 700; }
.card .label { padding: 10px 8px; }
.card .label .num { color: var(--jain-red); font-weight: 700; font-size: 0.8rem; }
.card .label .name { display: block; font-weight: 600; }
.card .label .alt { color: var(--muted); font-size: 0.8rem; }

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 18, 40, 0.6);
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 16px;
  overflow-y: auto;
  z-index: 50;
}
.modal.open { display: flex; }
.modal-box {
  background: #fff;
  border-radius: var(--radius);
  max-width: 640px;
  width: 100%;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.modal-head {
  background: var(--jain-blue);
  color: #fff;
  padding: 18px 20px;
  position: relative;
}
.modal-head h2 { margin: 0; }
.modal-head .alt { opacity: 0.85; font-size: 0.9rem; }
.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: transparent;
  border: 0;
  color: #fff;
  font-size: 1.6rem;
  cursor: pointer;
  line-height: 1;
}
.modal-body { padding: 20px; }
.modal-body section { margin-bottom: 18px; }
.modal-body h3 {
  margin: 0 0 6px;
  font-size: 1rem;
  color: var(--jain-red);
  border-left: 4px solid var(--jain-saffron);
  padding-left: 8px;
}
.modal-body a { color: var(--jain-blue); }
.modal-body ul { margin: 0; padding-left: 20px; }
.muted { color: var(--muted); font-style: italic; }
.tag {
  display: inline-block;
  background: var(--jain-green);
  color: #fff;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 0.8rem;
}

/* Error banner */
.error-banner {
  display: none;
  max-width: var(--maxw);
  margin: 16px auto;
  padding: 14px 18px;
  background: #fde8e8;
  color: #8a1c1c;
  border: 1px solid var(--jain-red);
  border-radius: 8px;
}
.error-banner.show { display: block; }

@media (max-width: 480px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
}
```

- [ ] **Step 2: Verify the theme renders**

Reload the served page (Task 2 server). Expected: the header is deep indigo-blue, a thin five-color stripe (white/red/saffron/green/blue) sits directly below it, and the page background is off-white. The grid is still empty (no JS yet).

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "Add Jain flag color theme and layout styles"
```

---

## Task 4: Public site behavior (render grid + modal)

**Files:**
- Modify: `script.js` (currently empty)

- [ ] **Step 1: Write `script.js`**

Replace the entire contents of `script.js` with:

```js
(function () {
  "use strict";

  var grid = document.getElementById("grid");
  var modal = document.getElementById("modal");
  var modalName = document.getElementById("modal-name");
  var modalAlt = document.getElementById("modal-alt");
  var modalBody = document.getElementById("modal-body");
  var modalClose = document.getElementById("modal-close");
  var errorBanner = document.getElementById("error");
  var data = [];

  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.classList.add("show");
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildThumb(t) {
    var thumb = document.createElement("div");
    thumb.className = "thumb";
    if (t.image) {
      var img = document.createElement("img");
      img.src = t.image;
      img.alt = t.name || "";
      img.addEventListener("error", function () {
        thumb.innerHTML = '<span class="placeholder">' + esc(t.id) + "</span>";
      });
      thumb.appendChild(img);
    } else {
      thumb.innerHTML = '<span class="placeholder">' + esc(t.id) + "</span>";
    }
    return thumb;
  }

  function renderGrid() {
    grid.innerHTML = "";
    data.forEach(function (t) {
      var card = document.createElement("div");
      card.className = "card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.appendChild(buildThumb(t));

      var label = document.createElement("div");
      label.className = "label";
      label.innerHTML =
        '<span class="num">#' + esc(t.id) + "</span>" +
        '<span class="name">' + esc(t.name) + "</span>" +
        (t.altName ? '<span class="alt">' + esc(t.altName) + "</span>" : "");
      card.appendChild(label);

      card.addEventListener("click", function () { openModal(t.id); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(t.id);
        }
      });
      grid.appendChild(card);
    });
  }

  function listOrEmpty(arr, render) {
    if (!arr || arr.length === 0) {
      return '<p class="muted">Information coming soon.</p>';
    }
    return "<ul>" + arr.map(render).join("") + "</ul>";
  }

  function comingSoon(value) {
    return value ? esc(value) : '<span class="muted">Information coming soon.</span>';
  }

  function buildBody(t) {
    var travel = t.travel || {};
    var html = "";
    html += "<section><h3>Birthplace</h3><p>" + comingSoon(t.birthplace) + "</p></section>";
    html += "<section><h3>Significance</h3><p>" + comingSoon(t.significance) + "</p></section>";

    html += "<section><h3>Travel</h3>";
    html += "<p><strong>Location:</strong> " + comingSoon(travel.location) + "</p>";
    if (travel.mapsLink) {
      html += '<p><a href="' + esc(travel.mapsLink) +
        '" target="_blank" rel="noopener">Open in Google Maps</a></p>';
    }
    html += "<p><strong>Distance:</strong> " + comingSoon(travel.distanceFromCities) + "</p>";
    html += "<p><strong>Transport:</strong> " + comingSoon(travel.transport) + "</p>";
    html += "</section>";

    html += "<section><h3>Accommodation</h3>" +
      listOrEmpty(t.accommodation, function (a) {
        return "<li>" + esc(a.name) +
          (a.type ? ' <span class="tag">' + esc(a.type) + "</span>" : "") +
          (a.contact ? " — " + esc(a.contact) : "") + "</li>";
      }) + "</section>";

    html += "<section><h3>Nearby Attractions</h3>" +
      listOrEmpty(t.nearbyAttractions, function (a) { return "<li>" + esc(a) + "</li>"; }) +
      "</section>";

    return html;
  }

  function openModal(id) {
    var t = data.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    modalName.textContent = t.name || "";
    var altBits = [];
    if (t.altName) altBits.push("(" + t.altName + ")");
    if (t.symbol) altBits.push("Emblem: " + t.symbol);
    modalAlt.textContent = altBits.join("  •  ");
    modalBody.innerHTML = buildBody(t);
    modal.classList.add("open");
    modalClose.focus();
  }

  function closeModal() { modal.classList.remove("open"); }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  fetch("data.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (json) {
      data = Array.isArray(json) ? json : [];
      renderGrid();
    })
    .catch(function () {
      showError(
        "Could not load data.json. Make sure you are viewing this site through a local " +
        "server (e.g. VS Code Live Server), not by double-clicking the file."
      );
    });
})();
```

- [ ] **Step 2: Verify the grid and modal work**

Reload the served page. Expected:
- Three cards render, each showing a placeholder number (1, 2, 3 — the image files don't exist yet, so the fallback shows), the name, and (for #1) the alt name "Adinatha".
- Clicking a card opens the modal with that Tirthankara's details.
- The modal shows Birthplace, Significance, Travel (with an "Open in Google Maps" link), Accommodation (with a green type tag), and Nearby Attractions.
- The modal closes via the ✕ button, clicking the dark backdrop, and pressing `Esc`.
- Tabbing to a card and pressing Enter/Space opens it.

- [ ] **Step 3: Verify error handling**

Temporarily open `index.html` by double-clicking it (a `file://` URL) instead of via the server. Expected: the red error banner appears with the "Could not load data.json…" message instead of a blank page. (Then go back to viewing via the server.)

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Render Tirthankara grid and detail modal from data.json"
```

---

## Task 5: Admin data store (read / validate / write) with tests

**Files:**
- Create: `admin/data-store.js`
- Test: `admin/data-store.test.js`

This module isolates all JSON file I/O and validation so it is unit-testable without an HTTP server. Built with TDD using Node's built-in `node:test` (no dependencies). Requires Node 18+.

- [ ] **Step 1: Confirm Node is available**

Run: `node --version`
Expected: a version string `v18.x` or higher.

- [ ] **Step 2: Write the failing tests**

Create `admin/data-store.test.js`:

```js
"use strict";
var test = require("node:test");
var assert = require("node:assert");
var fs = require("fs");
var os = require("os");
var path = require("path");
var store = require("./data-store");

function tmpFile() {
  return path.join(os.tmpdir(), "jpg-" + Math.random().toString(36).slice(2) + ".json");
}

test("readData returns [] for a missing file", function () {
  assert.deepStrictEqual(store.readData(tmpFile()), []);
});

test("nextId returns 1 when empty and max+1 otherwise", function () {
  assert.strictEqual(store.nextId([]), 1);
  assert.strictEqual(store.nextId([{ id: 3 }, { id: 7 }, { id: 2 }]), 8);
});

test("validateEntry requires a non-empty name", function () {
  assert.strictEqual(store.validateEntry({ name: "Mahavira" }).valid, true);
  assert.strictEqual(store.validateEntry({ name: "" }).valid, false);
  assert.strictEqual(store.validateEntry({}).valid, false);
});

test("writeData persists and round-trips via readData", function () {
  var f = tmpFile();
  store.writeData(f, [{ name: "Rishabhanatha" }]);
  var read = store.readData(f);
  assert.strictEqual(read.length, 1);
  assert.strictEqual(read[0].name, "Rishabhanatha");
  assert.strictEqual(typeof read[0].id, "number");
  fs.unlinkSync(f);
});

test("writeData keeps existing ids and assigns ids to new entries", function () {
  var f = tmpFile();
  var saved = store.writeData(f, [{ id: 5, name: "A" }, { name: "B" }]);
  assert.strictEqual(saved[0].id, 5);
  assert.strictEqual(typeof saved[1].id, "number");
  assert.notStrictEqual(saved[1].id, 5);
  fs.unlinkSync(f);
});

test("writeData throws when an entry has no name", function () {
  assert.throws(function () { store.writeData(tmpFile(), [{ name: "" }]); }, /Validation failed/);
});

test("writeData throws when the payload is not an array", function () {
  assert.throws(function () { store.writeData(tmpFile(), { name: "x" }); }, /must be an array/);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `node --test admin/`
Expected: FAIL — `Cannot find module './data-store'` (the module does not exist yet).

- [ ] **Step 4: Write the implementation**

Create `admin/data-store.js`:

```js
"use strict";
var fs = require("fs");

function readData(filePath) {
  if (!fs.existsSync(filePath)) return [];
  var raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

function nextId(entries) {
  var max = 0;
  entries.forEach(function (e) {
    if (typeof e.id === "number" && e.id > max) max = e.id;
  });
  return max + 1;
}

function validateEntry(entry) {
  var errors = [];
  if (!entry || typeof entry !== "object") {
    errors.push("Entry must be an object");
    return { valid: false, errors: errors };
  }
  if (!entry.name || String(entry.name).trim() === "") {
    errors.push("name is required");
  }
  return { valid: errors.length === 0, errors: errors };
}

// Validate every entry and assign fresh ids to any entry missing one.
// Returns { entries, errors } without writing to disk.
function normalize(entries) {
  var errors = [];
  var used = {};
  entries.forEach(function (e) {
    if (e && typeof e.id === "number") used[e.id] = true;
  });
  var counter = 1;
  function freshId() {
    while (used[counter]) counter++;
    used[counter] = true;
    return counter;
  }
  entries.forEach(function (e, i) {
    var v = validateEntry(e);
    if (!v.valid) errors.push("Entry " + (i + 1) + ": " + v.errors.join(", "));
    if (e && typeof e.id !== "number") e.id = freshId();
  });
  return { entries: entries, errors: errors };
}

function writeData(filePath, entries) {
  if (!Array.isArray(entries)) {
    throw new Error("Data must be an array");
  }
  var result = normalize(entries);
  if (result.errors.length > 0) {
    var err = new Error("Validation failed: " + result.errors.join("; "));
    err.validation = result.errors;
    throw err;
  }
  fs.writeFileSync(filePath, JSON.stringify(result.entries, null, 2) + "\n", "utf8");
  return result.entries;
}

module.exports = {
  readData: readData,
  nextId: nextId,
  validateEntry: validateEntry,
  normalize: normalize,
  writeData: writeData
};
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --test admin/`
Expected: PASS — all 7 tests pass (`pass 7`, `fail 0`).

- [ ] **Step 6: Commit**

```bash
git add admin/data-store.js admin/data-store.test.js
git commit -m "Add tested admin data-store module (read/validate/write)"
```

---

## Task 6: Admin HTTP server

**Files:**
- Create: `admin/server.js`

- [ ] **Step 1: Write `admin/server.js`**

Create `admin/server.js`:

```js
"use strict";
var http = require("http");
var fs = require("fs");
var path = require("path");
var store = require("./data-store");

var PORT = 3000;
var ADMIN_DIR = __dirname;
var DATA_FILE = path.join(__dirname, "..", "data.json");

var MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

function serveStatic(req, res) {
  var urlPath = req.url.split("?")[0];
  if (urlPath === "/") urlPath = "/admin.html";
  var filePath = path.join(ADMIN_DIR, path.normalize(urlPath));
  if (filePath.indexOf(ADMIN_DIR) !== 0) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, function (err, buf) {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    var ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(buf);
  });
}

var server = http.createServer(function (req, res) {
  var pathOnly = req.url.split("?")[0];

  if (req.method === "GET" && pathOnly === "/data.json") {
    try {
      sendJson(res, 200, store.readData(DATA_FILE));
    } catch (e) {
      sendJson(res, 500, { error: "Could not read data: " + e.message });
    }
    return;
  }

  if (req.method === "POST" && pathOnly === "/save") {
    var body = "";
    req.on("data", function (chunk) { body += chunk; });
    req.on("end", function () {
      var parsed;
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        return sendJson(res, 400, { error: "Invalid JSON body" });
      }
      try {
        var saved = store.writeData(DATA_FILE, parsed);
        sendJson(res, 200, { ok: true, count: saved.length });
      } catch (e) {
        sendJson(res, 400, { error: e.message, validation: e.validation || null });
      }
    });
    return;
  }

  if (req.method === "GET") {
    return serveStatic(req, res);
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, function () {
  console.log("Admin panel running at http://localhost:" + PORT);
  console.log("Editing data file: " + DATA_FILE);
});
```

- [ ] **Step 2: Start the server**

Run (from the project root): `node admin/server.js`
Expected: console prints `Admin panel running at http://localhost:3000` and the resolved `data.json` path. Leave it running for the next steps (open a second terminal for the curl checks).

- [ ] **Step 3: Verify GET /data.json returns the seed data**

Run: `curl http://localhost:3000/data.json`
Expected: the JSON array of the 3 seed Tirthankaras (ids 1, 2, 3).

- [ ] **Step 4: Verify POST /save round-trips and writes the file**

Run: `curl -X POST http://localhost:3000/save -H "Content-Type: application/json" --data-binary "@data.json"`
Expected: `{"ok":true,"count":3}`. The `data.json` file on disk is unchanged in meaning (re-saving the same 3 entries).

- [ ] **Step 5: Verify validation rejects a bad payload**

Run: `curl -X POST http://localhost:3000/save -H "Content-Type: application/json" -d "[{\"name\":\"\"}]"`
Expected: HTTP 400 with a body like `{"error":"Validation failed: Entry 1: name is required", ...}`. Confirm `data.json` still has the original 3 entries (validation rejected the write).

Stop the server with `Ctrl+C` when done.

- [ ] **Step 6: Commit**

```bash
git add admin/server.js
git commit -m "Add admin HTTP server with data.json read/save endpoints"
```

---

## Task 7: Admin panel UI

**Files:**
- Create: `admin/admin.html`
- Create: `admin/admin.css`
- Create: `admin/admin.js`

- [ ] **Step 1: Write `admin/admin.html`**

Create `admin/admin.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin — Jain Pilgrimage Guide</title>
  <link rel="stylesheet" href="admin.css" />
</head>
<body>
  <header class="admin-header">
    <h1>Admin — Jain Pilgrimage Guide</h1>
    <div class="actions">
      <span id="status" class="status"></span>
      <button id="add-btn" type="button">+ Add Tirthankara</button>
      <button id="save-btn" type="button" class="primary">Save all</button>
    </div>
  </header>
  <div class="flag-stripe" aria-hidden="true">
    <span class="s-white"></span><span class="s-red"></span>
    <span class="s-saffron"></span><span class="s-green"></span>
    <span class="s-blue"></span>
  </div>
  <main>
    <div id="list"></div>
  </main>
  <script src="admin.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `admin/admin.css`**

Create `admin/admin.css`:

```css
:root {
  --jain-blue: #16236b;
  --jain-red: #d81e27;
  --jain-saffron: #f2a900;
  --jain-green: #1a8a3c;
  --bg: #fbf8f1;
  --text: #1f2430;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
}
.admin-header {
  background: var(--jain-blue);
  color: #fff;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.admin-header h1 { margin: 0; font-size: 1.3rem; }
.actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.flag-stripe { height: 5px; display: flex; }
.flag-stripe span { flex: 1; }
.flag-stripe .s-white { background: #fff; }
.flag-stripe .s-red { background: var(--jain-red); }
.flag-stripe .s-saffron { background: var(--jain-saffron); }
.flag-stripe .s-green { background: var(--jain-green); }
.flag-stripe .s-blue { background: var(--jain-blue); }
main { max-width: 900px; margin: 0 auto; padding: 20px 16px 60px; }
button {
  cursor: pointer;
  border: 1px solid var(--jain-blue);
  background: #fff;
  color: var(--jain-blue);
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 0.9rem;
}
button.primary { background: var(--jain-red); border-color: var(--jain-red); color: #fff; }
button.danger { background: #fff; border-color: var(--jain-red); color: var(--jain-red); }
.status { color: #fff; font-size: 0.9rem; margin-right: 6px; }
.entry {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--jain-saffron);
  margin-bottom: 16px;
  padding: 14px 16px;
}
.entry summary { font-weight: 600; cursor: pointer; }
.entry .row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 8px;
  margin: 8px 0;
  align-items: center;
}
.entry label { font-size: 0.85rem; color: #555; }
.entry input, .entry textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font: inherit;
}
.entry textarea { min-height: 60px; resize: vertical; }
.sub { border-left: 3px solid var(--jain-saffron); padding-left: 10px; margin: 8px 0; }
.sub h4 { margin: 6px 0; font-size: 0.9rem; color: var(--jain-red); }
.sub .item { display: flex; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; align-items: center; }
.sub .item input { flex: 1; min-width: 120px; }
.entry-actions { margin-top: 10px; display: flex; justify-content: flex-end; }
```

- [ ] **Step 3: Write `admin/admin.js`**

Create `admin/admin.js`:

```js
"use strict";
(function () {
  var listEl = document.getElementById("list");
  var statusEl = document.getElementById("status");
  var entries = [];

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.style.color =
      kind === "error" ? "#ffd2d2" : kind === "ok" ? "#caffd0" : "#fff";
  }

  // Tiny element helper: el(tag, attrs, [children])
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function field(labelText, value, onInput, multiline) {
    var input = multiline
      ? document.createElement("textarea")
      : document.createElement("input");
    input.value = value == null ? "" : value;
    input.addEventListener("input", function () { onInput(input.value); });
    return el("div", { class: "row" }, [el("label", { text: labelText }), input]);
  }

  function renderAccommodation(entry) {
    var wrap = el("div", { class: "sub" }, [el("h4", { text: "Accommodation" })]);
    (entry.accommodation || []).forEach(function (acc, idx) {
      var nameI = document.createElement("input");
      nameI.placeholder = "Name";
      nameI.value = acc.name || "";
      nameI.addEventListener("input", function () { acc.name = nameI.value; });

      var typeI = document.createElement("input");
      typeI.placeholder = "Type";
      typeI.value = acc.type || "";
      typeI.addEventListener("input", function () { acc.type = typeI.value; });

      var contactI = document.createElement("input");
      contactI.placeholder = "Contact";
      contactI.value = acc.contact || "";
      contactI.addEventListener("input", function () { acc.contact = contactI.value; });

      var del = el("button", { type: "button", class: "danger", text: "✕" });
      del.addEventListener("click", function () {
        entry.accommodation.splice(idx, 1);
        render();
      });

      wrap.appendChild(el("div", { class: "item" }, [nameI, typeI, contactI, del]));
    });
    var add = el("button", { type: "button", text: "+ Add stay" });
    add.addEventListener("click", function () {
      if (!entry.accommodation) entry.accommodation = [];
      entry.accommodation.push({ name: "", type: "", contact: "" });
      render();
    });
    wrap.appendChild(add);
    return wrap;
  }

  function renderAttractions(entry) {
    var wrap = el("div", { class: "sub" }, [el("h4", { text: "Nearby Attractions" })]);
    (entry.nearbyAttractions || []).forEach(function (val, idx) {
      var inp = document.createElement("input");
      inp.value = val || "";
      inp.placeholder = "Attraction";
      inp.addEventListener("input", function () { entry.nearbyAttractions[idx] = inp.value; });

      var del = el("button", { type: "button", class: "danger", text: "✕" });
      del.addEventListener("click", function () {
        entry.nearbyAttractions.splice(idx, 1);
        render();
      });

      wrap.appendChild(el("div", { class: "item" }, [inp, del]));
    });
    var add = el("button", { type: "button", text: "+ Add attraction" });
    add.addEventListener("click", function () {
      if (!entry.nearbyAttractions) entry.nearbyAttractions = [];
      entry.nearbyAttractions.push("");
      render();
    });
    wrap.appendChild(add);
    return wrap;
  }

  function summaryText(entry) {
    return "#" + (entry.id != null ? entry.id : "new") + "  " + (entry.name || "(unnamed)");
  }

  function renderEntry(entry) {
    if (!entry.travel) entry.travel = {};
    var details = el("details", { class: "entry" });
    var summary = el("summary", { text: summaryText(entry) });
    details.appendChild(summary);

    details.appendChild(field("Name *", entry.name, function (v) {
      entry.name = v;
      summary.textContent = summaryText(entry);
    }));
    details.appendChild(field("Alternate name", entry.altName, function (v) { entry.altName = v; }));
    details.appendChild(field("Emblem (symbol)", entry.symbol, function (v) { entry.symbol = v; }));
    details.appendChild(field("Image path", entry.image, function (v) { entry.image = v; }));
    details.appendChild(field("Birthplace", entry.birthplace, function (v) { entry.birthplace = v; }));
    details.appendChild(field("Significance", entry.significance, function (v) { entry.significance = v; }, true));

    var travel = el("div", { class: "sub" }, [el("h4", { text: "Travel" })]);
    travel.appendChild(field("Location", entry.travel.location, function (v) { entry.travel.location = v; }));
    travel.appendChild(field("Google Maps link", entry.travel.mapsLink, function (v) { entry.travel.mapsLink = v; }));
    travel.appendChild(field("Distance", entry.travel.distanceFromCities, function (v) { entry.travel.distanceFromCities = v; }));
    travel.appendChild(field("Transport", entry.travel.transport, function (v) { entry.travel.transport = v; }));
    details.appendChild(travel);

    details.appendChild(renderAccommodation(entry));
    details.appendChild(renderAttractions(entry));

    var delBtn = el("button", { type: "button", class: "danger", text: "Delete this Tirthankara" });
    delBtn.addEventListener("click", function () {
      if (window.confirm("Delete " + (entry.name || "this entry") + "?")) {
        entries = entries.filter(function (e) { return e !== entry; });
        render();
      }
    });
    details.appendChild(el("div", { class: "entry-actions" }, [delBtn]));
    return details;
  }

  function render() {
    listEl.innerHTML = "";
    entries.forEach(function (entry) { listEl.appendChild(renderEntry(entry)); });
  }

  function load() {
    fetch("/data.json")
      .then(function (r) { return r.json(); })
      .then(function (json) {
        entries = Array.isArray(json) ? json : [];
        render();
        setStatus(entries.length + " entries loaded");
      })
      .catch(function () { setStatus("Failed to load data", "error"); });
  }

  document.getElementById("add-btn").addEventListener("click", function () {
    entries.push({
      name: "", altName: "", symbol: "", image: "", birthplace: "",
      significance: "", travel: {}, accommodation: [], nearbyAttractions: []
    });
    render();
  });

  document.getElementById("save-btn").addEventListener("click", function () {
    setStatus("Saving…");
    fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries)
    })
      .then(function (r) {
        return r.json().then(function (b) { return { ok: r.ok, body: b }; });
      })
      .then(function (res) {
        if (res.ok && res.body.ok) {
          setStatus("Saved " + res.body.count + " entries ✓", "ok");
          load();
        } else {
          setStatus("Save failed: " + (res.body.error || "unknown"), "error");
        }
      })
      .catch(function () { setStatus("Save failed (network)", "error"); });
  });

  load();
})();
```

- [ ] **Step 4: End-to-end admin test**

1. Start the server (from project root): `node admin/server.js`
2. Open `http://localhost:3000` in a browser.
   Expected: the admin header with a flag stripe, status "3 entries loaded", and three collapsible entries (#1 Rishabhanatha, #2 Ajitanatha, #3 Sambhavanatha).
3. Expand #1, change the Significance text, click **Save all**.
   Expected: status turns green "Saved 3 entries ✓".
4. Click **+ Add Tirthankara**, expand the new entry, set Name to a test value (e.g. "Test Entry"), click **Save all**.
   Expected: "Saved 4 entries ✓"; the new entry's summary shows `#4`.
5. Confirm the file changed on disk: `node -e "const d=JSON.parse(require('fs').readFileSync('data.json','utf8'));console.log(d.length, d[d.length-1].name)"`
   Expected: `4 Test Entry`
6. Delete the test entry via its "Delete this Tirthankara" button, click **Save all**.
   Expected: "Saved 3 entries ✓".
7. Open the public site (Live Server / `python -m http.server 5500`) and confirm the edited Significance from step 3 appears in Rishabhanatha's modal.

Stop the server with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
git add admin/admin.html admin/admin.css admin/admin.js
git commit -m "Add admin panel UI for editing data.json"
```

---

## Task 8: Run instructions and final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a "Running locally" section to `README.md`**

Insert the following section into `README.md` immediately before the `## Team Members` section:

```markdown
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
`node --test admin/`

### Add images
Drop image files into `images/` and set each Tirthankara's **Image path** (e.g. `images/04.jpg`) in the admin panel. If an image is missing, the site shows a numbered placeholder.
```

- [ ] **Step 2: Update the project status line**

In `README.md`, change the `## Status` body line from:

```markdown
This project is currently under development.
```

to:

```markdown
This project is currently under development. The public site and a local admin panel are functional, seeded with the first 3 Tirthankaras (Digambara tradition); remaining entries are added through the admin panel.
```

- [ ] **Step 3: Run the full verification checklist**

- [ ] `node --test admin/` → all tests pass.
- [ ] `node -e "JSON.parse(require('fs').readFileSync('data.json','utf8'))"` → no error (valid JSON).
- [ ] Public site (served): 3 cards render; each modal opens with correct content; ✕ / backdrop / `Esc` all close it; Google Maps link opens.
- [ ] Missing-image placeholder (numbers) shows on cards (no image files present yet).
- [ ] Admin (`node admin/server.js` + `http://localhost:3000`): load, edit, add, delete, and save all work; edits appear on the public site after refresh.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "Document local run instructions and update project status"
```

---

## Done

The public site lists the seeded Tirthankaras and shows full details in a modal; the admin panel lets you grow `data.json` to all 24 entries over time. Next steps (future enhancements, out of scope here): search/filter, multi-language, reviews, route planning, online booking, and image upload from the admin panel.
```

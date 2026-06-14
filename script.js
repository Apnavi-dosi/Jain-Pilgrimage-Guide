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

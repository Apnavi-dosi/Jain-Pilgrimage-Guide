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
    details.appendChild(field("Temple name", entry.templeName, function (v) { entry.templeName = v; }));
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
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        entries = Array.isArray(json) ? json : [];
        render();
        setStatus(entries.length + " entries loaded");
      })
      .catch(function () {
        setStatus("Failed to load data — is the admin server running?", "error");
      });
  }

  document.getElementById("add-btn").addEventListener("click", function () {
    entries.push({
      name: "", templeNameName: "", symbol: "", image: "", birthplace: "",
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

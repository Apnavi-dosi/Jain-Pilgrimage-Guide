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

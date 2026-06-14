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

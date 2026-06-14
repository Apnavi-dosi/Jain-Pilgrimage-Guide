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

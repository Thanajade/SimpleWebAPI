const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Load version.json content
router.get("/", (req, res) => {
  const versionPath = path.join(__dirname, "../../version.json");

  let versionData = {};
  try {
    versionData = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
  } catch (err) {
    console.error("Error reading version.json:", err);
    return res.status(500).json({ error: "Unable to load version information" });
  }

  res.status(200).json({
    message: "SimpleAPI",
    version: versionData,
  });
});

module.exports = router;
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve API version and environment information
 *     description: Returns the API version from version.json and the current environment.
 *     responses:
 *       200:
 *         description: Successfully retrieved version and environment information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SimpleAPI"
 *                 version:
 *                   type: object
 *                   description: API version details from version.json.
 *                   example: { "version": "1.0.0" }
 *                 environment:
 *                   type: string
 *                   example: "development"
 *       500:
 *         description: Failed to load version information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to load version information"
 */
router.get("/", (req, res) => {
  const versionPath = process.env.NODE_ENV === "production"
      ? path.join(__dirname, "version.json") // In production, `__dirname` points to the correct location
      : path.resolve(process.cwd(), "./version.json"); // In development, resolve relative to project root

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
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
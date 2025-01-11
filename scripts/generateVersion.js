const fs = require("fs");
const { execSync } = require("child_process");

// Get the current git hash
const gitHash = execSync("git rev-parse HEAD").toString().trim();

// Get the current git branch
const gitBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

// Get the current UTC timestamp in ISO format
const buildTimestamp = new Date().toISOString();

// Get the current timezone offset
const now = new Date();
const timezoneOffsetMinutes = now.getTimezoneOffset();
const timezoneOffsetHours = -timezoneOffsetMinutes / 60;
const timezone = `GMT${timezoneOffsetHours >= 0 ? `+${timezoneOffsetHours}` : timezoneOffsetHours}`;

// Prepare the version info
const versionInfo = {
    buildTimestamp, // UTC time in ISO format
    timezone,       // Local timezone
    gitHash,
    gitBranch,
};

// Write to version.json
fs.writeFileSync("version.json", JSON.stringify(versionInfo, null, 2), "utf-8");

console.log("Generated version.json:");
console.log(versionInfo);
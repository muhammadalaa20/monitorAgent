const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("devices.db");

app.use(cors());
app.use(bodyParser.json());

// Create table (unique hostname)
db.prepare(`
  CREATE TABLE IF NOT EXISTS devices (
    hostname TEXT PRIMARY KEY,
    ip_address TEXT,
    platform TEXT,
    os_type TEXT,
    release TEXT,
    arch TEXT,
    uptime_seconds INTEGER,
    total_memory INTEGER,
    free_memory INTEGER,
    cpu_info TEXT,
    network_interfaces TEXT,
    last_seen DATETIME
  )
`).run();

console.log("✅ SQLite initialized.");

// Insert or update device by hostname
app.post("/api/devices", (req, res) => {
  const {
    hostname,
    ip_address,
    platform,
    os_type,
    release,
    arch,
    uptime_seconds,
    total_memory,
    free_memory,
    cpu_info,
    network_interfaces,
  } = req.body;

  if (!hostname || !ip_address) {
    return res.status(400).send("Missing required fields.");
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO devices (
        hostname,
        ip_address,
        platform,
        os_type,
        release,
        arch,
        uptime_seconds,
        total_memory,
        free_memory,
        cpu_info,
        network_interfaces,
        last_seen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(hostname) DO UPDATE SET
        ip_address = excluded.ip_address,
        platform = excluded.platform,
        os_type = excluded.os_type,
        release = excluded.release,
        arch = excluded.arch,
        uptime_seconds = excluded.uptime_seconds,
        total_memory = excluded.total_memory,
        free_memory = excluded.free_memory,
        cpu_info = excluded.cpu_info,
        network_interfaces = excluded.network_interfaces,
        last_seen = datetime('now')
    `);

    stmt.run(
      hostname,
      ip_address,
      platform,
      os_type,
      release,
      arch,
      uptime_seconds,
      total_memory,
      free_memory,
      JSON.stringify(cpu_info),
      JSON.stringify(network_interfaces)
    );

    console.log(`🔁 Updated: ${hostname}`);
    res.send("OK");
  } catch (error) {
    console.error("❌ DB error:", error);
    res.status(500).send("DB error");
  }
});

// API to return current device list
app.get("/api/devices", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM devices ORDER BY last_seen DESC").all();
    res.json(rows);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).send("Fetch error");
  }
});

// Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

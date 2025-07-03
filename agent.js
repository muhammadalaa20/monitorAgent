const os = require("os");
const fetch = require("node-fetch");

// Get the first external IPv4 address
function getIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "0.0.0.0";
}

// Send every 5 seconds
setInterval(() => {
  const payload = {
    hostname: os.hostname(),
    ip_address: getIpAddress(),
    platform: os.platform(),
    os_type: os.type(),
    release: os.release(),
    arch: os.arch(),
    uptime_seconds: os.uptime(),
    total_memory: os.totalmem(),
    free_memory: os.freemem(),
    cpu_info: os.cpus().map(cpu => ({
      model: cpu.model,
      speed: cpu.speed,
    })),
    network_interfaces: os.networkInterfaces(), // optional
  };

  fetch("http://localhost:5000/api/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.text())
    .then((res) => console.log("✅ Sent:", res))
    .catch((err) => console.error("❌ Error:", err));
}, 1000);

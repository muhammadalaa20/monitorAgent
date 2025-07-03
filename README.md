
# Monitor Agent

An agent to run on the client pc and send the device details to the server



## installation

To run this project run

```bash
  npm install
```


## Notes

Don't forget to change the ip adress of your fetch in the agent.js before packaging from localhost to the machine running the server.js

``` bash

  fetch("http://localhost:5000/api/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.text())
    .then((res) => console.log("✅ Sent:", res))
    .catch((err) => console.error("❌ Error:", err));

```
## Packaging

To turn the agent.js into a agent.exe

```bash
pkg agent.js --targets node18-win-x64 --output agent.exe

```
    
## Server

To run the server.js

```bash
node server.js

```
    

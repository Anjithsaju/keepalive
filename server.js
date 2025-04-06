const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors()); // 🛡️ Enable CORS for all routes
app.use(express.json()); // To parse JSON body from incoming requests

// 🔁 1. Redirect Route
app.get("/", (req, res) => {
  res.redirect("https://baakipinnetharam.vercel.app/main");
});

// 👂 2. Ping Listener from Render
app.post("/ping", (req, res) => {
  const { message } = req.body;
  console.log(
    `[${new Date().toLocaleTimeString()}] Ping received from Render: ${message}`
  );
  res.status(200).send("Ping received. Thanks, Render! 🛸");
});

// 📡 3. Gremlin Ping to Render every 5 mins
async function handshake() {
  try {
    const response = await fetch(
      "https://baakipinnetharam.onrender.com/handshake",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello from redirect gremlin 👻",
        }),
      }
    );

    const result = await response.text();
    console.log(
      `[${new Date().toLocaleTimeString()}] Ping sent to Render: ${result}`
    );
  } catch (err) {
    console.error(
      `[${new Date().toLocaleTimeString()}] Ping to Render failed:`,
      err.message
    );
  }
}

// 🤝 Initial ping on startup
handshake();

// 🔄 Ping every 5 minutes
setInterval(handshake, 1000 * 60 * 10);

app.listen(PORT, () => {
  console.log(`🚀 Gremlin server live at http://localhost:${PORT}`);
});

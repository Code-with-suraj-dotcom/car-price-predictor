const express = require("express");

const app = express();
app.use(express.json());

app.post("/api/predict", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:5001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch {
    res.status(502).json({
      error: "Python prediction API is unavailable. Make sure Flask is running on port 5001.",
    });
  }
});

app.listen(5000, () => {
  console.log("Express API listening at http://127.0.0.1:5000");
});
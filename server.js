const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const db=require("./config/dbconnection.js")

// Middleware
app.use(cors());
app.use(express.json());

// Routes for all events
app.use('/cyber_heist', require('./routes/cyber_heist/controller.js'));
app.use('/chrono_bid',require('./routes/chrono_bid/controller.js'));
app.use('/escape_paradox', require('./routes/escape_paradox/controller.js'));
app.use('/lyric', require('./routes/lyric_quest/controller.js'));
app.use('/picto', require('./routes/pictoword/controller'));
app.use('/timeless_truth', require('./routes/Timeless_truth/controller'));
app.use('/interstellar_harmonics', require('./routes/interstellar_harmonics/controller'))

app.post("/feedback", async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const docRef = await db.collection("feedbacks").add({
      message,
      createdAt: new Date(),
    });
    res.status(200).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

const express = require("express");
const router = express.Router();
const db = require("../../config/dbconnection"); // 🔁 Firestore connection
const register = require("./dbstore"); // ✅ Your converted register logic

// POST: Register a team
router.post("/", async (req, res) => {
  const { teamName } = req.body;

  try {
    const snapshot = await db
      .collection("chrono_bid")
      .where("teamName", "==", teamName)
      .get();

    if (!snapshot.empty) {
      return res.status(201).json({ message: "Team name already exists" });
    }

    // Proceed to register
    register(req.body, res);
  } catch (err) {
    console.error("Error checking team name:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET: Count current teams in chrono_bid
router.get("/count", async (req, res) => {
  try {
    const snapshot = await db.collection("chrono_bid").get();
    const count = snapshot.size; // snapshot.size gives the count
    res.json({ count }); /// snapshot.size gives the count
  } catch (err) {
    console.error("Error fetching count:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

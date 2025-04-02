const express = require("express");
const router = express.Router();
const register = require("./dbstore");
const db = require("../../config/dbconnection");

router.post("/", async (req, res) => {
  const { teamName } = req.body;

  try {
    const snapshot = await db
      .collection("BattleofBytes")
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

// 🔥 Firestore-based team count
router.get("/count", async (req, res) => {
  try {
    const snapshot = await db.collection("BattleofBytes").get();
    res.json({ count: snapshot.size });
  } catch (err) {
    console.error("Error fetching count:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../../config/dbconnection"); // Firestore config
const cyberHeistRegister = require("./dbstore");

router.post("/", async (req, res) => {
  const { teamName } = req.body;

  try {
    const snapshot = await db
      .collection("cyber_heist")
      .where("teamName", "==", teamName)
      .get();

    if (!snapshot.empty) {
      return res.status(201).json({ message: "Team name already exists" });
    }

    // Proceed to register
    cyberHeistRegister(req.body, res);
  } catch (err) {
    console.error("Error checking team name:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Count registered teams
router.get("/count", async (req, res) => {
  try {
    const snapshot = await db.collection("cyber_heist").get();
    res.json({ count: snapshot.size });
  } catch (err) {
    console.error("Error fetching count:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

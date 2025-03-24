const express = require("express");
const router = express.Router();
const db = require("../../config/dbconnection"); // Firestore DB
const register = require("./dbstore");

// Handle registration
router.post("/", async (req, res) => {
  const { teamName } = req.body;

  try {
    const snapshot = await db
      .collection("interstellar_harmonics")
      .where("teamName", "==", teamName)
      .get();

    if (!snapshot.empty) {
      return res.status(409).json({ message: "Team name already exists" });
    }

    // Proceed to register
    register(req.body, res);
  } catch (err) {
    console.error("Error checking team name:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET team count using Firestore
router.get("/count", async (req, res) => {
  try {
    const snapshot = await db.collection("interstellar_harmonics").get();
    res.json({ count: snapshot.size });
  } catch (err) {
    console.error("Error fetching count:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

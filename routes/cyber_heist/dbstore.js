const db = require("../../config/dbconnection");
const insertIntoSheet = require("./sheet");
const sendMail = require("../../mail/mailer");

const cyberHeistRegister = async (data, res) => {
  const {
    teamName,
    event,
    member1 = {},
    member2 = {},
  } = data;

  // Validate required fields
  if (
    !teamName ||
    !event ||
    !member1.name ||
    !member1.email ||
    !member1.phone ||
    !member1.collegeName ||
    !member1.year
  ) {
    return res.status(400).send("❌ Missing required team or member1 details.");
  }

  try {
    const cyberHeistRef = db.collection("cyber_heist");

    // Step 1: Check team limit
    const snapshot = await cyberHeistRef.get();
    if (snapshot.size >= 30) {
      return snapshot.size;
    }

    // Step 2: Insert into Firestore
    const docData = {
      teamName,
      event,
      member1,
      member2,
      timestamp: new Date(),
    };

    await cyberHeistRef.add(docData);
    console.log("✅ Data inserted into Cyber Heist");

    // Step 3: Insert into Google Sheet
    try {
      await insertIntoSheet(data);
      console.log("✅ Data inserted into Google Sheet");
    } catch (sheetErr) {
      console.error("❌ Google Sheet Error:", sheetErr);
    }

    // Step 4: Send Email to members
    const teamMembers = [member1, member2].filter((m) => m.name && m.email);
    sendMail(teamMembers, member1.collegeName, event);

    // Done!
    res.status(200).send("🎉 Cyber Heist Registered Successfully");
  } catch (err) {
    console.error("❌ Firestore Insert Error:", err);
    res.status(500).send("Firestore Insert Error");
  }
};

module.exports = cyberHeistRegister;

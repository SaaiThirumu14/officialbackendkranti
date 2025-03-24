const db = require("../../config/dbconnection");
const insertIntoSheet = require("./sheet");
const sendMail = require("../../mail/mailer");

const escapeParadoxRegister = async (data, res) => {
  const { teamName, event, member1 = {}, member2 = {} } = data;

  try {
    // Step 1: Check if team limit (20) reached
    const snapshot = await db.collection("escape_paradox").get();
    if (snapshot.size >= 20) {
      return snapshot.size;
    }

    // Step 2: Prepare registration data
    const registrationData = {
      teamName,
      event,
      member1,
      member2,
      timestamp: new Date(),
    };

    // Step 3: Insert into Firestore
    await db.collection("escape_paradox").add(registrationData);
    console.log("✅ Data inserted into Escape Paradox");

    // Step 4: Google Sheet integration
    try {
      await insertIntoSheet(data);
    } catch (sheetErr) {
      console.error("❌ Google Sheet Error:", sheetErr);
    }

    // Step 5: Send email to members
    const teamMembers = [member1, member2].filter(m => m.name && m.email);
    sendMail(teamMembers, event);

    res.status(200).send("🎉 Escape Paradox Registered Successfully");
  } catch (err) {
    console.error("❌ Firestore Insert Error:", err);
    res.status(500).send("Firestore Error");
  }
};

module.exports = escapeParadoxRegister;

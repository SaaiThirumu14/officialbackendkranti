const db = require("../../config/dbconnection");
const insertIntoSheet = require("./sheet");
const sendMail = require("../../mail/mailer");

const pictowordRegister = async (data, res) => {
  const { teamName, event, member1, member2, member3 } = data;

  try {
    // Step 1: Team limit check
    const snapshot = await db.collection("pictoword").get();
    if (snapshot.size >= 30) {
      return snapshot.size;
    }

    // Step 2: Insert into Firestore
    const docData = {
      teamName,
      event,
      member1,
      member2,
      member3: member3 || {},
      timestamp: new Date(),
    };

    await db.collection("pictoword").add(docData);
    console.log("✅ Data inserted into Pictoword (Firestore)");

    // Step 3: Add to Google Sheet
    await insertIntoSheet(data);

    // Step 4: Send confirmation email
    const teamMembers = [member1, member2, member3].filter((m) => m?.name && m?.email);
    sendMail(teamMembers, event);

    res.status(200).send("🎉 Pictoword Registered Successfully");
  } catch (err) {
    console.error("❌ Firestore Insert Error:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = pictowordRegister;

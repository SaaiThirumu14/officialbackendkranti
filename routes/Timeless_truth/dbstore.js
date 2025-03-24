const db = require("../../config/dbconnection");
const insertIntoSheet = require("./sheet");
const sendMail = require("../../mail/mailer");

const timelessTruthsRegister = async (data, res) => {
  const {
    teamName,
    event,
    member1,
    member2,
    member3,
    member4,
  } = data;

  try {
    // Step 1: Check team limit
    const snapshot = await db.collection("timeless_truths").get();
    if (snapshot.size >= 35) {
      return snapshot.size;
    }

    // Step 2: Prepare data
    const docData = {
      teamName,
      event,
      member1,
      member2,
      member3: member3 || {},
      member4: member4 || {},
      timestamp: new Date().toISOString(),
    };

    // Step 3: Add to Firestore
    await db.collection("timeless_truths").add(docData);
    console.log("✅ Data inserted into Timeless Truths");

    // Step 4: Add to Google Sheet
    await insertIntoSheet(data);

    // Step 5: Send mail to all valid members
    const teamMembers = [member1, member2, member3, member4].filter(
      (m) => m?.name && m?.email
    );
    sendMail(teamMembers, event);

    res.status(200).send("🎉 Timeless Truths Registered Successfully");
  } catch (err) {
    console.error("❌ Firestore Insert Error:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = timelessTruthsRegister;

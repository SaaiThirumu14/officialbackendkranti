const insertIntoSheet = require("./sheet");
const sendMail = require("../../mail/mailer");
const db = require("../../config/dbconnection"); // Firestore instance

const chronoBidRegister = async (data, res) => {
  const {
    teamName,
    event,
    member1,
    member2,
    member3,
  } = data;

  try {
    const chronoBidRef = db.collection("chrono_bid");

    // Check current number of documents (team count)
    const snapshot = await chronoBidRef.get();
    if (snapshot.size >= 10) {
      return snapshot.size;
    }

    // Build registration data
    const registrationData = {
      teamName,
      event,
      member1,
      member2,
      member3: member3 || null,
      timestamp: new Date()
    };

    // Save to Firestore
    await chronoBidRef.add(registrationData);
    console.log("✅ Data inserted into Chrono Bid");

    // Store in Google Sheet
    await insertIntoSheet(data);

    // Send confirmation emails
    const teamMembers = [member1, member2, member3].filter(
      (m) => m?.name && m?.email
    );
    sendMail(teamMembers,teamName, event);

    res.status(200).send("Chrono Bid Registered Successfully");
  } catch (err) {
    console.error("❌ Firestore Insert Error:", err);
    res.status(500).send("Firestore Error");
  }
};

module.exports = chronoBidRegister;

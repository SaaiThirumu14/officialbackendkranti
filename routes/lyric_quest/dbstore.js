const db = require("../../config/dbconnection");
const insertIntoSheet = require("./sheet");
const sendMail = require("../../mail/mailer");

const lyricQuestRegister = async (data, res) => {
  const { teamName, event, member1, member2 } = data;

  try {
    // Step 1: Check team limit
    const snapshot = await db.collection("lyric_quest").get();
    if (snapshot.size >= 30) {
      return snapshot.size;
    }

    // Step 2: Prepare Firestore data
    const teamData = {
      teamName,
      event,
      member1: {
        name: member1.name,
        phone: member1.phone,
        email: member1.email,
        collegeName: member1.collegeName,
        year: member1.year,
      },
      member2: {
        name: member2?.name || "",
        phone: member2?.phone || "",
        email: member2?.email || "",
        collegeName: member2?.collegeName || "",
        year: member2?.year || "",
      },
      registeredAt: new Date()
    };

    // Step 3: Insert into Firestore
    await db.collection("lyric_quest").add(teamData);
    console.log("✅ Data inserted into Lyric Quest");

    // Step 4: Insert into Google Sheet
    await insertIntoSheet(data);

    // Step 5: Send confirmation emails
    const teamMembers = [member1, member2].filter(m => m?.name && m?.email);
    sendMail(teamMembers, teamName,event);

    res.status(200).send("🎉 Lyric Quest Registered Successfully");
  } catch (error) {
    console.error("Firestore Registration Error:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = lyricQuestRegister;

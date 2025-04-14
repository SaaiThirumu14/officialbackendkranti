const db = require("../../config/dbconnection");
const insertIntoSheet = require("./sheet");
const sendMail = require("../../mail/mailer");

const interstellarHarmonicsRegister = async (data, res) => {
  const {
    teamName,
    event,
    member1,
    member2
  } = data;

  try {
    // Step 1: Check team limit (Max 10 teams)
    const snapshot = await db.collection("interstellar_harmonics").get();
    if (snapshot.size >= 15) {
      return snapshot.size;
    }

    // Step 2: Insert data into Firestore
    await db.collection("interstellar_harmonics").add({
      teamName,
      event,
      member1_name: member1.name,
      member1_phone: member1.phone,
      member1_email: member1.email,
      member1_collegeName: member1.collegeName,
      member1_year: member1.year,
      member2_name: member2?.name || "",
      member2_phone: member2?.phone || "",
      member2_email: member2?.email || "",
      member2_collegeName: member2?.collegeName || "",
      member2_year: member2?.year || "",
      createdAt: new Date().toISOString()
    });

    console.log("✅ Data inserted into Firestore: Interstellar Harmonics");

    // Step 3: Add to Google Sheet
    await insertIntoSheet(data);

    // Step 4: Send confirmation email
    const teamMembers = [member1, member2].filter(m => m?.name && m?.email);
    sendMail(teamMembers,teamName, event);

    res.status(200).send("🎶 Interstellar Harmonics Registered Successfully");
  } catch (error) {
    console.error("Firestore Insert Error:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = interstellarHarmonicsRegister;

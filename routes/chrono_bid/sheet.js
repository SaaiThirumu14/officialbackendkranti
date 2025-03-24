const { google } = require("googleapis");
const fs = require("fs");

// Load service account JSON from secret file path
const serviceAccount = JSON.parse(
  fs.readFileSync("/etc/secrets/GOOGLE_SERVICE_ACCOUNT", "utf8")
);

// Auth using the loaded credentials
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SHEET_ID = process.env.SHEET_ID; // ✅ Replace with your actual Google Sheet ID

const insertIntoSheet = async (data) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const values = [
      new Date().toLocaleString(),      // Timestamp
      data.teamName,
      data.event,
      data.member1.name,
      data.member1.phone,
      data.member1.email,
      data.member1.collegeName,
      data.member1.year,
      data.member2?.name || "",
      data.member2?.phone || "",
      data.member2?.email || "",
      data.member2?.collegeName || "",
      data.member2?.year || "",
      data.member3?.name || "",
      data.member3?.phone || "",
      data.member3?.email || "",
      data.member3?.collegeName || "",
      data.member3?.year || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Chronobid!A2", // ✅ Sheet/tab name and starting range
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [values],
      },
    });

    console.log("✅ Data successfully added to Google Sheet: Chrono Bid");
  } catch (error) {
    console.error("❌ Google Sheet Error:", error.message);
  }
};

module.exports = insertIntoSheet;

const { google } = require("googleapis");
const fs = require("fs");

const SHEET_ID = process.env.SHEET_ID; // Google Sheet ID
const SHEET_NAME = "Timelesstruth"; // Sheet tab name

const insertIntoSheet = async (data) => {
  try {
    // Load service account JSON from Render's Secret Files
    const serviceAccount = JSON.parse(
      fs.readFileSync("/etc/secrets/GOOGLE_SERVICE_ACCOUNT", "utf8")
    );

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Format row data
    const row = [
      new Date().toLocaleString(),
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
      data.member4?.name || "",
      data.member4?.phone || "",
      data.member4?.email || "",
      data.member4?.collegeName || "",
      data.member4?.year || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    console.log("✅ Data added to Google Sheet for Timeless Truths");
  } catch (error) {
    console.error("❌ Google Sheets API Error:", error.message);
  }
};

module.exports = insertIntoSheet;

const { google } = require("googleapis");
const fs = require("fs");

const SHEET_ID = process.env.SHEET_ID; // Google Sheet ID
const SHEET_NAME = "PictoWord"; // Tab name in your Google Sheet

const insertIntoSheet = async (data) => {
  try {
    // Read service account credentials from Render secret file
    const keys = JSON.parse(
      fs.readFileSync("/etc/secrets/GOOGLE_SERVICE_ACCOUNT", "utf8")
    );

    const auth = new google.auth.GoogleAuth({
      credentials: keys,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    const values = [
      [
        new Date().toLocaleString(),
        data.teamName,
        data.event,
        data.member1.name,
        data.member1.phone,
        data.member1.email,
        data.member1.collegeName,
        data.member1.year,
        data.member2.name,
        data.member2.phone,
        data.member2.email,
        data.member2.collegeName,
        data.member2.year,
        data.member3?.name || "",
        data.member3?.phone || "",
        data.member3?.email || "",
        data.member3?.collegeName || "",
        data.member3?.year || "",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values,
      },
    });

    console.log("✅ Data added to Google Sheet: Pictoword");
  } catch (error) {
    console.error("❌ Failed to write to Google Sheet:", error.message);
  }
};

module.exports = insertIntoSheet;

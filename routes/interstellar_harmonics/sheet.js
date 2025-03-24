const { google } = require('googleapis');
const fs = require('fs');

// Load service account credentials from Render secret file
const credentials = JSON.parse(
  fs.readFileSync('/etc/secrets/GOOGLE_SERVICE_ACCOUNT', 'utf8')
);

// Google Sheet details
const SHEET_ID = process.env.SHEET_ID; // ✅ Replace with your actual Google Sheet ID
const SHEET_NAME = 'Interstellar-harmonics'; // ✅ Sheet/tab name

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const insertIntoSheet = async (data) => {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const values = [[
    new Date().toLocaleString(),
    data.teamName,
    data.event,
    data.member1.name,
    data.member1.phone,
    data.member1.email,
    data.member1.collegeName,
    data.member1.year,
    data.member2?.name || '',
    data.member2?.phone || '',
    data.member2?.email || '',
    data.member2?.collegeName,
    data.member2?.year,
  ]];

  const resource = { values };

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2`, // You can adjust starting cell
      valueInputOption: 'USER_ENTERED',
      resource,
    });

    console.log('✅ Data added to Google Sheet: Interstellar Harmonics');
  } catch (err) {
    console.error('❌ Error appending data to Google Sheet:', err);
    throw err;
  }
};

module.exports = insertIntoSheet;

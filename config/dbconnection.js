const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = JSON.parse(
  fs.readFileSync("/etc/secrets/FIREBASE_SERVICE_ACCOUNT", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;

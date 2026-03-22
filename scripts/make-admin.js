const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Error: serviceAccountKey.json not found in the root directory.");
  console.log("Please follow these steps to get it:");
  console.log("1. Go to Firebase Console > Project Settings > Service Accounts.");
  console.log("2. Click 'Generate new private key'.");
  console.log("3. Rename the downloaded file to 'serviceAccountKey.json' and place it in the project root.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function makeAdmin(email) {
  if (!email) {
    console.error("Usage: node scripts/make-admin.js user@email.com");
    process.exit(1);
  }

  console.log(`Searching for user with email: ${email} in Firebase Auth...`);

  try {
    let uid;
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      uid = userRecord.uid;
      console.log(`User found in Firebase Auth! UID: ${uid}`);
    } catch (authError) {
      console.log("User not found in Firebase Auth. Searching Firestore...");
      
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (!snapshot.empty) {
        uid = snapshot.docs[0].id;
        console.log(`User found in Firestore by email! UID: ${uid}`);
      } else {
        console.log("Still no user found. Searching Firestore for manual matches...");
        const allUsers = await usersRef.get();
        allUsers.forEach(doc => {
          const data = doc.data();
          if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
            uid = doc.id;
          }
        });
      }
    }

    if (!uid) {
      console.error("Critical: User not found in Firebase Auth OR Firestore.");
      console.log("Suggestions:");
      console.log("1. Ensure the user has actually signed up/logged in at least once.");
      console.log("2. Check the email spelling.");
      process.exit(1);
    }

    await updateUserData(uid, email);
  } catch (error) {
    console.error("Error during search:", error);
    process.exit(1);
  }
}

async function updateUserData(uid, email) {
  console.log(`Updating user ${uid}...`);
  
  const updateData = {
    role: "admin",
    status: "approved",
    email: email, // Ensure email is set
  };

  // Add createdAt if missing
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.data().createdAt) {
    updateData.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await db.collection("users").doc(uid).update(updateData);
  
  console.log("✨ Success! User is now an Admin.");
  process.exit(0);
}

const emailArg = process.argv[2];
makeAdmin(emailArg);

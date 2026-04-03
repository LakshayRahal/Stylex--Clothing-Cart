// const admin = require("firebase-admin");

// admin.initializeApp({
//   credential: admin.credential.cert(
//     require("../firebase-service-account.json")
//   ),
// });

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const firebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded; 

   

    next();
  } catch (err) {
    console.error("FIREBASE AUTH ERROR:", err.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = firebaseAuth;

// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   logoutUser,
//   authMiddleware,
// } = require("../../controllers/auth/auth-controller");

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.get("/check-auth", authMiddleware, (req, res) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     message: "Authenticated user!",
//     user,
//   });
// });

// module.exports = router;


// const express = require("express");


// const {
//   registerUser,
//   loginUser,
//   logoutUser,
//   authMiddleware,
//   googleAuthCallback,
//   forgotPassword,
//   resetPassword,
// } = require("../../controllers/auth/auth-controller");

// const router = express.Router();

// /* Email Auth */
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.get("/check-auth", authMiddleware, (req, res) => {
//   res.json({ success: true, user: req.user });
// });







// /* Forgot Password */
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// module.exports = router;

const express = require("express");
const firebaseAuth = require("../../middleware/firebaseAuth");
const User = require("../../models/User");

const router = express.Router();

/**
 * Called AFTER Firebase login (email or Google)
 */
router.post("/firebase-login", firebaseAuth, async (req, res) => {
  const { email, name } = req.user;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      userName: name || email.split("@")[0],
      role: "user",
    });
  }

  res.json({ success: true, user });
});




module.exports = router;


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/User");

/* 🔥 SAFE SECRET (ENV OR FALLBACK) */
const JWT_SECRET = "CLIENT_SECRET_KEY";

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User already exists!",
      });

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.json({ success: true, message: "Registration successful" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist. Please register.",
      });
    }

    // 🚨 Google-only users cannot login via form
    if (user.isGoogleUser && !user.password) {
      return res.json({
        success: false,
        message:
          "This account was created using Google. Please login with Google.",
      });
    }

    if (!password) {
      return res.json({
        success: false,
        message: "Password is required",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* ================= GOOGLE CALLBACK ================= */
const googleAuthCallback = async (req, res) => {
  const user = req.user;
  
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      userName: user.userName,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
};

/* ================= LOGOUT ================= */
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

/* ================= AUTH MIDDLEWARE ================= */
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};


const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist. Please register.",
      });
    }
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");

  await User.findOneAndUpdate(
    { email },
    { resetToken: token, resetTokenExpiry: Date.now() + 3600000 }
  );

  console.log(
    `Reset Link: ${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/auth/reset-password/${token}`
  );

  res.json({ success: true, message: "Reset link sent" });
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  googleAuthCallback,
  forgotPassword,
  resetPassword,
};

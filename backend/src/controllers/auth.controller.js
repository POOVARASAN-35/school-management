import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/**
 * STAFF & STUDENT LOGIN
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Only staff or student allowed here
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin must use admin login" });
    }

    // 5️⃣ Create token
    const token = generateToken(user._id, user.role);

    // 6️⃣ Send token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // 7️⃣ Success response
    res.json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN LOGIN (SEPARATE)
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = generateToken(admin._id, admin.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      message: "Admin login successful",
      user: admin,
    });

  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // 👈 immediately expires cookie
  });

  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Logged out" });
};



import User from "../models/User.js";
import mongoose from "mongoose";

/* ------------------ GET ALL USERS ------------------ */
export const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};

/* ------------------ CREATE USER ------------------ */
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!["staff", "student"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(201).json({
    message: "User created successfully",
    user,
  });
};

/* ------------------ UPDATE USER STATUS ------------------ */
export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 🛡️ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!["active", "suspended"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "User status updated",
    user,
  });
};

import User from "../models/user.js";
import catchAsync from "../utils/catchAsync.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = catchAsync(async (req, res) => {
  const { email, password, profileImage } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    profileImage,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }


  console.log("user", user)

  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log("passwordMatch", passwordMatch)
  if (!passwordMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
});

export const verifyToken = catchAsync(async (req, res) => {
  const authHeader = req.headers["Authorization"];
  console.log("authHeader", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer"))
    return res.status(401).json({ authenticated: false });

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userInfo = await User.findOne({ email: decoded.email }).select(
    "-password"
  );
  return res.status(200).json({ authenticated: true, user: userInfo });
});

export const getUserProfile = catchAsync(async (req, res) => {
  const email = req.user?.email;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request. No email found." });
  }

  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

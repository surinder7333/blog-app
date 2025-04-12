import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";

export const authGuard = catchAsync(async (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }

  const token = authToken?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
  req.user = decoded;
  next();
});

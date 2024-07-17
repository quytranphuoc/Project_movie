import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"; // Make sure to import asyncHandler correctly
import User from "../Models/UserModels.js"; // Adjust the path based on your project structure

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //set token from Bearer token in header
    try {
      token = req.headers.authorization.split(" ")[1];
      //verify token and get user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //get user id from decoded token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  //if token doesn't exits in headers send error
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
//idAdmin middlewares

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { generateToken, protect, admin };

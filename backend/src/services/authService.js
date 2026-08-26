import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import { refreshToken } from "../controllers/authController.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account is inactive");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) =>{
  if(!refreshToken){
    throw new ApiError(401,"Refresh Token is required.");
  }

  let decoded;

  try{
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  }catch(error){
    throw new ApiError(401,"invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId).select(
    "+refreshToken"
  );

  if(!user){
    throw new ApiError(401,"User not found!");
  }

  if(!user.isActive){
    throw new ApiError(403,"Account is inActive");
  }

  if(user.refreshToken !== refreshToken){
    throw new ApiError(401,"Refresh token has been revoked!");
  }

  const accessToken = generateAccessToken(user);

  return{
    accessToken,
  };
};

export const logoutUser = async(refreshToken) => {
  if(!refreshToken){
    throw new ApiError(400,"Refresh Token is required!");
  }

  const user = await User.findOne({
    refreshToken,
  }).select("+refreshToken");

  if(!user){
    return;
  }

  user.refreshToken = undefined;

  await user.save({
    validateBeforeSave:false,
  });
};
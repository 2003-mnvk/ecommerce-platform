import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";

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
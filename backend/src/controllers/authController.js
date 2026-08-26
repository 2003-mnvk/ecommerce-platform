import { registerUser,loginUser, refreshAccessToken,logoutUser } from "../services/authService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const register = async (req,res) =>{
    const result = await registerUser(req.validated.body);

    res.status(201).json(
        new ApiResponse(
            201,
            result,
            "User Registerd Successfully"
        )
    );
};

export const login = async (req, res) => {
  const result = await loginUser(req.validated.body);

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Login successful"
    )
  );
};

export const refreshToken = async (req,res) =>{
    const result = await refreshAccessToken(
        req.body.refreshToken
    );

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Access token refreshed sucessfully!"
        )
    );
};

export const logout = async (req,res) =>{
    await logoutUser(req.body.refreshToken);

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "logout sucessful"
        )
    );
};


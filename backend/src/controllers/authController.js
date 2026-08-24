import { registerUser,loginUser } from "../services/authService.js";
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

export const login = async (req,res) =>{
    const result = await loginUser(req.validated.body);

    res.status(201).json(
        new ApiResponse(
            201,
            result,
            "Login Sucessful"
        )
    );
};
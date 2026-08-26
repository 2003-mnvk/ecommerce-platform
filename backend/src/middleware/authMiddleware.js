import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(
            new ApiError(401,"Authentication Required")
        );
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if(!user){
            return next(
                new ApiError(401,"User no longer exist")
            );
        }

        if(!user.isActive){
            return next(
                new ApiError(403,"Account is inactive")
            );
        }

        req.user = user;

        next();
    }catch(error){
        return next(
            new ApiError(401,"Invalid or expired Access Token")
        );
    }
};

export default authMiddleware

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";



const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    (req,res) =>{
        res.status(200).json({
            success:true,
            message:"Protected route accessed sucessfully",
            user:{
                id:req.user._id,
                name:req.user.name,
                email:req.user.email,
                role:req.user.role,
            },
        });
    }
);

router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    (req,res) =>{
        res.status(200).json({
            success:true,
            message:"Admin route accessed sucessfully",
            user:{
                id:req.user._id,
                role:req.user.role,
            },
        });
    }
)

router.get(
    "/seller",
    authMiddleware,
    roleMiddleware("seller","admin"),
    (req,res) =>{
        res.status(200).json({
            success:true,
            message:"seller route accessed sucessfully",
            user:{
                id:req.user._id,
                role:req.user.role,
            },
        });
    }
)
export default router;
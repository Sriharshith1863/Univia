import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError(401, "User doesn't exist");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Something went wrong while generating access and refresh token", error);
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
};

const signUpUser = asyncHandler(async (req, res) => {
    const {username, password, dob, email, phoneNumber, confirmPassword} = req.body;
    if([username, password, dob, email, phoneNumber, confirmPassword].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }
    if(password != confirmPassword) {
        throw new ApiError(402, "retype your password");
    }
    //TODO: do structure checks for email, phoneNumber, dob here

    const userExisted = await User.findOne({
        $or: [{ username }, { email }],
    });
    if(userExisted) {
        throw new ApiError(409, "User already existed!");
    }

    //TODO: send email otp verification here

    try {
        const user = await User.create({
            username,
            password,
            dob,
            email,
            phoneNumber,
        });
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        if(!createdUser) {
            throw new ApiError(500, "Something went wrong checking creation of a user!");
        }
        return res
            .status(201)
            .json(new ApiResponse(201, createdUser, "User creation successfull"));
        } catch (error) {
            console.log("user creation failed", error);
            throw new ApiError(500, "Something went wrong while creating a user.");
        }
});

const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({
        username
    });
    if(!user) {
        throw new ApiError(404, "User not found");
    }
    const isValid = await user.isPasswordCorrect(password);
    if(!isValid) {
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {...loggedInUser, accessToken, refreshToken}, "user logged in successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
    const {email, phoneNumber, dob} = req.body;
    if(!email || !phoneNumber || !dob) {
        throw new ApiError(400, "No field should be empty!");
    }
    let updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email: email,
                phoneNumber: phoneNumber,
                dob: dob
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");

    if(!updatedUser) {
        throw new ApiError(404, "User not found!");
    }
    updatedUser = updatedUser._doc;
    return res
        .status(201)
        .json(new ApiResponse(201, {...updatedUser}, "profile successfully updated"));
});

const currentUserDetails = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if(!userId) {
        throw new ApiError(400, "Something went wrong while fetching user details!");
    }
    let currentUser = await User.findById(userId).select("-password -refreshToken -_id");
    if(!currentUser) {
        throw new ApiError(404, "User not found");
    }
    currentUser = currentUser._doc;
    return res
        .status(200)
        .json(new ApiResponse(200, {...currentUser}, "Retrived user details successfully!"));
});


export { signUpUser, loginUser, updateProfile, currentUserDetails };
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { Verification } from "../models/verification.models.js";
import { sendMail } from "../utils/mail.js";

const sendOTP = asyncHandler(async (req, res) => {
    const {username, email, password, dob, phoneNumber, confirmPassword} = req.body;
    if([username, password, dob, email, phoneNumber, confirmPassword].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }
    if(password !== confirmPassword) {
        throw new ApiError(400, "retype your password");
    }
    const userExisted = await User.findOne({
        $or: [{ username }, { email }],
    });
    const pendingUserExisted = await Verification.findOne({
        $or: [{"tempUserData.username": username}, {"tempUserData.email": email}],
    });
    if(userExisted || pendingUserExisted) {
        throw new ApiError(409, "User with username or email Id already exists!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const vData = {
        otp: hashedOtp,
        tempUserData: {
            username,
            password: hashedPassword,
            email,
            dob,
            phoneNumber
        }
    };
    console.log(vData);
    const unVerifiedUser = await Verification.create(vData);
    console.log(unVerifiedUser);
    const createdUser = await Verification.findById(unVerifiedUser._id).select("otp expiresAt _id").lean();
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while processing the user data!");
    }
    const html = `
    <h2>Email Verification</h2>
    <p>Your OTP for verifying your email is: <b>${otp}</b></p>
    <p>This code will expire in 5 minutes.</p>
    `;
    await sendMail(email, "Your Event Sphere Email verification OTP", html);
    return res
        .status(200)
        .json(new ApiResponse(200, {verificationId: createdUser._id}, "OTP sent to email!"));
});

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
    const {verificationId, otp} = req.body;
    console.log(verificationId);
    const unVerifiedUser = await Verification.findById(verificationId).select("otp tempUserData").lean();
    if(!unVerifiedUser) {
        throw new ApiError(400, "Your verification session has expired. Please sign up again");
    }
    
    const isMatch = await bcrypt.compare(otp, unVerifiedUser.otp);
    console.log(isMatch);
    if(!isMatch) {
        console.log("In to this incorrect otp error");
        throw new ApiError(400, "Incorrect otp");
    }

    try {
        const user = await User.create({
            username: unVerifiedUser.tempUserData.username,
            password: unVerifiedUser.tempUserData.password,
            dob: unVerifiedUser.tempUserData.dob,
            email: unVerifiedUser.tempUserData.email,
            phoneNumber: unVerifiedUser.tempUserData.phoneNumber,
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
        .select("-password -refreshToken").lean();
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
        .json(new ApiResponse(200, {...currentUser, avatar: currentUser.avatar.url}, "Retrived user details successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if(!incomingRefreshToken) {
        throw new ApiError(401, "Refresh Token is required!");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);
        if(!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }
        const {accessToken, refreshToken: newRefreshToken} = 
        await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                {accessToken,
                refreshToken: newRefreshToken 
                },
                "Access token refreshed successfully"
            ));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while refreshing access token");   
    }
});

const UpdateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }
    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("Uploaded avatar", avatar);
    } catch (error) {
        console.log("Error uploading avatar", error);
        throw new ApiError(400, "failed to upload avatar");
    }
    try {
        let previousPublicId = await User.findById(req.user?._id).select("avatar");
        previousPublicId = previousPublicId._doc;
        console.log(previousPublicId);
        previousPublicId = previousPublicId.avatar?.public_id;
        let user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: {
                        url: avatar.url,
                        public_id: avatar.public_id
                    }
                }
            },
            {new: true}
        ).select("avatar");
        user = user._doc;
        if(previousPublicId) {
            await deleteFromCloudinary(previousPublicId);
        }
        return res
            .status(200)
            .json(new ApiResponse(200, {avatar: user.avatar.url}, "avatar successfully updated!"));
    } catch (error) {
        console.log("avatar updation failed!");
        if(avatar) {
            await deleteFromCloudinary(avatar.public_id);
        }
        throw new ApiError(400, "Failed to update the avatar");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {new: true}
    );
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { signUpUser, loginUser, updateProfile, currentUserDetails, UpdateUserAvatar, refreshAccessToken, logoutUser, sendOTP };
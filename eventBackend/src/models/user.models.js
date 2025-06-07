import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "username is mandatory!"],
            unique: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "email is required!"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
        },
        dob: {
            type: Date,
            required: [true, "date of birth is required"],
            trim: true,
            validate: {
                validator: function(value) {
                    return value < new Date(); // DOB must be in the past
                },
                message: 'Date of birth must be in the past'
            }
        },
        password: {
            type: String,
            required: [true, "password is required!"],
        },
        phoneNumber: {
            type: String,
            match: [/^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
            required: true,
        },
        avatar: {
            type: String,
            trim: true
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);
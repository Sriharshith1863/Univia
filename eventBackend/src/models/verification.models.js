import mongoose, { Schema } from "mongoose";

const verificationSchema = new Schema(
    {
        otp: {
            type: String,
            required: true,
        },
        tempUserData: {
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
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 5*60*1000)
        }
    },
    {timestamps: true}
);

verificationSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

export const Verification = mongoose.model("Verification", verificationSchema);
import mongoose, { Schema } from "mongoose";

const registrationSchema = new Schema(
    {
        username: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        registeredAt: {
            type: Date,
            required: true,
            default: Date.now(),
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: ['successful', 'unsuccessful', 'cancelled'],
                message: '{VALUE} is not a valid status'
            },
            required: true
        }
    },
    {timestamps: true}
);

export const Registration = mongoose.model("Registration", registrationSchema);
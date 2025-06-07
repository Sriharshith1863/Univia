import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
    {
        registrationId: {
            type: Schema.Types.ObjectId,
            ref: "Registration",
            required: true
        },
        ticketCode: {
            type: String,
            required: true,
        },
        usedAt: {
            type: Date
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'used', 'expired'],
                message: '{VALUE} is not a valid status'
            },
            required: true
        }
    },
    {timestamps: true}
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
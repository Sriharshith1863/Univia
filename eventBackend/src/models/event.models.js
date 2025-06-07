import mongoose, { Schema } from "mongoose";
const eventSchema = new Schema(
  {
    eventId: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        index: true,
        default: Date.now()
    },
    eventName: {
        type: String,
        required: true,
        trim: true,
    },
    venue: {
        type: String,
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    organiserName: {
        type: String,
        required: [true, "organiser name is required!"],
        trim: true,
    },
    contact1: {
        type: String,
        match: [/^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
        required: true,
    },
    contact2: {
        type: String,
        match: [/^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },
    organiserEmailId: {
        type: String,
    },
    imageUrl: {
        type: String,
        trim: true
    },
    eventCreator: {
        type: String,
        trim: true,
        required: true
    },
    eventLaunched: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
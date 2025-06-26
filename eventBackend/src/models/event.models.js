import mongoose, { Schema } from "mongoose";
const eventSchema = new Schema(
  {
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
        validate: {
                validator: function(value) {
                    return value >= new Date(); // DOB must be in the past
                },
                message: 'Date of event must be in the future!'
            }
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
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
    },
    eventImage: {
            public_id: {
                type: String,
                trim: true,
            },
            url: {
                type: String,
                trim: true,
                default: "https://res.cloudinary.com/dk4prfm7s/image/upload/v1750942873/Image_not_available_hnbucy.png"
            }
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
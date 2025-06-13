import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Event } from "../models/event.models.js";

const createEvent = asyncHandler(async (req, res) => {
    const {eventId, eventName, venue, dateTime, description, organiserName, contact1, contact2, organiserEmailId, imageUrl, eventCreater, eventLaunched} = req.body;

    if(!eventName || !venue || !dateTime || isNaN(Date.parse(dateTime)) || !organiserName || !contact1 || !eventCreater || typeof eventLaunched !== "boolean") {
        console.log("Insufficient event details for creation!");
        throw new ApiError(400, "All fields are necessary!");
    }
    if(eventCreater != req.user?.username) {
        console.log("some other user is using some other user's account to create events!");
        throw new ApiError(401, "Only account owner can create the events on his behalf!");
    }

    try {
        const event = await Event.create({
            eventName,
            venue,
            dateTime,
            description,
            organiserName,
            contact1,
            contact2,
            organiserEmailId,
            imageUrl,
            eventCreator: eventCreater,
            eventLaunched
        });
        let createdEvent = await Event.findById(event._id).select("-createdAt -__v -updatedAt").lean();
        if(!createdEvent) {
            throw new ApiError(500, "Something went wrong while creating an event!");
        }
        createdEvent.eventId = createdEvent._id;
        delete createdEvent._id;
        const temp = createdEvent.eventCreator;
        delete createdEvent.eventCreator;
        // const dateOnly = new Date(createdEvent.dateTime).toISOString().split('T')[0];
        // createdEvent.dateTime = dateOnly;
        return res
            .status(201)
            .json(new ApiResponse(201, {...createdEvent, eventCreater: temp}, "Event creation successfull!"));
    } catch (error) {
        console.log("Event creation failed!", error);
        throw new ApiError(500, "Event creation failed!");
    }
});
const getUserEvents = asyncHandler(async (req, res) => {
    const username = req.user?.username;
    let userEvents = await Event.find({eventCreator: username}).select("-createdAt -__v -updatedAt").lean();
    userEvents = userEvents.map(({_id, eventCreator, dateTime, ...rest}) => ({
        ...rest,
        eventCreater: eventCreator,
        eventId: _id,
        dateTime: new Date(dateTime).toISOString().slice(0, 16)
    }));
    // const dateOnly = new Date(userEvents.dateTime).toISOString().split('T')[0];
    // userEvents.dateTime = dateOnly;
    console.log(userEvents);
    return res
    .status(200)
    .json(new ApiResponse(200, userEvents, "Successfully retrived user created events!"));
});

const editEvent = asyncHandler(async (req, res) => {
    const {eventId, eventName, venue, dateTime, description, organiserName, contact1, contact2, organiserEmailId, imageUrl, eventCreater, eventLaunched} = req.body;
    if(!eventName || !venue || !dateTime || isNaN(Date.parse(dateTime)) || !organiserName || !contact1 || !eventCreater || typeof eventLaunched !== "boolean") {
        console.log("Insufficient event details to edit!");
        throw new ApiError(400, "Some fields are needed to be filled!");
    }
    if(eventCreater != req.user?.username) {
        console.log("some other user is using some other user's account to edit events!");
        throw new ApiError(401, "Only account owner can edit events on his behalf!");
    }
    try {
     let editedEvent = await Event.findByIdAndUpdate(
        eventId,
        {
            $set: {
                eventName,
                venue,
                dateTime,
                description,
                organiserName,
                contact1,
                contact2,
                organiserEmailId,
                imageUrl,
                eventCreator: eventCreater,
                eventLaunched
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-createdAt -__v -updatedAt").lean();
    editedEvent.eventId = editedEvent._id;
    editedEvent.eventCreater = editedEvent.eventCreator;
    delete editedEvent._id;
    delete editedEvent.eventCreator;
    // const dateOnly = new Date(editedEvent.dateTime).toISOString().split('T')[0];
    // editedEvent.dateTime = dateOnly;
    return res
        .status(201)
        .json(new ApiResponse(201, editedEvent, "Event updated successfully!"));
    } catch (error) {
        console.log("Something went wrong while editing an event!", error);
        throw new ApiError(500, "Something went wrong while editing an event!");
    }
});

const getlaunchedEvents = asyncHandler(async (req, res) => {
    let launchedEvents = await Event.find({eventLaunched: true}).select("-createdAt -__v -updatedAt").lean();
    launchedEvents = launchedEvents.map(({_id, eventCreator, dateTime, ...rest}) => ({
        ...rest,
        eventCreater: eventCreator,
        eventId: _id,
        dateTime: new Date(dateTime).toISOString().slice(0, 16)
    }));
    return res
        .status(200)
        .json(new ApiResponse(200, launchedEvents, "successfully retrived launched events!"));
});

const deleteEvent = asyncHandler(async (req, res) => {
    const {eventId} = req.body;
    await Event.findByIdAndDelete(eventId);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully deleted the event!"));
});

export {createEvent, getUserEvents, editEvent, getlaunchedEvents, deleteEvent };
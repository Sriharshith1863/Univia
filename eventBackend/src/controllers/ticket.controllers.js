import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Event } from "../models/event.models.js";
import { Registration } from "../models/registration.models.js";
import { Ticket } from "../models/ticket.models.js";
import { nanoid } from "nanoid";
const joinEvent = asyncHandler(async (req, res) => {
    const {eventId} = req.body;
    const username1 = req.user?._id;
    const username = req.user?.username;
    if(!username.endsWith("usr")) {
        throw new ApiError(400, "Only users can register to events!");
    }
    if(!eventId) {
        throw new ApiError(400, "Event Id is mandatory!");
    }


    const event = await Event.findOne({
       _id: eventId,
       eventLaunched: true,
    });
    if(!event) {
        throw new ApiError(404, "can't register for an event which is not there or not launched yet!");
    }


    const alreadyRegistered = await Registration.findOne({
        username: username1,
        eventId
    });
    if(alreadyRegistered) {
        console.log("User has already registered to this event!");
        throw new ApiError(400, "You are already registered to this event!");
    }


    try {
        const registrationObject = await Registration.create({
        username: username1,
        eventId: event._id,
        status: "successful"
    });
    const checkRegistration = await Registration.findById(registrationObject._id).select("username eventId registeredAt status _id").lean();

    const ticket = await Ticket.create({
        registrationId: registrationObject._id,
        ticketCode: nanoid(10),
        status: "active",
        toDisplay: true
    });
    const checkTicket = await Ticket.findById(ticket._id).select("registrationId ticketCode usedAt status toDisplay")
        .populate({
            path: "registrationId",
            match: {username: req.user?._id},
            select: "username eventId registeredAt status"
        })
        .lean();
        if(!checkTicket || !checkTicket.registrationId) {
            throw new ApiError(404, "ticket or registration not found!");
        }
    return res
        .status(201)
        .json(new ApiResponse(201, checkTicket, "Successfully registered to the event!"));
    } catch (error) {
        console.log("Something went wrong while registering to the event!", error);
        throw new ApiError(500, "Something went wrong while registering to the event!");
    }
});

const getTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find()
        .select("registrationId ticketCode usedAt status toDisplay")
        .populate({
            path: "registrationId",
            match: {username: req.user?._id},
            select: "username eventId registeredAt status"
        })
        .lean();
    const userTickets = tickets.filter(ticket => ticket.registrationId !== null);

    for (const ticket of userTickets) {
        const eventId = ticket.registrationId?.eventId;
        if (!eventId) continue;

        const eventExists = await Event.exists({ _id: eventId });
        if (!eventExists) {
            await Ticket.findByIdAndDelete(ticket._id);
        }
    }

    // Refetch tickets after cleanup
    const validTickets = await Ticket.find()
        .select("registrationId ticketCode usedAt status toDisplay")
        .populate({
            path: "registrationId",
            match: { username: req.user?._id },
            select: "username eventId registeredAt status"
        })
        .lean();

    const cleanedUserTickets = validTickets.filter(ticket => ticket.registrationId !== null);


    return res
        .status(200)
        .json(new ApiResponse(200, cleanedUserTickets, "successfully retrived user tickets!"));
});

const deleteTicket = asyncHandler(async (req, res) => {
    const {ticketCode} = req.body;
    const ticketToDelete = await Ticket.findOneAndUpdate({ticketCode}
        ,{
            $set: {
                toDisplay: false
            }
        },
        {new: true}
    );
    if(!ticketToDelete) {
        throw new ApiError(404, "ticket not found!!");
    }
    return res
        .send(200)
        .json(new ApiResponse(200, {}, "successfully hided ticket"));
});

export { joinEvent, getTickets, deleteTicket };
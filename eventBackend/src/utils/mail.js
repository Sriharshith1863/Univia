import nodemailer from "nodemailer";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "./ApiError.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
});

/**
 * Send email to target address
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */

export const sendMail = asyncHandler(async (to, subject, html) => {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.log("Error sending email: ", error);
        throw new ApiError(400, "Error sending email");
    }
});
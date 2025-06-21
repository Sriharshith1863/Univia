import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import { deleteTicket, getTickets, joinEvent } from "../controllers/ticket.controllers.js";
const router = Router();

router.route("/register-event").post(verifyJWT, joinEvent);
router.route("/get-tickets").get(verifyJWT, getTickets);
router.route("/delete-ticket").patch(verifyJWT, deleteTicket);
export default router;
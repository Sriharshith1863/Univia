import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import { createEvent, deleteEvent, editEvent, getlaunchedEvents, getUserEvents, UpdateEventPhoto } from "../controllers/event.controllers.js";
const router = Router();

router.route("/create-event").post(verifyJWT, createEvent);
router.route("/user-events").get(verifyJWT, getUserEvents);
router.route("/edit-event").patch(verifyJWT, editEvent);
router.route("/launched-events").get(getlaunchedEvents);
router.route("/delete-event").delete(verifyJWT, deleteEvent);
router.route("/event-image").patch(upload.single("eventImage"),verifyJWT, UpdateEventPhoto);
export default router;
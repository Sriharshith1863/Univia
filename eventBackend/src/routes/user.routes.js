import { Router } from "express";
import { currentUserDetails, loginUser, signUpUser, updateProfile } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/signUp").post(signUpUser);
router.route("/login").post(loginUser);
router.route("/profile").post(verifyJWT, updateProfile);
router.route("/user-details").get(verifyJWT, currentUserDetails);
export default router;
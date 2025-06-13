import { Router } from "express";
import { currentUserDetails, loginUser, logoutUser, refreshAccessToken, signUpUser, updateProfile, UpdateUserAvatar } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/signUp").post(signUpUser);
router.route("/login").post(loginUser);
router.route("/profile").post(verifyJWT, updateProfile);
router.route("/user-details").get(verifyJWT, currentUserDetails);
router.route("/update-avatar").post(upload.single("avatar"), verifyJWT, UpdateUserAvatar);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/logout-user").post(verifyJWT, logoutUser);
export default router;
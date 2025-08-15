import { Router } from "express";
import {
  loginUser,
  logoutUser,
  userRegister,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatarImage,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 }, // ✅ Handles avatar
    { name: "coverImage", maxCount: 1 }, // ✅ Handles coverImage
  ]),
  userRegister,
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails); //patch because post we update all details
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatarImage); // verifyjwt is to check useer is logged in or not then multer for uploading and then methid for updating image
router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile); // in this method we are taking data from url or param so we use get and we have already name param to username so we have to use username for url and /c/: are important where c can written any thing
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;

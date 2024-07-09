import { Router } from "express";
import { loginUser,
         logoutUser, 
         registerUser,
         refreshAccessToken,
         changeCurrentPassword,
         updateAccountDetails,
         updateUserAvatar,
         updateUserCoverImage, 
         getUserChannelProfile,
         getUserWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
      ]),
    registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, updateAccountDetails);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/change-avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar);

router.route("/change-coverImage").patch(verifyJWT,upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/history").get(verifyJWT, getUserWatchHistory)
export default router

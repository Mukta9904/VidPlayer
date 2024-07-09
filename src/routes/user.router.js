import { Router } from "express";
import { loginUser,
         logoutUser, 
         registerUser,
         refreshAccessToken,
         changeCurrentPassword,
         updateAccountDetails,
         updateUserAvatar,
         updateUserCoverImage } from "../controllers/user.controller.js";
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

router.route("/update-details").post(verifyJWT, updateAccountDetails);

router.route("/change-avatar").post(verifyJWT,upload.single([
    {
        name: "avatar",
        maxCount: 1
    }  ]), updateUserAvatar);

router.route("/change-coverImage").post(verifyJWT,upload.single([
        {
            name: "coverImage",
            maxCount: 1
        }  ]), updateUserCoverImage);


export default router

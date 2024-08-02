import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
   saveNote,
   editNote,
   deleteNote,
   getNote
} from "../controllers/note.controller.js"

const router  = Router();

router.use(verifyJWT);

router.route("/:videoId").get(getNote).post(saveNote).patch(editNote).delete(deleteNote);

export default router;
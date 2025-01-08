import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import {verifyJwt} from "../middlewares/verifyjwt.js";

const router = express.Router();

router.get("/:id", verifyJwt, getMessages);
router.post("/send/:id", verifyJwt, sendMessage);

export default router;

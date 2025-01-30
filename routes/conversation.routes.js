import express from "express";
import {verifyJwt} from "../middlewares/verifyjwt.js";
import { getUsersForSidebar } from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/", verifyJwt, getUsersForSidebar);

export default router;

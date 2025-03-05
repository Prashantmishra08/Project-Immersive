// import express from "express";
// import {verifyJwt} from "../middlewares/verifyjwt.js";
// import { getUsersForSidebar } from "../controllers/conversation.controller.js";

// const router = express.Router();

// router.get("/", verifyJwt, getUsersForSidebar);

// export default router;

import express from "express";
import { getUsersForSidebar } from "../controllers/conversation.controller.js";
import { verifyJwt } from "../middlewares/verifyjwt.js";

const router = express.Router();

// ✅ Fetch all conversations (Ensure JWT Middleware)
router.get("/", verifyJwt, getUsersForSidebar);

export default router;

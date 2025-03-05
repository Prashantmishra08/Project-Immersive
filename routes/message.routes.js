import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import {verifyJwt} from "../middlewares/verifyjwt.js";
import Message from "../models/message.model.js"

const router = express.Router();

router.get("/:id", verifyJwt, getMessages);
router.post("/send/:id", verifyJwt, sendMessage);
router.put("/:messageId", verifyJwt, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    // Check if message is empty or not
    if (!message) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { message },
      { new: true }  // This ensures the updated message is returned
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

router.delete("/:messageId", verifyJwt, async (req, res) => {
  try {
    const { messageId } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

  
  
export default router;

import express from "express";
import {
  getAllConversation,
  getAllConversationByUser,
  getAllFriend,
  getAllMessageByConversation,
} from "../controllers/ChatController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const ChatRouter = express.Router();

// Public routes
ChatRouter.get("/", getAllConversation);

// Protected routes - require authentication
ChatRouter.get("/allmessage/:id", protect, getAllMessageByConversation);
ChatRouter.get("/:id", protect, getAllConversationByUser);
ChatRouter.get("/friend/:id", protect, getAllFriend);

export default ChatRouter;

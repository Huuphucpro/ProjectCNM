import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    type: String,
    members: [
      {
        idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        unreadCount: { type: Number, default: 0 },
      },
    ],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    name: String,
  },
  {
    timestamps: true,
  }
);

export const ConversationModel = mongoose.model("Conversation", ConversationSchema);

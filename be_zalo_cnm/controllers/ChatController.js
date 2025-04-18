import { ConversationModel } from "../models/ConversationModel.js";
import { MessageModel } from "../models/MessageModel.js";
import mongoose from "mongoose";
import { UsersModel } from "../models/UserModel.js";

// Cache đơn giản cho dữ liệu hội thoại
// Key: userId-timestamp, Value: danh sách hội thoại
const conversationCache = new Map();
// Cache timeout: 10 giây
const CACHE_TIMEOUT = 10 * 1000;

// Cache đơn giản cho tin nhắn
// Key: conversationId-timestamp, Value: danh sách tin nhắn
const messageCache = new Map();

// Safe ID utility function to handle various ID formats
const safeId = (id) => {
  if (!id) return null;
  
  // If it's already a valid ObjectId, return it
  if (mongoose.Types.ObjectId.isValid(id)) {
    return id;
  }
  
  // If it's an object with _id property, use that
  if (id && typeof id === 'object' && id._id) {
    return safeId(id._id);
  }
  
  // If it's a string representation of an object or undefined
  if (typeof id === 'string' && (id.includes('[object Object]') || id === 'undefined')) {
    console.error('Invalid ID format received:', id);
    return null;
  }
  
  // Try converting to string as last resort
  try {
    const idStr = String(id);
    if (mongoose.Types.ObjectId.isValid(idStr)) {
      return idStr;
    }
  } catch (err) {
    console.error('Error converting ID to string:', err);
  }
  
  console.error('Invalid ID format:', id);
  return null;
};

export const createConversation = async (userFrom, userTo) => {
  // Validate IDs first
  const fromId = safeId(userFrom);
  const toId = safeId(userTo);
  
  if (!fromId || !toId) {
    console.error("Invalid user IDs for conversation:", { userFrom, userTo });
    throw new Error("Invalid user IDs for creating conversation");
  }
  
  console.log("Creating conversation between:", fromId, toId);
  
  const newConversation = new ConversationModel({
    type: "single",
    lastMessage: "",
    members: [],
  });
  
  newConversation.members.push({ idUser: fromId });
  newConversation.members.push({ idUser: toId });
  
  await newConversation.save();
  return newConversation;
};

export const joinConversation = async (id) => {
  try {
    const conversationId = safeId(id);
    if (!conversationId) {
      console.error("Invalid conversation ID:", id);
      return null;
    }
    
    const conversation = await ConversationModel.findById(conversationId);
    return conversation;
  } catch (error) {
    console.error("Error joining conversation:", error);
    return null;
  }
};

export const getAllConversation = async (req, res) => {
  try {
    const allConversation = await ConversationModel.find();
    res.send(allConversation);
  } catch (error) {
    console.error("Error getting all conversations:", error);
    res.status(500).send({ message: "Error fetching conversations" });
  }
};

export const getAllConversationByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching conversations for user:", userId);

    // Clear any existing timer with this label
    if (console.timers && console.timers['getAllConversationByUser']) {
      console.timeEnd('getAllConversationByUser');
    }
    
    console.time('getAllConversationByUser');
    
    // Kiểm tra cache
    const cacheKey = `${userId}-${Math.floor(Date.now() / CACHE_TIMEOUT)}`;
    if (conversationCache.has(cacheKey)) {
      console.log("Returning cached conversations for user:", userId);
      const cachedData = conversationCache.get(cacheKey);
      console.timeEnd('getAllConversationByUser');
      return res.send(cachedData);
    }
    
    console.log("Fetching conversations for user:", userId);
    
    // Chỉ lấy 20 cuộc hội thoại gần nhất và chỉ lấy các trường cần thiết
    const list = await ConversationModel.find({
      "members.idUser": userId
    }, {
      type: 1,
      lastMessage: 1,
      members: 1,
      updatedAt: 1
    })
      .populate({
        path: "members.idUser",
        select: { name: 1, avatar: 1 }, // Chỉ lấy tên và avatar
      })
      .populate("lastMessage", { message: 1, sender: 1, seen: 1, createdAt: 1 }) // Chỉ lấy các trường cần thiết
      .sort({ updatedAt: -1 })
      .limit(20) // Giới hạn 20 cuộc hội thoại
      .lean(); // Sử dụng lean() để tối ưu hóa

    // Lưu vào cache
    conversationCache.set(cacheKey, list);
    
    console.timeEnd('getAllConversationByUser');
    res.send(list);
  } catch (error) {
    console.error("Error in getAllConversationByUser:", error);
    res.status(500).send({ message: "Error fetching conversations" });
  }
};

export const saveMessage = async (data) => {
  try {
    // Validate conversation ID
    const conversationId = safeId(data.idConversation);
    const senderId = safeId(data.sender);
    
    if (!conversationId || !senderId) {
      console.error("Invalid IDs for saveMessage:", { 
        conversation: data.idConversation,
        sender: data.sender 
      });
      throw new Error("Invalid IDs for saving message");
    }
    
    const message = new MessageModel({
      idConversation: conversationId,
      sender: senderId,
      message: data.message,
      seen: false,
    });
    
    await message.save();
    
    // Cập nhật số lượng tin nhắn chưa đọc cho các thành viên trong cuộc hội thoại
    const conversation = await ConversationModel.findById(conversationId);
    if (conversation) {
      // Tăng unreadCount cho tất cả thành viên trừ người gửi
      for (let i = 0; i < conversation.members.length; i++) {
        if (conversation.members[i].idUser.toString() !== senderId.toString()) {
          // Tăng unreadCount trong conversation
          if (!conversation.members[i].unreadCount) {
            conversation.members[i].unreadCount = 0;
          }
          conversation.members[i].unreadCount += 1;
          
          // Tăng unreadMessages trong user
          await UsersModel.findByIdAndUpdate(
            conversation.members[i].idUser,
            { $inc: { unreadMessages: 1 } }
          );
        }
      }
      await conversation.save();
    }
    
    // Xóa cache để đảm bảo dữ liệu mới được hiển thị
    clearMessageCache(conversationId);
    // Cũng xóa cache hội thoại vì trường lastMessage sẽ thay đổi
    clearConversationCache(senderId);
    
    return message;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const updateLastMesssage = async ({ idConversation, message }) => {
  try {
    const conversationId = safeId(idConversation);
    if (!conversationId) {
      console.error("Invalid conversation ID for updateLastMessage:", idConversation);
      throw new Error("Invalid conversation ID");
    }
    
    console.log("Updating last message for conversation:", conversationId);
    
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      console.error("Conversation not found:", conversationId);
      throw new Error("Conversation not found");
    }
    
    conversation.lastMessage = message;
    await conversation.save();
    
    // Xóa cache hội thoại cho tất cả thành viên
    if (conversation.members && conversation.members.length > 0) {
      conversation.members.forEach(member => {
        if (member.idUser) {
          clearConversationCache(safeId(member.idUser));
        }
      });
    }
  } catch (error) {
    console.error("Error updating last message:", error);
    throw error;
  }
};

export const getAllMessageByConversation = async (req, res) => {
  try {
    console.time('getAllMessageByConversation');
    const conversationId = safeId(req.params.id);
    if (!conversationId) {
      console.error("Invalid conversation ID for getAllMessageByConversation:", req.params.id);
      return res.status(400).send({ message: "Invalid conversation ID" });
    }
    
    // Kiểm tra cache
    const cacheKey = `${conversationId}-${Math.floor(Date.now() / CACHE_TIMEOUT)}`;
    if (messageCache.has(cacheKey)) {
      console.log("Returning cached messages for conversation:", conversationId);
      const cachedData = messageCache.get(cacheKey);
      console.timeEnd('getAllMessageByConversation');
      return res.send(cachedData);
    }
    
    // Chỉ lấy 50 tin nhắn gần nhất và chỉ lấy các trường cần thiết
    const allMessage = await MessageModel.find(
      { idConversation: conversationId },
      { message: 1, sender: 1, seen: 1, createdAt: 1 }
    )
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

    // Kết quả tin nhắn đã đảo ngược (cũ nhất trước)
    const result = allMessage.reverse();
    
    // Lưu vào cache
    messageCache.set(cacheKey, result);

    console.timeEnd('getAllMessageByConversation');
    res.send(result);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).send({ message: "Error fetching messages" });
  }
};

export const chat = async (id) => {
  try {
    const conversationId = safeId(id);
    if (!conversationId) {
      console.error("Invalid conversation ID for chat:", id);
      throw new Error("Invalid conversation ID");
    }
    
    let conversation = await ConversationModel.findById(conversationId);
    return conversation;
  } catch (error) {
    console.error("Error in chat function:", error);
    throw error;
  }
};

export const getAllFriend = async (req, res) => {
  try {
    const conversationId = safeId(req.params.id);
    if (!conversationId) {
      console.error("Invalid conversation ID for getAllFriend:", req.params.id);
      return res.status(400).send({ message: "Invalid conversation ID" });
    }
    
    console.log("Getting friends for conversation:", conversationId);
    
    const data = await ConversationModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(conversationId) } }
    ]);
    
    res.send(data);
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).send({ message: "Error fetching friends" });
  }
};

export const seenMessage = async (idConversation, userId) => {
  try {
    const conversationId = safeId(idConversation);
    const user = safeId(userId);
    
    if (!conversationId) {
      console.error("Invalid conversation ID for seenMessage:", idConversation);
      throw new Error("Invalid conversation ID");
    }
    
    if (!user) {
      console.error("Invalid user ID for seenMessage:", userId);
      throw new Error("Invalid user ID");
    }
    
    // Đánh dấu tất cả tin nhắn là đã xem
    await MessageModel.updateMany(
      { 
        idConversation: conversationId,
        sender: { $ne: user } // Chỉ đánh dấu tin nhắn không phải của người dùng hiện tại
      },
      { seen: true }
    );
    
    // Đặt lại số lượng tin nhắn chưa đọc cho người dùng trong cuộc hội thoại
    const conversation = await ConversationModel.findById(conversationId);
    if (conversation) {
      // Tìm thành viên trong cuộc hội thoại
      const memberIndex = conversation.members.findIndex(
        member => member.idUser.toString() === user.toString()
      );
      
      if (memberIndex !== -1) {
        // Đặt lại unreadCount
        conversation.members[memberIndex].unreadCount = 0;
        await conversation.save();
        
        // Cập nhật số tin nhắn chưa đọc trong user model
        await UsersModel.findByIdAndUpdate(
          user,
          { $inc: { unreadMessages: -conversation.members[memberIndex].unreadCount } }
        );
        
        // Xóa cache để đảm bảo dữ liệu mới được hiển thị
        clearMessageCache(conversationId);
        clearConversationCache(user);
      }
    }
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    throw error;
  }
};

// Thêm hàm để xóa cache khi có tin nhắn mới
export const clearConversationCache = (userId) => {
  // Xóa tất cả cache có chứa userId
  for (const key of conversationCache.keys()) {
    if (key.startsWith(userId)) {
      conversationCache.delete(key);
    }
  }
};

export const clearMessageCache = (conversationId) => {
  // Xóa tất cả cache có chứa conversationId
  for (const key of messageCache.keys()) {
    if (key.startsWith(conversationId)) {
      messageCache.delete(key);
    }
  }
};

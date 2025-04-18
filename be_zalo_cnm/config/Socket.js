import { Server } from "socket.io";
import {
  createConversation,
  joinConversation,
  saveMessage,
  seenMessage,
  updateLastMesssage,
} from "../controllers/ChatController.js";
import {
  acceptFriend,
  addFriend,
  deleteRequestFriend,
  DontAcceptFriend,
  unFriend,
} from "../controllers/UserController.js";

export const ConnectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001", "https://6501cc7e10f85c0986f66a74--shiny-klepon-f022e3.netlify.app"],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  // Store io instance in global for use in controllers
  global.io = io;

  io.on("connection", (socket) => {
    // Tắt log
    // console.log(`${socket.id} connected`);

    // --------------- ADD FRIEND
    socket.on("join_room", (User) => {
      if (!User || !User._id) {
        // Chỉ log lỗi, không log thông tin thông thường
        console.error("Invalid user data for join_room:", User);
        return;
      }
      // Tắt log
      // console.log("User joined room:", User._id);
      socket.join(User._id);
    });

    socket.on("add_friend", async (data) => {
      try {
        const { userFrom, userTo } = data;
        if (!userFrom || !userTo) {
          console.error("Invalid data for add_friend:", data);
          return;
        }
        // Tắt log
        // console.log("Adding friend:", userFrom, userTo);
        await addFriend(userFrom, userTo);

        io.emit("add_friend_success");
        io.to(userTo).emit("new_request_friend", userTo);
      } catch (error) {
        console.error("Error in add_friend socket handler:", error);
      }
    });

    socket.on("delete_request_friend", async (data) => {
      try {
        const { userFrom, userTo } = data;
        if (!userFrom || !userTo) {
          console.error("Invalid data for delete_request_friend:", data);
          return;
        }
        // Tắt log
        // console.log("Deleting friend request:", userFrom, userTo);
        await deleteRequestFriend(userFrom, userTo);
        
        io.emit("delete_request_friend_success");
        io.to(userTo).emit("person_delete_request_friend", userTo);
      } catch (error) {
        console.error("Error in delete_request_friend socket handler:", error);
      }
    });

    socket.on("accept_request_friend", async (data) => {
      try {
        const { userFrom, userTo } = data;
        if (!userFrom || !userTo) {
          console.error("Invalid data for accept_request_friend:", data);
          return;
        }
        // Tắt log
        // console.log("Accepting friend request:", userFrom, userTo);
        await acceptFriend(userFrom, userTo);

        io.emit("accept_request_friend_success", userFrom);
        io.to(userTo).emit("accept_request_friend", userTo);
      } catch (error) {
        console.error("Error in accept_request_friend socket handler:", error);
      }
    });

    socket.on("dont_accept_request_friend", async (data) => {
      try {
        const { userFrom, userTo } = data;
        if (!userFrom || !userTo) {
          console.error("Invalid data for dont_accept_request_friend:", data);
          return;
        }
        // Tắt log
        // console.log("Rejecting friend request:", userFrom, userTo);
        await DontAcceptFriend(userFrom, userTo);

        io.emit("dont_accept_request_friend_success", userFrom);
        io.to(userTo).emit("dont_accept_request_friend", userTo);
      } catch (error) {
        console.error("Error in dont_accept_request_friend socket handler:", error);
      }
    });

    socket.on("un_friend", async (data) => {
      try {
        const { userFrom, userTo, idConversation } = data;
        if (!userFrom || !userTo) {
          console.error("Invalid data for un_friend:", data);
          return;
        }
        // Tắt log
        // console.log("Unfriending:", userFrom, userTo, idConversation);
        await unFriend(userFrom, userTo, idConversation);

        io.emit("un_friend_success", userFrom);
        io.to(userTo).emit("un_friend", userTo);
      } catch (error) {
        console.error("Error in un_friend socket handler:", error);
      }
    });

    // --------------- CHAT
    socket.on("join_conversation", (idConversation) => {
      if (!idConversation) {
        console.error("Invalid conversation ID for join_conversation");
        return;
      }
      // Tắt log
      // console.log("Joining conversation:", idConversation);
      socket.join(idConversation);
    });
    
    socket.on("join_all_conversation", (array) => {
      if (!array || !Array.isArray(array)) {
        console.error("Invalid array for join_all_conversation:", array);
        return;
      }
      
      if (array.length === 0) {
        console.log("No conversations to join");
        return;
      }
      
      // Lọc ra các ID hợp lệ để tránh lỗi
      const validIds = array.filter(id => id && typeof id === 'string' && id.trim() !== '');
      
      if (validIds.length === 0) {
        console.log("No valid conversation IDs to join");
        return;
      }
      
      // Tắt log
      // console.log("Joining all conversations:", validIds);
      validIds.forEach(id => {
        socket.join(id);
      });
    });
    
    socket.on("seen_message", async (data) => {
      try {
        if (!data || !data.idConversation || !data.userId) {
          console.error("Invalid data for seen_message:", data);
          return;
        }
        // Tắt log
        // console.log("Seen message:", idConversation);
        await seenMessage(data.idConversation, data.userId);
        
        // Emit cho tất cả client trong conversation
        io.to(data.idConversation).emit("seen_message");
        
        // Emit cho tất cả client để cập nhật UI
        io.emit("conversation_updated");
      } catch (error) {
        console.error("Error in seen_message socket handler:", error);
      }
    });
    
    socket.on("send_message", async (data) => {
      try {
        if (!data || !data.idConversation) {
          console.error("Invalid data for send_message:", data);
          return;
        }
        const newMessage = await saveMessage(data);
        await updateLastMesssage({
          idConversation: newMessage.idConversation,
          message: newMessage._id,
        });

        io.to(newMessage.idConversation.toString()).emit(
          "new_message",
          newMessage
        );
      } catch (error) {
        console.error("Error in send_message socket handler:", error);
      }
    });
  });
};

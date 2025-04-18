import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants/ApiConstant';
import { SOCKET_EVENTS } from '../constants/ApiConstant';

// Socket instance
let socket: any = null;
// Track connection attempts
let connectionAttempts = 0;
// Max reconnection attempts
const MAX_RECONNECTION_ATTEMPTS = 5;
// Connection status
let isConnecting = false;

/**
 * Connect to the Socket.IO server
 * @param user The current user object
 * @param callback Function to call when connection is successful
 */
export const connectSocket = async (user: any, callback: () => void) => {
  try {
    // Don't try to connect if already connecting
    if (isConnecting) {
      console.log('Socket connection already in progress');
      return;
    }

    // Don't reconnect if we're already connected
    if (socket && socket.connected) {
      console.log('Socket already connected:', socket.id);
      if (callback) callback();
      return;
    }

    isConnecting = true;
    
    const token = await AsyncStorage.getItem('token');
    
    if (!token || !user || !user._id) {
      console.error('Cannot connect socket: missing token or user data');
      isConnecting = false;
      return;
    }
    
    // Clean up any existing socket
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    
    // Create new socket connection
    socket = io(BASE_URL, {
      auth: {
        token: JSON.parse(token || '""'),
      },
      query: {
        userId: user._id,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
      reconnectionDelay: 1000,
      timeout: 10000 // 10 second timeout
    });
    
    // Reset connection attempts counter
    connectionAttempts = 0;
    
    // Thiết lập các sự kiện socket
    setupSocketEvents();
    
    // Connection events
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Socket connected: ' + socket.id);
      isConnecting = false;
      connectionAttempts = 0;
      
      // Emit join room event for the user
      socket.emit('join_room', user);
      
      if (callback) callback();
    });
    
    socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      isConnecting = false;
      connectionAttempts++;
      
      // If we've exceeded max attempts, don't try again automatically
      if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
        console.error('Max reconnection attempts reached');
      }
    });
    
    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      isConnecting = false;
    });
    
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason: string) => {
      console.log('Socket disconnected:', reason);
      isConnecting = false;
      
      // If server closed the connection, try to reconnect
      if (reason === 'io server disconnect') {
        // Socket was disconnected by the server and needs manual reconnection
        setTimeout(() => {
          if (user && socket) {
            socket.connect();
          }
        }, 1000);
      }
    });
  } catch (error) {
    console.error('Error connecting socket:', error);
    isConnecting = false;
  }
};

/**
 * Setup all the socket event listeners
 */
const setupSocketEvents = () => {
  if (!socket) return;
  
  // Clear any existing listeners to prevent duplicates
  socket.off(SOCKET_EVENTS.NEW_MESSAGE);
  socket.off(SOCKET_EVENTS.TYPING);
  socket.off(SOCKET_EVENTS.STOP_TYPING);
  socket.off('new_request_friend');
  socket.off('accept_request_friend');
  socket.off('seen_message');
  
  // Xử lý sự kiện nhận tin nhắn mới
  socket.on(SOCKET_EVENTS.NEW_MESSAGE, (data: any) => {
    console.log('New message received:', data);
  });
  
  // Xử lý sự kiện người dùng đang nhập
  socket.on(SOCKET_EVENTS.TYPING, (data: any) => {
    console.log('User is typing:', data);
  });
  
  // Xử lý sự kiện người dùng dừng nhập
  socket.on(SOCKET_EVENTS.STOP_TYPING, (data: any) => {
    console.log('User stopped typing:', data);
  });
  
  // Xử lý sự kiện có yêu cầu kết bạn mới
  socket.on('new_request_friend', (data: any) => {
    console.log('New friend request received:', data);
  });
  
  // Xử lý sự kiện chấp nhận kết bạn
  socket.on('accept_request_friend', (data: any) => {
    console.log('Friend request accepted:', data);
  });
  
  // Xử lý sự kiện tin nhắn đã xem
  socket.on('seen_message', (data: any) => {
    console.log('Message seen:', data);
  });
};

/**
 * Get the socket instance
 * @returns The socket instance or null if not connected
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnecting = false;
    console.log('Socket disconnected');
  }
};

/**
 * Check if the socket is connected
 * @returns True if connected, false otherwise
 */
export const isSocketConnected = () => {
  return socket && socket.connected;
};

/**
 * Join a conversation
 * @param conversationId Conversation ID to join
 * @param userId User ID
 */
export const joinConversation = (conversationId: string, userId: string) => {
  if (socket && socket.connected) {
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { 
      idConversation: conversationId, 
      idUser: userId 
    });
  } else {
    console.warn('Cannot join conversation: socket not connected');
  }
};

/**
 * Leave a conversation
 * @param conversationId Conversation ID to leave
 * @param userId User ID
 */
export const leaveConversation = (conversationId: string, userId: string) => {
  if (socket && socket.connected) {
    socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { 
      idConversation: conversationId, 
      idUser: userId 
    });
  }
};

/**
 * Send typing status
 * @param conversationId Conversation ID
 * @param userId User ID
 */
export const sendTypingStatus = (conversationId: string, userId: string) => {
  if (socket && socket.connected) {
    socket.emit(SOCKET_EVENTS.TYPING, { 
      idConversation: conversationId, 
      idUser: userId 
    });
  }
};

/**
 * Send stop typing status
 * @param conversationId Conversation ID
 * @param userId User ID
 */
export const sendStopTypingStatus = (conversationId: string, userId: string) => {
  if (socket && socket.connected) {
    socket.emit(SOCKET_EVENTS.STOP_TYPING, { 
      idConversation: conversationId, 
      idUser: userId 
    });
  }
};

/**
 * Mark message as seen
 * @param conversationId Conversation ID
 * @param userId User ID
 */
export const markMessageSeen = (conversationId: string, userId: string) => {
  if (socket && socket.connected) {
    socket.emit('seen_message', { 
      idConversation: conversationId, 
      userId: userId 
    });
  }
};

// Export socket utility functions
export default {
  connectSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected,
  joinConversation,
  leaveConversation,
  sendTypingStatus,
  sendStopTypingStatus,
  markMessageSeen
};
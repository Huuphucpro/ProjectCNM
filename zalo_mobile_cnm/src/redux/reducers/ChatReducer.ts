import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  FETCH_CONVERSATIONS_FAILURE,
  FETCH_MESSAGES_REQUEST,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  NEW_MESSAGE_RECEIVED
} from '../constants';

interface ChatState {
  conversations: any[];
  currentConversation: any | null;
  messages: any[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  error: null
};

const chatReducer = (state = initialState, action: any): ChatState => {
  switch (action.type) {
    // Conversations
    case FETCH_CONVERSATIONS_REQUEST:
      return {
        ...state,
        isLoadingConversations: true,
        error: null
      };
    
    case FETCH_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        conversations: action.payload,
        isLoadingConversations: false,
        error: null
      };
    
    case FETCH_CONVERSATIONS_FAILURE:
      return {
        ...state,
        isLoadingConversations: false,
        error: action.payload
      };
    
    // Messages
    case FETCH_MESSAGES_REQUEST:
      return {
        ...state,
        isLoadingMessages: true,
        error: null
      };
    
    case FETCH_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload,
        isLoadingMessages: false,
        error: null
      };
    
    case FETCH_MESSAGES_FAILURE:
      return {
        ...state,
        isLoadingMessages: false,
        error: action.payload
      };
    
    // Send message
    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        isSendingMessage: true,
        error: null
      };
    
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isSendingMessage: false,
        error: null
      };
    
    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        isSendingMessage: false,
        error: action.payload
      };
    
    // New message received
    case NEW_MESSAGE_RECEIVED:
      // Cập nhật messages nếu đang ở trong cuộc trò chuyện tương ứng
      if (state.currentConversation && 
          action.payload.conversationId === state.currentConversation.id) {
        return {
          ...state,
          messages: [...state.messages, action.payload.message]
        };
      }
      
      // Cập nhật conversations để hiển thị tin nhắn mới nhất và đánh dấu unread
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === action.payload.conversationId) {
          return {
            ...conv,
            lastMessage: action.payload.message,
            unreadCount: conv.unreadCount + 1
          };
        }
        return conv;
      });
      
      return {
        ...state,
        conversations: updatedConversations
      };
    
    default:
      return state;
  }
};

export default chatReducer;
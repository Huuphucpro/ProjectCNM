// API Environment Configuration
export const API_ENV = {
  // DEV: 'http://192.168.1.216:4000', //Mạng ở nhà S8 TX13 (LAN)
  DEV: 'http://192.168.1.192:4000', //Mạng ở nhà S8 TX13 (wifi)
  // DEV: 'http://192.168.1.216:4000', //Mạng linh tinh
  STAGING: 'https://api-staging.zalo-app.com',
  PRODUCTION: 'https://api.zalo-app.com'
};

// Set current environment - can be changed based on build configuration
export const CURRENT_ENV = 'DEV'; // Options: 'DEV', 'STAGING', 'PRODUCTION'

// Base URL based on environment
export const BASE_URL = API_ENV[CURRENT_ENV as keyof typeof API_ENV];

// API Timeout (in milliseconds)
export const API_TIMEOUT = 15000; // Increased from 15000 for development

// Error Messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
  TIMEOUT: 'Yêu cầu đã hết thời gian. Vui lòng thử lại sau.',
  SERVER_ERROR: 'Đã xảy ra lỗi từ máy chủ. Vui lòng thử lại sau.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập nội dung này.',
  NOT_FOUND: 'Không tìm thấy tài nguyên yêu cầu.',
  DEFAULT: 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
};

// User API endpoints - Modified to match actual backend structure
export const USER_API = {
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  GET_ME: '/user/me',
  SEARCH_USER: '/user/search',
  UPDATE_USER: '/user/update',
  UPDATE_AVATAR: '/user/avatar',
  UPDATE_PASSWORD: '/user/change-password',
  GET_FRIENDS: '/friend/get-all-friend',
  SEND_FRIEND_REQUEST: '/friend/send-friend-request',
  ACCEPT_FRIEND_REQUEST: '/friend/accept-friend-request',
  DECLINE_FRIEND_REQUEST: '/friend/decline-friend-request',
  GET_FRIEND_REQUESTS: '/friend/get-friend-requests',
  FORGOT_PASSWORD: '/user/forgot-pass',
  RESET_PASSWORD: '/user/reset-password',
  VERIFY_OTP: '/user/verify-otp',
  RESEND_OTP: '/user/resend-otp',
  REFRESH_TOKEN: '/user/refresh-token',
};

// Chat API endpoints - Modified to match actual backend structure
export const CHAT_API = {
  GET_CONVERSATIONS: '/conversation/get-conversation-by-user',
  GET_MESSAGES: '/message/get-by-conversation',
  SEND_MESSAGE: '/message/send',
  CREATE_CONVERSATION: '/conversation/create',
  CREATE_GROUP: '/conversation/create-group',
  ADD_MEMBER: '/conversation/add-member',
  REMOVE_MEMBER: '/conversation/remove-member',
  LEAVE_GROUP: '/conversation/leave-group',
  RENAME_GROUP: '/conversation/rename-group',
  UPLOAD_IMAGE: '/message/upload-image',
  MARK_AS_READ: '/message/mark-as-read',
};

// Socket events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  NEW_MESSAGE: 'new_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  NEW_FRIEND_REQUEST: 'new_friend_request',
  ACCEPT_FRIEND_REQUEST: 'accept_friend_request',
  ONLINE_STATUS: 'online_status',
  MESSAGE_SEEN: 'message_seen',
  NEW_GROUP: 'new_group',
  GROUP_UPDATED: 'group_updated',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
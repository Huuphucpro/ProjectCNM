// Authentication
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGOUT = 'LOGOUT';

// Profile
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

// Password Reset
export const REQUEST_PASSWORD_RESET = 'REQUEST_PASSWORD_RESET';
export const RESEND_OTP = 'RESEND_OTP';
export const VERIFY_OTP = 'VERIFY_OTP';
export const RESET_PASSWORD = 'RESET_PASSWORD';

// Chat
export const FETCH_CONVERSATIONS_REQUEST = 'FETCH_CONVERSATIONS_REQUEST';
export const FETCH_CONVERSATIONS_SUCCESS = 'FETCH_CONVERSATIONS_SUCCESS';
export const FETCH_CONVERSATIONS_FAILURE = 'FETCH_CONVERSATIONS_FAILURE';

export const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';

export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const NEW_MESSAGE_RECEIVED = 'NEW_MESSAGE_RECEIVED';

// Contacts
export const FETCH_CONTACTS_REQUEST = 'FETCH_CONTACTS_REQUEST';
export const FETCH_CONTACTS_SUCCESS = 'FETCH_CONTACTS_SUCCESS';
export const FETCH_CONTACTS_FAILURE = 'FETCH_CONTACTS_FAILURE';

export const SEARCH_USERS_REQUEST = 'SEARCH_USERS_REQUEST';
export const SEARCH_USERS_SUCCESS = 'SEARCH_USERS_SUCCESS';
export const SEARCH_USERS_FAILURE = 'SEARCH_USERS_FAILURE';

export const SEND_FRIEND_REQUEST = 'SEND_FRIEND_REQUEST';
export const ACCEPT_FRIEND_REQUEST = 'ACCEPT_FRIEND_REQUEST';
export const REJECT_FRIEND_REQUEST = 'REJECT_FRIEND_REQUEST';

export const FETCH_FRIEND_REQUESTS_REQUEST = 'FETCH_FRIEND_REQUESTS_REQUEST';
export const FETCH_FRIEND_REQUESTS_SUCCESS = 'FETCH_FRIEND_REQUESTS_SUCCESS';
export const FETCH_FRIEND_REQUESTS_FAILURE = 'FETCH_FRIEND_REQUESTS_FAILURE';

// Realtime
export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';

// Loading state action types
export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';
export const SET_LOADING_MESSAGE = 'SET_LOADING_MESSAGE'; 
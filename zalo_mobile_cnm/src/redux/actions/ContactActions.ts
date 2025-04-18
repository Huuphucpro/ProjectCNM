import {
  FETCH_CONTACTS_REQUEST,
  FETCH_CONTACTS_SUCCESS,
  FETCH_CONTACTS_FAILURE,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAILURE,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  FETCH_FRIEND_REQUESTS_REQUEST,
  FETCH_FRIEND_REQUESTS_SUCCESS,
  FETCH_FRIEND_REQUESTS_FAILURE
} from '../constants';

// Fetch contacts
export const fetchContacts = () => ({
  type: FETCH_CONTACTS_REQUEST
});

export const fetchContactsSuccess = (contacts: any[]) => ({
  type: FETCH_CONTACTS_SUCCESS,
  payload: contacts
});

export const fetchContactsFailure = (error: string) => ({
  type: FETCH_CONTACTS_FAILURE,
  payload: error
});

// Search users
export const searchUsers = (keyword: string) => ({
  type: SEARCH_USERS_REQUEST,
  payload: { keyword }
});

export const searchUsersSuccess = (users: any[]) => ({
  type: SEARCH_USERS_SUCCESS,
  payload: users
});

export const searchUsersFailure = (error: string) => ({
  type: SEARCH_USERS_FAILURE,
  payload: error
});

// Friend requests
export const sendFriendRequest = (userId: string) => ({
  type: SEND_FRIEND_REQUEST,
  payload: { userId }
});

export const acceptFriendRequest = (requestId: string) => ({
  type: ACCEPT_FRIEND_REQUEST,
  payload: { requestId }
});

export const rejectFriendRequest = (requestId: string) => ({
  type: REJECT_FRIEND_REQUEST,
  payload: { requestId }
});

export const fetchFriendRequests = () => ({
  type: FETCH_FRIEND_REQUESTS_REQUEST
});

export const fetchFriendRequestsSuccess = (requests: any[]) => ({
  type: FETCH_FRIEND_REQUESTS_SUCCESS,
  payload: requests
});

export const fetchFriendRequestsFailure = (error: string) => ({
  type: FETCH_FRIEND_REQUESTS_FAILURE,
  payload: error
}); 
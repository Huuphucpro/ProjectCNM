import {
  FETCH_CONTACTS_REQUEST,
  FETCH_CONTACTS_SUCCESS,
  FETCH_CONTACTS_FAILURE,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAILURE,
  FETCH_FRIEND_REQUESTS_REQUEST,
  FETCH_FRIEND_REQUESTS_SUCCESS,
  FETCH_FRIEND_REQUESTS_FAILURE
} from '../constants';

type ContactState = {
  contacts: any[];
  searchResults: any[];
  friendRequests: any[];
  isLoading: boolean;
  error: string | null;
  isSearching: boolean;
  searchError: string | null;
  isLoadingFriendRequests: boolean;
  friendRequestsError: string | null;
};

const initialState: ContactState = {
  contacts: [],
  searchResults: [],
  friendRequests: [],
  isLoading: false,
  error: null,
  isSearching: false,
  searchError: null,
  isLoadingFriendRequests: false,
  friendRequestsError: null
};

const contactReducer = (state = initialState, action: any): ContactState => {
  switch (action.type) {
    // Contacts
    case FETCH_CONTACTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case FETCH_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: action.payload,
        isLoading: false,
        error: null
      };
    
    case FETCH_CONTACTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    
    // Search users
    case SEARCH_USERS_REQUEST:
      return {
        ...state,
        isSearching: true,
        searchError: null
      };
    
    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        isSearching: false,
        searchError: null
      };
    
    case SEARCH_USERS_FAILURE:
      return {
        ...state,
        isSearching: false,
        searchError: action.payload
      };
    
    // Friend requests
    case FETCH_FRIEND_REQUESTS_REQUEST:
      return {
        ...state,
        isLoadingFriendRequests: true,
        friendRequestsError: null
      };
    
    case FETCH_FRIEND_REQUESTS_SUCCESS:
      return {
        ...state,
        friendRequests: action.payload,
        isLoadingFriendRequests: false,
        friendRequestsError: null
      };
    
    case FETCH_FRIEND_REQUESTS_FAILURE:
      return {
        ...state,
        isLoadingFriendRequests: false,
        friendRequestsError: action.payload
      };
    
    default:
      return state;
  }
};

export default contactReducer; 
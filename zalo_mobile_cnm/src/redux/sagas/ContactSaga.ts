import { takeLatest, put, call, all } from 'redux-saga/effects';
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
import UserApi from '../../api/UserApi';
import { API_ERRORS } from '../../constants/ApiConstant';

// Define Action type
interface Action {
  type: string;
  payload: any;
}

// Define custom error interface for our API responses
interface ApiError {
  message: string;
  status?: number;
  data?: any;
  logout?: boolean;
}

// Worker Sagas
function* fetchContactsSaga(): Generator<any, void, any> {
  try {
    // We'll need to get the current user's ID from the state or storage
    // For now, we'll use a placeholder
    const userId = yield call(getCurrentUserId);
    const response = yield call(UserApi.getAllFriends, userId);
    
    yield put({ 
      type: FETCH_CONTACTS_SUCCESS, 
      payload: response || [] 
    });
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put({ 
      type: FETCH_CONTACTS_FAILURE, 
      payload: err.message || API_ERRORS.DEFAULT
    });
  }
}

// Helper function to get current user ID
function* getCurrentUserId(): Generator<any, string, any> {
  // This should be implemented to get the user ID from redux state
  // For now we'll return a placeholder
  return "current_user_id";
}

function* searchUsersSaga(action: Action): Generator<any, void, any> {
  try {
    const { keyword } = action.payload;
    const userId = yield call(getCurrentUserId);
    
    // Our updated API requires both query and userId parameters
    const response = yield call(UserApi.searchUsers, keyword, userId);
    
    yield put({ 
      type: SEARCH_USERS_SUCCESS, 
      payload: response || [] 
    });
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put({ 
      type: SEARCH_USERS_FAILURE, 
      payload: err.message || API_ERRORS.DEFAULT
    });
  }
}

function* sendFriendRequestSaga(action: Action): Generator<any, void, any> {
  try {
    const { userId } = action.payload;
    yield call(UserApi.sendFriendRequest, userId);
    
    // Refresh contacts after sending request
    yield call(fetchContactsSaga);
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error('Gửi yêu cầu kết bạn thất bại:', err.message || API_ERRORS.DEFAULT);
  }
}

function* acceptFriendRequestSaga(action: Action): Generator<any, void, any> {
  try {
    const { requestId } = action.payload;
    yield call(UserApi.acceptFriendRequest, requestId);
    
    // Refresh contacts after accepting request
    yield call(fetchContactsSaga);
    // Refresh friend requests
    yield call(fetchFriendRequestsSaga);
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error('Chấp nhận yêu cầu kết bạn thất bại:', err.message || API_ERRORS.DEFAULT);
  }
}

function* rejectFriendRequestSaga(action: Action): Generator<any, void, any> {
  try {
    const { requestId } = action.payload;
    // Updated method name to match the API
    yield call(UserApi.declineFriendRequest, requestId);
    
    // Refresh friend requests after rejecting
    yield call(fetchFriendRequestsSaga);
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error('Từ chối yêu cầu kết bạn thất bại:', err.message || API_ERRORS.DEFAULT);
  }
}

function* fetchFriendRequestsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(UserApi.getFriendRequests);
    
    yield put({ 
      type: FETCH_FRIEND_REQUESTS_SUCCESS, 
      payload: response || [] 
    });
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put({ 
      type: FETCH_FRIEND_REQUESTS_FAILURE, 
      payload: err.message || API_ERRORS.DEFAULT
    });
  }
}

// Watcher Saga
export default function* contactSaga() {
  yield all([
    takeLatest(FETCH_CONTACTS_REQUEST, fetchContactsSaga),
    takeLatest(SEARCH_USERS_REQUEST, searchUsersSaga),
    takeLatest(SEND_FRIEND_REQUEST, sendFriendRequestSaga),
    takeLatest(ACCEPT_FRIEND_REQUEST, acceptFriendRequestSaga),
    takeLatest(REJECT_FRIEND_REQUEST, rejectFriendRequestSaga),
    takeLatest(FETCH_FRIEND_REQUESTS_REQUEST, fetchFriendRequestsSaga)
  ]);
} 
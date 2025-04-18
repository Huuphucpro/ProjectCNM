import { put, call, takeLatest, takeEvery } from "redux-saga/effects";
import {
  checkOtp,
  getAllFriendByUser,
  getAllPeopleRequestByUser,
  getEmail,
  getNewToken,
  getUserById,
  login,
  register,
  searchUser,
  updateAvatar,
  updatePassword,
  updateUser,
} from "../../api/UserApi";
import { UserConstant } from "../../constants/UserConstant";
import { Actions, User, Message, Tokens, Friend, listFriend } from "../../types/UserType";
import type { Error } from "../../types/UserType";
import { AvatarResponse } from '../../types/User';
import {
  checkOtpFailure,
  checkOtpSuccess,
  getAllFriendFailure,
  getAllFriendSuccess,
  getAllPeopleRequestFailure,
  getAllPeopleRequestSuccess,
  getEmailFailure,
  getEmailSuccess,
  getNewTokenFailure,
  getNewTokenSuccess,
  getUserByIdFailure,
  getUserByIdRequest,
  getUserByIdSuccess,
  loginUserFailure,
  loginUserSuccess,
  registerUserFailure,
  registerUserSuccess,
  searchUserFailure,
  searchUserSuccess,
  updateAvatarFailure,
  updateAvatarSuccess,
  updatePasswordFailure,
  updatePasswordSuccess,
  updateUserFailure,
  updateUserSuccess,
} from "../actions/UserAction";

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function* LoginSaga(action: Actions) {
  try {
    const user: User = yield call(login, action.payload);
    localStorage.setItem("token", JSON.stringify(user.token));
    localStorage.setItem("refeshToken", JSON.stringify(user.refeshToken));
    yield put(loginUserSuccess(user));
    action.callback()
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorObj: Error = {
      error: err.response?.data?.message || "Login failed"
    };
    yield put(loginUserFailure(errorObj));
  }
}

function* RegisterSaga(action: Actions) {
  try {
    const user: User = yield call(register, action.payload);
    localStorage.setItem("refeshToken", JSON.stringify(user.refeshToken));
    yield put(registerUserSuccess(user));
    action.callback()
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorObj: Error = {
      error: err.response?.data?.message || "Registration failed"
    };
    yield put(registerUserFailure(errorObj));
  }
}

function* GetEmailSaga(action: Actions){
  try {
    const result: Message = yield call(getEmail, action.payload);
    yield put(getEmailSuccess(result));
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorObj: Error = {
      error: err.response?.data?.message || "Failed to get email"
    };
    yield put(getEmailFailure(errorObj));
  }
}

function* CheckOtpSaga(action: Actions) {
  console.log(action);
  try {
    const result: Message = yield call(checkOtp, action.payload);
    yield put(checkOtpSuccess(result));
    document.location.href = "/newpass";
    action.callback()
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorObj: Error = {
      error: err.response?.data?.message || "OTP verification failed"
    };
    yield put(checkOtpFailure(errorObj));
  }
}

function* UpdatePasswordSaga(action: Actions) {
  try {
    const result: Message = yield call(updatePassword, action.payload);
    yield put(updatePasswordSuccess(result));
    action.callback()
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorObj: Error = {
      error: err.response?.data?.message || "Password update failed"
    };
    yield put(updatePasswordFailure(errorObj));
  }
}

function* GetNewTokenSaga(action: Actions) {
  try {
    const result: Tokens = yield call(getNewToken, action.payload);
    localStorage.setItem("token", JSON.stringify(result.accessToken));
    localStorage.setItem("refeshToken", JSON.stringify(result.refeshToken));
    yield put(getNewTokenSuccess(result));
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorObj: Error = {
      error: err.response?.data?.message || "Failed to get new token"
    };
    yield put(getNewTokenFailure(errorObj));
  }
}

function* GetUserByIdSaga(action: Actions) {
  try {
    console.log(action.payload)
    const user: User = yield call(getUserById, action.payload);
    yield put(getUserByIdSuccess(user));
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorMsg: Message = {
      message: err.response?.data?.message || "Failed to get user"
    };
    yield put(getUserByIdFailure(errorMsg));
  }
}

function* UpdateAvatarSaga(action: Actions) {
  try {
    console.log("Uploading avatar...");
    const result: AvatarResponse = yield call(updateAvatar, action.payload);
    console.log("Avatar upload successful:", result);
    
    if (result && result.user) {
      yield put(updateAvatarSuccess(result.user));
      
      // Refresh user data after successful update
      if (result.user._id) {
        console.log("Refreshing user data after avatar update:", result.user._id);
        yield put(getUserByIdRequest(result.user._id));
      }
    } else {
      throw new Error("Invalid response from server");
    }
    
    // Call callback if provided
    if (action.callback) {
      action.callback(result);
    }
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorMsg: Message = {
      message: err.response?.data?.message || "Avatar update failed"
    };
    console.error("Avatar upload failed:", errorMsg);
    yield put(updateAvatarFailure(errorMsg));
  }
}

function* SearchUserSaga(action: Actions) {
  try {
    const result: User = yield call(searchUser, action.payload);
    yield put(searchUserSuccess(result));
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorMsg: Message = {
      message: err.response?.data?.message || "Search failed"
    };
    yield put(searchUserFailure(errorMsg));
  }
}

function* GetAllFriendSaga(action: Actions) {
  try {
    const result: listFriend = yield call(getAllFriendByUser, action.payload);
    yield put(getAllFriendSuccess(result));
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorMsg: Message = {
      message: err.response?.data?.message || "Failed to get friends"
    };
    yield put(getAllFriendFailure(errorMsg));
  }
}

function* GetAllPeopleRequestSaga(action: Actions) {
  try {
    const result: listFriend = yield call(getAllPeopleRequestByUser, action.payload);
    yield put(getAllPeopleRequestSuccess(result));
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorMsg: Message = {
      message: err.response?.data?.message || "Failed to get requests"
    };
    yield put(getAllPeopleRequestFailure(errorMsg));
  }
}

function* UpdateUserSaga(action: Actions) {
  try {
    console.log("Updating user info...");
    const result: User = yield call(updateUser, action.payload);
    console.log("User info update successful:", result);
    yield put(updateUserSuccess(result));
    
    // Refresh user data after successful update
    if (action.payload && action.payload.id) {
      console.log("Refreshing user data after update:", action.payload.id);
      yield put(getUserByIdRequest(action.payload.id));
    }
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    const errorObj: Error = {
      error: err.response?.data?.message || "User info update failed"
    };
    console.error("User info update failed:", errorObj);
    yield put(updateUserFailure(errorObj));
  }
}

function* UserSaga() {
  yield takeEvery(UserConstant.LOGIN_USER_REQUEST, LoginSaga);
  yield takeEvery(UserConstant.REGISTER_USER_REQUEST, RegisterSaga);
  yield takeLatest(UserConstant.GET_USER_BY_ID_REQUEST, GetUserByIdSaga);
  yield takeLatest(UserConstant.UPDATE_AVATAR_REQUEST, UpdateAvatarSaga);
  yield takeLatest(UserConstant.UPDATE_USER_REQUEST, UpdateUserSaga);
  
  yield takeLatest(UserConstant.GET_EMAIL_REQUEST, GetEmailSaga);
  yield takeLatest(UserConstant.CHECK_OTP_REQUEST, CheckOtpSaga);
  yield takeLatest(UserConstant.UPDATE_PASSWORD_REQUEST, UpdatePasswordSaga);
  yield takeLatest(UserConstant.GET_NEW_TOKEN_REQUEST, GetNewTokenSaga);
  yield takeLatest(UserConstant.SEARCH_USER_REQUEST, SearchUserSaga);

  yield takeLatest(UserConstant.GET_ALL_FRIEND_REQUEST, GetAllFriendSaga);
  yield takeLatest(UserConstant.GET_ALL_PEOPLE_REQUEST_REQUEST, GetAllPeopleRequestSaga);
}

export default UserSaga;

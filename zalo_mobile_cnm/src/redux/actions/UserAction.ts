import { UserConstant } from '../../constants/UserConstant';
import { 
  LoginForm, 
  RegisterForm, 
  UpdateUserForm, 
  ChangePasswordForm, 
  ForgotPasswordForm, 
  ResetPasswordForm
} from '../../types/UserType';

// Login actions
export const loginRequest = (data: LoginForm) => ({
  type: UserConstant.LOGIN_USER_REQUEST,
  payload: data,
});

export const loginSuccess = (data: any) => ({
  type: UserConstant.LOGIN_USER_SUCCESS,
  payload: data,
});

export const loginFailure = (error: string) => ({
  type: UserConstant.LOGIN_USER_FAILURE,
  payload: error,
});

// Register actions
export const registerRequest = (data: RegisterForm) => ({
  type: UserConstant.REGISTER_USER_REQUEST,
  payload: data,
});

export const registerSuccess = () => ({
  type: UserConstant.REGISTER_USER_SUCCESS,
});

export const registerFailure = (error: string) => ({
  type: UserConstant.REGISTER_USER_FAILURE,
  payload: error,
});

// Get user info actions
export const getUserInfoRequest = () => ({
  type: UserConstant.GET_USER_INFO_REQUEST,
});

export const getUserInfoSuccess = (data: any) => ({
  type: UserConstant.GET_USER_INFO_SUCCESS,
  payload: data,
});

export const getUserInfoFailure = (error: string) => ({
  type: UserConstant.GET_USER_INFO_FAILURE,
  payload: error,
});

// Update user actions
export const updateUserRequest = (data: UpdateUserForm) => ({
  type: UserConstant.UPDATE_USER_REQUEST,
  payload: data,
});

export const updateUserSuccess = (data: any) => ({
  type: UserConstant.UPDATE_USER_SUCCESS,
  payload: data,
});

export const updateUserFailure = (error: string) => ({
  type: UserConstant.UPDATE_USER_FAILURE,
  payload: error,
});

// Update avatar actions
export const updateAvatarRequest = (data: FormData) => ({
  type: UserConstant.UPDATE_AVATAR_REQUEST,
  payload: data,
});

export const updateAvatarSuccess = (avatarUrl: string) => ({
  type: UserConstant.UPDATE_AVATAR_SUCCESS,
  payload: avatarUrl,
});

export const updateAvatarFailure = (error: string) => ({
  type: UserConstant.UPDATE_AVATAR_FAILURE,
  payload: error,
});

// Change password actions
export const changePasswordRequest = (data: ChangePasswordForm) => ({
  type: UserConstant.CHANGE_PASSWORD_REQUEST,
  payload: data,
});

export const changePasswordSuccess = () => ({
  type: UserConstant.CHANGE_PASSWORD_SUCCESS,
});

export const changePasswordFailure = (error: string) => ({
  type: UserConstant.CHANGE_PASSWORD_FAILURE,
  payload: error,
});

// Forgot password actions
export const forgotPasswordRequest = (data: ForgotPasswordForm) => ({
  type: UserConstant.FORGOT_PASSWORD_REQUEST,
  payload: data,
});

export const forgotPasswordSuccess = () => ({
  type: UserConstant.FORGOT_PASSWORD_SUCCESS,
});

export const forgotPasswordFailure = (error: string) => ({
  type: UserConstant.FORGOT_PASSWORD_FAILURE,
  payload: error,
});

// Reset password actions
export const resetPasswordRequest = (data: ResetPasswordForm) => ({
  type: UserConstant.RESET_PASSWORD_REQUEST,
  payload: data,
});

export const resetPasswordSuccess = () => ({
  type: UserConstant.RESET_PASSWORD_SUCCESS,
});

export const resetPasswordFailure = (error: string) => ({
  type: UserConstant.RESET_PASSWORD_FAILURE,
  payload: error,
});

// Logout actions
export const logoutUserRequest = () => ({
  type: UserConstant.LOGOUT_USER_REQUEST,
});

export const logoutUserSuccess = () => ({
  type: UserConstant.LOGIN_USER_SUCCESS,
});

// Get all friend actions
export const getAllFriendRequest = (userId: string) => ({
  type: UserConstant.GET_ALL_FRIEND_REQUEST,
  payload: userId,
});

export const getAllFriendSuccess = (data: any) => ({
  type: UserConstant.GET_ALL_FRIEND_SUCCESS,
  payload: data,
});

export const getAllFriendFailure = (error: string) => ({
  type: UserConstant.GET_ALL_FRIEND_FAILURE,
  payload: error,
});

// Get friend request actions
export const getFriendRequestRequest = (userId: string) => ({
  type: UserConstant.GET_ALL_FRIEND_REQUEST_REQUEST,
  payload: userId,
});

export const getFriendRequestSuccess = (data: any) => ({
  type: UserConstant.GET_ALL_FRIEND_REQUEST_SUCCESS,
  payload: data,
});

export const getFriendRequestFailure = (error: string) => ({
  type: UserConstant.GET_ALL_FRIEND_REQUEST_FAILURE,
  payload: error,
});

// Send friend request actions
export const sendFriendRequestRequest = (senderId: string, receiverId: string) => ({
  type: UserConstant.SEND_FRIEND_REQUEST_REQUEST,
  payload: { senderId, receiverId },
});

export const sendFriendRequestSuccess = () => ({
  type: UserConstant.SEND_FRIEND_REQUEST_SUCCESS,
});

export const sendFriendRequestFailure = (error: string) => ({
  type: UserConstant.SEND_FRIEND_REQUEST_FAILURE,
  payload: error,
});

// Accept friend request actions
export const acceptFriendRequestRequest = (requestId: string) => ({
  type: UserConstant.ACCEPT_FRIEND_REQUEST_REQUEST,
  payload: requestId,
});

export const acceptFriendRequestSuccess = () => ({
  type: UserConstant.ACCEPT_FRIEND_REQUEST_SUCCESS,
});

export const acceptFriendRequestFailure = (error: string) => ({
  type: UserConstant.ACCEPT_FRIEND_REQUEST_FAILURE,
  payload: error,
});

// Decline friend request actions
export const declineFriendRequestRequest = (requestId: string) => ({
  type: UserConstant.DECLINE_FRIEND_REQUEST_REQUEST,
  payload: requestId,
});

export const declineFriendRequestSuccess = () => ({
  type: UserConstant.DECLINE_FRIEND_REQUEST_SUCCESS,
});

export const declineFriendRequestFailure = (error: string) => ({
  type: UserConstant.DECLINE_FRIEND_REQUEST_FAILURE,
  payload: error,
});

// Search user actions
export const searchUserRequest = (data: { query: string; userId: string | undefined }) => ({
  type: UserConstant.SEARCH_USER_REQUEST,
  payload: data,
});

export const searchUserSuccess = (data: any) => ({
  type: UserConstant.SEARCH_USER_SUCCESS,
  payload: data,
});

export const searchUserFailure = (error: string) => ({
  type: UserConstant.SEARCH_USER_FAILURE,
  payload: error,
});
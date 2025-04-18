import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  REQUEST_PASSWORD_RESET,
  VERIFY_OTP,
  RESET_PASSWORD,
  RESEND_OTP
} from '../constants';

// Login actions
export const login = (email: string, password: string) => ({
  type: LOGIN_REQUEST,
  payload: { email, password }
});

export const loginSuccess = (user: any, token: string) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token }
});

export const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: { error }
});

// Register actions
export const register = (userData: any) => ({
  type: REGISTER_REQUEST,
  payload: userData
});

export const registerSuccess = (user: any) => ({
  type: REGISTER_SUCCESS,
  payload: { user }
});

export const registerFailure = (error: string) => ({
  type: REGISTER_FAILURE,
  payload: { error }
});

// Logout action
export const logout = () => ({
  type: LOGOUT
});

// Update profile actions
export const updateProfile = (userData: any) => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: userData
});

export const updateProfileSuccess = (user: any) => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: { user }
});

export const updateProfileFailure = (error: string) => ({
  type: UPDATE_PROFILE_FAILURE,
  payload: { error }
});

// Password reset actions
export const requestPasswordReset = (email: string, onSuccess: () => void, onError: (error: string) => void) => ({
  type: REQUEST_PASSWORD_RESET,
  payload: { email, onSuccess, onError }
});

export const resendOTP = (email: string, onSuccess: () => void, onError: (error: string) => void) => ({
  type: RESEND_OTP,
  payload: { email, onSuccess, onError }
});

export const verifyOTP = (email: string, otp: string, onSuccess: () => void, onError: (error: string) => void) => ({
  type: VERIFY_OTP,
  payload: { email, otp, onSuccess, onError }
});

export const resetPassword = (email: string, otp: string, password: string, onSuccess: () => void, onError: (error: string) => void) => ({
  type: RESET_PASSWORD,
  payload: { email, otp, password, onSuccess, onError }
}); 
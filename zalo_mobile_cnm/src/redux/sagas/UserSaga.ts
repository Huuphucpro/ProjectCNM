import { takeLatest, put, call, all, cancelled } from 'redux-saga/effects';
import { 
  LOGIN_REQUEST, 
  REGISTER_REQUEST, 
  UPDATE_PROFILE_REQUEST,
  REQUEST_PASSWORD_RESET,
  VERIFY_OTP,
  RESET_PASSWORD,
  RESEND_OTP,
  LOGOUT
} from '../constants';
import UserApi from '../../api/UserApi';
import { clearTokens, apiCall } from '../../api/AxiosClient';
import { API_ERRORS } from '../../constants/ApiConstant';
import * as actions from '../actions/UserActions';
import { 
  RegisterForm, 
  UpdateUserForm
} from '../../types/UserType';
import { handleApiError, showErrorMessage, ApiError } from '../../utils/ErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { delay } from 'redux-saga/effects';

// Worker Sagas
function* loginSaga(action: ReturnType<typeof actions.login>): Generator<any, void, any> {
  try {
    const { email, password } = action.payload;
    
    // Use the apiCall wrapper for network checking and standardized error handling
    const response = yield call(apiCall, () => UserApi.login(email, password));
    
    // Token storage is handled in the UserApi login method
    yield put(actions.loginSuccess(response.user, response.token));
  } catch (error: unknown) {
    console.log('Login error:', error);
    const err = handleApiError(error, 'Login failed. Please check your credentials.');
    showErrorMessage(err.message);
    yield put(actions.loginFailure(err.message));
  } finally {
    if (yield cancelled()) {
      yield put(actions.loginFailure('Login was cancelled'));
    }
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    // Cancel any pending API calls first
    yield put({ type: 'CANCEL_PENDING_TASKS' });
    
    // Clear AsyncStorage if not already done
    try {
      yield call(() => AsyncStorage.clear());
    } catch (e) {
      console.log('AsyncStorage already cleared or error:', e);
    }
    
    // Wait for any pending tasks to finish
    yield delay(100);
    
    // Call API logout if needed
    yield call(apiCall, () => UserApi.logout());
    
    // Clear Redux store state - use this if you're not using redux-persist
    // yield put({ type: 'RESET_STORE' });
    
    // No need for logoutSuccess action since logout action is sufficient
  } catch (error) {
    // Even if the server-side logout fails, still clear local tokens
    yield call(clearTokens);
    console.error('Logout error:', error);
  }
}

function* registerSaga(action: ReturnType<typeof actions.register>): Generator<any, void, any> {
  try {
    const userData: RegisterForm = action.payload;
    console.log('Sending register request with data:', userData);
    const response = yield call(apiCall, () => UserApi.register(userData));
    console.log('Register response:', response);
    
    yield put(actions.registerSuccess(response.user || response));
  } catch (error: unknown) {
    console.log('Register error:', error);
    const err = handleApiError(error, 'Registration failed. Please try again.');
    showErrorMessage(err.message);
    yield put(actions.registerFailure(err.message));
  } finally {
    if (yield cancelled()) {
      yield put(actions.registerFailure('Registration was cancelled'));
    }
  }
}

function* updateProfileSaga(action: ReturnType<typeof actions.updateProfile>): Generator<any, void, any> {
  try {
    const userData: UpdateUserForm = action.payload;
    console.log('📱 Update profile saga with data:', userData);
    
    const response = yield call(apiCall, () => UserApi.updateProfile(userData));
    console.log('📱 Update profile response:', response);
    
    yield put(actions.updateProfileSuccess(response.user || response));
    
    // Only show success message if update was successful
    if (response && !response.error) {
      showErrorMessage('Cập nhật thông tin thành công');
    }
  } catch (error: unknown) {
    console.error('📱 Update profile error:', error);
    const err = handleApiError(error, 'Profile update failed. Please try again.');
    showErrorMessage(err.message);
    yield put(actions.updateProfileFailure(err.message));
  }
}

function* requestPasswordResetSaga(action: ReturnType<typeof actions.requestPasswordReset>): Generator<any, void, any> {
  try {
    const { email, onSuccess, onError } = action.payload;
    yield call(apiCall, () => UserApi.requestPasswordReset(email));
    
    if (onSuccess) onSuccess();
  } catch (error: unknown) {
    const err = handleApiError(error, 'Password reset request failed. Please try again.');
    if (action.payload.onError) action.payload.onError(err.message);
    else showErrorMessage(err.message);
  }
}

function* verifyOTPSaga(action: ReturnType<typeof actions.verifyOTP>): Generator<any, void, any> {
  try {
    const { email, otp, onSuccess, onError } = action.payload;
    yield call(apiCall, () => UserApi.verifyOTP(email, otp));
    
    if (onSuccess) onSuccess();
  } catch (error: unknown) {
    const err = handleApiError(error, 'OTP verification failed. Please try again.');
    if (action.payload.onError) action.payload.onError(err.message);
    else showErrorMessage(err.message);
  }
}

function* resetPasswordSaga(action: ReturnType<typeof actions.resetPassword>): Generator<any, void, any> {
  try {
    const { email, otp, password, onSuccess, onError } = action.payload;
    
    // Use the reset data with the available fields
    yield call(apiCall, () => UserApi.resetPassword({
      email,
      otp,
      password,
      confirmPassword: password // Since the action doesn't have confirmPassword
    }));
    
    if (onSuccess) onSuccess();
  } catch (error: unknown) {
    const err = handleApiError(error, 'Password reset failed. Please try again.');
    if (action.payload.onError) action.payload.onError(err.message);
    else showErrorMessage(err.message);
  }
}

function* resendOTPSaga(action: ReturnType<typeof actions.resendOTP>): Generator<any, void, any> {
  try {
    const { email, onSuccess, onError } = action.payload;
    yield call(apiCall, () => UserApi.resendOTP(email));
    
    if (onSuccess) onSuccess();
  } catch (error: unknown) {
    const err = handleApiError(error, 'Failed to resend OTP. Please try again.');
    if (action.payload.onError) action.payload.onError(err.message);
    else showErrorMessage(err.message);
  }
}

// Watcher Saga
export default function* userSaga(): Generator<any, void, any> {
  yield all([
    takeLatest(LOGIN_REQUEST, loginSaga),
    takeLatest(LOGOUT, logoutSaga),
    takeLatest(REGISTER_REQUEST, registerSaga),
    takeLatest(UPDATE_PROFILE_REQUEST, updateProfileSaga),
    takeLatest(REQUEST_PASSWORD_RESET, requestPasswordResetSaga),
    takeLatest(VERIFY_OTP, verifyOTPSaga),
    takeLatest(RESET_PASSWORD, resetPasswordSaga),
    takeLatest(RESEND_OTP, resendOTPSaga)
  ]);
}
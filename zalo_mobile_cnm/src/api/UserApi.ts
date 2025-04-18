import axiosClient, { saveTokens, clearTokens } from './AxiosClient';
import { USER_API } from '../constants/ApiConstant';
import { 
  LoginForm, 
  RegisterForm, 
  UpdateUserForm, 
  ChangePasswordForm, 
  ForgotPasswordForm, 
  ResetPasswordForm,
  UserState
} from '../types/UserType';

// Define response interfaces
interface LoginResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  refeshToken?: string;
  user: any;
}

/**
 * UserApi - Contains all API calls related to user actions
 */
const UserApi = {
  /**
   * Authentication
   */
  login: async (phone: string, password: string) => {
    const response = await axiosClient.post<LoginResponse>(USER_API.LOGIN, { phone, password });
    
    // Save tokens to storage if available in response
    // Handle different naming conventions between backend and mobile
    if (response && typeof response === 'object') {
      // Get token (could be named token OR accessToken)
      const responseData = response as any; // Cast to any to handle both naming conventions
      const token = (responseData.token || responseData.accessToken) as string;
      // Get refresh token (could be named refreshToken OR refeshToken)
      const refreshToken = (responseData.refreshToken || responseData.refeshToken) as string;
      
      console.log('📱 Received auth tokens:', { 
        hasToken: !!token, 
        hasRefreshToken: !!refreshToken 
      });
      
      if (token && refreshToken) {
        await saveTokens(token, refreshToken);
        console.log('📱 Tokens saved successfully');
      } else {
        console.error('📱 Missing tokens in response:', responseData);
      }
    }
    
    return response;
  },
  
  register: (data: RegisterForm) => {
    // Create a new object with name mapped from fullName
    const mappedData = {
      ...data,
      name: data.fullName, // Map fullName to name for the backend
    };
    
    // Remove fields not expected by the backend schema
    delete (mappedData as any).fullName;
    
    // Log the data being sent for debugging
    console.log('📱 Mapped registration data:', mappedData);
    
    return axiosClient.post(USER_API.REGISTER, mappedData);
  },
  
  logout: async () => {
    try {
      // Server-side logout handled in AxiosClient clear tokens
      await clearTokens();
      
      // Clear any in-memory caches
      try {
        // Using any type assertion for custom properties that might exist
        const fetchWithCache = global.fetch as any;
        if (fetchWithCache && typeof fetchWithCache.__clearCache === 'function') {
          fetchWithCache.__clearCache();
        }
      } catch (e) {
        console.log('No fetch cache to clear');
      }
      
      // Clear any image caches (if using react-native-fast-image or similar)
      // if (FastImage && typeof FastImage.clearCache === 'function') {
      //   await FastImage.clearCache();
      // }
      
      // Clear any other app-specific caches here
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout cleanup:', error);
      return { success: false, error };
    }
  },
  
  /**
   * User Profile
   */
  getCurrentUser: () => {
    return axiosClient.get(USER_API.GET_ME);
  },
  
  updateProfile: (data: UpdateUserForm) => {
    // Check if data is in the format {id: string, data: FormData}
    if (data.id && data.data) {
      console.log(`📱 Updating profile for user ID: ${data.id}`);
      
      // Check if FormData contains an avatar image
      const formData = data.data as FormData;
      const hasAvatar = Array.from((formData as any)._parts || []).some(
        (part: any) => part[0] === 'avatar'
      );
      
      console.log(`📱 Update includes avatar: ${hasAvatar}`);
      
      if (hasAvatar) {
        // For avatar updates, use the dedicated avatar endpoint
        // Create a new FormData with 'image' instead of 'avatar'
        const formDataForBackend = new FormData();
        
        // Process the FormData to rename 'avatar' to 'image'
        for (const pair of (formData as any)._parts || []) {
          if (pair && pair.length >= 2) {
            const key = pair[0];
            const value = pair[1];
            
            // Rename 'avatar' field to 'image' for the backend
            if (key === 'avatar') {
              formDataForBackend.append('image', value);
            } else {
              formDataForBackend.append(key, value);
            }
          }
        }
        
        return axiosClient.post(USER_API.UPDATE_AVATAR, formDataForBackend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // For regular profile updates without avatar
        return axiosClient.put(`/user/${data.id}`, formData);
      }
    } else {
      // Fallback for backward compatibility 
      console.log('📱 Warning: Update user called without ID');
      return axiosClient.put(USER_API.UPDATE_USER, data);
    }
  },
  
  updateAvatar: (formData: FormData) => {
    // Check if formData contains 'avatar' field and rename it to 'image' to match backend
    const formDataForBackend = new FormData();
    
    // Get all entries from the original formData
    if (formData) {
      // Handle field renaming and copying directly
      for (const pair of (formData as any)._parts || []) {
        if (pair && pair.length >= 2) {
          const key = pair[0];
          const value = pair[1];
          
          // Rename 'avatar' field to 'image' for the backend
          if (key === 'avatar') {
            formDataForBackend.append('image', value);
          } else {
            formDataForBackend.append(key, value);
          }
        }
      }
    }
    
    return axiosClient.post(USER_API.UPDATE_AVATAR, formDataForBackend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  changePassword: (data: ChangePasswordForm) => {
    return axiosClient.put(USER_API.UPDATE_PASSWORD, data);
  },
  
  /**
   * Password Reset
   */
  requestPasswordReset: (email: string) => {
    return axiosClient.post(USER_API.FORGOT_PASSWORD, { email });
  },
  
  verifyOTP: (email: string, otp: string) => {
    return axiosClient.post(USER_API.VERIFY_OTP, { email, otp });
  },
  
  resetPassword: (data: ResetPasswordForm) => {
    return axiosClient.post(USER_API.RESET_PASSWORD, data);
  },
  
  resendOTP: (email: string) => {
    return axiosClient.post(USER_API.RESEND_OTP, { email });
  },

  /**
   * Friends & Contacts
   */
  getAllFriends: (userId: string) => {
    return axiosClient.get(`${USER_API.GET_FRIENDS}/${userId}`);
  },
  
  searchUsers: (query: string, userId: string) => {
    return axiosClient.get(USER_API.SEARCH_USER, { 
      params: { query, userId } 
    });
  },
  
  sendFriendRequest: (friendId: string) => {
    return axiosClient.post(USER_API.SEND_FRIEND_REQUEST, { friendId });
  },
  
  getFriendRequests: () => {
    return axiosClient.get(USER_API.GET_FRIEND_REQUESTS);
  },
  
  acceptFriendRequest: (requestId: string) => {
    return axiosClient.post(USER_API.ACCEPT_FRIEND_REQUEST, { requestId });
  },
  
  declineFriendRequest: (requestId: string) => {
    return axiosClient.post(USER_API.DECLINE_FRIEND_REQUEST, { requestId });
  },
};

export default UserApi;
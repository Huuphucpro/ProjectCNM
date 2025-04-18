// Interface cho người dùng
export interface IUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  coverImage?: string;
  gender?: string;
  birthday?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface cho thông tin đăng nhập
export interface LoginForm {
  phone: string;
  password: string;
}

// Interface cho thông tin đăng ký
export interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Interface cho thông tin cập nhật người dùng
export interface UpdateUserForm {
  name?: string;
  email?: string;
  gender?: string;
  birthday?: string;
  // For profile update with user ID
  id?: string;
  data?: FormData;
}

// Interface cho thông tin đổi mật khẩu
export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface cho thông tin quên mật khẩu
export interface ForgotPasswordForm {
  email: string;
}

// Interface cho thông tin đặt lại mật khẩu
export interface ResetPasswordForm {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

// Interface cho bạn bè
export interface FriendItem {
  _id: string;
  idUser: {
    _id: string;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
  };
  idConversation?: string;
}

// Interface cho yêu cầu kết bạn
export interface FriendRequest {
  _id: string;
  sender: any;
  receiver: any;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface UserState {
  isLoading: boolean;
  userCurrent: any;
  error: any;
  emailUserResetPass: string | null;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  friends: any[];
  peopleRequest: any[];
  isLoggedIn: boolean;
}

export interface UpdateProfileForm {
  fullName?: string;
  avatar?: any;
  bio?: string;
}
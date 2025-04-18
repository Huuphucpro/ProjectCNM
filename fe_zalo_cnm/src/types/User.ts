export interface User {
  _id: string;
  name: string;
  phone: string;
  avatar?: string;
  cloudinary_id?: string;
  // ... other fields
}

export interface AvatarResponse {
  message: string;
  user: User;
} 
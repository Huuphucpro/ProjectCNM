import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FriendSchema = new Schema({
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  idConversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, index: true }, // Thêm trường email riêng
    avatar: String,
    password: { 
      type: String, 
      required: true,
      minlength: [8, 'Password must be at least 8 characters long'],
      validate: {
        validator: function(v) {
          // At least one uppercase letter, one lowercase letter, one number
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
        },
        message: props => 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    },
    otp: String,
    refeshToken: { type: String, index: true },
    cloudinary_id: String,
    unreadMessages: { type: Number, default: 0 },

    friends: [FriendSchema], // ban be cua user
    myRequest: [FriendSchema], // cac yeu cau kb cua user gửi đi
    peopleRequest: [FriendSchema], // các yêu cầu kb tới accout của user
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ name: 'text' });
UserSchema.index({ 'friends.idUser': 1 });
UserSchema.index({ 'myRequest.idUser': 1 });
UserSchema.index({ 'peopleRequest.idUser': 1 });

export const UsersModel = mongoose.model("User", UserSchema);
export const FriendsModel = mongoose.model("Friend", FriendSchema);
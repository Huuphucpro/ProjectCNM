import { UsersModel } from "../models/UserModel.js";
import { generateToken } from "../utils/index.js";
import { mailer } from "../utils/mailer.js";
import cloudinary from "cloudinary";
import { ConversationModel } from "../models/ConversationModel.js";
import { MessageModel } from "../models/MessageModel.js";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

// Safe ID utility function to handle various ID formats
const safeId = (id) => {
  // Nếu ID là null hoặc undefined
  if (!id) return null;
  
  // Nếu là string "[object Object]", trả về null
  if (typeof id === 'string' && id === '[object Object]') {
    console.error('Received string "[object Object]" instead of actual object');
    return null;
  }
  
  // Nếu là JSON string, thử parse
  if (typeof id === 'string' && (id.startsWith('{') || id.startsWith('['))) {
    try {
      const parsed = JSON.parse(id);
      if (parsed && typeof parsed === 'object' && parsed._id) {
        return safeId(parsed._id);
      }
    } catch (e) {
      // Không phải JSON hợp lệ, tiếp tục xử lý dưới dạng chuỗi
    }
  }
  
  // Nếu là ObjectId hợp lệ, sử dụng ngay
  if (mongoose.Types.ObjectId.isValid(id)) {
    return id;
  }
  
  // Nếu là object với _id, sử dụng _id
  if (id && typeof id === 'object') {
    if (id._id) {
      return safeId(id._id);
    }
    
    // Nếu object có toString() method đặc biệt, có thể đó là ObjectId
    try {
      const idStr = id.toString();
      if (idStr !== '[object Object]' && mongoose.Types.ObjectId.isValid(idStr)) {
        return idStr;
      }
    } catch (err) {
      console.error('Error using object toString():', err);
    }
    
    console.error('Invalid object ID format:', id);
    return null;
  }
  
  // Trường hợp còn lại, thử chuyển đổi sang string
  try {
    const idStr = String(id);
    if (mongoose.Types.ObjectId.isValid(idStr)) {
      return idStr;
    }
  } catch (err) {
    console.error('Error converting ID to string:', err);
  }
  
  console.error('Invalid ID format:', id);
  return null;
};

export const getUser = async (req, res) => {
  try {
    console.time('getAllUsers');
    // Chỉ lấy các trường cần thiết thay vì toàn bộ document
    const users = await UsersModel.find({}, { 
      name: 1, 
      avatar: 1, 
      phone: 1,
      // Không lấy các trường nhạy cảm hoặc lớn
      password: 0, 
      refeshToken: 0 
    }).lean(); // Sử dụng lean() để tăng tốc bằng cách trả về đối tượng JS thông thường
    console.timeEnd('getAllUsers');
    res.send(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).send({ message: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    console.time('getUserById');
    const id = safeId(req.params.id);
    if (!id) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }
    
    // Chỉ lấy các trường cần thiết
    const user = await UsersModel.findById(id, { 
      password: 0, 
      refeshToken: 0 
    }).lean();
    console.timeEnd('getUserById');
    
    if (user) {
      res.send(user);
    } else {
      res.status(403).send({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).send({ message: "Error fetching user" });
  }
};

export const updateUserRefeshToken = (user, refeshToken) => {
  user.refeshToken = refeshToken;
  user.save();
};

export const Login = async (req, res) => {
  const user = await UsersModel.findOne({
    $or: [
      { phone: req.body.phone },
      { email: req.body.phone } // Support login with email
    ]
  });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const tokens = generateToken(user);
    updateUserRefeshToken(user, tokens.refeshToken);

    res.send({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      otp: user.otp || null,
      token: tokens.accessToken,
      refeshToken: tokens.refeshToken,
    });
  } else {
    res.status(403).send({ message: "Số điện thoại hoặc mật khẩu không đúng" });
  }
};

export const Register = async (req, res) => {
  console.log(req.body)
  try {
    // Kiểm tra nếu số điện thoại đã tồn tại
    const userPhoneExists = await UsersModel.findOne({ phone: req.body.phone });
    if (userPhoneExists) {
      return res.status(400).send({ message: "Số điện thoại này đã đăng kí tài khoản" });
    }
    
    // Nếu có email, kiểm tra email đã tồn tại chưa
    if (req.body.email) {
      const userEmailExists = await UsersModel.findOne({ email: req.body.email });
      if (userEmailExists) {
        return res.status(400).send({ message: "Email này đã được đăng ký" });
      }
      
      // Kiểm tra định dạng email hợp lệ
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).send({ message: "Định dạng email không hợp lệ" });
      }
    }
    
    // Hash password trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const user = new UsersModel({
      ...req.body,
      password: hashedPassword
    });
    user.avatar =
      "https://res.cloudinary.com/ds4v3awds/image/upload/v1743854129/rrotvnyfpdkih3goymsa.jpg";
    await user.save();

    res.status(200).send({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      otp: "",
    });
  } catch (error) {
    console.error("Error in Register:", error);
    res.status(500).send({ message: "Lỗi đăng ký tài khoản, vui lòng thử lại" });
  }
};

export const getNewToken = async (req, res) => {
  const refeshToken = req.body;
  const userExists = await UsersModel.findOne(refeshToken);
  if (userExists) {
    const tokens = generateToken(userExists);
    updateUserRefeshToken(userExists, tokens.refeshToken);
    res.send(tokens);
  } else {
    res.status(403).send({ message: "no refesh token" });
  }
};

export const UpdatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting to update password for email: ${email}`);
    
    if (!email || !password) {
      console.error("Missing email or password in request");
      return res.status(400).send({ message: "Vui lòng cung cấp đầy đủ email và mật khẩu mới" });
    }

    // Tìm user bằng email hoặc phone (để hỗ trợ cả dữ liệu cũ và mới)
    const userExist = await UsersModel.findOne({
      $or: [
        { email: email },
        { phone: email }
      ]
    });
    
    if (!userExist) {
      console.log(`No user found with email: ${email}`);
      return res.status(403).send({ message: "Email này chưa đăng kí tài khoản" });
    }

    // Cập nhật email vào trường email nếu tìm thấy qua phone
    if (!userExist.email && email.includes('@')) {
      userExist.email = email;
    }

    // Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    userExist.password = hashedPassword;
    
    // Xóa OTP sau khi đặt lại mật khẩu thành công
    userExist.otp = "";
    
    await userExist.save();
    console.log(`Password updated successfully for user: ${userExist._id}`);
    
    res.send({ message: "Cập nhật mật khẩu thành công" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

function countDownOtp(time, user) {
  setTimeout(() => {
    user.otp = "";
    user.save();
  }, time);
}

export const sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Attempting to send OTP to email: ${email}`);
    
    if (!email) {
      console.error("Email was not provided in request");
      return res.status(400).send({ message: "Email không được để trống" });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated OTP: ${otp} for email: ${email}`);

    // Tìm user bằng email hoặc phone (để hỗ trợ cả dữ liệu cũ và mới)
    const userExist = await UsersModel.findOne({ 
      $or: [
        { email: email },
        { phone: email }
      ]
    });
    
    if (userExist) {
      console.log(`Found user with ID: ${userExist._id} for email: ${email}`);
      
      // Cập nhật email vào trường email nếu tìm thấy qua phone
      if (!userExist.email && email.includes('@')) {
        userExist.email = email;
      }
      
      // Lưu OTP vào database
      userExist.otp = String(otp);
      await userExist.save();
      console.log(`Saved OTP to database for user: ${userExist._id}`);
      
      // Đặt hẹn giờ để xóa OTP sau 60s
      countDownOtp(60000, userExist);
      console.log(`Set countdown to clear OTP after 60 seconds`);
      
      try {
        // Gửi email
        console.log(`Attempting to send email to: ${email}`);
        await mailer(
          String(email),
          "Mã xác thực OTP cho Zalo",
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #2483ff; text-align: center;">Mã xác thực OTP</h2>
            <p>Xin chào,</p>
            <p>Dưới đây là mã xác thực OTP của bạn:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f5f5f5; border-radius: 5px;">${otp}</span>
            </div>
            <p>Mã này có hiệu lực trong vòng <strong>60 giây</strong>.</p>
            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
            <p style="color: #777; margin-top: 20px; text-align: center; font-size: 12px;">© ${new Date().getFullYear()} Zalo App</p>
          </div>`
        );
        console.log(`Email sent successfully to: ${email}`);
        
        res.send({ message: "Đã gửi mã xác thực đến email của bạn" });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        
        // Nếu lỗi gửi email, phản hồi lỗi nhưng vẫn giữ OTP trong DB
        // để có thể thử gửi lại
        res.status(500).send({ 
          message: "Lỗi gửi email, vui lòng thử lại sau",
          error: emailError.message 
        });
      }
    } else {
      console.log(`No user found with email: ${email}`);
      res.status(403).send({ message: "Email này chưa đăng kí tài khoản" });
    }
  } catch (error) {
    console.error("Error in sendMail function:", error);
    res.status(500).send({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

export const checkCodeOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`Checking OTP: ${otp} for email: ${email}`);
    
    if (!email || !otp) {
      console.error("Missing email or OTP in request");
      return res.status(400).send({ 
        message: "Vui lòng cung cấp đầy đủ thông tin email và mã OTP" 
      });
    }

    // Tìm user bằng email hoặc phone (để hỗ trợ cả dữ liệu cũ và mới)
    const userExist = await UsersModel.findOne({ 
      $or: [
        { email: email },
        { phone: email }
      ]
    });
    
    if (!userExist) {
      console.log(`No user found with email: ${email}`);
      return res.status(403).send({ message: "Email này chưa đăng kí tài khoản" });
    }
    
    console.log(`User found: ${userExist._id}, comparing OTP: [${otp}] with stored OTP: [${userExist.otp}]`);
    
    if (otp === userExist.otp && userExist.otp !== '') {
      console.log(`OTP verification successful for user: ${userExist._id}`);
      res.send({ message: "Mã xác thực OTP hợp lệ" });
    } else {
      console.log(`OTP verification failed for user: ${userExist._id}`);
      if (userExist.otp === '') {
        res.status(403).send({ message: "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới" });
      } else {
        res.status(403).send({ message: "Mã OTP không đúng" });
      }
    }
  } catch (error) {
    console.error("Error in checkCodeOtp:", error);
    res.status(500).send({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

export const changeAvatar = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file uploaded for avatar change");
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Get user ID from request
    const userId = req.user._id; // Get from auth middleware
    if (!userId) {
      console.error("No user ID found in request");
      return res.status(400).send({ message: "User ID not found" });
    }

    console.log("Processing avatar change for user ID:", userId);
    console.log("File received:", req.file.path);

    // First find the user to check if they exist and to get their old avatar
    const user = await UsersModel.findById(userId);
    if (!user) {
      console.error("User not found for avatar change, ID:", userId);
      return res.status(404).send({ message: "User not found" });
    }

    // If user already has an avatar in Cloudinary, delete it
    if (user.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(user.cloudinary_id);
        console.log("Previous avatar deleted from Cloudinary:", user.cloudinary_id);
      } catch (cloudinaryError) {
        console.error("Error deleting previous avatar:", cloudinaryError);
        // Continue despite error in deletion
      }
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "zalo/avatars",
      resource_type: "auto"
    });
    console.log("New avatar uploaded to Cloudinary:", result.public_id);

    // Update user with new avatar URL and cloudinary ID
    const updatedUser = await UsersModel.findByIdAndUpdate(
      userId,
      {
        avatar: result.secure_url,
        cloudinary_id: result.public_id
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("Failed to update user with new avatar, ID:", userId);
      return res.status(500).send({ message: "Failed to update user with new avatar" });
    }

    // Return success with updated user data
    return res.status(200).send({
      message: "Avatar updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error changing avatar:", error);
    return res.status(500).send({
      message: "Error changing avatar",
      error: error.message
    });
  }
};

export const searchUser = async (req, res) => {
  const user = await UsersModel.findOne({ phone: req.body.phone });
  if (user) {
    res.send(user);
  } else {
    res.status(403).send({ message: "Số điện thoại hoặc email không đúng" });
  }
};

export const addFriend = async (userFrom, userTo) => {
  const fromId = safeId(userFrom);
  const toId = safeId(userTo);
  
  if (!fromId || !toId) {
    console.error("Invalid user IDs for add friend:", { userFrom, userTo });
    return;
  }

  try {
    const userToAccount = await UsersModel.findById(toId);
    const userFromAccount = await UsersModel.findById(fromId);
    console.log("Adding friend:", fromId, toId);

    if (userToAccount && userFromAccount) {
      // Check if already friends or request pending
      const alreadyFriend = userFromAccount.friends.some(f => String(f.idUser) === String(toId));
      const alreadyRequested = userFromAccount.myRequest.some(r => String(r.idUser) === String(toId));
      
      if (alreadyFriend) {
        console.log("Already friends, no action needed");
        return;
      }
      
      if (alreadyRequested) {
        console.log("Request already sent, no action needed");
        return;
      }
      
      userToAccount.peopleRequest.push({ idUser: fromId });
      userFromAccount.myRequest.push({ idUser: toId });

      await userToAccount.save();
      await userFromAccount.save();
    } else {
      console.error("Could not find one or both users for add friend:", { fromId, toId });
    }
  } catch (error) {
    console.error("Error in addFriend:", error);
  }
};

export const deleteRequestFriend = async (userFrom, userTo) => {
  const fromId = safeId(userFrom);
  const toId = safeId(userTo);
  
  if (!fromId || !toId) {
    console.error("Invalid user IDs for delete request:", { userFrom, userTo });
    return;
  }

  try {
    const userToAccount = await UsersModel.findById(toId);
    const userFromAccount = await UsersModel.findById(fromId);

    if (userToAccount && userFromAccount) {
      userFromAccount.myRequest = userFromAccount.myRequest.filter(
        (x) => String(x.idUser) !== String(toId)
      );
      userToAccount.peopleRequest = userToAccount.peopleRequest.filter(
        (x) => String(x.idUser) !== String(fromId)
      );

      await userFromAccount.save();
      await userToAccount.save();
    } else {
      console.error("Could not find one or both users for delete request:", { fromId, toId });
    }
  } catch (error) {
    console.error("Error in deleteRequestFriend:", error);
  }
};

export const acceptFriend = async (userFrom, userTo) => {
  // Make sure both IDs are valid
  const fromId = safeId(userFrom);
  const toId = safeId(userTo);
  
  if (!fromId || !toId) {
    console.error("Invalid user IDs:", { userFrom, userTo });
    return;
  }

  try {
    const userFromAccount = await UsersModel.findById(fromId);
    const userToAccount = await UsersModel.findById(toId);

    if (userFromAccount && userToAccount) {
      // ------------ CREATE NEW CONVERSATION
      const newConversation = new ConversationModel({
        type: "single",
        members: [],
      });
      
      // Ensure valid ObjectIds
      newConversation.members.push({ idUser: fromId });
      newConversation.members.push({ idUser: toId });
      await newConversation.save();
      console.log("new-conversation: ", newConversation._id);

      // ------------ CODE LOGIC
      userFromAccount.peopleRequest = userFromAccount.peopleRequest.filter(
        (x) => String(x.idUser) !== String(toId)
      );
      userFromAccount.friends.push({
        idUser: toId,
        idConversation: newConversation._id,
      });

      userToAccount.myRequest = userToAccount.myRequest.filter(
        (x) => String(x.idUser) !== String(fromId)
      );
      userToAccount.friends.push({
        idUser: fromId,
        idConversation: newConversation._id,
      });
      console.log("userToAccount: ", userToAccount);

      await userFromAccount.save();
      await userToAccount.save();
    } else {
      console.error("Could not find one or both users:", { userFrom, userTo });
    }
  } catch (error) {
    console.error("Error in acceptFriend:", error);
  }
};

export const DontAcceptFriend = async (userFrom, userTo) => {
  const fromId = safeId(userFrom);
  const toId = safeId(userTo);
  
  if (!fromId || !toId) {
    console.error("Invalid user IDs for rejecting friend request:", { userFrom, userTo });
    return;
  }

  try {
    const userFromAccount = await UsersModel.findById(fromId);
    const userToAccount = await UsersModel.findById(toId);

    if (userFromAccount && userToAccount) {
      userFromAccount.peopleRequest = userFromAccount.peopleRequest.filter(
        (x) => String(x.idUser) !== String(toId)
      );

      userToAccount.myRequest = userToAccount.myRequest.filter(
        (x) => String(x.idUser) !== String(fromId)
      );

      await userFromAccount.save();
      await userToAccount.save();
    } else {
      console.error("Could not find one or both users for rejecting friend request:", { fromId, toId });
    }
  } catch (error) {
    console.error("Error in DontAcceptFriend:", error);
  }
};

export const unFriend = async (userFrom, userTo, idConversation) => {
  const fromId = safeId(userFrom);
  const toId = safeId(userTo);
  
  if (!fromId || !toId) {
    console.error("Invalid user IDs for unfriend:", { userFrom, userTo });
    return;
  }

  try {
    if (idConversation) {
      await ConversationModel.findByIdAndDelete(idConversation);
      await MessageModel.deleteMany({ idConversation: idConversation });
    }

    const userFromAccount = await UsersModel.findById(fromId);
    const userToAccount = await UsersModel.findById(toId);

    if (userFromAccount && userToAccount) {
      userFromAccount.friends = userFromAccount.friends.filter(
        (x) => String(x.idUser) !== String(toId)
      );

      userToAccount.friends = userToAccount.friends.filter(
        (x) => String(x.idUser) !== String(fromId)
      );

      await userFromAccount.save();
      await userToAccount.save();
    } else {
      console.error("Could not find one or both users for unfriend:", { fromId, toId });
    }
  } catch (error) {
    console.error("Error in unFriend:", error);
  }
};

export const getAllPeopleRequestByUser = async (req, res) => {
  const list = await UsersModel.findById(req.params.id).populate({
    path: "peopleRequest.idUser",
    select: { name: 1, avatar: 1 },
  });
  res.send(list.peopleRequest);
};

export const getAllFriendByUser = async (req, res) => {
  const list = await UsersModel.findById(req.params.id).populate({
    path: "friends.idUser",
    select: { name: 1, avatar: 1 },
  });

  res.send(list.friends);
};

export const Demo = (req, res) => {
  res.send("dnsahbc");
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Updating user with ID:", userId);
    console.log("Request body:", req.body);
    
    // Validate user ID
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }
    
    // Find the user
    const user = await UsersModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    
    // Update user fields
    if (req.body.name) {
      console.log("Updating name to:", req.body.name);
      user.name = req.body.name;
    }
    
    if (req.body.phone) {
      console.log("Updating phone to:", req.body.phone);
      user.phone = req.body.phone;
    }
    
    // Save the updated user
    await user.save();
    console.log("User updated successfully:", user);
    
    // Emit socket event for real-time updates
    if (global.io) {
      console.log("Emitting user_updated event for user:", userId);
      global.io.emit("user_updated", {
        userId: userId,
        name: user.name,
        phone: user.phone
      });
    } else {
      console.log("Socket.io not available for real-time updates");
    }
    
    // Return the updated user
    return res.status(200).send({
      message: "User updated successfully",
      user: user
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send({
      message: "Error updating user",
      error: error.message
    });
  }
};

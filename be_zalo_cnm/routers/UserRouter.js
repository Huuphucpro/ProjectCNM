import express from 'express'
import {
  changeAvatar,
  checkCodeOtp,
  Demo,
  getAllFriendByUser,
  getAllPeopleRequestByUser,
  getNewToken,
  getUser,
  getUserById,
  Login,
  Register,
  searchUser,
  sendMail,
  UpdatePassword,
  updateUser,
} from "../controllers/UserController.js";
import { isAuth } from "../utils/index.js";
import { upload } from "../utils/uploadImage.js";

const UserRouter = express.Router();

UserRouter.get("/", getUser);
UserRouter.get("/:id", getUserById);
UserRouter.post("/login", Login);
UserRouter.post("/register", Register);

UserRouter.post("/sendmail", sendMail);
UserRouter.post("/checkotp", checkCodeOtp);
UserRouter.post("/updatepassword", UpdatePassword);
UserRouter.post("/getnewtoken", getNewToken);

UserRouter.post("/avatar", isAuth, upload.single("image"), changeAvatar);
UserRouter.post("/search", searchUser);

UserRouter.get("/getAllFriendByUser/:id", getAllFriendByUser);
UserRouter.get("/getAllPeopleRequestByUser/:id", getAllPeopleRequestByUser);

UserRouter.put("/:id", isAuth, upload.none(), updateUser);

UserRouter.get("/demo", Demo);

UserRouter.post("/forgot-pass", sendMail);
UserRouter.post("/reset-password", UpdatePassword);

export default UserRouter

// Interface cho tin nhắn
export interface IMessage {
  _id: string;
  sender: string;
  message: string;
  idConversation: string;
  createdAt: string;
  updatedAt: string;
  type?: MessageType;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
  seen?: boolean;
}

// Interface cho cuộc trò chuyện
export interface IConversation {
  _id: string;
  name?: string;
  avatar?: string;
  members: string[];
  isGroup: boolean;
  lastMessage?: {
    _id: string;
    sender: string;
    message: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Interface cho thành viên trong cuộc trò chuyện nhóm
export interface IGroupMember {
  _id: string;
  name: string;
  avatar?: string;
}

// Interface cho thông tin người đang chat cùng
export interface IChatWith {
  idConversation: string;
  idUser: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

// Interface cho tham số gửi tin nhắn
export interface ISendMessageParams {
  sender: string;
  message: string;
  idConversation: string;
  type?: MessageType;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
}

// Interface cho tham số tạo cuộc trò chuyện mới
export interface ICreateConversationParams {
  userId: string;
  friendId: string;
}

// Interface cho tham số tạo nhóm chat mới
export interface ICreateGroupParams {
  name: string;
  members: string[];
  creatorId: string;
}

// Interface cho tham số thêm thành viên vào nhóm
export interface IAddMemberParams {
  conversationId: string;
  memberId: string;
}

// Interface cho tham số xóa thành viên khỏi nhóm
export interface IRemoveMemberParams {
  conversationId: string;
  memberId: string;
}

// Interface cho tham số rời nhóm
export interface ILeaveGroupParams {
  conversationId: string;
  userId: string;
}

// Interface cho tham số đổi tên nhóm
export interface IRenameGroupParams {
  conversationId: string;
  name: string;
}

// Add message type enum
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file'
}
import axiosClient from './AxiosClient';
import { CHAT_API } from '../constants/ApiConstant';
import {
  ISendMessageParams,
  ICreateConversationParams,
  ICreateGroupParams,
  IAddMemberParams,
  IRemoveMemberParams,
  ILeaveGroupParams,
  IRenameGroupParams,
  IMessage,
  IConversation
} from '../types/ChatType';

/**
 * ChatApi - Contains all API calls related to chat functionality
 */
const ChatApi = {
  /**
   * Conversations
   */
  getConversationsByUser: (userId: string) => {
    return axiosClient.get<IConversation[]>(`${CHAT_API.GET_CONVERSATIONS}/${userId}`);
  },

  getMessagesByConversation: (conversationId: string, page = 1, limit = 20) => {
    return axiosClient.get<IMessage[]>(`${CHAT_API.GET_MESSAGES}/${conversationId}`, {
      params: { page, limit }
    });
  },

  createConversation: (data: ICreateConversationParams) => {
    return axiosClient.post<IConversation>(CHAT_API.CREATE_CONVERSATION, data);
  },

  createGroup: (data: ICreateGroupParams) => {
    return axiosClient.post<IConversation>(CHAT_API.CREATE_GROUP, data);
  },

  /**
   * Messages
   */
  sendMessage: (data: ISendMessageParams) => {
    return axiosClient.post<IMessage>(CHAT_API.SEND_MESSAGE, data);
  },

  sendImageMessage: (formData: FormData) => {
    return axiosClient.post<IMessage>(CHAT_API.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  markAsRead: (messageId: string, userId: string) => {
    return axiosClient.post(CHAT_API.MARK_AS_READ, { messageId, userId });
  },

  /**
   * Group Management
   */
  addMembersToGroup: (data: IAddMemberParams) => {
    return axiosClient.post(
      `${CHAT_API.ADD_MEMBER}/${data.conversationId}`, 
      { memberId: data.memberId }
    );
  },

  removeMemberFromGroup: (data: IRemoveMemberParams) => {
    return axiosClient.post(
      `${CHAT_API.REMOVE_MEMBER}/${data.conversationId}`, 
      { memberId: data.memberId }
    );
  },

  leaveGroup: (data: ILeaveGroupParams) => {
    return axiosClient.post(
      `${CHAT_API.LEAVE_GROUP}/${data.conversationId}`, 
      { userId: data.userId }
    );
  },

  renameGroup: (data: IRenameGroupParams) => {
    return axiosClient.patch(
      `${CHAT_API.RENAME_GROUP}/${data.conversationId}`, 
      { name: data.name }
    );
  }
};

export default ChatApi;
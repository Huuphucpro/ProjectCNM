import * as ChatConstant from "../../constants/ChatConstant";
import { IConversation, IMessage } from "../../types/ChatType";
import { FriendItem } from "../../types/UserType";

// Define missing constants
const UPDATE_SEEN_MESSAGE = 'UPDATE_SEEN_MESSAGE';

// --------------- GET ALL MESSAGES BY CONVERSATION
export const getAllMessageByConversationRequest = (id: string) => {
    return{
        type: ChatConstant.GET_ALL_MESSAGE_REQUEST,
        payload: id
    }
}
export const getAllMessageByConversationSuccess = (data: IMessage[]) => {
    return{
        type: ChatConstant.GET_ALL_MESSAGE_SUCCESS,
        payload: data
    }
}
export const getAllMessageByConversationFailure = (error: any) => {
    return{
        type: ChatConstant.GET_ALL_MESSAGE_FAILURE,
        payload: error
    }
}

// --------------- GET ALL CONVERSATION BY USER
export const getAllConversationByUserRequest = (id: string) => {
    return{
        type: ChatConstant.GET_ALL_CONVERSATION_REQUEST,
        payload: id
    }
}
export const getAllConversationByUserSuccess = (data: IConversation[]) => {
    return{
        type: ChatConstant.GET_ALL_CONVERSATION_SUCCESS,
        payload: data
    }
}
export const getAllConversationByUserFailure = (error: any) => {
    return{
        type: ChatConstant.GET_ALL_CONVERSATION_FAILURE,
        payload: error
    }
}

// --------------- SAVE INFO USER CURRENT CHATTING 
export const saveInfoChatWith = (friend: FriendItem) => {
    return{
        type: ChatConstant.SAVE_INFO_CHAT_WITH,
        payload: friend
    }
}

// --------------- PUSH NEW MESSAGE TO LIST MESSAGE
export const pushNewMesssgeToListMessage = (message: IMessage) => {
    return{
        type: ChatConstant.PUSH_NEW_MESSAGE,
        payload: message
    }
}

// --------------- UPDATE SEEN MESSAGE
export const updateSeenMessage = (messageId: string) => {
    return{
        type: UPDATE_SEEN_MESSAGE,
        payload: messageId
    }
}

// --------------- CREATE NEW GROUP
export const createNewGroupRequest = (data: any) => {
    return{
        type: ChatConstant.CREATE_GROUP_REQUEST,
        payload: data
    }
}
export const createNewGroupSuccess = (data: any) => {
    return{
        type: ChatConstant.CREATE_GROUP_SUCCESS,
        payload: data
    }
}
export const createNewGroupFailure = (error: any) => {
    return{
        type: ChatConstant.CREATE_GROUP_FAILURE,
        payload: error
    }
}

// --------------- ADD MEMBERS TO GROUP
export const addMembersToGroupRequest = (data: any) => {
    return{
        type: ChatConstant.ADD_MEMBER_REQUEST,
        payload: data
    }
}
export const addMembersToGroupSuccess = (data: any) => {
    return{
        type: ChatConstant.ADD_MEMBER_SUCCESS,
        payload: data
    }
}
export const addMembersToGroupFailure = (error: any) => {
    return{
        type: ChatConstant.ADD_MEMBER_FAILURE,
        payload: error
    }
}

// --------------- LEAVE GROUP
export const leaveGroupRequest = (data: any) => {
    return{
        type: ChatConstant.LEAVE_GROUP_REQUEST,
        payload: data
    }
}
export const leaveGroupSuccess = (data: any) => {
    return{
        type: ChatConstant.LEAVE_GROUP_SUCCESS,
        payload: data
    }
}
export const leaveGroupFailure = (error: any) => {
    return{
        type: ChatConstant.LEAVE_GROUP_FAILURE,
        payload: error
    }
}

// --------------- RENAME GROUP
export const renameGroupRequest = (data: any) => {
    return{
        type: ChatConstant.RENAME_GROUP_REQUEST,
        payload: data
    }
}
export const renameGroupSuccess = (data: any) => {
    return{
        type: ChatConstant.RENAME_GROUP_SUCCESS,
        payload: data
    }
}
export const renameGroupFailure = (error: any) => {
    return{
        type: ChatConstant.RENAME_GROUP_FAILURE,
        payload: error
    }
}
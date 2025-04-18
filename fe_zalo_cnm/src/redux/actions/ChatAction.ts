import {ChatConstant} from '../../constants/ChatConstant'
import { Conversation, IMessage } from '../../types/ChatType'
import { Error } from '../../types/common/CommonType'
import { FriendItem, Message } from '../../types/UserType'

// --------------- GET ALL MESSAGE BY CONVERSATION 
export const getAllMessageByConversationRequest = (idConversation: string) => {
    return{
        type: ChatConstant.GET_ALL_MESSAGE_BY_CONVERSATION_REQUEST,
        payload: idConversation
    }
}
export const getAllMessageByConversationSuccess = (data: IMessage[]) => {
    return{
        type: ChatConstant.GET_ALL_MESSAGE_BY_CONVERSATION_SUCCESS,
        payload: data
    }
}
export const getAllMessageByConversationFailure = (error: Message) => {
    return{
        type: ChatConstant.GET_ALL_MESSAGE_BY_CONVERSATION_FAILURE,
        payload: error
    }
}

export const pushNewMesssgeToListMessage = (message: IMessage) => {
    return {
        type: ChatConstant.PUSH_NEW_MESSAGE_TO_LIST_MESSAGE,
        payload: message,
    }
}

// --------------- GET ALL CONVERSATION BY USER
export const getAllConversationByUserRequest = (id: string) => {
    return{
        type: ChatConstant.GET_ALL_CONVERSATION_BY_USER_REQUEST,
        payload: id
    }
}
export const getAllConversationByUserSuccess = (data: Conversation[]) => {
    console.log(data)
    return{
        type: ChatConstant.GET_ALL_CONVERSATION_BY_USER_SUCCESS,
        payload: data
    }
}
export const getAllConversationByUserFailure = (error: Error) => {
    return{
        type: ChatConstant.GET_ALL_CONVERSATION_BY_USER_FAILURE,
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
import { call, put, takeLatest, debounce } from "@redux-saga/core/effects"
import { getAllConversationByUser, getAllMessageByConversation } from "../../api/ChatApi"
import { ChatConstant } from "../../constants/ChatConstant"
import { Conversation, IMessage } from "../../types/ChatType"
import { Actions } from "../../types/common/CommonType"
import { Error as ErrorType } from "../../types/common/CommonType"
import { Message } from "../../types/UserType"
import { getAllConversationByUserFailure, getAllConversationByUserSuccess, getAllMessageByConversationFailure, getAllMessageByConversationSuccess } from "../actions/ChatAction"

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function* getAllMessageByConversationSaga(action: Actions){
    try {
        const data:IMessage[] =  yield call(getAllMessageByConversation, action.payload)
        yield put(getAllMessageByConversationSuccess(data))

    } catch (error: unknown) {
        const err = error as ErrorResponse;
        const errorMessage: Message = {
            message: err.response?.data?.message || 'Unknown error occurred'
        };
        yield put(getAllMessageByConversationFailure(errorMessage))
    }
}

function* getAllConversationByUserSaga(action: Actions){
    try {
        const data:Conversation[] =  yield call(getAllConversationByUser, action.payload)
        yield put(getAllConversationByUserSuccess(data))

    } catch (error: unknown) {
        const err = error as ErrorResponse;
        const errorObj: ErrorType = {
            message: err.response?.data?.message || 'Unknown error occurred'
        };
        yield put(getAllConversationByUserFailure(errorObj))
    }
}

function* ChatSaga() {
    yield debounce(500, ChatConstant.GET_ALL_CONVERSATION_BY_USER_REQUEST, getAllConversationByUserSaga)
    yield takeLatest(ChatConstant.GET_ALL_MESSAGE_BY_CONVERSATION_REQUEST, getAllMessageByConversationSaga)
}

export default ChatSaga
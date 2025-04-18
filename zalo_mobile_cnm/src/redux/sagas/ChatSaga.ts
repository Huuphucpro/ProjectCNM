import { put, call, takeLatest } from "redux-saga/effects";
import ChatApi from "../../api/ChatApi";
import * as ChatConstants from "../../constants/ChatConstant";
import { IMessage, IConversation, ICreateGroupParams, IAddMemberParams, ILeaveGroupParams, IRenameGroupParams } from "../../types/ChatType";
import { API_ERRORS } from "../../constants/ApiConstant";
import { handleApiError, showErrorMessage } from "../../utils/ErrorHandler";
import { apiCall } from "../../api/AxiosClient";

import {
  addMembersToGroupFailure,
  addMembersToGroupSuccess,
  createNewGroupFailure,
  createNewGroupSuccess,
  getAllConversationByUserFailure,
  getAllConversationByUserSuccess,
  getAllMessageByConversationFailure,
  getAllMessageByConversationSuccess,
  leaveGroupFailure,
  leaveGroupSuccess,
  renameGroupFailure,
  renameGroupSuccess,
} from "../actions/ChatAction";

// Define Action type
interface Action {
  type: string;
  payload: any;
}

function* GetAllMessageByConversationSaga(action: Action): Generator<any, void, any> {
  try {
    const messages: IMessage[] = yield call(
      apiCall, 
      () => ChatApi.getMessagesByConversation(action.payload)
    );
    yield put(getAllMessageByConversationSuccess(messages));
  } catch (error: unknown) {
    const err = handleApiError(error, "Failed to load messages");
    const errorObj = { error: err.message };
    yield put(getAllMessageByConversationFailure(errorObj));
  }
}

function* GetAllConversationByUserSaga(action: Action): Generator<any, void, any> {
  try {
    const conversations: IConversation[] = yield call(
      apiCall,
      () => ChatApi.getConversationsByUser(action.payload)
    );
    yield put(getAllConversationByUserSuccess(conversations));
  } catch (error: unknown) {
    const err = handleApiError(error, "Failed to load conversations");
    showErrorMessage(err.message);
    const errorObj = { error: err.message };
    yield put(getAllConversationByUserFailure(errorObj));
  }
}

function* CreateNewGroupSaga(action: Action): Generator<any, void, any> {
  try {
    const groupData: ICreateGroupParams = {
      name: action.payload.name,
      members: action.payload.members,
      creatorId: action.payload.creatorId || action.payload.members[0]
    };
    
    const result: IConversation = yield call(
      apiCall,
      () => ChatApi.createGroup(groupData)
    );
    yield put(createNewGroupSuccess(result));
  } catch (error: unknown) {
    const err = handleApiError(error, "Failed to create group");
    showErrorMessage(err.message);
    const errorObj = { error: err.message };
    yield put(createNewGroupFailure(errorObj));
  }
}

function* AddMembersToGroupSaga(action: Action): Generator<any, void, any> {
  try {
    const memberData: IAddMemberParams = {
      conversationId: action.payload.groupId,
      memberId: action.payload.memberIds
    };
    
    const result = yield call(
      apiCall,
      () => ChatApi.addMembersToGroup(memberData)
    );
    yield put(addMembersToGroupSuccess(result));
  } catch (error: unknown) {
    const err = handleApiError(error, "Failed to add members to group");
    showErrorMessage(err.message);
    const errorObj = { error: err.message };
    yield put(addMembersToGroupFailure(errorObj));
  }
}

function* LeaveGroupSaga(action: Action): Generator<any, void, any> {
  try {
    const leaveData: ILeaveGroupParams = {
      conversationId: action.payload.groupId,
      userId: action.payload.userId
    };
    
    const result = yield call(
      apiCall,
      () => ChatApi.leaveGroup(leaveData)
    );
    yield put(leaveGroupSuccess(result));
  } catch (error: unknown) {
    const err = handleApiError(error, "Failed to leave group");
    showErrorMessage(err.message);
    const errorObj = { error: err.message };
    yield put(leaveGroupFailure(errorObj));
  }
}

function* RenameGroupSaga(action: Action): Generator<any, void, any> {
  try {
    const renameData: IRenameGroupParams = {
      conversationId: action.payload.groupId,
      name: action.payload.newName
    };
    
    const result = yield call(
      apiCall,
      () => ChatApi.renameGroup(renameData)
    );
    yield put(renameGroupSuccess(result));
  } catch (error: unknown) {
    const err = handleApiError(error, "Failed to rename group");
    showErrorMessage(err.message);
    const errorObj = { error: err.message };
    yield put(renameGroupFailure(errorObj));
  }
}

function* ChatSaga() {
  yield takeLatest(ChatConstants.GET_ALL_MESSAGE_REQUEST, GetAllMessageByConversationSaga);
  yield takeLatest(ChatConstants.GET_ALL_CONVERSATION_REQUEST, GetAllConversationByUserSaga);
  yield takeLatest(ChatConstants.CREATE_GROUP_REQUEST, CreateNewGroupSaga);
  yield takeLatest(ChatConstants.ADD_MEMBER_REQUEST, AddMembersToGroupSaga);
  yield takeLatest(ChatConstants.LEAVE_GROUP_REQUEST, LeaveGroupSaga);
  yield takeLatest(ChatConstants.RENAME_GROUP_REQUEST, RenameGroupSaga);
}

export default ChatSaga;
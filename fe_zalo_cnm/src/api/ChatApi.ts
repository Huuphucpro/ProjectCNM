import { Conversation, IMessage} from "../types/ChatType";
import axiosClient from "./AxiosClient";

export const getAllMessageByConversation = (id: string): Promise<IMessage[]> => axiosClient.get(`/chat/allmessage/${id}`)
export const getAllConversationByUser = (id: string): Promise<Conversation[]> => axiosClient.get(`/chat/${id}`)
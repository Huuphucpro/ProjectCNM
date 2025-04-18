export interface IMessage {
    _id: string,
    idConversation: string,
    sender: string,
    message: string,
    seen: boolean,
    createdAt: string
}
export interface User {
    _id: string,
    idUser: {
        _id: string,
        name: string,
        avatar: string
    }
}
export interface Conversation{
    _id: string,
    type: string,
    lastMessage: IMessage,
    members: {
        idUser: {
            _id: string,
            name: string,
            avatar: string
        },
        unreadCount: number
    }[],
    name?: string,
}
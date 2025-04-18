import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllConversationByUserRequest, getAllMessageByConversationRequest, saveInfoChatWith } from '../../../redux/actions/ChatAction'
import { showChat } from '../../../redux/actions/OptionLayoutAction'
import { RootState } from '../../../redux/reducers'
import { Conversation, User } from '../../../types/ChatType'
import styles from './Conversations.module.scss'
import { IMessage } from '../../../types/ChatType'
import { FriendItem } from '../../../types/UserType'

const Conversations = () => {
    const dispatch = useDispatch()
    const { userCurrent }: any = useSelector<RootState>((state) => state.user);
    const { listConversation, listMessage }: any = useSelector<RootState>(state => state.chat)
    const { socket }: any = useSelector<RootState>((state) => state);

    // Kiểm tra xem tin nhắn có phải là ảnh không
    const isImageMessage = (message: string) => {
        return message?.startsWith('data:image/');
    };

    // Format tin nhắn cuối cùng
    const formatLastMessage = (message: string, isFromCurrentUser: boolean) => {
        if (!message) return '';
        if (isImageMessage(message)) {
            return isFromCurrentUser ? 'Bạn đã gửi một hình ảnh' : 'Đã gửi một hình ảnh';
        }
        return isFromCurrentUser ? `Bạn: ${message}` : message;
    };

    useEffect(() => {
        // Chỉ thực hiện khi có danh sách hội thoại hợp lệ
        if (listConversation && Array.isArray(listConversation) && listConversation.length > 0) {
            const arrIdConversation: string[] = []
            listConversation.forEach((item: Conversation) => {
                if (item && item._id) {
                    arrIdConversation.push(item._id);
                }
            });
            
            if (arrIdConversation.length > 0) {
                console.log("Joining conversation rooms:", arrIdConversation);
                socket.emit('join_all_conversation', arrIdConversation);
            }
        } else {
            console.log("No conversations to join");
        }
    }, [listConversation])

    useEffect(() => {
        dispatch(getAllConversationByUserRequest(userCurrent._id));
    }, []);

    // Gộp tất cả các event listeners vào một useEffect
    useEffect(() => {
        const handleConversationUpdate = () => {
            dispatch(getAllConversationByUserRequest(userCurrent._id));
        };

        // Đăng ký lắng nghe các sự kiện
        socket.on('new_message', handleConversationUpdate);
        socket.on('seen_message', handleConversationUpdate);
        socket.on('conversation_updated', handleConversationUpdate);
        socket.on('user_updated', handleConversationUpdate);

        // Cleanup khi component unmount
        return () => {
            socket.off('new_message', handleConversationUpdate);
            socket.off('seen_message', handleConversationUpdate);
            socket.off('conversation_updated', handleConversationUpdate);
            socket.off('user_updated', handleConversationUpdate);
        };
    }, [socket, userCurrent._id]);

    const handleChat = async (chatWithUser: any, idConversation: string) => {
        const friendItem: FriendItem = {
            _id: idConversation,
            idUser: chatWithUser,
            idConversation: idConversation
        };
        
        // Lưu thông tin chat trước
        dispatch(saveInfoChatWith(friendItem));
        
        // Emit seen_message event
        socket.emit('seen_message', {
            idConversation: idConversation,
            userId: userCurrent._id
        });

        // Đợi một chút để đảm bảo thông tin chat đã được lưu
        setTimeout(() => {
            // Lấy tin nhắn của conversation
            dispatch(getAllMessageByConversationRequest(idConversation));
        }, 100);
    }

    const renderSingleConversation = (conversation: Conversation) => {
        // Tìm người dùng khác trong cuộc hội thoại
        const chatWithUser = conversation.members.find(
            member => member.idUser._id !== userCurrent._id
        );

        if (!chatWithUser) return null;

        const isLastMessageFromCurrentUser = conversation.lastMessage?.sender === userCurrent._id;
        const lastMessageText = formatLastMessage(conversation.lastMessage?.message, isLastMessageFromCurrentUser);

        return (
            <div className={styles.conversations_item} onClick={() => handleChat(chatWithUser.idUser, conversation._id)}>
                <div className={styles.avatar}>
                    <img src={chatWithUser.idUser.avatar} alt={chatWithUser.idUser.name} />
                </div>
                <div className={styles.main}>
                    <div className={styles.main_top}>
                        <div className={styles.name}>
                            {chatWithUser.idUser.name}
                        </div>
                        <div className={styles.info}>
                            20 phút
                        </div>
                    </div>
                    <div className={styles.main_bottom}>
                        <div className={conversation.lastMessage?.seen ? styles.lastmessage : `${styles.lastmessage} ${styles.not_seen}`}>
                            {lastMessageText}
                        </div>
                        <div className={styles.newmessage}>
                            {(() => {
                                const currentUserMember = conversation.members.find(
                                    member => member.idUser._id === userCurrent._id
                                );
                                const unreadCount = currentUserMember?.unreadCount || 0;
                                return unreadCount > 5 ? '5+' : unreadCount;
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.conversations}>
            {
                listConversation.map((conversation: Conversation) => conversation.type === 'single' ? renderSingleConversation(conversation) : '')
            }
        </div>
    )
}

export default Conversations

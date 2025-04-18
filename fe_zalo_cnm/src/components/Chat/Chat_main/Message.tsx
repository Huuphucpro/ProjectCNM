import React, { useEffect } from "react";
import styles from "./Message.module.scss";
import avatar from "../../../asset/images/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import {
    getAllMessageByConversationRequest,
    pushNewMesssgeToListMessage,
} from "../../../redux/actions/ChatAction";
import { getUserByIdRequest } from "../../../redux/actions/UserAction";
import { Conversation, IMessage } from "../../../types/ChatType";

const Message = () => {
    const dispatch = useDispatch();
    const { chatWith, listMessage }: any = useSelector<RootState>(
        (state) => state.chat
    );
    const { socket }: any = useSelector<RootState>((state) => state);
    const { userCurrent }: any = useSelector<RootState>((state) => state.user);

    // Kiểm tra xem tin nhắn có phải là ảnh không
    const isImageMessage = (message: string) => {
        return message.startsWith('data:image/');
    };

    // Render nội dung tin nhắn
    const renderMessageContent = (message: string) => {
        if (isImageMessage(message)) {
            return (
                <div className={styles.image_container}>
                    <img src={message} alt="Sent" className={styles.image_message} />
                    <div className={styles.image_text}>Đã gửi 1 hình ảnh</div>
                </div>
            );
        }
        return message;
    };

    // Lấy tin nhắn khi chuyển conversation
    useEffect(() => {
        if (!chatWith?.idConversation) return;
        dispatch(getAllMessageByConversationRequest(chatWith.idConversation));
    }, [chatWith?.idConversation]);

    // Xử lý socket events
    useEffect(() => {
        if (!chatWith?.idConversation) return;
        if (!userCurrent?._id) return;

        // Join conversation
        socket.emit("join_conversation", chatWith.idConversation);
        
        // Handler function cho tin nhắn mới
        const handleNewMessage = (newMessage: IMessage) => {
            if (newMessage.idConversation === chatWith.idConversation) {
                const messageExists = listMessage.some((msg: IMessage) => 
                    msg._id === newMessage._id || 
                    (msg.sender === newMessage.sender && 
                     msg.message === newMessage.message && 
                     Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000)
                );
                if (!messageExists) {
                    dispatch(pushNewMesssgeToListMessage(newMessage));
                }
            }
        };

        // Handler function cho tin nhắn đã xem
        const handleSeenMessage = () => {
            if (!userCurrent?._id) return;
            dispatch(getAllMessageByConversationRequest(chatWith.idConversation));
            dispatch(getUserByIdRequest(userCurrent._id));
        };

        socket.on("new_message", handleNewMessage);
        socket.on("seen_message", handleSeenMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("seen_message", handleSeenMessage);
        };
    }, [chatWith?.idConversation, socket, dispatch, userCurrent?._id]);

    // Scroll to bottom khi có tin nhắn mới
    useEffect(() => {
        if (!listMessage?.length) return;
        
        const element = document.querySelector(`.${styles.listMessage}`);
        if (element) {
            setTimeout(() => {
                element.scrollTop = element.scrollHeight;
            }, 100); // Thêm delay nhỏ để đảm bảo DOM đã được cập nhật
        }
    }, [listMessage]);

    return (
        <div className={styles.chat}>
            <div className={styles.listMessage}>
                {listMessage && listMessage.map((item: IMessage, index: number, arr: IMessage[]) =>
                    // CHECK SENDER IS CURRENT_USER OR SOMEONE
                    item.sender === userCurrent._id ? (
                        <div key={item._id || index} className={styles.listMessage_item_me}>
                            {
                                // HIDE AVATAR IF MESSAGE HAVE SENDER === PREVIOUS SENDER
                                index > 0 && item.sender === arr[index - 1].sender ? (
                                    <div className={`${styles.avatar}`} style={{ opacity: '0' }}>
                                        <img src={userCurrent.avatar} alt="avatar" />
                                    </div>
                                ) : (
                                    <div className={styles.avatar}>
                                        <img src={userCurrent.avatar} alt="avatar" />
                                    </div>
                                )
                            }
                            <div className={styles.main}>
                                <div className={styles.text}>
                                    {renderMessageContent(item.message)}
                                </div>
                                {index === arr.length - 1 && (
                                    <div className={styles.more}>
                                        <span className={styles.time}>
                                            {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className={styles.status}>
                                            {item.seen ? 'Đã xem' : 'Đã nhận'}
                                        </span>
                                        {item.seen && (
                                            <div className={styles.seen_avatar}>
                                                <img src={userCurrent.avatar} alt="Seen by" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div key={item._id || index} className={styles.listMessage_item}>
                            {
                                // HIDE AVATAR IF MESSAGE HAVE SENDER === PREVIOUS SENDER
                                index > 0 && item.sender === arr[index - 1].sender ? (
                                    <div className={`${styles.avatar}`} style={{ opacity: '0' }}>
                                        <img src={chatWith.idUser.avatar} alt="avatar" />
                                    </div>
                                ) : (
                                    <div className={styles.avatar}>
                                        <img src={chatWith.idUser.avatar} alt="avatar" />
                                    </div>
                                )
                            }
                            <div className={styles.main}>
                                <div className={styles.text}>
                                    {renderMessageContent(item.message)}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Message;

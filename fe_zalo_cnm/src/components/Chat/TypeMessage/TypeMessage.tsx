import React, { FormEvent, useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../redux/reducers'
import styles from './TypeMessage.module.scss'
import { updateUserUnreadMessages } from '../../../redux/actions/UserAction'

const EMOJIS = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠']

const TypeMessage = () => {
    const [message, setMessage] = useState<string>('')
    const [showEmoji, setShowEmoji] = useState<boolean>(false)
    const [isSending, setIsSending] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const messageInputRef = useRef<HTMLInputElement>(null)
    const { socket }: any = useSelector<RootState>(state => state)
    const { userCurrent }: any = useSelector<RootState>(state => state.user)
    const { chatWith, listMessage }: any = useSelector<RootState>(state => state.chat)
    const [focus, setFocus] = useState<boolean>(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (focus === true && listMessage.length > 0 && listMessage[listMessage.length - 1]?.sender !== userCurrent._id) {
            // Cập nhật state Redux ngay lập tức
            dispatch(updateUserUnreadMessages(0));
            
            // Emit seen_message event khi focus vào ô nhập tin nhắn
            socket.emit('seen_message', {
                idConversation: chatWith.idConversation,
                userId: userCurrent._id
            });
        }
    }, [focus, listMessage]);

    const sendMessage = async (messageToSend: string, type: 'text' | 'image' = 'text') => {
        if (!messageToSend || messageToSend.trim() === '' || isSending) return false;

        try {
            setIsSending(true);
            const data = {
                idConversation: chatWith.idConversation,
                sender: userCurrent._id,
                message: messageToSend.trim(),
                type
            };
            
            // Chỉ kiểm tra tin nhắn trùng lặp ngay lập tức
            const lastMessage = listMessage[listMessage.length - 1];
            if (lastMessage && 
                lastMessage.message === messageToSend.trim() && 
                lastMessage.sender === userCurrent._id &&
                Date.now() - new Date(lastMessage.createdAt).getTime() < 1000) {
                return false;
            }
            
            socket.emit('send_message', data);
            return true;
        } finally {
            // Giảm thời gian debounce xuống để không ảnh hưởng UX
            setTimeout(() => {
                setIsSending(false);
            }, 500);
        }
    }

    const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        if (trimmedMessage === '' || isSending) return;
        
        const success = await sendMessage(trimmedMessage);
        if (success) {
            setMessage('');
            if (messageInputRef.current) {
                messageInputRef.current.focus();
            }
        }
    }

    const handleFocus = () => {
        setFocus(true)
        setShowEmoji(false)
    }

    const handleEmojiClick = async (emoji: string) => {
        if (messageInputRef.current) {
            const start = messageInputRef.current.selectionStart || 0
            const end = messageInputRef.current.selectionEnd || 0
            const newMessage = message.substring(0, start) + emoji + message.substring(end)
            setMessage(newMessage)
            // Đặt lại vị trí con trỏ
            setTimeout(() => {
                if (messageInputRef.current) {
                    const newPosition = start + emoji.length
                    messageInputRef.current.focus()
                    messageInputRef.current.setSelectionRange(newPosition, newPosition)
                }
            }, 0)
        } else {
            setMessage(prevMsg => prevMsg + emoji)
        }
        setShowEmoji(false)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || isSending) return

        // Kiểm tra file có phải là ảnh không
        if (!file.type.match(/image.*/)) {
            alert('Vui lòng chọn file ảnh!')
            return
        }

        // Kiểm tra kích thước file (giới hạn 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước ảnh không được vượt quá 5MB!')
            return
        }

        try {
            setIsSending(true)
            const reader = new FileReader()
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    sendMessage(reader.result, 'image')
                }
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error('Error handling image:', error)
            alert('Có lỗi xảy ra khi xử lý ảnh!')
        } finally {
            setIsSending(false)
            // Reset input file
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleSendLike = () => {
        sendMessage('👍')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Ngăn chặn Enter khi đang hiển thị emoji picker
        if (e.key === 'Enter' && showEmoji) {
            e.preventDefault()
        }
    }

    return (
        <form className={styles.type_message} onSubmit={(e) => handleSubmitForm(e)}>
            <div className={styles.top}>
                <div className={styles.list}>
                    <div className={styles.item} onClick={() => setShowEmoji(!showEmoji)}>
                        <span><i className="far fa-smile"></i></span>
                    </div>
                    <div className={styles.item}>
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <span onClick={() => fileInputRef.current?.click()}>
                            <i className="far fa-images"></i>
                        </span>
                    </div>
                    <div className={styles.item}>
                        <span><i className="far fa-paperclip"></i></span>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.form}>
                    <input 
                        ref={messageInputRef}
                        placeholder="Nhập tin nhắn ..." 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        onFocus={() => handleFocus()} 
                        onBlur={() => setFocus(false)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className={styles.list}>
                    <div className={styles.item}>
                        <span className={styles.like} onClick={handleSendLike}>
                            <i className="far fa-thumbs-up"></i>
                        </span>
                    </div>
                </div>
            </div>
            {showEmoji && (
                <div className={styles.emoji_picker}>
                    <div className={styles.emoji_list}>
                        {EMOJIS.map((emoji, index) => (
                            <span 
                                key={index} 
                                onClick={() => handleEmojiClick(emoji)}
                                className={styles.emoji_item}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </form>
    )
}

export default TypeMessage

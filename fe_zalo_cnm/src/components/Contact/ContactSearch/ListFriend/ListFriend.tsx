import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMessageByConversationRequest, saveInfoChatWith } from '../../../../redux/actions/ChatAction'
import { showChat } from '../../../../redux/actions/OptionLayoutAction'
import { getAllFriendRequest } from '../../../../redux/actions/UserAction'
import { RootState } from '../../../../redux/reducers'
import { Friend, FriendItem } from '../../../../types/UserType'
import styles from './ListFriend.module.scss'
import ShowOption from './ShowOption'

type showOption = {
    id: string,
    status: boolean
}
const ListFriend = () => {
    const dispatch = useDispatch()
    const { userCurrent, friends }: any = useSelector<RootState>(state => state.user)
    const { socket }: any = useSelector<RootState>((state) => state);
    const [showOption, setShowOption] = useState<showOption>({
        id: '',
        status: false
    })

    useEffect(() => {
        dispatch(getAllFriendRequest(userCurrent._id))
    }, [userCurrent])

    // Lắng nghe sự kiện cập nhật thông tin người dùng
    useEffect(() => {
        socket.on('user_updated', (data: any) => {
            console.log("ListFriend: User updated event received:", data);
            // Cập nhật danh sách bạn bè khi có thay đổi thông tin người dùng
            dispatch(getAllFriendRequest(userCurrent._id));
        });

        return () => {
            socket.off('user_updated');
        };
    }, [socket, userCurrent._id, dispatch]);

    const handleChat = async (item: FriendItem) => {
        await dispatch(getAllMessageByConversationRequest(String(item.idConversation)))
        await dispatch(saveInfoChatWith(item))
        await dispatch(showChat())
        socket.emit('join_conversation', item.idConversation)
    }

    const handleShowOption = (itemId: string) => {
        setShowOption({
            id: itemId,
            status: !showOption.status
        })
    }
    const handleUnFriend = (item: FriendItem) => {
        const data = { userFrom: userCurrent._id, userTo: item.idUser._id, idConversation: item.idConversation };
        console.log(data)
        socket.emit('un_friend', data)
    }

    return (
        <div className={styles.listfriend}>
            <div className={styles.title}>
                <span>Bạn bè ({friends ? friends.length : 0})</span>
            </div>
            {
                friends ? friends.map((item: FriendItem) => (
                    <div className={styles.listfriend_item} key={item._id}>
                    <div className={styles.avatar}>
                        <img src={item.idUser.avatar}></img>
                        <div className={styles.dot}></div>
                    </div>
                        <div className={styles.main} onClick={() => handleChat(item)}>
                        <div className={styles.main_top}>
                            <div className={styles.name}>
                                {item.idUser.name}
                            </div>
                        </div>
                    </div>
                        <div className={styles.option}>
                            <i className="fal fa-ellipsis-h" onClick={() => handleShowOption(item._id)}></i>

                        {
                            showOption.status === true && showOption.id === item._id ? (<div className={styles.unfriend}>
                                <li onClick={() => handleUnFriend(item)}><span>Hủy kết bạn</span></li>
                            </div>) : ''
                        }
                    </div>
                </div>)) : ''
            }
        </div>
    )
}

export default ListFriend

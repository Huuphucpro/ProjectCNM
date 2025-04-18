import { emit } from 'process';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllPeopleRequestRequest, getUserByIdRequest } from '../../redux/actions/UserAction';
import { RootState } from '../../redux/reducers';
import { Friend, FriendItem } from '../../types/UserType';
import styles from './RequestFriend.module.scss'

const RequestFriend = () => {
    const dispatch = useDispatch()

    const { userCurrent, peopleRequest }: any = useSelector<RootState>((state) => state.user);
    const { socket }: any = useSelector<RootState>((state) => state);

    useEffect(() => {
        dispatch(getAllPeopleRequestRequest(userCurrent._id))
    }, [userCurrent])

    // Lắng nghe sự kiện cập nhật thông tin người dùng
    useEffect(() => {
        socket.on('user_updated', (data: any) => {
            console.log("RequestFriend: User updated event received:", data);
            // Cập nhật danh sách yêu cầu kết bạn khi có thay đổi thông tin người dùng
            dispatch(getAllPeopleRequestRequest(userCurrent._id));
        });

        return () => {
            socket.off('user_updated');
        };
    }, [socket, userCurrent._id, dispatch]);

    const handleAcceptFriend = (item: FriendItem) => {
        if (!item.idUser || !item.idUser._id) {
            console.error("Invalid friend item", item);
            return;
        }
        
        console.log("Accepting friend request", userCurrent._id, item.idUser._id);
        const data = { 
            userFrom: userCurrent._id, 
            userTo: item.idUser._id 
        };
        socket.emit('accept_request_friend', data);
        
        // Refresh user data after a short delay
        setTimeout(() => {
            dispatch(getUserByIdRequest(userCurrent._id));
        }, 1000);
    }

    const handleDontAcceptFriend = (item: FriendItem) => {
        if (!item.idUser || !item.idUser._id) {
            console.error("Invalid friend item", item);
            return;
        }
        
        console.log("Rejecting friend request", userCurrent._id, item.idUser._id);
        const data = { 
            userFrom: userCurrent._id, 
            userTo: item.idUser._id 
        };
        socket.emit('dont_accept_request_friend', data);
        
        // Refresh user data after a short delay
        setTimeout(() => {
            dispatch(getUserByIdRequest(userCurrent._id));
        }, 1000);
    }

    return (
        <div className={styles.request}>
            <div className={styles.title}>
                <span>Danh sách kết bạn</span>
            </div>
            <div className={styles.list}>
                <div className={styles.list_title}>
                    <span>Lời mời kết bạn ({`${userCurrent.peopleRequest?.length || 0}`})</span>
                </div>

                {
                    peopleRequest ? peopleRequest.map((item: FriendItem) => (
                        <div className={styles.list_item} key={item._id}>
                            <div className={styles.avatar}>
                                <img src={item.idUser?.avatar || "https://res.cloudinary.com/hoanghuytoi/image/upload/v1630225166/zalo/anonymous_bujoil.jpg"} alt="avatar"></img>
                            </div>
                            <div className={styles.name}>
                                <span>{item.idUser?.name || "Unknown"}</span>
                            </div>
                            <div className={styles.btn}>
                                <button className={styles.delete} onClick={() => handleDontAcceptFriend(item)}>Bỏ qua</button>
                                <button className={styles.accept} onClick={() => handleAcceptFriend(item)}>Đồng ý</button>
                            </div>
                        </div>
                    )) : 'Không có lời mời kết bạn'
                }

            </div>
        </div>
    )
}

export default RequestFriend

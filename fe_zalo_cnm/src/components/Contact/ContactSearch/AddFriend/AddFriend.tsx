import React, { useEffect } from "react";
import styles from "./AddFriend.module.scss";
import "../../../../scss/dialog.scss";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import { useForm, SubmitHandler } from "react-hook-form";
import { Friend, phone, User } from "../../../../types/UserType";
import { useDispatch, useSelector } from "react-redux";
import {
    searchUserRequest,
} from "../../../../redux/actions/UserAction";
import { RootState } from "../../../../redux/reducers";
import { useState } from "react";

type statusResult = {
    isFriend: boolean,
    isStranger: boolean,
    requested: boolean,
    isPeopleRequest: boolean,
    isMe: boolean,
}

type FormValues = {
    phone: string;
};

const AddFriend = ({ open, handleClose }: any) => {
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm<FormValues>();

    const [statusResult, setStatusResult] = useState<statusResult>({
        isFriend: false,
        isStranger: false,
        requested: false,
        isPeopleRequest: false,
        isMe: false,
    })

    const { resultSearch, error, userCurrent }: any = useSelector<RootState>(
        (state) => state.user
    );
    const { socket }: any = useSelector<RootState>((state) => state);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        dispatch(searchUserRequest(data));
    };

    useEffect(() => {
        if (resultSearch) {
            const isFriend = userCurrent.friends.find((x: Friend) => x.idUser === resultSearch._id)
            const requested = userCurrent.myRequest.find((x: Friend) => x.idUser === resultSearch._id)
            const isPeopleRequest = userCurrent.peopleRequest.find((x: Friend) => x.idUser === resultSearch._id)
            const isMe = resultSearch._id === userCurrent._id

            if (isFriend) {
                setStatusResult({
                    ...statusResult, isFriend: true
                })
            }
            else if (requested) {
                setStatusResult({
                    ...statusResult, requested: true
                })
            }

            else if (isPeopleRequest) {
                setStatusResult({
                    ...statusResult, isPeopleRequest: true
                })
            }
            else if (isMe) {
                setStatusResult({
                    ...statusResult, isMe: true
                })
            }
            else {
                setStatusResult({
                    ...statusResult, isStranger: true
                })
            }

        }
    }, [userCurrent, resultSearch])

    useEffect(() => {
        socket.on('add_friend_success', () => {
            setStatusResult({
                ...statusResult, requested: true
            })
        })

        socket.on('delete_request_friend_success', () => {
            setStatusResult({
                ...statusResult, isStranger: true
            })
        })

        socket.on("accept_request_friend_success", () => {
            setStatusResult({
                ...statusResult, isFriend: true
            })
        });

        socket.on("dont_accept_request_friend_success", (idUser: string) => {
            setStatusResult({
                ...statusResult, isStranger: true
            })
        });
    }, [])

    const handleAddFriend = () => {
        const data = { userFrom: userCurrent._id, userTo: resultSearch._id };
        socket.emit("add_friend", data);
    };

    const handleDeleteRequestFriend = () => {
        const data = { userFrom: userCurrent._id, userTo: resultSearch._id };
        socket.emit("delete_request_friend", data);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <form className={styles.dialog} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.title}>
                        <span>Thêm bạn</span>
                        <div className={styles.close} onClick={() => handleClose()}></div>
                    </div>
                    <div>
                        <input
                            placeholder="Số điện thoại hoặc email"
                            {...register("phone")}
                        ></input>
                    </div>

                    <div className={styles.results}>
                        {resultSearch ? (
                            <>
                                <div className={styles.lastresults}>Kết quả tìm kiếm</div>
                                <div className={styles.item}>
                                    {
                                        <div className={styles.avatar}>
                                            {resultSearch.avatar ? (
                                                <img src={resultSearch.avatar}></img>
                                            ) : (
                                                <img src="https://res.cloudinary.com/hoanghuytoi/image/upload/v1630225166/zalo/anonymous_bujoil.jpg"></img>
                                            )}
                                        </div>
                                    }
                                    <div className={styles.info}>
                                        <div className={styles.name}> {resultSearch.name}</div>
                                        <div className={styles.phone}> {resultSearch.phone}</div>
                                    </div>

                                    {/* cần phải check resultSearch._id có tồn tại trong request hay không */}
                                    <div
                                        className={styles.addfriend}
                                    >
                                        {
                                            statusResult.isFriend ? (<span>Bạn bè</span>) : ''
                                        }
                                        {
                                            statusResult.isStranger ? (<span onClick={() => handleAddFriend()}>Kết bạn</span>) : ''
                                        }
                                        {
                                            statusResult.requested ? (<span onClick={() => handleDeleteRequestFriend()}>Hủy lời mời kết bạn</span>) : ''
                                        }
                                        {
                                            statusResult.isPeopleRequest ? (<span>Chấp nhận</span>) : ''
                                        }
                                        {
                                            statusResult.isMe ? '' : ''
                                        }
                                    </div>
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                        {error ? (
                            <>
                                <div>
                                    <span className={styles.error}>{error}</span>
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                    </div>

                    <div className={styles.btn}>
                        <button className={`${styles.btn} ${styles.cancel}`}>Hủy</button>
                        <button className={`${styles.btn} ${styles.search}`}>
                            Tìm Kiếm
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriend;

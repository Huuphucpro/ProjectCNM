import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
    getNewTokenRequest,
    getUserByIdRequest,
} from "../../redux/actions/UserAction";
import { useHistory } from "react-router-dom";
import { connectSocket } from "../../redux/reducers/SocketReducer";

import Chat from '../Chat/Chat'
import Contact from '../Contact/Contact'
import NavBar from '../NavBar/NavBar'
import styles from './Container.module.scss'
import { RootState } from "../../redux/reducers";
import RequestFriend from "../RequestFriend/RequestFriend";

const Container = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const tokenLocalStorage = localStorage.getItem("token");
    const refeshTokenLocalStorage = localStorage.getItem("refeshToken");

    const { userCurrent }: any = useSelector<RootState>((state) => state.user);
    const { showChat, showFriends }: any = useSelector<RootState>(state => state.optionLayout)
    const { chatWith }: any = useSelector<RootState>(state => state.chat)
    const { socket }: any = useSelector<RootState>((state) => state);

    useEffect(() => {
        if (tokenLocalStorage === null || refeshTokenLocalStorage === null) {
            history.push("/login");
        } else {
            const token: string = tokenLocalStorage.slice(
                1,
                tokenLocalStorage.length - 1
            );
            const refeshToken: string = refeshTokenLocalStorage.slice(
                1,
                tokenLocalStorage.length - 1
            );
            const decoded: any = jwt_decode(token);
            dispatch(getUserByIdRequest(decoded._id))
            if (decoded.exp < Date.now() / 1000) {
                dispatch(getNewTokenRequest({ refeshToken }));
            }
        }
    }, []);

    useEffect(() => {
        if (userCurrent && userCurrent._id) {
            connectSocket(userCurrent, () => {
                socket.emit('join_room', userCurrent);
            });
        }

        socket.on("new_request_friend", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });

        socket.on("person_delete_request_friend", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });

        socket.on("accept_request_friend_success", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });
        socket.on("accept_request_friend", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });

        socket.on("dont_accept_request_friend_success", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });
        socket.on("dont_accept_request_friend", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });

        socket.on("un_friend_success", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });
        socket.on("un_friend", (idUser: string) => {
            dispatch(getUserByIdRequest(idUser))
        });

        socket.on('join_conversation', (idConversation: string) => {
            console.log(idConversation)
        })

        return () => {
            socket.off("new_request_friend");
            socket.off("person_delete_request_friend");
            socket.off("accept_request_friend_success");
            socket.off("accept_request_friend");
            socket.off("dont_accept_request_friend_success");
            socket.off("dont_accept_request_friend");
            socket.off("un_friend_success");
            socket.off("un_friend");
            socket.off("join_conversation");
        };
    }, [userCurrent])

    return (
        <div className={styles.container}>
            <div className={styles.navBar}>
                <NavBar></NavBar>
            </div>

            <div className={styles.sidebar}>
                <Contact></Contact>
            </div>

            <main className={styles.main}>
                {
                    showChat ? (<Chat></Chat>) : ''
                }
                {
                    showFriends ? (<RequestFriend></RequestFriend>) : ''
                }
            </main>
        </div>
    )
}

export default Container

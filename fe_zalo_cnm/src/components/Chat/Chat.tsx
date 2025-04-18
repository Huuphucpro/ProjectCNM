import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers'

import styles from './Chat.module.scss'
import ChatHeader from './Chat_header/ChatHeader'
import Message from './Chat_main/Message'
import TypeMessage from './TypeMessage/TypeMessage'


const Chat = () => {
    const { chatWith }: any = useSelector<RootState>(state => state.chat)
    return (
        <>
            {
                chatWith ? (
                    <div className={styles.chat}>
                        <ChatHeader></ChatHeader>
                        <Message></Message>
                        <TypeMessage></TypeMessage>
                    </div>) : ''
            }
        </>
    )
}

export default Chat

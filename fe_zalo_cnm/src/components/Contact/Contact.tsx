import React from 'react'
import ContactSearch from './ContactSearch/ContactSearch'
import styles from './Contact.module.scss'
import Conversations from './Conversations/Conversations'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers'
import ListFriend from './ContactSearch/ListFriend/ListFriend'

const Contact = () => {
    const { showChat, showFriends }: any = useSelector<RootState>(state => state.optionLayout)

    return (
        <div className={styles.contact}>
            <ContactSearch></ContactSearch>
            {
                showChat ? (<Conversations></Conversations>) : ''
            }
            {
                showFriends ? (<ListFriend></ListFriend>) : ''
            }
        </div>
    )
}

export default Contact

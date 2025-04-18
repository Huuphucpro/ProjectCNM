import React from 'react'
import styles from './ChatHeader.module.scss'
import avatar from '../../../asset/images/avatar.jpg'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers'

const ChatHeader = () => {
    const { chatWith }: any = useSelector<RootState>(state => state.chat)
    return (
        <div className={styles.header}>
            <div className={styles.avatar}>
                <div className={styles.img}>
                    <img src={chatWith.idUser.avatar}></img>
                </div>
                {/* <div className={styles.img}>
                            <img src={avatar}></img>
                        </div>
                        <div className={styles.img}>
                            <img src={avatar}></img>
                        </div>
                        <div className={styles.img}>
                            <img src={avatar}></img>
                        </div> */}
            </div>
            <div className={styles.main}>
                <div className={styles.name}>
                    <span>{chatWith.idUser.name}</span>
                </div>
                {/* <div className={styles.member}>
                            <span><i className="fal fa-user"></i> 530 thành viên</span>
                        </div> */}
            </div>
            <div className={styles.btn}>
                <div className={styles.add}>
                    <span><i className="fal fa-user-plus"></i></span>
                </div>
                <div className={styles.search}>
                    <span><i className="fal fa-search"></i></span>
                </div>
                <div className={styles.show}>
                    <span><i className="fal fa-bars"></i></span>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader

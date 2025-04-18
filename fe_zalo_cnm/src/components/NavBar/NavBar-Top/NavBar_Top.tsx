import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showChat, showFriends } from '../../../redux/actions/OptionLayoutAction';
import { RootState } from '../../../redux/reducers';
import styles from "./NavBar-Top.module.scss";

const NavBar_Top = () => {
    const dispatch = useDispatch()

    const { userCurrent }: any = useSelector<RootState>((state) => state.user);
    const chat: any = useSelector<RootState>(state => state.optionLayout.showChat)
    const friends: any = useSelector<RootState>(state => state.optionLayout.showFriends)

    const handleShowFriends = () => {
        dispatch(showFriends())
    }

    const handleShowChat = () => {
        dispatch(showChat())
    }

    return (
        <div className={styles.navbar_top}>
            <ul>
                <li className={chat ? (`${styles.navbar_top_active}`) : ('')}
                    onClick={handleShowChat}
                >
                    <i className="fas fa-comments-alt"></i>
                </li>
                <li className={friends ? (`${styles.navbar_top_active}`) : ('')}
                    onClick={handleShowFriends}
                >
                    <i className="fal fa-address-book"></i>
                    {
                        userCurrent.peopleRequest &&
                            userCurrent.peopleRequest.length > 0 &&
                            userCurrent.peopleRequest.length < 6 ?
                            <div className={styles.navbar_top_alert}>{userCurrent.peopleRequest.length}</div> : ''
                    }
                </li>
                <li>
                    <i className="fal fa-clipboard-check"></i>
                </li>
            </ul>
        </div>
    )
}

export default NavBar_Top
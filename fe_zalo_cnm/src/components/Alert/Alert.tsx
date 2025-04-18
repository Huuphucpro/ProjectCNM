import React from 'react'
import styles from './Alert.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface Props {
    type: string;
    message: string;
    show: Boolean;
    age?:string;
    
}
// interface nó khác với type -> dùng interface trong component de quản lý kiểu của props và hay phải thay doi
const Alert = ({ type, message, show }: Props) => {
    return (
        <>
            {
                show === true ? (<div className={styles.container}>
                    {
                        type === 'success' ? (<div className={`${styles.alert} ${styles.success}`}>
                            <p>{message}</p>
                            <span><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></span>
                        </div>) :

                            type === 'error' ? (<div className={`${styles.alert} ${styles.error}`}>
                                <p>{message}</p>
                                <span><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></span>
                            </div>) :

                                type === 'alert' ? (<div className={`${styles.alert} ${styles.alert}`}>
                                    <p>{message}</p>
                                    <span><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></span>
                                </div>) : ''

                    }
                </div>) : ''
            }
        </>
    )
}

export default Alert

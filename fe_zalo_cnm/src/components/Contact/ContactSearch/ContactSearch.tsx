import React, { useState } from 'react'
import styles from './ContactSearch.module.scss'
import '../../../scss/dialog.scss'

import AddFriend from './AddFriend/AddFriend'
import CreateGroup from './CreateGroup/CreateGroup'


const ContactSearch = () => {
    const [open, setOpen] = useState<Boolean>(false);
    const [openGroup, setOpenGroup] = useState<Boolean>(false)

    const handleClickOpenGroup = () => {
        setOpenGroup(true)
    }

    const handleCloseGroup = () => {
        setOpenGroup(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (

        <div className={styles.contact_search}>
            {
                open === true ? (<AddFriend open={open} handleClose={handleClose}></AddFriend>) : ''
            }
            {
                openGroup === true ? (<CreateGroup open={openGroup} handleClose={handleCloseGroup}></CreateGroup>) : ''
            }
            <form>
                <input placeholder="Tìm kiếm"></input>
                <span><i className="fal fa-search"></i></span>
            </form>
            <div className={styles.addfriend} onClick={handleClickOpen}>
                <i className="fal fa-user-plus"></i>
            </div>
            <div className={styles.creategroup} onClick={handleClickOpenGroup}>
                <i className="fal fa-users"></i>
            </div>

        </div>
    )
}

export default ContactSearch

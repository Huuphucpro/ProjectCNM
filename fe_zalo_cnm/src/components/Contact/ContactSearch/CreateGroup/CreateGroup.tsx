import React from 'react'
import styles from './CreateGroup.module.scss'
import '../../../../scss/dialog.scss'

import avatar from '../../../../asset/images/avatar.jpg'

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import Checkbox from '@material-ui/core/Checkbox';

const CreateGroup = ({ open, handleClose }: any) => {

    const [checked, setChecked] = React.useState(true);

    const handleChange = (event: any) => {
        setChecked(event.target.checked);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <div className={styles.dialog}>
                    <div className={styles.title}>
                        <span>Tạo nhóm</span>
                        <div className={styles.close} onClick={() => handleClose()}>

                        </div>
                    </div>
                    <div className={styles.create}>
                        <div className={styles.camera}>
                            <span><i className="fal fa-camera"></i></span>
                        </div>
                        <div className={styles.phone}>
                            <input placeholder="Nhập tên nhóm"></input>
                        </div>
                    </div>
                    <div className={styles.search}>
                        <span>Thêm bạn vào nhóm</span>
                        <form>
                            <input placeholder="Số điện thoại hoặc email"></input>
                            <span><i className="fal fa-search"></i></span>
                        </form>
                    </div>

                    <div className={styles.main}>
                        <div className={styles.friends}>

                            
                        </div>
                    </div>

                    <div className={styles.btn}>
                        <button className={`${styles.btn} ${styles.cancel}`}>Hủy</button>
                        <button className={`${styles.btn} ${styles.search}`}>Tạo nhóm</button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateGroup

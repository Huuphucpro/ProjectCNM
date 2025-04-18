import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logoutUserRequest } from "../../../redux/actions/UserAction";
import styles from "./NavBar-Bottom.module.scss";
import UpdateProfile from "./UpdateProfile/UpdateProfile";

const NavBar_Bottom = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async () => {
    dispatch(logoutUserRequest());
    history.push("/login");
  };

  return (
    <div className={styles.navbar_bottom}>
      <ul>
        <li>
          <i className="fal fa-cloud"></i>
        </li>
        <li onClick={() => setShowMenu(!showMenu)}>
          <i className="fal fa-cog"></i>

          {
            showMenu ? (<div className={styles.menu}>
              <div className={styles.menu_item} onClick={handleClickOpen}>
                <span><i className="fal fa-user"></i></span>
                <span>Thông tin tài khoản</span>
              </div>
              <div className={styles.menu_item}>
                <span><i className="fal fa-cog"></i></span>
                <span>Cài đặt</span>
              </div>
              <div className={styles.menu_item}>
                <span><i className="fal fa-database"></i></span>
                <span>Dữ liệu</span>
              </div>
              <div className={styles.menu_item}>
                <span><i className="fal fa-globe"></i></span>
                <span>Ngôn ngữ</span>
              </div>
              <div className={styles.menu_item}>
                <span><i className="fal fa-question-circle"></i></span>
                <span>Hỗ trợ</span>
              </div>
              <div className={styles.menu_item} onClick={handleLogout}>
                <span><i className="fal fa-sign-out"></i></span>
                <span>Đăng xuất</span>
              </div>
              <div className={styles.menu_item}>
                <span><i className="fal fa-times"></i></span>
                <span>Thoát</span>
              </div>
            </div>) : ''
          }

        </li>
      </ul>
      {
        open === true ? (<UpdateProfile open={open} handleClose={handleClose}></UpdateProfile>) : ''
      }
    </div>
  );
};

export default NavBar_Bottom;

import React from "react";
import styles from "./NavBar.module.scss";
import Avatar from "./Avatar/Avatar";
import NavBar_Top from "./NavBar-Top/NavBar_Top";
import NavBar_Bottom from "./NavBar-Bottom/NavBar_Bottom";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <Avatar></Avatar>
      <NavBar_Top></NavBar_Top>
      <NavBar_Bottom></NavBar_Bottom>
    </div>
  );
};

export default NavBar;

import React from "react";
import Login from "../components/Login/Login";

const LoginPage = () => {
  return (
    <>
      <Login></Login>
      <div className="bg-svg" style={{position: 'fixed', top: '0', left: 0, width: '100%', height: '100vh', backgroundImage: 'url(https://res.cloudinary.com/ds4v3awds/image/upload/v1743940527/p8t4hgpjuthf19sbin88.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      </div>
    </>
  );
};

export default LoginPage;

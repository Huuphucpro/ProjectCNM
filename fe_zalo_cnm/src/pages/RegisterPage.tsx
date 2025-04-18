import React from "react";
import Register from "../components/Register/Register";

const RegisterPage = () => {
  return (
    <div>
      <Register></Register>
      <div className="bg-svg" style={{position: 'fixed', top: '0', left: 0, width: '100%', height: '100vh', backgroundImage: 'url(https://res.cloudinary.com/ds4v3awds/image/upload/v1743940527/p8t4hgpjuthf19sbin88.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      </div>
    </div>
  );
};

export default RegisterPage;

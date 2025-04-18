import React from 'react'
import ForgotPass from '../components/ForgotPass/ForgotPass'

const ForgotPassPage = () => {
    return (
        <div>
            <ForgotPass></ForgotPass>
            <div className="bg-svg" style={{ position: 'fixed', top: '0', left: 0, width: '100%', height: '100vh', backgroundImage: 'url(https://res.cloudinary.com/ds4v3awds/image/upload/v1743940527/p8t4hgpjuthf19sbin88.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>
        </div>
    );
};

export default ForgotPassPage;

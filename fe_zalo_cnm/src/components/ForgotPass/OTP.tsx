import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { checkOtpRequest } from "../../redux/actions/UserAction";
import { RootState } from "../../redux/reducers";
import { Email, UserState } from "../../types/UserType";
import CountDown from "./CountDown";
import "./OTP.scss";

const OTP = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [time, setTime] = useState(60)
  const [otp, setOtp] = useState("")
  const { emailUserResetPass }: { emailUserResetPass: Email } = useSelector((state: RootState) => state.user)
  const user: UserState = useSelector((state: RootState) => state.user);
  const { error } = user;

  const handleChange = (otp: string) => setOtp(otp)

  // Make sure we have the email available
  useEffect(() => {
    // If no email in state, try to get from localStorage
    if (!emailUserResetPass?.email) {
      const storedEmail = localStorage.getItem('emailUserResetPass');
      if (!storedEmail) {
        // If no email found, redirect back to forgot password
        history.push('/forgotpass');
      }
    }
  }, [emailUserResetPass, history]);

  const getOtpValue = async () => {
    if (!otp || otp.length !== 6) {
      return; // Don't proceed if OTP is incomplete
    }
    
    const data = {
      email: emailUserResetPass?.email || JSON.parse(localStorage.getItem('emailUserResetPass') || '{}').email,
      otp,
    }
    
    if (!data.email) {
      history.push('/forgotpass'); // Redirect if email is still not available
      return;
    }
    
    await dispatch(checkOtpRequest(data, () => {
      // Store the email in localStorage for use in NewPass component
      localStorage.setItem('emailUserResetPass', JSON.stringify({ email: data.email }));
      history.push('/newpass')
    }))
  };

  return (
    <div className="otp">
      <div className="title">
        Khôi phục mật khẩu
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <OtpInput
          inputStyle={{
            width: "40px",
            flex: "1",
            minWidth: "25px",
            minHeight: "25px",
            fontSize: "1rem",
            color: "black",
            margin: "2px",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.3)",
          }}
          value={otp}
          onChange={handleChange}
          numInputs={6}
          separator={<strong>.</strong>}
        />

        {
          error ? (<div className="error">OTP không đúng</div>) : ''
        }
      </div>
      <div className="btn"><button onClick={getOtpValue} disabled={otp.length !== 6}>Xác nhận</button></div>

      <CountDown time={time}></CountDown>
    </div>
  );
};

export default OTP;

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import styles from "./ForgotPass.module.scss";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserState,
  getEmailRequest,
  saveEmailUser,
} from "../../redux/actions/UserAction";
import { RootState } from "../../redux/reducers";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Email, UserState } from "../../types/UserType";
import OTP from "./OTP";

type FormValues = {
  email: string;
};

const ForgotPass = () => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email không hợp lệ")
      .required("Email không được để trống"),
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) 
  });

  const [countDown, setCountDown] = useState<Boolean>(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Clear previous errors when component mounts
  useEffect(() => {
    dispatch(clearUserState());
    return () => {
      // Clear any existing timeouts when component unmounts
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    }
  }, [dispatch, errorTimeout]);
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Store the email in both Redux state and localStorage for persistence
      const emailData = { email: data.email };
      localStorage.setItem('emailUserResetPass', JSON.stringify(emailData));
      dispatch(saveEmailUser(emailData));
      
      // Request OTP to be sent to email
      dispatch(getEmailRequest(emailData));
      
      // Show OTP input component after a short delay to make sure state is updated
      const timeout = setTimeout(() => {
        setCountDown(true);
        reset();
      }, 500);
      
      setErrorTimeout(timeout);
    } catch (error) {
      console.error("Error sending email request:", error);
    }
  };

  const user: UserState = useSelector((state: RootState) => state.user);
  const { errorResetPass, isLoading, result } = user;

  // Effect to show OTP component when email is sent successfully
  useEffect(() => {
    if (result && result.message && !errorResetPass) {
      setCountDown(true);
    }
  }, [result, errorResetPass]);

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        {
          countDown ? (
            <OTP />
          ) : (
            <>
              <div className={styles.login_title}>
                Khôi phục mật khẩu 
              </div>
              <div className={styles.login_main}>
                <div className={styles.login_main_content}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <li>Nhập email để nhận mã xác thực</li>
                    <div className={styles.login_form_input}>
                      <input
                        type="text"
                        placeholder="Email"
                        {...register("email")}
                      ></input>
                      <span>
                        <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                      </span>
                      {errors.email ? (
                        <div className={styles.error}>{errors.email?.message}</div>
                      ) : (
                        ""
                      )}
                      {errorResetPass ? (
                        <div className={styles.error}>{errorResetPass}</div>
                      ) : (
                        ""
                      )}
                    </div>
                    <button
                      type="submit"
                      className={`${styles.btn_login}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang gửi...' : 'Tiếp tục'}
                    </button>
                  </form>
      
                  <Link to="/login" className={styles.back}>
                    Quay lại
                  </Link>
                </div>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default ForgotPass;

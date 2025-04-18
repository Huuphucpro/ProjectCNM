import { useState, useEffect } from "react";
import styles from "./NewPass.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updatePasswordRequest } from "../../redux/actions/UserAction";
import { useHistory } from "react-router-dom";
import { RootState } from "../../redux/reducers";

interface Password {
  password: string;
}

const NewPass = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<Password>();
  const { isLoading, resultUpdatePassword, error } = useSelector((state: RootState) => state.user);

  const [pass, setPass] = useState<string>("");
  const [repeatPass, setRepeatPass] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // Retrieve email from localStorage when component mounts
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("emailUserResetPass");
      if (storedEmail) {
        const parsedEmail = JSON.parse(storedEmail);
        if (parsedEmail && parsedEmail.email) {
          setEmail(parsedEmail.email);
        } else {
          // If email is not found, redirect to forgot password
          history.push("/forgotpass");
        }
      } else {
        // If email is not found, redirect to forgot password
        history.push("/forgotpass");
      }
    } catch (error) {
      console.error("Error retrieving email:", error);
      history.push("/forgotpass");
    }
  }, [history]);

  // Redirect to login page after successful password update
  useEffect(() => {
    if (success && resultUpdatePassword) {
      const timer = setTimeout(() => {
        // Clear stored email when process is complete
        localStorage.removeItem("emailUserResetPass");
        history.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, resultUpdatePassword, history]);

  const onSubmit: SubmitHandler<Password> = (data) => {
    if (pass === repeatPass) {
      if (pass.length < 8) {
        setErrorMessage("Mật khẩu phải lớn hơn 8 kí tự!");
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
      } else {
        const passwordData = {
          email: email,
          password: data.password,
        };
        
        dispatch(
          updatePasswordRequest(passwordData, () => {
            setSuccess(true);
          })
        );
      }
    } else {
      setErrorMessage("Mật khẩu không khớp!");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div className={styles.login_title}>Mật khẩu mới</div>
        <div className={styles.login_main}>
          <div className={styles.login_main_content}>
            {success && resultUpdatePassword ? (
              <div className={styles.success_message}>
                Cập nhật mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <li>Tạo mật khẩu mới</li>
                <div className={styles.login_form_input}>
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    {...register("password")}
                    onChange={(e) => setPass(e.target.value)}
                  ></input>
                  <span>
                    <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
                  </span>
                  {errorMessage && pass.length < 8 ? (
                    <div className={styles.error}>{errorMessage}</div>
                  ) : (
                    ""
                  )}
                </div>
                <div className={styles.login_form_input}>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    onChange={(e) => setRepeatPass(e.target.value)}
                  ></input>
                  <span>
                    <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
                  </span>
                  {errorMessage && pass !== repeatPass ? (
                    <div className={styles.error}>{errorMessage}</div>
                  ) : (
                    ""
                  )}
                  {error ? (
                    <div className={styles.error}>{error}</div>
                  ) : (
                    ""
                  )}
                </div>
                <button
                  type="submit"
                  className={`${styles.btn_login}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPass;

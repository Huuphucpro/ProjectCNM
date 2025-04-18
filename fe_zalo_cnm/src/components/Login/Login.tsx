import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Login.module.scss";
import { Link, useHistory } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserState,
  loginUserRequest,
} from "../../redux/actions/UserAction";
import { RootState } from "../../redux/reducers";
import { User, UserState } from "../../types/UserType";
import useLoginController from "./useLoginController";

type FormData = {
  phone: string;
  password: string;
}
type OptionType = {
  qr_code: Boolean;
  phone: Boolean;
}

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const { option, setOption } = useLoginController();
  const {
    register,
    handleSubmit,
  } = useForm<FormData>()

  // const [option, setOption] = useState<OptionType>({
  //   qr_code: false,
  //   phone: true,
  // });

  // const user: UserState = useSelector((state: RootState) => state.user);
  const user: UserState = useSelector((state: RootState) => state.user);
  const { error } = user;

  const handleClearUserState = (): void => {
    dispatch(clearUserState());
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    dispatch(loginUserRequest(data, () => {
      history.push('/')
    }));
  };

  return (
    <section className={styles.container}>
      <div className={styles.login}>
        <div className={styles.login_title}>
          Đăng nhập tài khoản
        </div>

        <div className={styles.login_main}>
          <div className={styles.login_main_option}>
            <li
              className={option.qr_code ? styles.active : ""}
              onClick={() => setOption({ qr_code: true, phone: false })}
            >
              với mã qr
            </li>
            <li
              className={option.phone ? styles.active : ""}
              onClick={() => setOption({ qr_code: false, phone: true })}
            >
              với số điện thoại
            </li>
          </div>

          {option.qr_code ? (
            <div className={styles.login_main_content}>
              <div className={styles.login_main_content_img}>
                <img src="https://i.imgur.com/dPr3SMX.png"></img>
              </div>
              <div className={styles.login_main_content_text}>
                <span>Quét mã QR để đăng nhập</span>
              </div>
            </div>
          ) : (
            <div className={styles.login_main_content}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.login_form_input}>
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    {...register("phone")}
                    required
                  ></input>
                  <span>
                    <FontAwesomeIcon icon={faMobileAlt}></FontAwesomeIcon>
                  </span>
                </div>
                <div className={styles.login_form_input}>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    {...register("password")}
                    required
                  ></input>
                  <span>
                    <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
                  </span>
                  {error ? <div className={styles.error}>{error}</div> : ""}
                </div>
                <button className={styles.btn_login}>Đăng nhập</button>
                <Link
                  to='forgotpass'
                  className={styles.forgot_password}
                  onClick={() => {
                    handleClearUserState();
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </form>
              <div className={styles.action_more}>
                <p>
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/register" onClick={() => handleClearUserState()}>
                    Đăng ký ngay!
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;

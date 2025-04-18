import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faMobileAlt, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import styles from "./Register.module.scss";
import { Link, useHistory } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUserRequest } from "../../redux/actions/UserAction";
import { UserState, User } from "../../types/UserType";
import { RootState } from "../../redux/reducers";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const Register = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    name: yup.string().required('Họ và tên không được để trống'),
    phone: yup.string().trim().matches(/^(?:\d{10}|(84|0[3|5|7|8|9])+([0-9]{8})\b)$/ , 'Số điện thoại không hợp lệ').required('Số điện thoại không được để trống'),
    email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
    password: yup.string().min(8, 'Mật khẩu phải trên 8 kí tự').required('Mật khẩu không được để trống'),
  });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(schema)
  });
  
  const [pass, setPass] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [repeatPass, setRepeatPass] = useState<string>("");

  const user: UserState = useSelector((state: RootState) => state.user);
  const { error, isLoading } = user;

  const onSubmit: SubmitHandler<User> = async (data) => {
    if (pass === repeatPass) {
      await dispatch(registerUserRequest(data, () => {
        history.push('/login')
      }));
    } else {
      setErrorMessage('Mật khẩu không khớp')
      setTimeout(() => {
        setErrorMessage('')
      }, 2000)
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.register}>
        <div className={styles.register_title}>
          Đăng ký tài khoản
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.register_form_input}>
            <input
              type="text"
              placeholder="Họ và tên"
              {...register("name")}
            ></input>
            <span>
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
            </span>
            {errors.name && <div className={styles.error}>{errors.name?.message}</div>}
          </div>
          
          <div className={styles.register_form_input}>
            <input
              type="text"
              placeholder="Số điện thoại"
              {...register("phone")}
            ></input>
            <span>
              <FontAwesomeIcon icon={faMobileAlt}></FontAwesomeIcon>
            </span>
            {errors.phone && <div className={styles.error}>{errors.phone?.message}</div>}
          </div>
          
          <div className={styles.register_form_input}>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
            ></input>
            <span>
              <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
            </span>
            {errors.email && <div className={styles.error}>{errors.email?.message}</div>}
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.register_form_input}>
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password")}
              onChange={(e: FormEvent<HTMLInputElement>) =>
                setPass(e.currentTarget.value)
              }
            ></input>
            <span>
              <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
            </span>
            {errors.password && <div className={styles.error}>{errors.password?.message}</div>}
          </div>
          
          <div className={styles.register_form_input}>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              required
              onChange={(e: FormEvent<HTMLInputElement>) =>
                setRepeatPass(e.currentTarget.value)
              }
            ></input>
            <span>
              <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
            </span>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          </div>

          <button className={styles.btn} disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>

          <div className={styles.toLogin}>
            <Link to="/login">Đã có tài khoản? Đăng nhập!</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

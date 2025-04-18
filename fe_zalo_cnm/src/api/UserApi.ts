import { Friend, refeshToken } from "../types/UserType";
import axiosClient from "./AxiosClient";

interface ListResponse<T> {
    data: T[]
}

interface User{
    name: string
    phone: string,
    password: string
}

interface Email{
    email: string
    password?: string  // Thêm trường password và đặt là tùy chọn
}

interface OTP{
    otp: string
    email: string
}

interface resultGetEmail{
    message: string
}

export const getAllUsers = () :Promise<ListResponse<User>> => axiosClient.get('/user')
export const login = (user: User) :Promise<ListResponse<User>> => axiosClient.post('/user/login', user)
export const register = (user: User) :Promise<ListResponse<User>> => axiosClient.post('/user/register', user)

export const getUserById = (id: string) :Promise<ListResponse<User>> => axiosClient.get(`/user/${id}`)
export const updateAvatar = (data: any) :Promise<resultGetEmail> => axiosClient.post('/user/avatar', data)
export const searchUser = (data: any) :Promise<User> => axiosClient.post('/user/search', data)

export const getEmail = (email: Email) :Promise<resultGetEmail> => axiosClient.post('/user/sendmail', email)
export const checkOtp = (otp: OTP) :Promise<resultGetEmail> => axiosClient.post('/user/checkotp', otp)
export const updatePassword = (data: Email) :Promise<resultGetEmail> => axiosClient.post('/user/updatepassword', data)
export const getNewToken = (refeshToken: refeshToken) :Promise<resultGetEmail> => axiosClient.post('/user/getnewtoken', refeshToken)

export const getAllPeopleRequestByUser = (id: string) :Promise<Friend> => axiosClient.get(`/user/getAllPeopleRequestByUser/${id}`)
export const getAllFriendByUser = (id: string) :Promise<Friend> => axiosClient.get(`/user/getAllFriendByUser/${id}`)

export const updateUser = (data: { id: string, data: FormData }) :Promise<ListResponse<User>> => {
  console.log("API: Updating user with ID:", data.id);
  console.log("API: FormData being sent");
  return axiosClient.put(`/user/${data.id}`, data.data);
}




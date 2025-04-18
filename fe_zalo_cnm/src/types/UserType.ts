export type Message = {
  message: string
}

export type Error ={
  error: string
}

export type UserState = {
  isLoading?: boolean;
  userCurrent?: any;
  error?: string;
  result? : Message
  errorResetPass?: Message
};

export type User = {
  _id?: string
  name?: string
  phone?: string;
  email?: string; // Thêm trường email vào User type
  password?: string
  token?:string | null
  refeshToken? : string | null
  otp?: string,
  avatar?: string,
  updatedAt?: string,
  createAt?: string,
  friends?: [],
  myRequest?: [],
  peopleRequest?: [],
}

export type Email ={
  email: string
  password?: string
}

export type Actions ={
  type: string
  payload?: any
  callback?: any
}

export type OTP ={
  email: string
  otp: string
}

export type Tokens = {
  accessToken: string,
  refeshToken: string,
}

export type refeshToken = {
  refeshToken: string,
}

export type phone = {
  phone: string
}

export type Friend = {
  _id: string,
  idUser: string,
}

export type FriendItem = {
  _id: string,
  idUser: {
    _id: string,
    name: string,
    avatar: string
  },
  idConversation?: string,
}


export type listFriend = [
  Friend
]
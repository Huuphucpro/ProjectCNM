import { UserConstant } from "../../constants/UserConstant";
import { Actions, Email, Error, Friend, listFriend, Message, OTP, phone, refeshToken, Tokens, User } from "../../types/UserType";

// -------------- LOGIN
export const loginUserRequest = (data: User, callback: any): Actions => {
  return {
    type: UserConstant.LOGIN_USER_REQUEST,
    payload: data,
    callback
  };
};

export const loginUserSuccess = (data: User): Actions => {
  return {
    type: UserConstant.LOGIN_USER_SUCCESS,
    payload: data,
  };
};

export const loginUserFailure = (error: Error): Actions => {
  return {
    type: UserConstant.LOGIN_USER_FAILURE,
    payload: error,
  };
};

// -------------- REGISTER
export const registerUserRequest = (data: User, callback: any): Actions => {
  return {
    type: UserConstant.REGISTER_USER_REQUEST,
    payload: data,
    callback: callback,
  };
};

export const registerUserSuccess = (data: User): Actions => {
  return {
    type: UserConstant.REGISTER_USER_SUCCESS,
    payload: data,
  };
};

export const registerUserFailure = (error: Error): Actions => {
  return {
    type: UserConstant.REGISTER_USER_FAILURE,
    payload: error,
  };
};


// -------------- LOGOUT
export const logoutUserRequest = (): Actions => {
    localStorage.removeItem('token')
    localStorage.removeItem('refeshToken');
  return {
    type: UserConstant.LOGOUT_USER_REQUEST,
  };
};

export const logoutUserSuccess = (message: Message): Actions => {
  return {
    type: UserConstant.LOGOUT_USER_SUCCESS,
    payload: message,
  };
};

export const logoutUserFailure = (error: Error): Actions => {
  return {
    type: UserConstant.LOGOUT_USER_FAILURE,
    payload: error,
  };
};


// -------------- CHECK OTP
export const checkOtpRequest = (data: OTP, callback: any): Actions => {
  return {
    type: UserConstant.CHECK_OTP_REQUEST,
    payload: data,
    callback
  };
};

export const checkOtpSuccess = (data: Message): Actions => {
  return {
    type: UserConstant.CHECK_OTP_SUCCESS,
    payload: data,
  };
};

export const checkOtpFailure = (error: Error): Actions => {
  return {
    type: UserConstant.CHECK_OTP_FAILURE,
    payload: error,
  };
};

// -------------- GET OTP
export const getEmailRequest = (data: Email): Actions => {
  return {
    type: UserConstant.GET_EMAIL_REQUEST,
    payload: data,
  };
};

export const getEmailSuccess = (data: Message): Actions => {
  return {
    type: UserConstant.GET_EMAIL_SUCCESS,
    payload: data,
  };
};

export const getEmailFailure = (error: Error): Actions => {
  return {
    type: UserConstant.GET_EMAIL_FAILURE,
    payload: error,
  };
};

// -------------- UPDATE PASWORD
export const updatePasswordRequest = (data: Email, callback: any): Actions => {
  return {
    type: UserConstant.UPDATE_PASSWORD_REQUEST,
    payload: data,
    callback
  };
};

export const updatePasswordSuccess = (data: Message): Actions => {
  return {
    type: UserConstant.UPDATE_PASSWORD_SUCCESS,
    payload: data,
  };
};

export const updatePasswordFailure = (error: Error): Actions => {
  return {
    type: UserConstant.UPDATE_PASSWORD_FAILURE,
    payload: error,
  };
};

// -------------- GET NEW ACCESS TOKEN
export const getNewTokenRequest = (refeshToken: refeshToken): Actions => {
  return {
    type: UserConstant.GET_NEW_TOKEN_REQUEST,
    payload: refeshToken,
  };
};

export const getNewTokenSuccess = (tokens: Tokens): Actions => {
  return {
    type: UserConstant.GET_NEW_TOKEN_SUCCESS,
    payload: tokens,
  };
};

export const getNewTokenFailure = (error: Error): Actions => {
  return {
    type: UserConstant.GET_NEW_TOKEN_FAILURE,
    payload: error,
  };
};

// -------------- GET USER BY ID
export const getUserByIdRequest = (id: string) => {
  console.log(id)
  return {
    type: UserConstant.GET_USER_BY_ID_REQUEST,
    payload: id
  }
}
export const getUserByIdSuccess = (data: User) => {
  return {
    type: UserConstant.GET_USER_BY_ID_SUCCESS,
    payload: data
  }
}
export const getUserByIdFailure = (message: Message) => {
  return {
    type: UserConstant.GET_USER_BY_ID_REQUEST,
    payload: message
  }
}

// -------------- UPDATE AVATAR
export const updateAvatarRequest = (data: any) => {
  return {
    type: UserConstant.UPDATE_AVATAR_REQUEST,
    payload: data,
  }
} 
export const updateAvatarSuccess = (data: User) => {
  return {
    type: UserConstant.UPDATE_AVATAR_SUCCESS,
    payload: data
  }
} 
export const updateAvatarFailure = (message: Message) => {
  return {
    type: UserConstant.UPDATE_AVATAR_FAILURE,
    payload: message
  }
} 

// -------------- SEARCH USER BY PHONE OR EMAIL
export const searchUserRequest = (data: phone) => {
  return{
    type: UserConstant.SEARCH_USER_REQUEST,
    payload: data
  }
}
export const searchUserSuccess = (data: User) => {
  return{
    type: UserConstant.SEARCH_USER_SUCCESS,
    payload: data
  }
}
export const searchUserFailure = (error: Message) => {
  return{
    type: UserConstant.SEARCH_USER_FAILURE,
    payload: error
  }
}

// -------------- GET ALL FRIENDS
export const getAllFriendRequest = (id: string) => {
  return {
    type: UserConstant.GET_ALL_FRIEND_REQUEST,
    payload: id
  }
}
export const getAllFriendSuccess = (data: listFriend) => {
  return {
    type: UserConstant.GET_ALL_FRIEND_SUCCESS,
    payload: data
  }
}
export const getAllFriendFailure = (error: Message) => {
  return {
    type: UserConstant.GET_ALL_FRIEND_FAILURE,
    payload: error
  }
}

// -------------- GET ALL PEOPLE REQUEST
export const getAllPeopleRequestRequest = (id: string) => {
  return {
    type: UserConstant.GET_ALL_PEOPLE_REQUEST_REQUEST,
    payload: id
  }
}
export const getAllPeopleRequestSuccess = (data: listFriend) => {
  return {
    type: UserConstant.GET_ALL_PEOPLE_REQUEST_SUCCESS,
    payload: data
  }
}
export const getAllPeopleRequestFailure = (error: Message) => {
  return {
    type: UserConstant.GET_ALL_PEOPLE_REQUEST_FAILURE,
    payload: error
  }
}

// -------------- SAVE INFO USER TO STATE
export const saveInfoUser = (user: User) => {
  return {
    type: UserConstant.SAVE_INFO_USER,
    payload: user,
  }
}

// -------------- DELETE USER STATE
export const clearUserState = (): Actions => {
    return {
      type: UserConstant.CLEAR_USER_STATE,
    };
};

// -------------- SAVE EMAIL USER TO STATE
export const saveEmailUser = (data: Email): Actions => {
  localStorage.setItem('emailUserResetPass', JSON.stringify(data))
  return {
    type: UserConstant.SAVE_EMAIL_USER,
    payload: data,
  };
};

// --------------- UPDATE USER
export const updateUserRequest = (data: { id: string, data: FormData }) => {
    return {
        type: UserConstant.UPDATE_USER_REQUEST,
        payload: data
    }
}

export const updateUserSuccess = (data: any) => {
    return {
        type: UserConstant.UPDATE_USER_SUCCESS,
        payload: data
    }
}

export const updateUserFailure = (error: Error) => {
    return {
        type: UserConstant.UPDATE_USER_FAILURE,
        payload: error
    }
}

export const updateUserUnreadMessages = (unreadMessages: number) => {
  return {
    type: UserConstant.UPDATE_USER_UNREAD_MESSAGES,
    payload: unreadMessages,
  };
};


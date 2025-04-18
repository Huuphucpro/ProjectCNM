import { UserConstant } from "../../constants/UserConstant";
import { UserState } from "../../types/UserType";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from '../constants';

type UserAction = {
    type: string,
    payload: any,
}

const initialState: UserState = {
    isLoading: false,
    userCurrent: {},
    error: null,
    emailUserResetPass: null,
    tokens: {
        accessToken: '',
        refreshToken: '',
    },
    friends: [],
    peopleRequest: [],
    isLoggedIn: false,
}

const userReducer = (state = initialState, action: UserAction) => {
    switch (action.type) {
        // ------------- LOGIN
        case LOGIN_REQUEST:
        case UserConstant.LOGIN_USER_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null,
            }
        }

        case LOGIN_SUCCESS:
        case UserConstant.LOGIN_USER_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                userCurrent: action.payload.user,
                tokens: {
                    accessToken: action.payload.token,
                    refreshToken: action.payload.refreshToken,
                },
                error: null,
                isLoggedIn: true,
            }
        }

        case LOGIN_FAILURE:
        case UserConstant.LOGIN_USER_FAILURE: {
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            }
        }

        // ------------- REGISTER
        case REGISTER_REQUEST:
        case UserConstant.REGISTER_USER_REQUEST: {
            return {
                ...state,
                isLoading: true,
                error: null,
            }
        }

        case REGISTER_SUCCESS:
        case UserConstant.REGISTER_USER_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                userCurrent: action.payload,
                error: null,
            }
        }

        case REGISTER_FAILURE:
        case UserConstant.REGISTER_USER_FAILURE: {
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            }
        }

        //-------------- LOGOUT
        case LOGOUT:
        case UserConstant.LOGOUT_USER_REQUEST: {
            return {
                ...initialState,
            }
        }

        // ------------- GET OTP BY EMAIL
        case UserConstant.GET_EMAIL_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case UserConstant.GET_EMAIL_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                result: action.payload,
                error: null,
            }
        }

        case UserConstant.GET_EMAIL_FAILURE: {
            return {
                ...state,
                errorResetPass: action.payload,
                isLoading: false,
            }
        }

        // ------------- CHECK OTP
        case UserConstant.CHECK_OTP_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case UserConstant.CHECK_OTP_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                checkOtp: action.payload
            }
        }

        case UserConstant.CHECK_OTP_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        }

        // ------------- UPDATE PASSWORD
        case UserConstant.UPDATE_PASSWORD_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case UserConstant.UPDATE_PASSWORD_SUCCESS: {
            return {
                ...state,
                resultUpdatePassword: action.payload
            }
        }

        case UserConstant.UPDATE_PASSWORD_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        }

        //-------------- GET NEW TOKEN
        case UserConstant.GET_NEW_TOKEN_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case UserConstant.GET_NEW_TOKEN_SUCCESS: {
            return{
                ...state,
                isLoading: false,
                tokens: action.payload,
            }
        }

        case UserConstant.GET_NEW_TOKEN_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        }

        //-------------- GET USER BY ID
        case UserConstant.GET_USER_BY_ID_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }
        case UserConstant.GET_USER_BY_ID_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                userCurrent: action.payload
            }
        }
        case UserConstant.GET_USER_BY_ID_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        }

         //-------------- UPDATE AVATAR REQUEST
        case UserConstant.UPDATE_AVATAR_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }
        case UserConstant.UPDATE_AVATAR_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                userCurrent: action.payload
            }
        }
        case UserConstant.UPDATE_AVATAR_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        }

         //-------------- SEARCH USER BY PHONE OR EMAIL
        case UserConstant.SEARCH_USER_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }
        case UserConstant.SEARCH_USER_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                error: null,
                resultSearch: action.payload
            }
        }
        case UserConstant.SEARCH_USER_FAILURE: {
            return {
                ...state,
                isLoading: false,
                resultSearch: null,
                error: action.payload
            }
        }

        //-------------- GET ALL FRIEND
        case UserConstant.GET_ALL_FRIEND_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }
        case UserConstant.GET_ALL_FRIEND_SUCCESS: {
            return {
                ...state,
                loading: false,
                friends: action.payload
            }
        }
        case UserConstant.GET_ALL_FRIEND_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        }

        //-------------- GET ALL PEOPLE REQUEST
        case UserConstant.GET_ALL_FRIEND_REQUEST_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }
        case UserConstant.GET_ALL_FRIEND_REQUEST_SUCCESS: {
            return {
                ...state,
                loading: false,
                peopleRequest: action.payload
            }
        }
        case UserConstant.GET_ALL_FRIEND_REQUEST_FAILURE: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        }

        // ------------- SAVE EMAIL USER
        case UserConstant.SAVE_EMAIL_USER: {
            return {
                ...state,
                emailUserResetPass: action.payload
            }
        }

        // ------------- SAVE INFO USER
        case UserConstant.SAVE_INFO_USER: {
            return {
                ...state,
                userCurrent: action.payload
            }
        }

        // ------------- DELETE USER STATE
        case UserConstant.CLEAR_USER_STATE: {
            return {
                isLoading: false,
                userCurrent: {},
                error: null,
                emailUserResetPass: null
            }
        }

        case UserConstant.UPDATE_USER_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }
        case UserConstant.UPDATE_USER_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                userCurrent: action.payload
            }
        }
        case UserConstant.UPDATE_USER_FAILURE: {
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            }
        }
        
        case UserConstant.UPDATE_USER_UNREAD_MESSAGES: {
            return {
                ...state,
                userCurrent: {
                    ...state.userCurrent,
                    unreadMessages: action.payload
                }
            }
        }
        
        default:
            return state;
    }
};

export default userReducer;
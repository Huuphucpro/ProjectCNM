import { UserConstant } from "../../constants/UserConstant"
import { User } from "../../types/UserType"

interface UserState {
    isLoading: boolean
    userCurrent: User
    error: string | null
    emailUserResetPass: any
    message? : {}
}

type UserLoginAction = {
    type: string,
    payload: {},
}

const InitialState :UserState = {
    isLoading: false,
    userCurrent: {},
    error: null,
    emailUserResetPass: null
}

export const UserReducer = (state = InitialState, action: UserLoginAction) => {
    switch (action.type) {
        // ------------- LOGIN
        case UserConstant.LOGIN_USER_REQUEST: {
            return {
                isLoading: true
            }
        }

        case UserConstant.LOGIN_USER_SUCCESS: {
            return {
                isLoading: false,
                userCurrent: action.payload,
                error: undefined,
            }
        }

        case UserConstant.LOGIN_USER_FAILURE: {
            return {
                error: action.payload,
                isLoading: false,
            }
        }

        // ------------- REGISTER
        case UserConstant.REGISTER_USER_REQUEST: {
            return {
                isLoading: true
            }
        }

        case UserConstant.REGISTER_USER_SUCCESS: {
            return {
                isLoading: false,
                userCurrent: action.payload,
                error: undefined,
            }
        }

        case UserConstant.REGISTER_USER_FAILURE: {
            return {
                error: action.payload,
                isLoading: false,
            }
        }

        //-------------- LOGOUT
        case UserConstant.LOGOUT_USER_REQUEST: {
            return {
                ...state,
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
                error: undefined,
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
                isLoading: false,
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
                isLoading: true
            }
        }

        //-------------- UPDATE AVATAR REQUEST
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

         //-------------- SERCH USER BY PHONE OR EMAIL
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
                isLoading: false,
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
        case UserConstant.GET_ALL_PEOPLE_REQUEST_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }
        case UserConstant.GET_ALL_PEOPLE_REQUEST_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                peopleRequest: action.payload
            }
        }
        case UserConstant.GET_ALL_PEOPLE_REQUEST_FAILURE: {
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
            return {}
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
        
        default: return state
    }
}
import { OptionLayoutConstant } from "../../constants/OptionLayoutConstant"
import { OptionLayout } from "../../types/OptionLayoutType"
import { Actions } from "../../types/UserType"

const initialState : OptionLayout = {
    showChat: true,
    showFriends: false
}

export const optionLayoutReducer = (state = initialState, action: Actions) => {
    switch (action.type) {
        case OptionLayoutConstant.SHOW_CHAT:{
            return {
                ...state,
                showChat: true,
                showFriends: false
            }
        }
        
        case OptionLayoutConstant.SHOW_FRIENDS:{
            return {
                ...state,
                showChat: false,
                showFriends: true
            }
        }
    
        default: return state
    }
}
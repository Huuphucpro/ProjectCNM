import { combineReducers } from "redux";
import { chatReducer } from "./ChatReducer";
import { optionLayoutReducer } from "./optionLayoutReducer";
import { createSocket } from "./SocketReducer";
import { UserReducer } from "./UserReducer";

export const reducers: any = combineReducers({
    user: UserReducer,
    socket: createSocket,
    optionLayout: optionLayoutReducer,
    chat: chatReducer
})

export type RootState = ReturnType<typeof reducers>;
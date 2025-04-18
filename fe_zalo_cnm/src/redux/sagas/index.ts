import { all} from "@redux-saga/core/effects";
import ChatSaga from "./ChatSaga";
import UserSaga from "./UserSaga";

function* rootSaga () {
    yield all([
        UserSaga(),
        ChatSaga()
    ])
}

export default rootSaga
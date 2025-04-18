import { all, fork } from 'redux-saga/effects';
import userSaga from './UserSaga';
import chatSaga from './ChatSaga';
import contactSaga from './ContactSaga';

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(chatSaga),
    fork(contactSaga),
  ]);
}
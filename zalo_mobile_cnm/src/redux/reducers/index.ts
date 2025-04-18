import { combineReducers } from 'redux';
import userReducer from './UserReducer';
import chatReducer from './ChatReducer';
import contactReducer from './ContactReducer';
import { loadingReducer } from './LoadingReducer';

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  contact: contactReducer,
  loading: loadingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
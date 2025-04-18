import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setStore } from '../utils/storeAccess';

import rootReducer from './reducers';
import rootSaga from './sagas';
import { loadingMiddleware } from './middleware/loadingMiddleware';

// Cấu hình Redux Persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'], // Chỉ lưu trữ state của user reducer
};

// Tạo persisted reducer - using type assertion to avoid TS errors
// @ts-ignore - suppressing TypeScript errors for redux-persist compatibility
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo saga middleware
const sagaMiddleware = createSagaMiddleware();

// Tạo store với middleware
export const store = createStore(
  persistedReducer,
  applyMiddleware(
    loadingMiddleware,
    sagaMiddleware
  )
);

// Tạo persistor
export const persistor = persistStore(store);

// Chạy các sagas
sagaMiddleware.run(rootSaga);

// Export RootState type for use in components
export type RootState = ReturnType<typeof store.getState>;

setStore(store);

export default { store, persistor };
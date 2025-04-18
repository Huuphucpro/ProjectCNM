import { SHOW_LOADING, HIDE_LOADING, SET_LOADING_MESSAGE } from '../constants';

export const showLoading = (id?: string) => ({
  type: SHOW_LOADING,
  payload: { id }
});

export const hideLoading = (id?: string) => ({
  type: HIDE_LOADING,
  payload: { id }
});

export const setLoadingMessage = (message: string) => ({
  type: SET_LOADING_MESSAGE,
  payload: { message }
}); 
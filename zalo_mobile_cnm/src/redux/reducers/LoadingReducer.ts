import { SHOW_LOADING, HIDE_LOADING, SET_LOADING_MESSAGE } from '../constants';

export interface LoadingState {
  isLoading: boolean;
  loadingIds: string[];
  message: string;
}

const initialState: LoadingState = {
  isLoading: false,
  loadingIds: [],
  message: 'Loading...'
};

interface LoadingAction {
  type: string;
  payload?: {
    id?: string;
    message?: string;
  };
}

export const loadingReducer = (state = initialState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case SHOW_LOADING: {
      const newLoadingIds = action.payload?.id 
        ? [...state.loadingIds, action.payload.id]
        : state.loadingIds;
        
      return {
        ...state,
        isLoading: true,
        loadingIds: newLoadingIds
      };
    }
    
    case HIDE_LOADING: {
      // If a specific ID was provided, remove it from the loading IDs
      const loadingIds = action.payload?.id 
        ? state.loadingIds.filter(id => id !== action.payload?.id)
        : [];
        
      // Only set isLoading to false if there are no more loading operations
      return {
        ...state,
        isLoading: loadingIds.length > 0,
        loadingIds
      };
    }
    
    case SET_LOADING_MESSAGE: {
      return {
        ...state,
        message: action.payload?.message || 'Loading...'
      };
    }
    
    default:
      return state;
  }
}; 
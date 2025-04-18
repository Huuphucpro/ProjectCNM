import { showLoading, hideLoading } from '../actions/LoadingActions';

/**
 * Regular expressions to match request and response action types
 */
const REQUEST_PATTERN = /_REQUEST$/;
const SUCCESS_PATTERN = /_SUCCESS$/;
const FAILURE_PATTERN = /_FAILURE$/;

// Define a basic action type
interface Action {
  type: string;
  [key: string]: any;
}

/**
 * Middleware to automatically handle loading states
 * It shows loading for actions ending with _REQUEST
 * and hides loading for actions ending with _SUCCESS or _FAILURE
 */
// @ts-ignore - Ignoring TypeScript errors for the middleware definition
export const loadingMiddleware = store => next => action => {
  // Skip actions without a type property or if type is not a string
  if (!action || typeof action.type !== 'string') {
    return next(action);
  }
  
  const { type } = action as Action;
  
  // Extract base action name without suffix
  const baseActionType = type
    .replace(REQUEST_PATTERN, '')
    .replace(SUCCESS_PATTERN, '')
    .replace(FAILURE_PATTERN, '');
  
  // Show loading on request actions
  if (REQUEST_PATTERN.test(type)) {
    store.dispatch(showLoading(baseActionType));
  }
  
  // Hide loading on success or failure actions
  if (SUCCESS_PATTERN.test(type) || FAILURE_PATTERN.test(type)) {
    store.dispatch(hideLoading(baseActionType));
  }
  
  return next(action);
}; 
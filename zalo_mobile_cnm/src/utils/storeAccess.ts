/**
 * This utility provides a way to access the Redux store without creating circular dependencies.
 * It avoids direct imports between the store and other modules that might create require cycles.
 */

// Store reference (initially null)
let store: any = null;

/**
 * Set the store reference
 * @param appStore The Redux store instance
 */
export const setStore = (appStore: any) => {
  store = appStore;
};

/**
 * Get the store reference
 * @returns The Redux store instance
 */
export const getStore = () => store;

/**
 * Get the current state from the store
 * @returns The current Redux state
 */
export const getState = () => (store ? store.getState() : null);

/**
 * Dispatch an action to the store
 * @param action The action to dispatch
 * @returns The result of the dispatch
 */
export const dispatch = (action: any) => (store ? store.dispatch(action) : null); 
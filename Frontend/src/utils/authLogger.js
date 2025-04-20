/**
 * Authentication Logger Utility
 * 
 * This file provides a utility to log authentication status to the console
 * without modifying the existing Redux slices.
 */

let storeRef = null;
let previousAuthState = null;
let previousAdminState = null;

/**
 * Initialize the authentication logger to monitor the Redux store
 * for changes in authentication state
 * 
 * @param {Object} store - Redux store
 */
export const initAuthLogger = (store) => {
  // Store reference to the Redux store
  storeRef = store;
  
  // Log initial state on startup
  const initialState = store.getState();
  logCurrentAuthState(initialState);
  console.log("Auth logger initialized. Initial state:", initialState);
  
  // Subscribe to store changes
  store.subscribe(() => {
    const currentState = store.getState();
    
    // Deep comparison for user state
    const currentUser = currentState.auth?.user;
    const prevUser = previousAuthState?.user;
    
    if (JSON.stringify(currentUser) !== JSON.stringify(prevUser)) {
      if (currentUser) {
        console.log("User logged in:", currentUser);
      } else if (prevUser) {
        console.log("User logged out");
      } else if (previousAuthState === null) {
        console.log(currentUser ? "User is logged in" : "No user logged in");
      }
    }
    
    // Deep comparison for admin state
    const currentAdmin = currentState.admin?.admin;
    const isAuthenticated = currentState.admin?.isAuthenticated;
    const prevAdmin = previousAdminState?.admin;
    const wasAuthenticated = previousAdminState?.isAuthenticated;
    
    if (JSON.stringify(currentAdmin) !== JSON.stringify(prevAdmin) || isAuthenticated !== wasAuthenticated) {
      if (currentAdmin && isAuthenticated) {
        console.log("Admin logged in:", currentAdmin);
      } else if (prevAdmin && wasAuthenticated) {
        console.log("Admin logged out");
      } else if (previousAdminState === null) {
        console.log(currentAdmin && isAuthenticated ? "Admin is logged in" : "No admin logged in");
      }
    }
    
    // Update previous state references
    previousAuthState = {...currentState.auth};
    previousAdminState = {...currentState.admin};
  });
};

/**
 * Log the current authentication state
 * 
 * @param {Object} state - Redux state
 */
export const logCurrentAuthState = (state) => {
  if (!state) return;
  
  console.group("Authentication Status");
  
  // Check user auth state
  if (state.auth?.user) {
    console.log("User logged in:", state.auth.user);
  } else {
    console.log("No user logged in");
  }
  
  // Check admin auth state
  if (state.admin?.isAuthenticated && state.admin.admin) {
    console.log("Admin logged in:", state.admin.admin);
  } else {
    console.log("No admin logged in");
  }
  
  console.groupEnd();
};

/**
 * Utility function to log the current authentication status
 * Can be called from any component
 */
export const logAuthStatus = () => {
  if (!storeRef) {
    console.error("Auth logger not initialized");
    return;
  }
  const state = storeRef.getState();
  logCurrentAuthState(state);
};

export default initAuthLogger; 
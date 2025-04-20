import {configureStore} from "@reduxjs/toolkit" ;
import authReducer from "./authSlice" ;
import adminReducer from "./adminSlice" ;

// Create store without the logger to avoid circular dependency
const store = configureStore({
    reducer : {
        auth : authReducer,
        admin : adminReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
        })
}) ;

// Initialize previous state for comparison
let prevUserState = null;
let prevAdminState = null;

// Monitor and log state changes
store.subscribe(() => {
    const state = store.getState() ;
    
    // Monitor user auth state changes
    if (JSON.stringify(state.auth.user) !== JSON.stringify(prevUserState)) {
        console.group("👤 User Auth State Changed");
        console.log("Previous:", prevUserState);
        console.log("Current:", state.auth.user);
        console.groupEnd();
        prevUserState = state.auth.user;
    }
    
    // Monitor admin auth state changes
    if (JSON.stringify(state.admin.admin) !== JSON.stringify(prevAdminState) || 
        state.admin.isAuthenticated !== (prevAdminState ? true : false)) {
        console.group("👑 Admin Auth State Changed");
        console.log("Previous Admin:", prevAdminState);
        console.log("Current Admin:", state.admin.admin);
        console.log("Is Authenticated:", state.admin.isAuthenticated);
        console.groupEnd();
        prevAdminState = state.admin.admin;
    }
    
    // Log errors
    if (state.auth?.error) {
        console.error("Auth Error:", state.auth.error) ;
    }
    if (state.admin?.error) {
        console.error("Admin Error:", state.admin.error) ;
    }
}) ;

// Import and initialize logger after store is created to avoid circular dependency
import initAuthLogger from "../utils/authLogger" ;
initAuthLogger(store) ;

export default store ;
import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage (if available)
const storedUser = localStorage.getItem("user");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: storedUser ? JSON.parse(storedUser) : null, // Persist user session
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload)); // Store in localStorage
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("user"); // Clear on logout
        }
    }
});

export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

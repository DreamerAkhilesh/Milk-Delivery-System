import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage (if available)
const storedUser = localStorage.getItem("user");
const storedAdminToken = localStorage.getItem("adminToken");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: storedUser ? JSON.parse(storedUser) : null,
        isAdmin: !!storedAdminToken,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAdmin = action.payload?.role === "admin";
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAdmin = false;
            localStorage.removeItem("user");
            localStorage.removeItem("adminToken");
        }
    }
});

export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage (if available)
const storedUser = localStorage.getItem("user");
const storedAdminData = localStorage.getItem("adminData");
const storedAdminToken = localStorage.getItem("adminToken");

const initialState = {
    loading: false,
    user: storedAdminToken && storedAdminData ? JSON.parse(storedAdminData) : (storedUser ? JSON.parse(storedUser) : null),
    isAdmin: !!storedAdminToken,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAdmin = action.payload?.role === "admin";
            if (action.payload?.role === "admin") {
                localStorage.setItem("adminData", JSON.stringify(action.payload));
            } else {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAdmin = false;
            localStorage.removeItem("user");
            localStorage.removeItem("adminData");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("token");
        }
    }
});

export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

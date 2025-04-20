import { createSlice } from "@reduxjs/toolkit";

// Function to safely parse stored user data
const getSafeUserData = () => {
  try {
    const userData = localStorage.getItem("user");
    console.log("Reading user data from localStorage:", userData);
    
    if (userData && userData !== "undefined") {
      const parsedUser = JSON.parse(userData);
      console.log("Successfully parsed user data:", parsedUser);
      return parsedUser;
    }
    
    console.log("No valid user data found in localStorage");
    return null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  loading: false,
  user: getSafeUserData(),
  isAdmin: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      console.log("setUser action called with payload:", action.payload);
      
      // Ensure we have valid user data
      if (!action.payload) {
        console.warn("setUser called with empty payload");
        return;
      }
      
      // Set the user in state
      state.user = action.payload;
      
      // Store in localStorage
      try {
        const userString = JSON.stringify(action.payload);
        console.log("Storing user data in localStorage:", userString);
        localStorage.setItem("user", userString);
      } catch (error) {
        console.error("Failed to store user data in localStorage:", error);
      }
      
      console.log("User state updated successfully:", state.user);
    },
    logoutUser: (state) => {
      console.log("logoutUser action called");
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.log("User logged out and data cleared");
    }
  }
});

export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

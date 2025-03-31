import { createSlice } from "@reduxjs/toolkit" ;

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null // When before login 
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        } // after login the page should set in way that it is login by the user
    }
}) ;
export const {setLoading, setUser} = authSlice.actions ;
export default authSlice.reducer ;
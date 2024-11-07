import {createSlice,PayloadAction} from '@reduxjs/toolkit';
import { User } from '@/app/page';
import { createAppAsyncThunk } from '@/app/_store/hooks';
export type UpdatePointsArgs={success:boolean,username:string,Points:number}
const initialState:Array<User>=[
    {
       _id:'',
       totalPointsAwarded:0
    }
]
export const updatePointsAsync=createAppAsyncThunk<UpdatePointsArgs,{username:string}>('friends/updatePointsAsync',async({username},{rejectWithValue})=>{
try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/v1/claim-points`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
       
        username
      })
    });

    if (!res.ok) {
     rejectWithValue('Something went wrong')
    }

    const data = await res.json();
    console.log("Points claimed successfully:", (data.message as string).slice(0,1));
    return {success: true, username, Points: data.data.Points as number}
    // Dispatch action or update state as needed with the response data
  } catch (error) {
    console.error("Failed to claim points:", error);
     return rejectWithValue("Failed to claim points");
  }
})
export const friendsSlice=createSlice({
    name:'friends',
    initialState,
    reducers:{
        setAllFriend:(state,action:PayloadAction<Array<User>>)=>{
            return [ ...action.payload];
        }
    },
     extraReducers: (builder) => {
    builder
    .addCase(updatePointsAsync.fulfilled, (state, action) => {
      const { username, Points } = action.payload;
      const user = state.find((user) => user._id === username);
      if (user) {
        user.totalPointsAwarded = Points; // Update the user's points in the state
      }
       state.sort((a, b) => b.totalPointsAwarded - a.totalPointsAwarded);
    })
    .addCase(updatePointsAsync.rejected, (state, action) => {
      console.error(action.payload || "Error in updatePointsAsync");
    });
  },
})

export const{setAllFriend}=friendsSlice.actions;
export default friendsSlice.reducer;
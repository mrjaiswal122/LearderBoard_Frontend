import {createSlice,PayloadAction} from '@reduxjs/toolkit';

type IUser={
firstName:string,
lastName:string,
username:string,
email:string,
Points:number
}
const initialState:IUser={
firstName: '',
lastName: '',
username: '',
email: '',
Points: 0
};

export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        setUserData :(state,action:PayloadAction<IUser>)=>{
            return action.payload;
        }
    }
});


export const{setUserData }=userSlice.actions;
export default userSlice.reducer;
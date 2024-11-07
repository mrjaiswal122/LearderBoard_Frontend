import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../_features/user/userSlice";
import friendsSlice  from "../_features/friends/friendsSlice";
import myFriendsSlice  from "../_features/myFriends/myfriendsSlice";
export const store=configureStore({
    reducer:{
        user:userSlice,
        allUsers:friendsSlice,
        myFriends:myFriendsSlice
    }
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

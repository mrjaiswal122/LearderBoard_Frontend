import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/app/_store/hooks";

interface Document {
  _id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  Points?: number;
  createdAt?: string;
  updatedAt?: string;
  _v: number;
}

type LoadMyFriendAsync = {
  success: boolean;
  username: string;
  data: Document[];
};

const initialState: Array<Document> = [
  {
    _id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    Points: 0,
    createdAt: "",
    updatedAt: "",
    _v: 0,
  },
];

export const loadMyFriendsAsync = createAppAsyncThunk<
  LoadMyFriendAsync,
  { username: string }
>("myFriends/loadMyFriendsAsync", async ({ username }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/v1/get-users`, {
      method: "GET",
    });

    if (!res.ok) {
      return rejectWithValue("Something went wrong");
    }

    const data = await res.json();
   
    return { success: true, username, data: data.data };
  } catch (error) {
    console.error("Failed to claim points:", error);
    return rejectWithValue("Failed to claim points");
  }
});

export const myFriendsSlice = createSlice({
  name: "myFriends",
  initialState,
  reducers: {
    updatePoint(
      state,
      action: PayloadAction<{ Points: number; username: string }>
    ) {
      const friendIndex = state.findIndex(
        (friend) => friend.username === action.payload.username
      );
      if (friendIndex > -1) {
        state[friendIndex].Points = action.payload.Points;
      }
    },
     sortByPoints(state) {
      state.sort((a, b) => (b.Points || 0) - (a.Points || 0));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMyFriendsAsync.fulfilled, (state, action) => {
        // Update state with the loaded friend data
        
        return [...action.payload.data];
      })
      .addCase(loadMyFriendsAsync.rejected, (state, action) => {
        console.error(action.payload || "Error in updatePointsAsync");
      });
  },
});

export const { updatePoint,sortByPoints } = myFriendsSlice.actions;
export default myFriendsSlice.reducer;
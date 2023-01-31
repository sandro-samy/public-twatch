import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  _id: string;
  isAuth: boolean;
  username: string;
  email: string;
  wishList: string[];
}

const initialState: IInitialState = {
  _id: "",
  isAuth: false,
  username: "",
  email: "",
  wishList: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        _id: string;
        username: string;
        email: string;
      }>
    ) {
      state._id = action.payload._id;
      state.isAuth = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    logout(state) {
      state._id = "";
      state.isAuth = false;
      state.username = "";
      state.email = "";
      localStorage.removeItem("wishlist");
    },
    setWishList(state, action: PayloadAction<{ wishList: string[] }>) {
      state.wishList = action.payload.wishList;
      localStorage.setItem("wishlist", JSON.stringify(action.payload.wishList));
    },
    addWishItem(state, action: PayloadAction<{ id: string }>) {
      if (!state.wishList.includes(action.payload.id)) {
        state.wishList.push(action?.payload?.id!);
        localStorage.setItem("wishlist", JSON.stringify(state.wishList));
      }
    },
    removeWishItem(state, action: PayloadAction<{ id: string }>) {
      state.wishList = state.wishList.filter((id) => id !== action.payload.id);
      if (state.wishList.length !== 0) {
        localStorage.setItem("wishlist", JSON.stringify(state.wishList));
      } else {
        localStorage.removeItem("wishlist");
      }
    },
  },
});

export const { login, logout, setWishList, addWishItem, removeWishItem } =
  authSlice.actions;

export default authSlice.reducer;

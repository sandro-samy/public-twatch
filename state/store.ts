import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import cartSlice from "./cartSlice";
import windowSlice from "./windowSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    window: windowSlice,
    cart: cartSlice,
  },
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const windowSlice = createSlice({
  name: "window",
  initialState: {
    width: 0,
    height: 0,
  },
  reducers: {
    setWindow(state, action) {
      state.width = action.payload.width ?? state.width;
      state.height = action.payload.height ?? state.height;
    },
  },
});

export const { setWindow } = windowSlice.actions;

export default windowSlice.reducer;

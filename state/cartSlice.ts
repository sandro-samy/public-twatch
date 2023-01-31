import { createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

interface ICartInit {
  items: ICartProduct[];
  cartState: number;
  shippingDetails: {
    fullName: string;
    city: string;
    address: string;
    phone: string;
  } | null;
  paymentMethod: "cash" | "paypal" | null;
}

const initialState: ICartInit = {
  items: [],
  cartState: 0,
  shippingDetails: null,
  paymentMethod: null,
};

if (typeof window !== "undefined") {
  if (localStorage.getItem("cartItems"))
    initialState.items = JSON.parse(localStorage.getItem("cartItems")!);
  if (localStorage.getItem("cartState"))
    initialState.cartState = JSON.parse(localStorage.getItem("cartState")!);
  if (localStorage.getItem("shippingDetails"))
    initialState.shippingDetails = JSON.parse(
      localStorage.getItem("shippingDetails")!
    );
  if (localStorage.getItem("paymentMethod"))
    initialState.paymentMethod = JSON.parse(
      localStorage.getItem("paymentMethod")!
    );
}

const updateLocalStorage = (items: ICartProduct[]) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: { type: string; payload: IProduct }) {
      const exist = state.items.find((item) => item._id === action.payload._id);
      if (exist) {
        if (exist.countInStock >= exist.quantity + 1) {
          exist.quantity++;
        }
      } else {
        if (action.payload.countInStock > 0) {
          const newItem: ICartProduct = { ...action.payload, quantity: 1 };
          state.items.push(newItem);
        }
      }
      updateLocalStorage(state.items);
    },
    updateCount(
      state,
      action: { type: string; payload: { _id: string; count: number } }
    ) {
      const { _id, count } = action.payload;
      const existingItem = state.items.find((item) => item._id === _id);
      if (existingItem && count <= existingItem.countInStock) {
        existingItem.quantity = count;
      }
      updateLocalStorage(state.items);
    },
    removeItem(state, action: { type: string; payload: string }) {
      const _id = action.payload;
      state.items = state.items.filter((item) => item._id !== _id);
      updateLocalStorage(state.items);
    },
    resetCart(state) {
      state.items = [];
      state.cartState = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartState");
    },
    setShippingDetails(state, action) {
      state.shippingDetails = action.payload;
      localStorage.setItem("shippingDetails", JSON.stringify(action.payload));
      if (state.cartState < 2) {
        state.cartState = 2;
        localStorage.setItem("cartState", "2");
      }
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload.paymentMethod;
      localStorage.setItem(
        "paymentMethod",
        JSON.stringify(action.payload.paymentMethod)
      );
      if (state.cartState < 3) {
        state.cartState = 3;
        localStorage.setItem("cartState", "3");
      }
    },
  },
});

export const {
  addToCart,
  removeItem,
  updateCount,
  resetCart,
  setPaymentMethod,
  setShippingDetails,
} = cartSlice.actions;

export default cartSlice.reducer;

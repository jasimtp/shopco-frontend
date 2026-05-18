import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: number;
  productId?: number;
  name: string;
  price: number;
  size: string;
  color: string;
  img: string;
  qty: number;
};

type AddCartItem = Omit<CartItem, "id">;

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const API = "https://shopco-backend-qtvr.onrender.com/api/cart";

// ✅ FETCH CART
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await fetch(API);
  return await res.json();
});

// ✅ ADD TO CART
export const addToCartBackend = createAsyncThunk(
  "cart/addToCartBackend",
  async (item: AddCartItem) => {
    const res = await fetch(`${API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    return await res.json();
  }
);

// ✅ DELETE ITEM
export const removeFromCartBackend = createAsyncThunk(
  "cart/removeFromCartBackend",
  async (id: number) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    return id;
  }
);

// ✅ INCREASE QTY
export const increaseQtyBackend = createAsyncThunk(
  "cart/increaseQtyBackend",
  async (id: number) => {
    const res = await fetch(`${API}/increase/${id}`, {
      method: "PATCH",
    });

    return await res.json();
  }
);

// ✅ DECREASE QTY
export const decreaseQtyBackend = createAsyncThunk(
  "cart/decreaseQtyBackend",
  async (id: number) => {
    const res = await fetch(`${API}/decrease/${id}`, {
      method: "PATCH",
    });

    return await res.json();
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // ✅ FETCH
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.items = action.payload;
        }
      )

      // ✅ ADD TO CART
      .addCase(
        addToCartBackend.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === action.payload.productId &&
              item.size === action.payload.size &&
              item.color === action.payload.color
          );

          if (existingItem) {
            existingItem.qty = action.payload.qty;
          } else {
            state.items.push(action.payload);
          }
        }
      )

      // ✅ DELETE
      .addCase(
        removeFromCartBackend.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      )

      // ✅ INCREASE
      .addCase(
        increaseQtyBackend.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const index = state.items.findIndex(
            (item) => item.id === action.payload.id
          );

          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )

      // ✅ DECREASE
      .addCase(
        decreaseQtyBackend.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const index = state.items.findIndex(
            (item) => item.id === action.payload.id
          );

          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      );
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
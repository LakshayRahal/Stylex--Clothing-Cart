import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "@/firebase/firebase";
//  helpers
const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

// cart 
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const headers = await getAuthHeader();

    const response = await axios.post(
      "http://localhost:5000/api/shop/cart/add",
      { productId, quantity },
      { headers }
    );

    return response.data;
  }
);

// fetch 
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const headers = await getAuthHeader();

    const response = await axios.get(
      "http://localhost:5000/api/shop/cart/get",
      { headers }
    );

    return response.data;
  }
);

// update 
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }) => {
    const headers = await getAuthHeader();

    const response = await axios.put(
      "http://localhost:5000/api/shop/cart/update", 
      { productId, quantity }, 
      { headers }
    );

    return response.data;
  }
);
//  delete 
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (productId) => {
    const headers = await getAuthHeader();

    const response = await axios.delete(
      `http://localhost:5000/api/shop/cart/${productId}`,
      { headers }
    );

    return response.data;
  }
);

// slice 
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState: {
    cartItems: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD 
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data.items;
      })

      //  FETCH 
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data.items;
      })

      //  UPDATE 
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.data.items;
      })

      // /DELETE 
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload.data.items;
      })

      //  FALLBACK 
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export default shoppingCartSlice.reducer;

// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { auth } from "@/firebase/firebase";
// import { onAuthStateChanged } from "firebase/auth";

// // ✅ SAFE AUTH HEADER (waits for Firebase)
// const getAuthHeader = async () => {
//   return new Promise((resolve, reject) => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       unsubscribe(); // stop listener after first run

//       if (!user) {
//         reject("User not logged in");
//       } else {
//         try {
//           const token = await user.getIdToken();
//           resolve({
//             Authorization: `Bearer ${token}`,
//           });
//         } catch (error) {
//           reject(error);
//         }
//       }
//     });
//   });
// };

// // ✅ ADD TO CART
// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async ({ productId, quantity }, { rejectWithValue }) => {
//     try {
//       const headers = await getAuthHeader();

//       console.log("🛒 ADD TOKEN:", headers);

//       const response = await axios.post(
//         "http://localhost:5000/api/shop/cart/add",
//         { productId, quantity },
//         { headers }
//       );

//       console.log("🛒 ADD RESPONSE:", response.data);

//       return response.data;
//     } catch (error) {
//       console.log("❌ ADD ERROR:", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // ✅ FETCH CART
// export const fetchCartItems = createAsyncThunk(
//   "cart/fetchCartItems",
//   async (_, { rejectWithValue }) => {
//     try {
//       const headers = await getAuthHeader();

//       console.log("🛒 FETCH TOKEN:", headers);

//       const response = await axios.get(
//         "http://localhost:5000/api/shop/cart/get",
//         { headers }
//       );

//       console.log("🛒 FETCH RESPONSE:", response.data);

//       return response.data;
//     } catch (error) {
//       console.log("❌ FETCH ERROR:", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // ✅ UPDATE CART
// export const updateCartQuantity = createAsyncThunk(
//   "cart/updateCartQuantity",
//   async ({ productId, quantity }, { rejectWithValue }) => {
//     try {
//       const headers = await getAuthHeader();

//       const response = await axios.put(
//         "http://localhost:5000/api/shop/cart/update-cart",
//         { productId, quantity },
//         { headers }
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // ✅ DELETE CART ITEM
// export const deleteCartItem = createAsyncThunk(
//   "cart/deleteCartItem",
//   async (productId, { rejectWithValue }) => {
//     try {
//       const headers = await getAuthHeader();

//       const response = await axios.delete(
//         `http://localhost:5000/api/shop/cart/${productId}`,
//         { headers }
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // ✅ SLICE
// const shoppingCartSlice = createSlice({
//   name: "shoppingCart",
//   initialState: {
//     cartItems: [],
//     isLoading: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // ADD
//       .addCase(addToCart.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.isLoading = false;
//         console.log("🔥 ADD RESPONSE:", action.payload);
//         state.cartItems = action.payload?.data?.items || [];
//       })

//       // FETCH
//       .addCase(fetchCartItems.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchCartItems.fulfilled, (state, action) => {
//         console.log("🔥 FULL PAYLOAD:", action.payload);
//         state.isLoading = false;
//         state.cartItems = action.payload?.data?.items || [];
//       })

//       // UPDATE
//       .addCase(updateCartQuantity.fulfilled, (state, action) => {
//         state.cartItems = action.payload?.data?.items || [];
//       })

//       // DELETE
//       .addCase(deleteCartItem.fulfilled, (state, action) => {
//         state.cartItems = action.payload?.data?.items || [];
//       })

//       // ERROR HANDLING
//       .addMatcher(
//         (action) => action.type.endsWith("rejected"),
//         (state) => {
//           state.isLoading = false;
//         }
//       );
//   },
// });

// export default shoppingCartSlice.reducer;
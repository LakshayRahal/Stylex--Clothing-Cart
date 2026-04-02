import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { auth } from "@/firebase/firebase";

// helper to get Firebase token
const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

// CREATE ORDER
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeader();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
        orderData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.log(" CREATE ORDER ERROR:", error);
      return rejectWithValue(error.message);
    }
  }
);

//  CAPTURE PAYMENT
export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeader();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
        {
          paymentId,
          payerId,
          orderId,
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.log(" PAYMENT ERROR:", error);
      return rejectWithValue(error.message);
    }
  }
);

//  GET ALL ORDERS (NO userId — token based)
export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeader();

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/get`,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.log(" FETCH ORDERS ERROR:", error);
      return rejectWithValue(error.message);
    }
  }
);

//  GET ORDER DETAILS
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeader();

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.log(" ORDER DETAILS ERROR:", error);
      return rejectWithValue(error.message);
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 CREATE ORDER
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload?.approvalURL || null;
        state.orderId = action.payload?.orderId || null;

        if (action.payload?.orderId) {
          sessionStorage.setItem(
            "currentOrderId",
            JSON.stringify(action.payload.orderId)
          );
        }
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })

      // 🔹 FETCH ALL ORDERS
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload?.data || [];
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // 🔹 ORDER DETAILS
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload?.data || null;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
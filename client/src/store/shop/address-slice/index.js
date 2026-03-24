import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuth } from "firebase/auth";

const initialState = {
  isLoading: false,
  addressList: [],
};

//  Helper to safely get user UID
const getUserUID = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  return user.uid;
};

//  ADD ADDRESS
export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const userId = getUserUID();


      const response = await axios.post(
        "http://localhost:5000/api/shop/address/add",
        {
          ...formData,
          userId,
        }
      );

      return response.data;
    } catch (error) {
      console.log("❌ Add Address Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

//  FETCH ADDRESSES
export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserUID();


      const response = await axios.get(
        `http://localhost:5000/api/shop/address/get/${userId}`
      );

      return response.data;
    } catch (error) {
      console.log("❌ Fetch Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// EDIT ADDRESS
export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ addressId, formData }, { rejectWithValue }) => {
    try {
      const userId = getUserUID();

      const response = await axios.put(
        `http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  DELETE ADDRESS
export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ addressId }, { rejectWithValue }) => {
    try {
      const userId = getUserUID();

      const response = await axios.delete(
        `http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  SLICE
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;

        //  instantly update UI
        if (action.payload?.data) {
          state.addressList.push(action.payload.data);
        }
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })

      // FETCH
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload?.data || [];
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
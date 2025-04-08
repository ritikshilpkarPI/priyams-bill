import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: StaffSliceInterface = {
  staffs: [],
  loading: false,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action) => {
      state.staffs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setStaff, setLoading } = staffSlice.actions;
export default staffSlice.reducer;
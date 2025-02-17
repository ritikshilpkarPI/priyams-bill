import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemsSkuList: [],
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItemsData: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setItemsData } = itemsSlice.actions;
export default itemsSlice.reducer;
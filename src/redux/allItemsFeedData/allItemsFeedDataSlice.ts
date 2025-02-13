import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initialState: AllItemsFeedDataState = {
  itemsFeedData: { itemBarCodesList: [],
    itemNamesList: [],
    itemsBarCodeMap: {},
    itemsNameMap: {},
    totalItemsCount: 0,},
};

const allItemsFeedDataSlice = createSlice({
  name: 'allItemsFeedData',
  initialState,
  reducers: {
    setItemsFeedData: (state, action: PayloadAction<AllItemsFeedData>) => {
      state.itemsFeedData = action.payload;
    },
   
  },
});

export const { setItemsFeedData } = allItemsFeedDataSlice.actions;
export default allItemsFeedDataSlice.reducer;
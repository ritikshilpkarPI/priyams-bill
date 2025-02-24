import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initialState: AllItemsFeedDataState = {
  itemsFeedData: { itemBarCodesList: [],
    itemNamesList: [],
    itemsBarCodeMap: {},
    itemsNameMap: {},
    totalItemsCount: 0,},
    itemsFeedAPILoading:false
};

const allItemsFeedDataSlice = createSlice({
  name: 'allItemsFeedData',
  initialState,
  reducers: {
    setItemsFeedData: (state, action: PayloadAction<AllItemsFeedData>) => {
      state.itemsFeedData = action.payload;
      state.itemsFeedAPILoading = false;
    },
    setItemsFeedAPILoading: (state, action: PayloadAction<boolean>) => {
      state.itemsFeedAPILoading = action.payload;
    },
   
  },
});

export const { setItemsFeedData,setItemsFeedAPILoading } = allItemsFeedDataSlice.actions;
export default allItemsFeedDataSlice.reducer;

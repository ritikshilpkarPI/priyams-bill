import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initialState: AllItemsFeedDataState = {
  itemsFeedData: { itemBarCodesList: [],
    itemNamesList: [],
    itemsBarCodeMap: {},
    itemsNameMap: {},
    totalItemsCount: 0,},
    loading:false
};

const allItemsFeedDataSlice = createSlice({
  name: 'allItemsFeedData',
  initialState,
  reducers: {
    setItemsFeedData: (state, action: PayloadAction<AllItemsFeedData>) => {
      state.itemsFeedData = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
   
  },
});

export const { setItemsFeedData,setLoading } = allItemsFeedDataSlice.actions;
export default allItemsFeedDataSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initialState: AllItemsFeedDataState = {
  itemsFeedData: { itemBarCodesList: [],
    itemNamesList: [],
    itemsBarCodeMap: {},
    itemsNameMap: {},
    totalItemsCount: 0,},
    itemsFeedAPILoading:false
};

const allWarehouseItemsFeedDataSlice = createSlice({
  name: 'allWarehouseItemsFeedData',
  initialState,
  reducers: {
    setWarehouseItemsFeedData: (state, action: PayloadAction<AllItemsFeedData>) => {
      state.itemsFeedData = action.payload;
      state.itemsFeedAPILoading = false;
    },
    setWarehouseItemsFeedAPILoading: (state, action: PayloadAction<boolean>) => {
      state.itemsFeedAPILoading = action.payload;
    },
   
  },
});

export const { setWarehouseItemsFeedData, setWarehouseItemsFeedAPILoading } = allWarehouseItemsFeedDataSlice.actions;
export default allWarehouseItemsFeedDataSlice.reducer;

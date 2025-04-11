import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initialState: PurchaseListApprovalState = {
  allPurchaseList: [],
  loadingState: {},
  order: 'asc',
  orderBy: 'createdAt',
  page: 0,
  rowsPerPage: 10,
  indexDetail: null,
  isAdminUser: false,
};

const purchaseListApprovalSlice = createSlice({
  name: 'purchaseListApproval',
  initialState,
  reducers: {
    setAllPurchaseList(state, action: PayloadAction<any[]>) {
      state.allPurchaseList = action.payload;
    },
    setLoadingState(
      state,
      action: PayloadAction<{ id: string; value: { state: boolean; btnName: string } }>
    ) {
      state.loadingState[action.payload.id] = action.payload.value;
    },
    setOrder(state, action: PayloadAction<'asc' | 'desc'>) {
      state.order = action.payload;
    },
    setOrderBy(state, action: PayloadAction<string>) {
      state.orderBy = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    },
    setIndexDetail(state, action: PayloadAction<number | null>) {
      state.indexDetail = action.payload;
    },
    setIsAdminUser(state, action: PayloadAction<boolean>) {
      state.isAdminUser = action.payload;
    },
    resetPurchaseListApprovalState() {
      return initialState;
    },
  },
});

export const {
  setAllPurchaseList,
  setLoadingState,
  setOrder,
  setOrderBy,
  setPage,
  setRowsPerPage,
  setIndexDetail,
  setIsAdminUser,
  resetPurchaseListApprovalState,
} = purchaseListApprovalSlice.actions;

export default purchaseListApprovalSlice.reducer;

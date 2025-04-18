import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CONSTANTS } from '../../constants/constants';
const initialState: StockTransactionType = {
  transactionType: '',
  source: {
    sourceStaff: '',
    sourceEntityId: '',
    sourceType: '',
    sourceRemark: '',
  },
  destination: {
    destinationStaff: '',
    destinationEntityId: '',
    destinationType: '',
    destinationRemark: '',
  },
  transactionReason: '',
  dateOfTransaction: '',
  transactionStatus: '',
  hasErrors: false,
  approvedByAdmin: false,
  adminRemark: '',
  isDeleted: false,
  transactionItems: [],
  sourceTypeData: [
    { label: CONSTANTS.WAREHOUSE, value: CONSTANTS.WAREHOUSE },
    { label: CONSTANTS.STORE, value: CONSTANTS.STORE },
    { label: CONSTANTS.DEALER, value: CONSTANTS.DEALER, disabled: true },
  ],
  destinationTypeData: [
    { label: CONSTANTS.WAREHOUSE, value: CONSTANTS.WAREHOUSE },
    { label: CONSTANTS.STORE, value: CONSTANTS.STORE },
    { label: CONSTANTS.DEALER, value: CONSTANTS.DEALER },
  ],
};

const stockTransactionSlice = createSlice({
  name: 'stockTransaction',
  initialState,
  reducers: {
    addTransactionItem: (state, action: PayloadAction<TransactionItemType>) => {
      state.transactionItems.push(action.payload);
    },
    updateTransactionItemQuantity: (
      state,
      action: PayloadAction<{
        itemId: string;
        quantity: number;
        shelfId?: string;
      }>
    ) => {
      const { itemId, quantity, shelfId } = action.payload;

      const item = state.transactionItems.find(
        (transactionItem) => transactionItem.itemId === itemId
      );
      if (!item) return;

      if (shelfId) {
        const batch = item.itemByDate?.find(
          (batch: any) => batch.shelfId === shelfId
        );
        if (batch) {
          batch.sourceQuantity.qty = quantity;

          item.itemShelfDates = item.itemShelfDates?.map((batch: any) =>
            batch._id === shelfId
              ? { ...batch, quantity: quantity ?? 0 }
              : batch
          );
        }
      }

      item.totalQtyAdd = item.itemByDate.reduce(
        (acc: number, batch: any) => acc + (batch.sourceQuantity.qty || 0),
        0
      );
    },
    resetStoreInventory: (state) => {
      state.transactionItems = [];
    },
    removeTransactionItem: (state, action) => {
      state.transactionItems = state.transactionItems.filter(
        (invItem) => invItem.itemId !== action.payload
      );
    },
    addTransactionSource: (state, action: PayloadAction<TransactionSource>) => {
      Object.assign(state.source, action.payload);
    },
    addTransactionDestination: (
      state,
      action: PayloadAction<TransactionDestination>
    ) => {
      Object.assign(state.destination, action.payload);
    },
    setTransactionReason: (state, action) => {
      state.transactionReason = action.payload;
    },
    getSwap: (state) => {
      const tempSource = { ...state.source };
      state.source = {
        sourceType: state.destination.destinationType,
        sourceEntityId: state.destination.destinationEntityId,
        sourceStaff: state.destination.destinationStaff,
        sourceRemark: state.destination.destinationRemark,
      };
      state.destination = {
        destinationType: tempSource.sourceType,
        destinationEntityId: tempSource.sourceEntityId,
        destinationStaff: tempSource.sourceStaff,
        destinationRemark: tempSource.sourceRemark,
      };
    },
    resetTransactionSource: (state) => {
      state.source = {
        ...state.source,
        sourceEntityId: '',
        sourceStaff: '',
        sourceRemark: '',
      };
    },
    resetTransactionDestination: (state) => {
      state.destination = {
        ...state.destination,
        destinationEntityId: '',
        destinationStaff: '',
        destinationRemark: '',
      };
    },
  },
});

export const {
  addTransactionItem,
  updateTransactionItemQuantity,
  removeTransactionItem,
  addTransactionSource,
  addTransactionDestination,
  setTransactionReason,
  resetTransactionSource,
  resetTransactionDestination,
  getSwap,
  resetStoreInventory,
} = stockTransactionSlice.actions;

export default stockTransactionSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CONSTANTS } from '../../constants/constants';
const initialState: StockTransactionType = {
  transactionType: 'IN',
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
  transactionReason:"",
  dateOfTransaction: new Date(),
  transactionStatus: 'pending',
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
      state.transactionType = 'IN';
      state.source = {
        sourceStaff: '',
        sourceEntityId: '',
        sourceType: '',
        sourceRemark: '',
      };
      state.destination = {
        destinationStaff: '',
        destinationEntityId: '',
        destinationType: '',
        destinationRemark: '',
      };
      state.approvedByAdmin = false;
      state.transactionReason = '';
      
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
    setTransactionData: (
      state,
      action: PayloadAction<{
        transactionType?: string;
        transactionStatus?: string;
        dateOfTransaction?: Date | string;
        approvedByAdmin?: boolean;
        adminRemark?: string;
        transactionItems?: any[];
        transactionReason?: string;
        source?: TransactionSource;
        destination?: TransactionDestination;
      }>
    ) => {
      const {
        transactionType,
        transactionStatus,
        dateOfTransaction,
        approvedByAdmin,
        adminRemark,
        transactionItems,
        transactionReason,
        source,
        destination,
      } = action.payload;
    
      if (transactionType !== undefined) state.transactionType = transactionType;
      if (transactionStatus !== undefined) state.transactionStatus = transactionStatus;
      if (dateOfTransaction !== undefined) state.dateOfTransaction = dateOfTransaction;
      if (approvedByAdmin !== undefined) state.approvedByAdmin = approvedByAdmin;
      if (adminRemark !== undefined) state.adminRemark = adminRemark;
      if (transactionReason !== undefined) state.transactionReason = transactionReason;
          
      if (source) {
        if (source.sourceType !== undefined) state.source.sourceType = source.sourceType;
        if (source.sourceEntityId !== undefined) state.source.sourceEntityId = source.sourceEntityId._id;
        if (source.sourceStaff?._id) state.source.sourceStaff = source.sourceStaff._id;
        if (source.sourceRemark !== undefined) state.source.sourceRemark = source.sourceRemark;
      }
    
      if (destination) {
        if (destination.destinationType !== undefined)
          state.destination.destinationType = destination.destinationType;
        if (destination.destinationEntityId !== undefined)
          state.destination.destinationEntityId = destination.destinationEntityId._id;
        if (destination.destinationStaff?._id)
          state.destination.destinationStaff = destination.destinationStaff._id;
        if (destination.destinationRemark !== undefined)
          state.destination.destinationRemark = destination.destinationRemark;
      }
    
      if (Array.isArray(transactionItems)) {
        state.transactionItems = transactionItems.map((item) => ({
          itemId: item.itemId,
          itemBarcode: item.itemId.itemBarcode,
          itemMRPperUnit: item.itemMRPperUnit,
          itemName: item.itemName,
          itemQtyInStore: item.itemQtyInStore,
          itemStockQuantity: item.itemId.itemStockQuantity,
          itemSellingPricePerUnit: item.itemSellingPricePerUnit,
          sku: item.itemId.sku,
          totalQtyAdd: 0,
          itemShelfDates: [],
          itemByDate: item.itemByDate,
        }));
      }
    }
    ,    
    updateTransactionItemRemarkAndError: (
      state,
      action: PayloadAction<{
        itemId: string;
        field: 'destinationRemark' | 'error';
        value: string;
      }>
    ) => {
      const { itemId, field, value } = action.payload;
      const item = state.transactionItems.find((i) => i.itemId === itemId);
      if (!item) return;
    
      if (field === 'destinationRemark') {
        item.destinationRemark = value;
      }
    
      if (field === 'error') {
        item.error = value;
      }
    },
    
    updateTransactionItemShelfField: (
      state,
      action: PayloadAction<{
        itemId: any;
        index: number;
        path: string;
        value: any;
        shelfId: string;
      }>
    ) => {
      const { itemId, index, path, value, shelfId } = action.payload;
    
      const item = state.transactionItems.find((i: any) => i.itemId._id === itemId._id);
    
      if (!item || !item.itemByDate || !item.itemByDate[index]) return;
      const shelf = item.itemByDate[index];
    
      if (path === 'destinationQuantity.qty') {
        shelf.destinationQuantity = {
          qty: value,
          manufacturingDate: new Date(shelf.sourceQuantity.manufacturingDate),
          expiryDate: new Date(shelf.sourceQuantity.expiryDate),
        };
    
        const sourceQty = shelf.sourceQuantity?.qty ?? 0;
        const destQty = value ?? 0;

    
        shelf.statusMessage = sourceQty === destQty ? 'Matched' : 'Qty mismatch';
        if (sourceQty != destQty) {
          shelf.itemError = {
            errorReason: 'Qty mismatch',
            errorQty: sourceQty - destQty,
            isResolved: false,
          }
        }
      }
    
      if (path === 'destinationRemark') {
        shelf.destinationRemark = value;
      }
    }
    
    

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
  setTransactionData,
  updateTransactionItemRemarkAndError,
  updateTransactionItemShelfField
} = stockTransactionSlice.actions;

export default stockTransactionSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BatchEntry {
  shelfId: string;
  manufacturingDate: Date;
  expiryDate: Date;
  quantity: number;
  checked: boolean;
  costPrice?: number;
  purchaseOrderId?: string;
  entryDate?: Date;
  initialStockQuantity?: number;
}

export interface ExpiryBatchState {
  items: Record<string, BatchEntry[]>;
  dealerId: string;
  boxId: string;
  dealerNameInExpiryBatch: string;
}

const initialState: ExpiryBatchState = {
  items: {},
  dealerId: '',
  boxId: '',
  dealerNameInExpiryBatch: '',
};

const expiryBatchSlice = createSlice({
  name: 'expiryBatch',
  initialState,
  reducers: {
    setItems: (
      state,
      action: PayloadAction<{
        items: {
          _id: string;
          itemShelfDates: {
            _id: string;
            manufacturingDate: string;
            expiryDate: string;
            currentStockQuantity: number;
            purchaseOrderId: string;
          }[];
        }[];
      }>
    ) => {
      state.items = {};
      action.payload.items.forEach((item) => {
        state.items[item._id] = item.itemShelfDates.map((batch) => ({
          shelfId: batch._id,
          manufacturingDate: new Date(batch.manufacturingDate),
          expiryDate: new Date(batch.expiryDate),
          quantity: batch.currentStockQuantity,
          checked: false,
          purchaseOrderId: batch.purchaseOrderId,
        }));
      });
    },

    toggleChecked: (
      state,
      action: PayloadAction<{ itemId: string; shelfId: string }>
    ) => {
      const batches = state.items[action.payload.itemId];
      if (!batches) return;
      const b = batches.find((x) => x.shelfId === action.payload.shelfId);
      if (b) b.checked = !b.checked;
    },

    updateBatch: (
      state,
      action: PayloadAction<{
        itemId: string;
        shelfId: string;
        fields: Partial<{
          manufacturingDate: Date;
          expiryDate: Date;
          quantity: number;
            checked: boolean;
          costPrice: number;
        }>;
      }>
    ) => {  

      const batches = state.items[action.payload.itemId];
      if (!batches) return;
      const b = batches.find((x) => x.shelfId === action.payload.shelfId);
      if (b) Object.assign(b, action.payload.fields);
    },
    addBatch: (
      state,
      action: PayloadAction<{
        itemId: string;
        batch: {
          _id: string;
          shelfId: string;
          purchaseOrderId: string;
          entryDate: string;
          manufacturingDate: string;
          expiryDate: string;
          initialStockQuantity: number;
          currentStockQuantity: number;
          checked?: boolean;
          costPrice?: number;
        };
      }>
    ) => {
      const { itemId, batch } = action.payload;
      if (!state.items[itemId]) {
        state.items[itemId] = [];
      }
      state.items[itemId].push({
        shelfId: batch.shelfId,
        manufacturingDate: new Date(batch.manufacturingDate),
        expiryDate: new Date(batch.expiryDate),
        quantity: batch.currentStockQuantity,
        checked: batch.checked ?? false,
      });
    },
    setDealerIdToBatch: (
      state,
      action: PayloadAction<{ dealerId?: string, dealerName?: string }>
    ) => {
      if (action.payload.dealerId)
      state.dealerId = action.payload.dealerId;
      if (action.payload.dealerName) {
        state.dealerNameInExpiryBatch = action.payload.dealerName;
      }
    },
    setBoxIdToBatch: (
      state,
      action: PayloadAction<{ boxId: string }>
    ) => {
      state.boxId = action.payload.boxId;
    },
    clearBatch: (state) => {
      state.items = {};
      state.dealerId = '';
      state.boxId = '';
    },
  },
});

export const { setItems, toggleChecked, updateBatch, addBatch, setDealerIdToBatch, setBoxIdToBatch, clearBatch } =
  expiryBatchSlice.actions;
export default expiryBatchSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BatchEntry {
  shelfId: string;
  manufacturingDate: Date;
  expiryDate: Date;
  quantity: number;
  checked: boolean;
}

export interface ExpiryBatchState {
  items: Record<string, BatchEntry[]>;
}

const initialState: ExpiryBatchState = {
  items: {},
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
        }>;
      }>
    ) => {
      const batches = state.items[action.payload.itemId];
      if (!batches) return;
      const b = batches.find((x) => x.shelfId === action.payload.shelfId);
      if (b) Object.assign(b, action.payload.fields);
    },
  },
});

export const { setItems, toggleChecked, updateBatch } =
  expiryBatchSlice.actions;
export default expiryBatchSlice.reducer;

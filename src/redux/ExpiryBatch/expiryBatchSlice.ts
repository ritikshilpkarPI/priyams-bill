import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryRow, Purchase, ItemData } from '../../types';

export interface BatchEntry {
  _id: string;
  shelfId: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  currentStockQuantity: number;
  checked: boolean;
  costPrice?: number;
  purchaseOrderId?: string;
  entryDate?: string;
  initialStockQuantity?: number;
}

export interface ExpiryBatchState {
  items: Record<string, BatchEntry[]>;
  itemsData: InventoryRow[];
  dealerId: string;
  boxId: string;
  dealerNameInExpiryBatch: string;
  batchStatus: string;
}

const initialState: ExpiryBatchState = {
  items: {},
  itemsData: [],
  dealerId: '',
  boxId: '',
  dealerNameInExpiryBatch: '',
  batchStatus: '',  
};

const expiryBatchSlice = createSlice({
  name: 'expiryBatch',
  initialState,
  reducers: {
    setItems: (
      state,
      action: PayloadAction<{
        items: ItemData[];
      }>
    ) => {
      state.items = {};
      action.payload.items.forEach((item) => {
        state.items[item._id] = item.itemShelfDates.map((batch) => ({
          _id: batch._id,
          shelfId: batch._id,
          manufacturingDate: batch.manufacturingDate,
          expiryDate: batch.expiryDate,
          quantity: batch.currentStockQuantity,
          currentStockQuantity: batch.currentStockQuantity,
          checked: false,
          purchaseOrderId: batch.purchaseOrderId,
          entryDate: batch.entryDate,
          initialStockQuantity: batch.initialStockQuantity,
          costPrice: batch.costPrice,
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
        fields: Partial<BatchEntry>;
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
        batch: BatchEntry;
      }>
    ) => {
      const { itemId, batch } = action.payload;      
      if (!state.items[itemId]) {
        state.items[itemId] = [];
      }
      state.items[itemId].push({
        ...batch,
        _id: batch._id || Date.now().toString(),
        shelfId: batch.shelfId || batch._id || Date.now().toString(),
        manufacturingDate: batch.manufacturingDate || new Date().toISOString(),
        expiryDate: batch.expiryDate || new Date().toISOString(),
        quantity: batch.currentStockQuantity || batch.quantity || 0,
        currentStockQuantity: batch.currentStockQuantity || batch.quantity || 0,
        checked: batch.checked ?? true,
        costPrice: batch.costPrice || 0,
        purchaseOrderId: batch.purchaseOrderId || '',
        entryDate: batch.entryDate || new Date().toISOString(),
        initialStockQuantity: batch.initialStockQuantity || batch.currentStockQuantity || batch.quantity || 0
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
    removeBatch: (
      state,
      action: PayloadAction<{ itemId: string; shelfId: string }>
    ) => {
      const { itemId, shelfId } = action.payload;
      
      const batches = state.items[itemId];
      
      if (!batches) return;
      state.items[itemId] = batches.filter(batch => batch.shelfId !== shelfId);
      
       if (state.items[itemId].length === 0) {
           const { [itemId]: _, ...rest } = state.items;
           state.items = rest;
       }
    },
    updateItemsWithExpiryBatch: (
      state,
      action: PayloadAction<{
        items: (BatchEntry & { itemId: { _id: string } })[];
      }>
    ) => {
      const { items } = action.payload;
      items.forEach((item) => {
        const itemId = item.itemId?._id;
        if (!itemId) return;

        if (!state.items[itemId]) {
          state.items[itemId] = [];
        }        

        const existingBatchIndex = state.items[itemId].findIndex(b => b.shelfId === item._id);

        const batchData: BatchEntry = {
          _id: item._id || Date.now().toString(),
          shelfId: item._id || '',
          manufacturingDate: item.manufacturingDate || new Date().toISOString(),
          expiryDate: item.expiryDate || new Date().toISOString(),
          quantity: item.quantity || 0,
          currentStockQuantity: item.quantity || 0,
          checked: item.checked ?? true,
          costPrice: item.costPrice,
          purchaseOrderId: item.purchaseOrderId,
          entryDate: item.entryDate || new Date().toISOString(),
          initialStockQuantity: item.initialStockQuantity || 0,
        };

        if (existingBatchIndex !== -1) {
          state.items[itemId][existingBatchIndex] = { ...state.items[itemId][existingBatchIndex], ...batchData };
        } else {
          state.items[itemId].push(batchData);
        }
      });
    },
    setBatchStatus: (
      state,
      action: PayloadAction<string>
    ) => {
      state.batchStatus = action.payload;
    },
    clearBatchStatus: (state) => {
      state.batchStatus = '';
    },
    removeItemData: (state, action: PayloadAction<{ itemId: string }>) => {
      const { itemId } = action.payload;

      const batchesToRemove = state.items[itemId];
      if (batchesToRemove) {
        batchesToRemove.forEach(batch => {
          batch.checked = false;
        });
      }

      state.itemsData = state.itemsData.filter((item: InventoryRow) => item._id !== itemId);
      
    },
    setItemsData: (state, action: PayloadAction<InventoryRow[]>) => {
      state.itemsData = action.payload;
    },
    addItemData: (state, action: PayloadAction<InventoryRow>) => {
       if (!state.itemsData.some(item => item._id === action.payload._id)) {
           state.itemsData.push(action.payload);
       }
    },
  },
});

export const { setItems, toggleChecked, updateBatch, addBatch, setDealerIdToBatch, setBoxIdToBatch, clearBatch, removeBatch, updateItemsWithExpiryBatch, setBatchStatus, clearBatchStatus, removeItemData, addItemData, setItemsData } =
  expiryBatchSlice.actions;
export default expiryBatchSlice.reducer;

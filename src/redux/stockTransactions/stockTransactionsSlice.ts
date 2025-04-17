import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { formatDateTime } from 'src/utils/formatDate';


const initialState: TransactionState = {
  rawData: {},
  transformedData: [],
  expandedRows: [],
  isLoading: false,
  page: 0,
  rowsPerPage: 10, 
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(),
  
};

const stockTransactionsSlice = createSlice({
  name: 'stockTransactions',
  initialState,
  reducers: {
    setRawData(state, action: PayloadAction<{ page: number; data: any[] }>) {
      const { page, data } = action.payload;
      state.rawData[page] = data;  
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    toggleExpandedRow(state, action: PayloadAction<string>) {
      const rowId = action.payload;
      state.expandedRows = state.expandedRows.includes(rowId)
        ? state.expandedRows.filter((id) => id !== rowId)
        : [...state.expandedRows, rowId];
    },
    transformData(state) {
      const transformed = [];
      const expandedSet = new Set(state.expandedRows);
    
      const allPages = Object.values(state.rawData).flat();
    
      let txnIndex = 0;
      let itemIndex = 0;
      let subIndex = -1;
    
      while (txnIndex < allPages.length) {
        const txn = allPages[txnIndex];
        const transactionId = txn.transactionSlug;
        const items = txn.transactionItems ?? [];
    
        if (itemIndex >= items.length) {
          txnIndex++;
          itemIndex = 0;
          subIndex = -1;
          continue;
        }
    
        const item = items[itemIndex];
        const itemId = item?.itemId?._id ?? `item_${itemIndex}`;
        const mainRowId = `${transactionId}_${itemId}`;
        const isCurrentPage = state.rawData[state.page]?.includes(txn);
        const subRows = item.itemByDate ?? [];
    
        if (subIndex === -1 && isCurrentPage) {
          transformed.push({
            _id: mainRowId,
            transactionId,
            itemId,
            sku: item?.itemId?.sku ?? '',
            price: item?.itemId?.itemMRPperUnit ?? '',
            transactionType: txn.transactionType,
            sourceType: txn.source?.sourceType,
            sourceRemark: txn.source?.sourceRemark,
            sourceStaff: txn.source?.sourceStaff?.name,
            destinationType: txn.destination?.destinationType,
            destinationRemark: txn.destination?.destinationRemark,
            destinationStaff: txn.destination?.destinationStaff?.name,
            transactionReason: txn.transactionReason,
            transactionStatus: txn.transactionStatus,
            hasErrors: txn.hasErrors ? 'Yes' : 'No',
            approvedByAdmin: txn.approvedByAdmin ? 'Yes' : 'No',
            adminRemark: txn.adminRemark,
            dateOfTransaction: formatDateTime(txn.dateOfTransaction),
            isSubRow: false,
          });
    
          if (expandedSet.has(mainRowId) && subRows.length > 0) {
            subIndex = 0;
            continue;
          } else {
            itemIndex++;
            continue;
          }
        }
    
        if (expandedSet.has(mainRowId) && subIndex >= 0 && subIndex < subRows.length) {
          const dateData = subRows[subIndex];
    
          transformed.push({
            _id: `${mainRowId}_date_${subIndex}`,
            sourceExpiry: dateData?.sourceQuantity?.expiryDate ? formatDateTime(dateData.sourceQuantity.expiryDate) : '',
            sourceMfg: dateData?.sourceQuantity?.manufacturingDate ? formatDateTime(dateData.sourceQuantity.manufacturingDate) : '',
            qty: dateData?.sourceQuantity?.qty ?? '',
            destinationQty: dateData?.destinationQuantity?.qty ?? '',
            destinationExpiry: dateData?.destinationQuantity?.expiryDate ? formatDateTime(dateData.destinationQuantity.expiryDate) : '',
            destinationMfg: dateData?.destinationQuantity?.manufacturingDate ? formatDateTime(dateData.destinationQuantity.manufacturingDate) : '',
            ItemSourceRemark: dateData?.sourceRemark ?? '',
            ItemDestinationRemark: dateData?.destinationRemark ?? '',
            itemError: dateData?.itemError?.errorReason ?? '',
            isSubRow: true,
          });
    
          subIndex++;
    
          if (subIndex >= subRows.length) {
            subIndex = -1;
            itemIndex++;
          }
    
          continue;
        }
    
        itemIndex++;
        subIndex = -1;
      }
    
      state.transformedData = transformed;
    }
    ,
    setPage(state, action: PayloadAction<number>) {
        state.page = action.payload;
      },
      setRowsPerPage(state, action: PayloadAction<number>) {
        state.rowsPerPage = action.payload;
      },
      setStartDate(state, action) {
        state.startDate = action.payload;
      },
      setEndDate(state, action) {
        state.endDate = action.payload;
      },
      clearRawData: (state) => {
        state.rawData = {};
      },
  },
});

export const {
  setRawData,
  setIsLoading,
  toggleExpandedRow,
  transformData,
  setPage,
  setRowsPerPage,
  setStartDate,
  setEndDate,
  clearRawData
} = stockTransactionsSlice.actions;

export default stockTransactionsSlice.reducer;

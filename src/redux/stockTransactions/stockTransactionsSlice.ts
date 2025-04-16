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
      const transformed: any[] = [];

      Object.values(state.rawData).forEach((txnList) => {
        txnList.forEach((txn: any) => {
          const transactionId = txn._id;

          txn.transactionItems?.forEach((item: any, index: number) => {
            const itemName = item?.itemId?.itemName ?? '';
            const price = item?.itemId?.itemMRPperUnit ?? '';
            const itemId = item?.itemId?._id ?? `item_${index}`;
            const mainRowId = `${transactionId}_${itemId}`;

            transformed.push({
              _id: mainRowId,
              transactionId,
              itemId,
              itemName,
              price,
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

            if (state.expandedRows.includes(mainRowId)) {
              
              item.itemByDate?.forEach((dateData: any, i: number) => {
                const subRowId = `${mainRowId}_date_${i}`;
                transformed.push({
                  _id: subRowId,
                  sourceExpiry: dateData?.sourceQuantity?.expiryDate
                    ? formatDateTime(dateData.sourceQuantity.expiryDate)
                    : '',
                  sourceMfg: dateData?.sourceQuantity?.manufacturingDate
                    ? formatDateTime(dateData.sourceQuantity.manufacturingDate)
                    : '',
                  qty: dateData?.sourceQuantity?.qty ?? '',
                  destinationQty: dateData?.destinationQuantity?.qty ?? '',
                  destinationExpiry: dateData?.destinationQuantity?.expiryDate
                    ? formatDateTime(dateData.destinationQuantity.expiryDate)
                    : '',
                  destinationMfg: dateData?.destinationQuantity?.manufacturingDate
                    ? formatDateTime(dateData.destinationQuantity.manufacturingDate)
                    : '',
                  ItemSourceRemark: dateData?.sourceRemark ?? '',
                  ItemDestinationRemark: dateData?.destinationRemark ?? '',
                  itemError: dateData?.itemError?.errorReason,
                  isSubRow: true,
                });
              });
            }
          });
        });
      });

      state.transformedData = transformed;
    },
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
  setEndDate
} = stockTransactionsSlice.actions;

export default stockTransactionsSlice.reducer;

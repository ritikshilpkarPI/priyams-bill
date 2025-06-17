import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateRange, LoadingState, TableRowData } from '../../components/dashboard/types';

interface DashboardState {
  // Date ranges
  summaryDateRange: DateRange;
  topQtyDateRange: DateRange;
  topAmountDateRange: DateRange;
  categoryDateRange: DateRange;
  brandDateRange: DateRange;
  dealerDateRange: DateRange;
  purchasedDateRange: DateRange;
  trendDateRange: DateRange;

  // Loading states
  loading: LoadingState;

  // Summary data
  totalSales: number | null;
  totalProfit: number | null;
  totalDiscount: number | null;
  totalMRP: number | null;

  // Table data
  topByQty: TableRowData[] | undefined;
  topByAmount: TableRowData[] | undefined;
  categoryWiseData: TableRowData[] | undefined;
  brandWiseData: TableRowData[] | undefined;
  dealersByQty: TableRowData[] | undefined;
  dealersByAmount: TableRowData[] | undefined;
  purchasedItems: TableRowData[] | undefined;
  itemBillingTrend: TableRowData[] | undefined;
  overallItemBilling: TableRowData[] | undefined;

  // Search states
  topQtySearch: string;
  topAmountSearch: string;
  categorySearch: string;
  brandSearch: string;
  dealerSearch: string;
  purchasedSearch: string;
  trendSearch: string;

  // Selected item for trend
  selectedItem: string | null;

  // Expanded sections
  expandedCategories: Record<string, boolean>;
  expandedBrands: Record<string, boolean>;

  // Pagination and trend data
  page: number;
  rowsPerPage: number;
  allItemsTrendData: any[];
  totalCount: number;
  dateColumns: Array<{ key: string; label: string }>;
}

const getDefaultDateRange = (): DateRange => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 15);
  return [start, end];
};

const initialState: DashboardState = {
  // Date ranges
  summaryDateRange: getDefaultDateRange(),
  topQtyDateRange: getDefaultDateRange(),
  topAmountDateRange: getDefaultDateRange(),
  categoryDateRange: getDefaultDateRange(),
  brandDateRange: getDefaultDateRange(),
  dealerDateRange: getDefaultDateRange(),
  purchasedDateRange: getDefaultDateRange(),
  trendDateRange: getDefaultDateRange(),

  // Loading states
  loading: {
    totalSales: false,
    totalProfit: false,
    totalDiscount: false,
    totalMRP: false,
    topQty: false,
    topAmount: false,
    categoryWise: false,
    brandWise: false,
    dealersQty: false,
    dealersAmount: false,
    purchased: false,
    itemTrend: false,
    overallTrend: false,
  },

  // Summary data
  totalSales: null,
  totalProfit: null,
  totalDiscount: null,
  totalMRP: null,

  // Table data
  topByQty: undefined,
  topByAmount: undefined,
  categoryWiseData: undefined,
  brandWiseData: undefined,
  dealersByQty: undefined,
  dealersByAmount: undefined,
  purchasedItems: undefined,
  itemBillingTrend: undefined,
  overallItemBilling: undefined,

  // Search states
  topQtySearch: '',
  topAmountSearch: '',
  categorySearch: '',
  brandSearch: '',
  dealerSearch: '',
  purchasedSearch: '',
  trendSearch: '',

  // Selected item for trend
  selectedItem: null,

  // Expanded sections
  expandedCategories: {},
  expandedBrands: {},

  // Pagination and trend data
  page: 1,
  rowsPerPage: 10,
  allItemsTrendData: [],
  totalCount: 0,
  dateColumns: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Date range setters
    setSummaryDateRange: (state, action: PayloadAction<DateRange>) => {
      state.summaryDateRange = action.payload;
    },
    setTopQtyDateRange: (state, action: PayloadAction<DateRange>) => {
      state.topQtyDateRange = action.payload;
    },
    setTopAmountDateRange: (state, action: PayloadAction<DateRange>) => {
      state.topAmountDateRange = action.payload;
    },
    setCategoryDateRange: (state, action: PayloadAction<DateRange>) => {
      state.categoryDateRange = action.payload;
    },
    setBrandDateRange: (state, action: PayloadAction<DateRange>) => {
      state.brandDateRange = action.payload;
    },
    setDealerDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dealerDateRange = action.payload;
    },
    setPurchasedDateRange: (state, action: PayloadAction<DateRange>) => {
      state.purchasedDateRange = action.payload;
    },
    setTrendDateRange: (state, action: PayloadAction<DateRange>) => {
      state.trendDateRange = action.payload;
    },

    // Loading state setters
    setLoading: (state, action: PayloadAction<Partial<LoadingState>>) => {
      state.loading = { ...state.loading, ...action.payload };
    },

    // Summary data setters
    setTotalSales: (state, action: PayloadAction<number | null>) => {
      state.totalSales = action.payload;
    },
    setTotalProfit: (state, action: PayloadAction<number | null>) => {
      state.totalProfit = action.payload;
    },
    setTotalDiscount: (state, action: PayloadAction<number | null>) => {
      state.totalDiscount = action.payload;
    },
    setTotalMRP: (state, action: PayloadAction<number | null>) => {
      state.totalMRP = action.payload;
    },

    // Table data setters
    setTopByQty: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.topByQty = action.payload;
    },
    setTopByAmount: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.topByAmount = action.payload;
    },
    setCategoryWiseData: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.categoryWiseData = action.payload;
    },
    setBrandWiseData: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.brandWiseData = action.payload;
    },
    setDealersByQty: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.dealersByQty = action.payload;
    },
    setDealersByAmount: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.dealersByAmount = action.payload;
    },
    setPurchasedItems: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.purchasedItems = action.payload;
    },
    setItemBillingTrend: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.itemBillingTrend = action.payload;
    },
    setOverallItemBilling: (state, action: PayloadAction<TableRowData[] | undefined>) => {
      state.overallItemBilling = action.payload;
    },

    // Search state setters
    setTopQtySearch: (state, action: PayloadAction<string>) => {
      state.topQtySearch = action.payload;
    },
    setTopAmountSearch: (state, action: PayloadAction<string>) => {
      state.topAmountSearch = action.payload;
    },
    setCategorySearch: (state, action: PayloadAction<string>) => {
      state.categorySearch = action.payload;
    },
    setBrandSearch: (state, action: PayloadAction<string>) => {
      state.brandSearch = action.payload;
    },
    setDealerSearch: (state, action: PayloadAction<string>) => {
      state.dealerSearch = action.payload;
    },
    setPurchasedSearch: (state, action: PayloadAction<string>) => {
      state.purchasedSearch = action.payload;
    },
    setTrendSearch: (state, action: PayloadAction<string>) => {
      state.trendSearch = action.payload;
    },

    // Selected item setter
    setSelectedItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItem = action.payload;
    },

    // Expanded sections setters
    setExpandedCategories: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.expandedCategories = action.payload;
    },
    setExpandedBrands: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.expandedBrands = action.payload;
    },

    // Pagination and trend data setters
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
    },
    setAllItemsTrendData: (state, action: PayloadAction<any[]>) => {
      state.allItemsTrendData = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setDateColumns: (state, action: PayloadAction<Array<{ key: string; label: string }>>) => {
      state.dateColumns = action.payload;
    },

    // Reset state
    resetDashboard: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  // Date range actions
  setSummaryDateRange,
  setTopQtyDateRange,
  setTopAmountDateRange,
  setCategoryDateRange,
  setBrandDateRange,
  setDealerDateRange,
  setPurchasedDateRange,
  setTrendDateRange,

  // Loading state actions
  setLoading,

  // Summary data actions
  setTotalSales,
  setTotalProfit,
  setTotalDiscount,
  setTotalMRP,

  // Table data actions
  setTopByQty,
  setTopByAmount,
  setCategoryWiseData,
  setBrandWiseData,
  setDealersByQty,
  setDealersByAmount,
  setPurchasedItems,
  setItemBillingTrend,
  setOverallItemBilling,

  // Search state actions
  setTopQtySearch,
  setTopAmountSearch,
  setCategorySearch,
  setBrandSearch,
  setDealerSearch,
  setPurchasedSearch,
  setTrendSearch,

  // Selected item action
  setSelectedItem,

  // Expanded sections actions
  setExpandedCategories,
  setExpandedBrands,

  // Pagination and trend data actions
  setPage,
  setRowsPerPage,
  setAllItemsTrendData,
  setTotalCount,
  setDateColumns,

  // Reset action
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 
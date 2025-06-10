export type DateRange = [Date | null, Date | null];

export interface ReportResponse<T = any> {
  success: boolean;
  data: T[];
}

export interface LoadingState {
  totalSales: boolean;
  totalProfit: boolean;
  totalDiscount: boolean;
  totalMRP: boolean;
  topQty: boolean;
  topAmount: boolean;
  categoryWise: boolean;
  brandWise: boolean;
  dealersQty: boolean;
  dealersAmount: boolean;
  purchased: boolean;
  itemTrend: boolean;
  overallTrend: boolean;
}

export interface TableRowData {
  sku?: string;
  barcode?: string;
  itemName?: string;
  totalQuantity?: number;
  totalAmount?: number;
  brand?: string;
  category?: string;
  dealerName?: string;
  totalStock?: number;
  mrp?: number;
  costPrice?: number;
  lastPurchaseDate?: string;
  totalOrders?: number;
  suppliers?: string[];
  billNo?: string;
  billDate?: string;
  staffName?: string;
  itemQuantity?: number;
  sellingPriceTotal?: number;
  discountTotal?: number;
  totalDiscount?: number;
  totalMRPsum?: number;
  firstSale?: string;
  lastSale?: string;
  topProducts?: Array<{
    sku: string;
    barcode: string;
    totalQuantity: number;
    totalAmount: number;
  }>;
} 
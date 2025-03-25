  interface creditsType {
    creditAmount?: number;
    payDate?: string;
    creditLimitInDays?: number;
    createdAt?: Date;
  }
  interface paymentsType {
    paymentDate?: string;
    paidBy?: string;
    paidAmount?: number;
    paymentImages?: Array<file>;
    paymentImgURL?: Array<{ public_id: string; secure_url: string }>;
    createdAt?: Date;
  }
  export interface purchaseDetailsType {
    totalPayableAmount?: number;
    totalBillAmount?: number;
    paymentType?: string;
    credits?: Array<creditsType>;
    payments?: Array<paymentsType>;
  }


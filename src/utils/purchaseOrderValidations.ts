import * as Yup from 'yup';
import { dealerFormValidation } from './validations/dealerFormValidation';
import { draftItemFormValidation } from './validations/draftItemFormValidation';
import { PaymentCoverageComplete, paymentDetailFormValidation } from './validations/paymentDetailFormValidation';


export const validateDealerDetails = async (purchaseOrder: PurchaseOrderDataType) => {
  try {
    await dealerFormValidation.validate(purchaseOrder);
    return true;
  } catch (err) {
    return false;
  }
};

export const validateItemDetails = async (purchaseOrder: PurchaseOrderDataType) => {
  try {
    const purchasedItemsValidation = Yup.array().of(draftItemFormValidation);
    await purchasedItemsValidation.validate(purchaseOrder.purchasedItems);
    return true;
  } catch (err) {
    return false;
  }
};

export  const validatePaymentDetails = async (
    purchaseOrder: PurchaseOrderDataType
  ) => {
    try {
      await paymentDetailFormValidation.validate(purchaseOrder.purchaseDetails);
      await PaymentCoverageComplete.validate(purchaseOrder.purchaseDetails);
      return true;
    } catch (err) {
      return false;
    }
  };

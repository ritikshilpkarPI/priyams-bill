import * as Yup from 'yup';
export const StoreInventoryManagementValidation = Yup.object().shape({
    selectedStoreId: Yup.string()
    .required("Select Store is required"),
    inventoryItems: Yup.array()
    .min(1, "At least one item is required"),
})
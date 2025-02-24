import Yup from "yup";
export const draftItemFormValidation = Yup.object({
    barcode: Yup.string().trim().required('Barcode is required.'),
    inputName: Yup.string().trim().required('Item name is required.'),
    itemQuantity: Yup.number().required().min(1, "Packet Qty. must be greater than 0"),
    unit: Yup.string().required('Unit is required.'),
    mrp: Yup.number()
      .min(1, 'MRP must be greater than 0')
      .required('MRP is required.')
      .test('greater-than-selling-price', 'MRP must be greater or equal to SP.', function(value) {
        const { sellingPrice } = this.parent;
        return value >= sellingPrice;
      }),
    companyName: Yup.string().trim().required('Company Name is required.'),
    brand: Yup.string().trim().required('Brand Name is required.'),
    costPrice: Yup.number()
      .min(1, 'Cost Price must be greater than 0.')
      .required('Cost Price is required.')
      .test('greater-than-zero', 'Cost Price must be greater than 0.', value => value > 0),
    sellingPrice: Yup.number()
      .min(1, 'SP must be greater than 0')
      .required('Selling Price is required.')
      .test('greater-than-cost-price', 'SP must be greater or equal to CP.', function(value) {
        const { costPrice } = this.parent;
        return value >= costPrice;
      }),
    stockQuantity: Yup.number()
      .min(1, 'Order Quantity must be greater than 0.')
      .required('Order Quantity is required.')
  });
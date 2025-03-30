

const skuModalQuestion = `Any change in SKU fields will create new item. Do you want to continue?
SKU Fields: Barcode, Item name, MRP, Packet Amount, Unit`;

const radioGroupConfig = {
  label: "Do you want to update the existing item details?",
  name: "updateItemDetails",
  defaultValue: "yes",
  options: [
    { value: "yes", label: "Yes, update existing" },
    { value: "no", label: "No, create new" },
  ],
};

const YES = 'yes';


export { radioGroupConfig, skuModalQuestion, YES };

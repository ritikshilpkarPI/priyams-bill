const tableHead = [
    "Barcode",
    "Brand Name",
    "Item Name",
    "Category",
    "Item Qn.",
    "Unit",
    "Expiry date",
    "MRP",
    "Cost",
    "Sell Price",
    "Purchase Qn.",
    "Action"
];

const addItemRow = [
    {
        type: "NumberInput",
        name: "itemBarcode",
    },
    {
        type: "TextInput",
        name: "itemBrandName",
    },
    {
        type: "TextInput",
        name: "itemName",
    },
    {
        type: "Select",
        name: "itemCategory",
        data: [
            { value: 'Rice', label: 'Rice' },
            { value: 'Pulse', label: 'Pulse' },
            { value: 'Beverage', label: 'Beverage' },
            { value: 'Spice', label: 'Spice' },
            { value: 'Biscuit', label: 'Biscuit' },
        ]
    },
    {
        type: "NumberInput",
        name: "itemQuantity",
    },
    {
        type: "Select",
        name: "itemUnit",
        data: [
            { value: 'Kilo', label: 'Kg' },
            { value: 'Grams', label: 'grams' },
            { value: 'Litre', label: 'litre' },
            { value: 'Mililiter', label: 'ml' },
            { value: 'Piece', label: 'pcs.' },
        ]
    },
    {
        type: "Custom",
        name: "itemUseByDate",
    },
    {
        type: "NumberInput",
        name: "itemMRPperUnit",
    },
    {
        type: "NumberInput",
        name: "itemCostPricePerUnit",
    },
    {
        type: "NumberInput",
        name: "itemSellingPricePerUnit",
    },
    {
        type: "NumberInput",
        name: "itemTotalStockQuantity",
    },
    {
        type: "icon",
        src: "images/add.svg",
    },
];

const itemInitialObj = {
    itemBarcode: '',
    itemBrandName: '',
    itemName: '',
    itemCategory: '',
    itemQuantity: '',
    itemUnit: '',
    itemUseByDate: [],
    itemMRPperUnit: '',
    itemCostPricePerUnit: '',
    itemSellingPricePerUnit: '',
    itemTotalStockQuantity: '',
};

export { tableHead, addItemRow, itemInitialObj };
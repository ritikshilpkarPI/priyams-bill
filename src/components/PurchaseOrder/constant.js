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
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
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
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
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
]

export { tableHead, addItemRow };
const tableHead = [
    "Barcode",
    "Brand Name",
    "Item Name",
    "Category",
    "Quantity",
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
        name: "BrandName",
    },
    {
        type: "TextInput",
        name: "itemName",
    },
    {
        type: "Select",
        name: "Category",
        data: [
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
        ]
    },
    {
        type: "NumberInput",
        name: "Quantity",
    },
    {
        type: "Select",
        name: "Unit",
        data: [
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
        ]
    },
    {
        type: "Custom",
        name: "useByDate",
    },
    {
        type: "NumberInput",
        name: "MRP",
    },
    {
        type: "NumberInput",
        name: "Cost",
    },
    {
        type: "NumberInput",
        name: "Sell Price",
    },
    {
        type: "NumberInput",
        name: "Purchase quantity",
    },
    {
        type: "icon",
        src: "images/add.svg",
    },
]

export { tableHead, addItemRow };
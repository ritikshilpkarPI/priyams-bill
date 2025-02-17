export const getItemSKU = ({
    itemQuantity,
    unit = "",
    mrp,
    barcode = "",
    itemName = ""
}) => `${barcode.trim()} - ${itemName.trim()} - ${itemQuantity} ${unit.trim()} - MRP ${mrp}`.toUpperCase();
export const getItemSKU = ({
    packetQty,
    packetUnit = "",
    mrp,
    barcode = "",
    itemName = ""
}) => `${barcode.trim()} - ${itemName.trim()} - ${packetQty} ${packetUnit.trim()} - MRP ${mrp}`.toUpperCase();
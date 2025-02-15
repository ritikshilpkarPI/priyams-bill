export const getItemSKU = ({
    packetQty,
    packetUnit,
    mrp,
    barcode,
    itemName
}) => `${barcode} - ${itemName} - ${packetQty} ${packetUnit} - MRP ${mrp}`.toUpperCase();
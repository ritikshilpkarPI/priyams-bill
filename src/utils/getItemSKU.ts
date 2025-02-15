export const getItemSKU = ({
    packetQty,
    packetUnit,
    mrp,
    barcode,
    itemName
}: ItemNameSKUProps) => `${barcode} - ${itemName} - ${packetQty} ${packetUnit} - MRP ${mrp}`.toUpperCase();
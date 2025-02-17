export const getItemSKU = ({
    packetQty = 0,
    packetUnit = "",
    mrp = 0,
    barcode = "",
    itemName = ""
}: ItemNameSKUProps) => `${barcode?.trim()} - ${itemName?.trim()} - ${packetQty} ${packetUnit?.trim()} - MRP ${mrp}`.toUpperCase();
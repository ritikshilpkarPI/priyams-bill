export const getItemSKU = ({
    packetQty = 0,
    packetUnit = "",
    mrp = 0,
    barcode = "",
    itemName = ""
}: ItemNameSKUProps) => `${barcode?.trim()} - ${itemName?.trim()} - ${Number(packetQty)} ${packetUnit?.trim()} - MRP ${Number(mrp)}`.toUpperCase();
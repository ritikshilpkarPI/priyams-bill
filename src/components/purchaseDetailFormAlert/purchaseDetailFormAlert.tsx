import { Alert, Flex, Title } from "@mantine/core";
import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import { useMemo } from "react";
import { useSelector } from "react-redux"
import { selectPurchasedItemDetailForm } from "src/redux/purchasedItemDetailForm/purchasedItemSelectors"
import { getItemSKU } from "../../utils/getItemSKU";

export const PurchaseDetailFormAlert = () => {
    const purchasedItemFormData = useSelector(selectPurchasedItemDetailForm);
    const newItemSKU = useMemo(() => getItemSKU({
        barcode: purchasedItemFormData.barcode?.toString()?.trim(),
        itemName: purchasedItemFormData.itemName?.trim(),
        mrp: purchasedItemFormData.mrp,
        packetQty: purchasedItemFormData.itemQuantity,
        packetUnit: purchasedItemFormData.unit
      }), [
        purchasedItemFormData.barcode, purchasedItemFormData.itemName,
        purchasedItemFormData.mrp,
        purchasedItemFormData.unit,
        purchasedItemFormData.itemQuantity
      ])
    return    <Flex align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left" }}>
    <Title order={3}>Messages</Title>
    {
      purchasedItemFormData.itemName && purchasedItemFormData.barcode ?
       (    <Alert color="green">
              <IconCheck
                size={20} color="green" style={{ marginRight: '10px' }} 
              />
              Current ITEM SKU
              <div>{newItemSKU}</div>
          </Alert>
       )
       : (
          <Alert color="yellow">
              <IconExclamationCircle
                size={20} color="black" style={{ marginRight: '10px' }} 
              />
              SKU will be generated on adding item name and barcode
          </Alert>
       )
    }
  </Flex>
}
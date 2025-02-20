import { Alert, Flex, Title } from "@mantine/core";
import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { selectItemsSkuList } from "../../redux/items/itemsSelector";
import { setItemsData } from "../../redux/items/itemsSlice";
import { selectPurchasedItemDetailForm } from "../../redux/purchasedItemDetailForm/purchasedItemSelectors"
import { getItemsSkuAPI } from "../../utils/apiUtils";
import { getItemSKU } from "../../utils/getItemSKU";

export const PurchaseDetailFormAlert = () => {
    const dispatch = useDispatch();
    const purchasedItemFormData = useSelector(selectPurchasedItemDetailForm);
    const itemsSKUList = useSelector(selectItemsSkuList);
    const newItemSKU = useMemo(()=> getItemSKU({
      barcode: purchasedItemFormData.barcode?.toString()?.trim(),
      itemName: purchasedItemFormData.inputName?.trim() || "",
      mrp: purchasedItemFormData.mrp,
      packetQty: purchasedItemFormData.itemQuantity,
      packetUnit: purchasedItemFormData.unit
    }), [
        purchasedItemFormData.barcode, 
        purchasedItemFormData.inputName,
        purchasedItemFormData.mrp,
        purchasedItemFormData.unit,
        purchasedItemFormData.itemQuantity,
        purchasedItemFormData.item_id
    ])

  const isSkuAlreadyExists = useMemo(()=> itemsSKUList?.find((itemSku: string) => itemSku?.toUpperCase() === newItemSKU?.toUpperCase()), [newItemSKU]);
  
  const getItemsSku = async () => {
    const response = await getItemsSkuAPI();
    if(!response && response.isError) return;
    dispatch(setItemsData({ itemsSkuList: response.itemsSku }));
  }

  useEffect(()=> {
    getItemsSku();
  }, [])

  return   <Flex align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left" }}>
    <Title order={3}>Messages</Title>
    {
      purchasedItemFormData.inputName && purchasedItemFormData.barcode ?
       (    
         isSkuAlreadyExists && !purchasedItemFormData.item_id
         ? (<Alert color="red">
              <IconExclamationCircle
                size={20} color="red" style={{ marginRight: '10px' }} 
              />
               Item with this SKU already exists
              <div>{newItemSKU}</div>
              <div>SKU: Item Barcode + Item Name + Packet Qty + Unit + MRP + MRP IN DIGITS</div>
          </Alert>)
         : <Alert color="green">
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
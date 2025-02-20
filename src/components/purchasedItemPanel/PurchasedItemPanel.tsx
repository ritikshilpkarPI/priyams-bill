import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { deletePurchaseOrderItemByIdAPI, getItemByIdAPI, getPurchaseOrderDetailsAPI, saveOrderAPI, updatePurchaseOrderByIdAPI, updatePurchaseOrderItemByIdxAPI } from '../../utils/apiUtils';
import { setPurchasedItemDetailForm } from '../../redux/purchasedItemDetailForm/purchasedItemDetailFormSlice';
import { PurchasedItemDetailForm } from '../PurchasedItemDetailForm/PurchasedItemDetailForm'
import { PurchasedItemTable } from '../purchasedItemTable/PurchasedItemTable'
import { QuestionModal } from '../questionModal/QuestionModal';
import { ItemSearch } from '../ItemSearch';
import { Box } from '@mantine/core';
import { PurchaseDetailFormAlert } from '../purchaseDetailFormAlert/purchaseDetailFormAlert';
import { getPurchasedItemByItem } from 'src/utils/getPurchasedItemByItem';

const PurchasedItemPanel = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const purchaseOrderId = params?.id;
    const [editItem, setEditItem] = useState<PurchasedItemDetailFormType | null>(null);
    const [removeItem, setRemoveItem] = useState<PurchasedItemDetailFormType | null>(null);
    const editItemIdxRef = useRef(-1);
    const resetEditItem = ()=> setEditItem(null);
    const resetRemoveItem = () => setRemoveItem(null);
    const onEdit = () => {
        if(!editItem) return;
        dispatch(setPurchasedItemDetailForm(editItem));
        setEditItem(null);
    }
    const onRemove = async () => {
      if(!purchaseOrderId || !removeItem?._id) return;
      resetRemoveItem();
      const response = await deletePurchaseOrderItemByIdAPI(purchaseOrderId, removeItem._id);
      if(response.isError) return;
      getPurchaseOrderDetails();
    }

    const onItemSelect = async (item: any) => {
      console.log("here we are")
      const itemDetails = item?.itemDetail;
      if(!itemDetails?._id) return;
      const response = await getItemByIdAPI(itemDetails._id);
      if(response.isError) return;
      dispatch(setPurchasedItemDetailForm(getPurchasedItemByItem(response.item)))
  }

    const onPurchasedOrderSubmit = (purchaseItemDetails: any) => {
        if(!purchaseOrderId) return onSavePurchaseOrderItem(purchaseItemDetails);
        if(editItemIdxRef.current >= 0) return onUpdatePurchaseOrderItem(purchaseItemDetails)
        return onAddPurchaseOrderItem(purchaseItemDetails)
      }
    
      const onSavePurchaseOrderItem = async(purchaseItemDetails: PurchasedItemDetailFormType) => {
        const response = await saveOrderAPI(purchaseItemDetails);
        if(response.isError) return;
        getPurchaseOrderDetails();
        navigate(`${location.pathname}/${response?.order._id}${location.search}`)
      }
    
      const onAddPurchaseOrderItem = async(purchasedItemData: PurchasedItemDetailFormType) => {
        if(!purchaseOrderId) return;
        const response = await updatePurchaseOrderByIdAPI(purchasedItemData, purchaseOrderId);
        if(response.isError) return;
        getPurchaseOrderDetails();
      }
  
      const onUpdatePurchaseOrderItem = async(purchasedItemData: PurchasedItemDetailFormType) => {
        if(!purchaseOrderId) return;
        const response = await updatePurchaseOrderItemByIdxAPI(purchaseOrderId, editItemIdxRef.current, purchasedItemData);
        if(response.isError) return;
        getPurchaseOrderDetails();
      }

      const getPurchaseOrderDetails = async () => {
    
        if(!purchaseOrderId) return;
    
        const response = await getPurchaseOrderDetailsAPI(purchaseOrderId);
       if(response?.data)  dispatch(setPurchaseOrder(response.data))
      }

      useEffect(()=> {
        getPurchaseOrderDetails();
      }, [])

  return (
    <div>
        <Box mx="sm" mt="16px"><PurchaseDetailFormAlert /></Box>
        <Box mx="sm" mt="16px">
          <ItemSearch onItemSelect={onItemSelect} />
        </Box>
        <PurchasedItemDetailForm onSubmit={onPurchasedOrderSubmit} />
          <PurchasedItemTable 
            onEdit={(purchasedItem: PurchasedItemDetailFormType, idx: number)=> {
              setEditItem(purchasedItem);
              editItemIdxRef.current = idx;
            }} 
            onRemove={(purchasedItem: PurchasedItemDetailFormType)=> setRemoveItem(purchasedItem)} 
           />
           <QuestionModal 
            opened={Boolean(editItem)}
            onClose={resetEditItem}
            onAgree={onEdit}
            onDisagree={resetEditItem}
            question={`Do you want to edit item ${editItem?.inputName || ""} ?`}
         />
         <QuestionModal 
            opened={Boolean(removeItem)}
            onClose={resetRemoveItem}
            onAgree={onRemove}
            onDisagree={resetRemoveItem}
            question={`Do you want to remove item ${removeItem?.inputName || ""} ?`}
         />
    </div>
  )
}

export default PurchasedItemPanel
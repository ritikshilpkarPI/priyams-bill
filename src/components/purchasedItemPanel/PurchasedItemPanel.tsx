import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import {
  deletePurchaseOrderItemByIdAPI,
  getItemByIdAPI,
  getPurchaseOrderDetailsAPI,
  saveOrderAPI,
  updatePurchaseOrderByIdAPI,
  updatePurchaseOrderItemByIdxAPI,
} from '../../utils/apiUtils';
import {
  resetPurchasedItemForm,
  setPurchasedItemDetailForm,
} from '../../redux/purchasedItemDetailForm/purchasedItemDetailFormSlice';
import { PurchasedItemDetailForm } from '../PurchasedItemDetailForm/PurchasedItemDetailForm';
import { PurchasedItemTable } from '../purchasedItemTable/PurchasedItemTable';
import { QuestionModal } from '../questionModal/QuestionModal';
import { ItemSearch } from '../ItemSearch';
import { Box } from '@mantine/core';
import { getPurchasedItemByItem } from '../../utils/getPurchasedItemByItem';
import { toast } from 'react-toastify';
import ShareOnWhatsApp from '../shareOnWhatsApp';
import Accordion from '../accordion/Accordion';
import Dashboard from '../PODashboard/PODashboard';

const PurchasedItemPanel = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const purchaseOrderId = params?.id;
  const [editItem, setEditItem] = useState<PurchasedItemDetailFormType | null>(
    null
  );
  const [removeItem, setRemoveItem] =
    useState<PurchasedItemDetailFormType | null>(null);
  const [itemFormLoading, setItemFormLoading] = useState(false);
  const [removeItemId, setRemoveItemId] = useState('');
  const editItemIdxRef = useRef(-1);
  const resetEditItem = () => setEditItem(null);
  const resetRemoveItem = () => setRemoveItem(null);
  const onEdit = () => {
    if (!editItem) return;
    dispatch(setPurchasedItemDetailForm(editItem));
    setEditItem(null);
  };
  const onRemove = async () => {
    if (!purchaseOrderId || !removeItem?._id) return;
    setRemoveItemId(removeItem._id);
    resetRemoveItem();
    const response = await deletePurchaseOrderItemByIdAPI(
      purchaseOrderId,
      removeItem._id
    );
    setRemoveItemId('');
    if (response.isError)
      return toast.error(
        'unable to remove this item, please try again after some time'
      );
    getPurchaseOrderDetails();
  };

  const onItemSelect = async (item: { itemDetail: BillLeanItemType }) => {
    const itemDetails = item?.itemDetail;
    if (!itemDetails?._id) return;
    setItemFormLoading(true);
    const response = await getItemByIdAPI(itemDetails._id);
    setItemFormLoading(false);
    if (response.isError)
      return toast.error('unable to get item details, please try again');
    dispatch(setPurchasedItemDetailForm(getPurchasedItemByItem(response.item)));
  };

  const onPurchasedOrderSubmit = async (
    purchaseItemDetails: PurchasedItemDetailFormType
  ) => {
    setItemFormLoading(true);
    if (!purchaseOrderId) await onSavePurchaseOrderItem(purchaseItemDetails);
    else if (editItemIdxRef.current >= 0)
      await onUpdatePurchaseOrderItem(purchaseItemDetails);
    else await onAddPurchaseOrderItem(purchaseItemDetails);
    setItemFormLoading(false);
  };

  const onSavePurchaseOrderItem = async (
    purchaseItemDetails: PurchasedItemDetailFormType
  ) => {
    const response = await saveOrderAPI(purchaseItemDetails);
    if (response.isError)
      return toast.error('unable to add item, please try again');
    dispatch(resetPurchasedItemForm());
    navigate(`${location.pathname}/${response?.order._id}${location.search}`);
  };

  const onAddPurchaseOrderItem = async (
    purchasedItemData: PurchasedItemDetailFormType
  ) => {
    if (!purchaseOrderId) return;
    const response = await updatePurchaseOrderByIdAPI(
      purchasedItemData,
      purchaseOrderId
    );
    if (response.isError)
      return toast.error('unable to add item, please try again');
    dispatch(resetPurchasedItemForm());
    getPurchaseOrderDetails();
  };

  const onUpdatePurchaseOrderItem = async (
    purchasedItemData: PurchasedItemDetailFormType
  ) => {
    if (!purchaseOrderId) return;
    const response = await updatePurchaseOrderItemByIdxAPI(
      purchaseOrderId,
      editItemIdxRef.current,
      purchasedItemData
    );
    if (response.isError)
      return toast.error('unable to update item, please try again');
    dispatch(resetPurchasedItemForm());
    getPurchaseOrderDetails();
  };

  const getPurchaseOrderDetails = async () => {
    if (!purchaseOrderId) return;
    const response = await getPurchaseOrderDetailsAPI(purchaseOrderId);
    if (response.isError || !response?.data)
      return toast.error('unable to get item details, please try again');
    dispatch(setPurchaseOrder(response.data));
  };
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/new-purchase-order\/([a-f0-9]{24})/);
  return (
    <>
      <div>
        <Box mx="sm" mt="16px">
          <ItemSearch onItemSelect={onItemSelect} />
        </Box>
        <PurchasedItemDetailForm
          loading={itemFormLoading}
          onSubmit={onPurchasedOrderSubmit}
        />

    <div className="item-details-tab">
      <Accordion title="Dashboard">
        <Dashboard />
      </Accordion>
    
    </div>

        <PurchasedItemTable
          onEdit={(purchasedItem: PurchasedItemDetailFormType, idx: number) => {
            setEditItem(purchasedItem);
            editItemIdxRef.current = idx;
          }}
          onRemove={(purchasedItem: PurchasedItemDetailFormType) =>
            setRemoveItem(purchasedItem)
          }
          loadingRemoveItemById={removeItemId}
        />
        <QuestionModal
          opened={Boolean(editItem)}
          onClose={resetEditItem}
          onAgree={onEdit}
          onDisagree={resetEditItem}
          question={`Do you want to edit item ${editItem?.inputName || ''} ?`}
        />
        <QuestionModal
          opened={Boolean(removeItem)}
          onClose={resetRemoveItem}
          onAgree={onRemove}
          onDisagree={resetRemoveItem}
          question={`Do you want to remove item ${removeItem?.inputName || ''} ?`}
        />
      </div>
      <Box mt="16px">{match && <ShareOnWhatsApp message={currentUrl} />}</Box>
    </>
  );
};

export default PurchasedItemPanel;

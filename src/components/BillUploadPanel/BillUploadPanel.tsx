import { Box, Button, Container, Flex, Image, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { DatePicker } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { selectPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { addNewOrderAPI, updateOrderDetailsAPI } from '../../utils/apiUtils';
import { getFileURL } from '../../utils/getFileURL';
import ShareOnWhatsApp from '../shareOnWhatsApp';

export const BillUploadPanel: React.FC<PurchaseOrderProps> = ({isApprovedPO}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState('');
  
  const [billDate, setBillDate] = useState(
    purchaseOrder?.dateOnBill ? new Date(purchaseOrder.dateOnBill) : null
  );

  const onFileSelect = async (files: Array<File>) => {
    const newFiles: Array<string> = [];
    setIsFileUploading(true);
    for (let fileIdx = 0; fileIdx < files.length; fileIdx += 1) {
      try {
        const file = files[fileIdx];
        const fileURL: string = (await getFileURL(file)) as string;
        newFiles.push(fileURL);
      } catch (err) {
        console.error(err);
      }
    }
    if (newFiles.length === 0) return setIsFileUploading(false);
    if (purchaseOrder._id)
      return updateDetails({
        bills: newFiles,
        uploadedImages: purchaseOrder.billPhotos,
      });
    onNewOrderBillUpload(newFiles);
  };

  const onNewOrderBillUpload = async (bills: Array<string>) => {
    const response = await addNewOrderAPI({
      new_order: {
        purchaseObj: {
          details: {},
          ...purchaseOrder,
          orders: purchaseOrder.purchasedItems || [],
          bills,
        },
      },
    });
    setIsFileUploading(false);
    if (response.isError || !response.message)
      return toast.error('Unable to upload images, please try again');
    dispatch(setPurchaseOrder(response.message));
    navigate(`${location.pathname}/${response.message._id}${location.search}`);
  };

  const updateDetails = async ({
    bills = [],
    deleteBills = [],
    uploadedImages = [],
  }: UpdateDetailBillUploadArgs) => {
    if(!purchaseOrder._id) return;
    const response = await updateOrderDetailsAPI({
      new_order: {
        purchaseObj: {
          ...purchaseOrder,
          orders: purchaseOrder.purchasedItems,
          purchaseDetails: purchaseOrder.purchaseDetails || {},
          bills,
        },
        id: purchaseOrder._id,
      },
      deleteBills,
      uploadedImages,
    });
    setIsFileUploading(false);
    setDeleteFileId('');
    if (response.isError || !response.message) {
      if (deleteBills.length)
        return toast.error('Unable to delete image, please try again');
      return toast.error('Unable to upload images, please try again');
    }
    dispatch(setPurchaseOrder(response.message));
  };

  const onImageDelete = (deleteBillPhoto: CloudFileType) => {
    setDeleteFileId(deleteBillPhoto.public_id);
    let uploadedImages = purchaseOrder.billPhotos?.filter(
      (billPhoto) => deleteBillPhoto.public_id !== billPhoto.public_id
    );
    updateDetails({ deleteBills: [deleteBillPhoto], uploadedImages });
  };

  const onReject = () => {
    toast.warn('Image should be more than 5MB and in JPEG/JPG/PNG/WEBP format');
  };

  const handleBillDateChange = async (date: Date | null) => {
    
    setBillDate(date);
    if (!purchaseOrder._id) return;

    const response = await updateOrderDetailsAPI({
      new_order: {
        purchaseObj: {
          ...purchaseOrder,
          purchaseDetails: {
            ...(purchaseOrder.purchaseDetails || {}),
          },
          dateOnBill: date,
        },
        id: purchaseOrder._id,
      },
    });

    if (response.isError || !response.message) {
      toast.error('Unable to update bill date');
    } else {
      dispatch(setPurchaseOrder(response.message));
    }
  };

  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/new-purchase-order\/([a-f0-9]{24})/);

  useEffect(() => {
    if (purchaseOrder?.dateOnBill) {
      setBillDate(new Date(purchaseOrder.dateOnBill));
    }
  }, [purchaseOrder?.dateOnBill]);


  return (
    <>
      <Container>
          <DatePicker
          label="Date on Bill"
          placeholder="Select bill date"
          value={ billDate}
          onChange={handleBillDateChange}
          disabled={isApprovedPO}
          mx="sm"
          mt="md"
        />
        <Dropzone
          onDrop={onFileSelect}
          onReject={onReject}
          maxSize={5 * 1024 ** 2}
          mt="16px"
          sx={{ borderColor: 'black' }}
          loading={isFileUploading}
          accept={['image/jpeg', 'image/png', 'image/jpg', 'image/webp']}
          disabled={isApprovedPO}
        >
          <Flex
            justify="center"
            align="center"
            mih={120}
            style={{ pointerEvents: 'none' }}
          >
            <div>
              <Text size="xl" inline>
                Drag or select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </Flex>
        </Dropzone>
        <Flex wrap="wrap">
          {purchaseOrder?.billPhotos?.map((billPhoto) => (
            <Flex
              key={billPhoto.public_id}
              align="left"
              gap="16px"
              direction="column"
              sx={{
                border: '1px solid grey',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'left',
                overflow: 'scroll',
              }}
              mx="sm"
              mt="16px"
            >
              <Box>
                <Button
                  onClick={() => onImageDelete(billPhoto)}
                  color="red"
                  leftIcon={<IconTrash size={20} />}
                  loading={deleteFileId === billPhoto.public_id}
                  disabled={
                    (deleteFileId !== billPhoto.public_id && !!deleteFileId) || isApprovedPO
                  }
                >
                  Delete
                </Button>
              </Box>
              <Image
                radius="sm"
                width={'240px'}
                src={billPhoto.secure_url}
                sx={{ objectFit: 'cover', maxWidth: '300px' }}
              />
            </Flex>
          ))}
        </Flex>
      </Container>
      <Box mt="16px">
        {match && <ShareOnWhatsApp message={currentUrl} />}
      </Box>
    </>
  );
};

import { Box, Button, Container, Flex, Image, Text } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useLocation } from "react-router"
import { useNavigate } from "react-router"
import { setPurchaseOrder } from "src/redux/purchaseOrder/purchaseOrderSlice"
import { selectPurchaseOrder } from "../../redux/purchaseOrder/purchaseOrderSelectors"
import { addNewOrderAPI, updateOrderDetailsAPI } from "../../utils/apiUtils"
import { getFileURL } from "../../utils/getFileURL"

export const BillUploadPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const purchaseOrder = useSelector(selectPurchaseOrder);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [deleteFileId, setDeleteFileId] = useState('');
    const onFileSelect = async (files: Array<File>) => {
        const newFiles: Array<string> = [];
        setIsFileUploading(true);
        for(let fileIdx = 0; fileIdx < files.length; fileIdx+=1) {
            try {
                const file = files[fileIdx];
                const fileURL: string = await getFileURL(file) as string;
                newFiles.push(fileURL);
            } catch (err){
                console.error(err);
            }
        }
        if(newFiles.length === 0) return setIsFileUploading(false);
        if(purchaseOrder._id) return updateDetails({ bills: newFiles });
        onNewOrderBillUpload(newFiles)
    }

    const onNewOrderBillUpload = async (bills: Array<string>) => {
        const response = await addNewOrderAPI({
            new_order: { 
              purchaseObj: { 
                details: [],
                ...purchaseOrder, 
                orders: purchaseOrder.purchasedItems || [],
                bills
            } },
        })
        setIsFileUploading(false)
        if(response.isError) return;
        if(!response.message) return;
        dispatch(setPurchaseOrder(response.message));
        navigate(`${location.pathname}/${response.message._id}?${location.search}`);
    }

    const updateDetails = async ({
        bills = [],
        deleteBills = [],
        uploadedImages = [],
    }: any) => {
       const response = await updateOrderDetailsAPI({
         new_order: { 
            purchaseObj: {
              orders: purchaseOrder.purchasedItems,
              details: [],
              ...purchaseOrder,
              id: purchaseOrder._id,
              bills,
            },
            id: purchaseOrder._id,
          },
          deleteBills,
          uploadedImages,
       });
       setIsFileUploading(false);
       setDeleteFileId('');
       if(response.isError) return;
       if(!response.message) return;
       dispatch(setPurchaseOrder(response.message))
    }

    const onImageDelete = (deleteBillPhoto: CloudFileType) => {
        setDeleteFileId(deleteBillPhoto.public_id);
        let uploadedImages = purchaseOrder.billPhotos?.filter((billPhoto) => deleteBillPhoto.public_id !== billPhoto.public_id);
        updateDetails({ deleteBills: [deleteBillPhoto], uploadedImages })
    }

    return (
    <Container>
        <Dropzone
            onDrop={onFileSelect}
            onReject={() => {}}
            maxSize={5 * 1024 ** 2}
            mt="16px"
            sx={{ borderColor: "black" }}
            loading={isFileUploading}
            accept={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
            >
            <Flex justify="center" align="center" mih={120} style={{ pointerEvents: 'none' }}>

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
        {
            purchaseOrder?.billPhotos?.map((billPhoto) => <Flex key={billPhoto.public_id} align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left", overflow: "scroll"}} mx="sm" mt="16px">
                <Box>
                    <Button 
                        onClick={()=> onImageDelete(billPhoto)}
                        color="red" 
                        leftIcon={<IconTrash size={20} />}
                        loading={deleteFileId === billPhoto.public_id}
                        disabled={Boolean(deleteFileId !== billPhoto.secure_url && deleteFileId)}
                    >
                        Delete
                    </Button>
                </Box>
                <Image
                    radius="sm"
                    width={"240px"}
                    src={billPhoto.secure_url}
                    sx={{ objectFit: "cover", maxWidth: "300px" }}
                />
            </Flex>)
        }
     </Flex>
    </Container>)
}
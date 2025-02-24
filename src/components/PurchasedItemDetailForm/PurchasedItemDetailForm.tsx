import React, { useRef, useState } from 'react';
import * as yup from 'yup';
import {
  TextInput,
  Select,
  Textarea,
  Button,
  Grid,
  Col,
  Box,
  Divider,
  Autocomplete,
  Flex,
  Checkbox,
  Title,
  Badge,
  Modal,
  LoadingOverlay,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useSelector, useDispatch } from 'react-redux';
import { selectPurchasedItemDetailForm } from '../../redux/purchasedItemDetailForm/purchasedItemSelectors';
import { addItemExpiryDateData, removeItemExpiryDateByIdx, resetPurchasedItemForm, setPurchasedItemDetailForm } from '../../redux/purchasedItemDetailForm/purchasedItemDetailFormSlice';
import { getNumberFromStr } from '../../utils/getNumberFromStr';
import { getFloatNumFromStr } from '../../utils/getFloatNumFromStr';
import { categoriesWithSubcategories } from '../../utils/constants/categoriesWithSubCategories';
import {  IconEdit, IconPlus } from '@tabler/icons-react';
import { ItemExpiryTable } from '../ItemExpiryTable/ItemExpiryTable';
import { getStrWithoutSpecChar } from '../../utils/getStrWithoutSpecChar';
import { QuestionModal } from '../questionModal/QuestionModal';
import { getItemSKU } from '../../utils/getItemSKU';
import { draftItemFormValidation } from '../../utils/validations/draftItemFormValidation';
import { itemExpiryFormValidation } from '../../utils/validations/itemExpiryFormValidation';
import { generateBarcode } from '../../utils/generateBarcode';

export const PurchasedItemDetailForm: React.FC<PurchasedItemDetailFormProps> = ({
  onSubmit,
  loading
}) => {
  const dispatch = useDispatch();
  const purchasedItemFormData = useSelector(selectPurchasedItemDetailForm);
  const [showSkuModal, setShowSkuModal] = useState(false);
  const formOldValuesRef = useRef<PurchasedItemDetailFormType | null>(null);
  const defaulValuesExpiryItemForm = {
    mfgDate: null,
    date: null,
    value: 0,
  }
  const skuFields: any = {
    inputName: "inputName",
    barcode: "barcode",
    mrp: "mrp",
    itemQuantity: "itemQuantity",
    unit: "unit"
  }
  const [formExpiryDate, setFormExpiryDate] = useState(defaulValuesExpiryItemForm);
  const [errors, setErrors] = useState<any>({});

  const isSkuAlreadyExists = (field: string, value: string) => {
    const itemSKUData = {
      barcode: purchasedItemFormData?.barcode?.trim() || "",
      itemName: purchasedItemFormData?.inputName?.trim() || "",
      packetQty: purchasedItemFormData?.itemQuantity,
      packetUnit: purchasedItemFormData.unit,
      mrp: purchasedItemFormData.mrp
    }
    let skuRelatedField = field;
    switch(field){
      case "inputName":
        skuRelatedField = "itemName"; break;
      case "barcode":
        skuRelatedField = "barcode"; break;
      case "itemQuantity":
        skuRelatedField = "packetQty"; break;
      case "packetUnit":
        skuRelatedField = "unit"; break;
      case "mrp":
        skuRelatedField = "mrp"; break;
    }
    const newItemSKU = getItemSKU({
      ...itemSKUData,
      [skuRelatedField]: value?.toString().trim()
    })
    const oldItemSKU = getItemSKU(itemSKUData);
    return newItemSKU === oldItemSKU;
  }

  const onChange = (field: string, value: string | number | boolean) => {
    if(skuFields[field] && purchasedItemFormData.item_id && !isSkuAlreadyExists(field, value?.toString())){
        formOldValuesRef.current = { ...purchasedItemFormData };
        setShowSkuModal(true);
    }
    dispatch(setPurchasedItemDetailForm({
      [field]: value,
    }));
  }

  const handleSubmit = async () => {
    try {
      await draftItemFormValidation.validate(purchasedItemFormData, { abortEarly: false });
      const totalExpiryQty = purchasedItemFormData.expiryDates?.reduce((total, expiryDate) => (total + (Number(expiryDate.value) || 0)), 0);
      if(Number(totalExpiryQty) !== Number(purchasedItemFormData.stockQuantity)){
        return setErrors({ stockQuantity: "order quantity and expiry items should be equal" })
      }
      setErrors({});
      onSubmit(purchasedItemFormData);
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const errorMessages = error.inner.reduce((acc: any, err: yup.ValidationError) => {
          if (err.path) {
            acc[err.path] = err.message;
          }
          return acc;
        }, {});
  
        setErrors(errorMessages);
      }
    }
  }
  
  const onExpiryFormDateChange = (field: string, value: string | number | Date | null) => {
    const updatedExpiryDateForm = { ...formExpiryDate, [field]: value };
    if(field === 'mfgDate' && value === null) {
      updatedExpiryDateForm.date = null;
    }
    setFormExpiryDate(updatedExpiryDateForm)
  }

  const onAddExpiryDate = async () => {
    try {
      await itemExpiryFormValidation.validate(formExpiryDate, { abortEarly: false });
      setErrors({});
      dispatch(addItemExpiryDateData({ ...formExpiryDate }));
      setFormExpiryDate(defaulValuesExpiryItemForm);
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const errorMessages = error.inner.reduce((acc: any, err: yup.ValidationError) => {
          if (err.path) {
            acc[err.path] = err.message;
          }
          return acc;
        }, {});
  
        setErrors(errorMessages);
      }
    }
  }

  const onBarcodeGenerate = () => {
    formOldValuesRef.current = { ...purchasedItemFormData };
    setShowSkuModal(true);
    const newBarcode = generateBarcode();
    dispatch(setPurchasedItemDetailForm({ barcode: newBarcode }))
  }

  const onSkuModalClose = () => {
    setShowSkuModal(false);
    if(!formOldValuesRef.current) return;
    dispatch(setPurchasedItemDetailForm(formOldValuesRef.current));
  }

  return (
    <Flex direction="column" gap="16px" mx="sm" mt="lg" pos="relative">
      <Flex align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left" }}>
        <Title order={3} display="flex" sx={{ gap: "8px" }}>
          Form 
          <span>
          {
            purchasedItemFormData.item_id ? 
            (<Badge>
              This item exists in inventory
            </Badge>)
            : (<Badge color="green">
                You are adding new item
              </Badge>)
          }
          </span>
        </Title>
        <Flex wrap="wrap" direction="row" gap="32px">
          <Box>
          <Divider my="xs" label="Item SKU Details" labelPosition="center" />
          <Grid gutter="md" sx={{ width: "240px" }}>

            <Col span={12}>
              <TextInput
                label="Barcode"
                value={purchasedItemFormData.barcode}
                onChange={(event) => onChange('barcode', event.currentTarget.value.toUpperCase().trim())}
                required
                error={errors.barcode}
                placeholder="Enter barcode"
                rightSection={<>
               <IconEdit onClick={onBarcodeGenerate} cursor="pointer" size={20} color="#228be6" />
              </>}
              />
            </Col>

            <Col span={12}>
              <TextInput
                label="Item Name"
                value={purchasedItemFormData.inputName}
                onChange={(event) => onChange('inputName', getStrWithoutSpecChar(event.currentTarget.value.toUpperCase()))}
                required
                error={errors.inputName}
                placeholder="Enter Item name"
              />
            </Col>

            <Col span={12}>
              <TextInput
                label="Packet Qty."
                value={purchasedItemFormData.itemQuantity}
                onChange={(event) => onChange('itemQuantity', getNumberFromStr(event.currentTarget.value) || 0)}
                required
                error={errors.itemQuantity}
                placeholder="Enter Packet Quantity"
              />
            </Col>

            <Col span={12}>
              <Select
                  label="Packet Unit"
                  data={['grams', 'kg', 'ml', 'liter', 'piece']}
                  value={purchasedItemFormData.unit}
                  required
                  onChange={(value) => onChange('unit', value!)}
              />
            </Col>

            <Col span={12}>
              <TextInput
                  label="M.R.P."
                  value={purchasedItemFormData.mrp}
                  required
                  onChange={(event) => onChange('mrp', getFloatNumFromStr(event.currentTarget.value) || 0)}
                  error={errors.mrp}
              />
            </Col>
          </Grid>
          </Box>

        <Box>
        <Divider my="xs" label="Add Item Details" labelPosition="center" />
          <Grid gutter="md" sx={{ width: "240px" }}>

            <Col span={12}>
              <TextInput
                label="Company Name"
                value={purchasedItemFormData.companyName}
                required
                onChange={(event) => onChange('companyName', event.currentTarget.value)}
                error={errors.companyName}
              />
            </Col>

            <Col span={12}>
              <TextInput
                label="Brand Name"
                value={purchasedItemFormData.brand}
                required
                onChange={(event) => onChange('brand', event.currentTarget.value)}
                error={errors.brand}
              />
            </Col>

            <Col span={12}>
              <Autocomplete
                label="Category"
                placeholder="Add Category"
                data={Object.keys(categoriesWithSubcategories)}
                autoCapitalize="on"
                limit={Infinity}
                maxDropdownHeight={250}
                sx={{ width: "100%" }}
                value={purchasedItemFormData.category}
                onChange={(value) => onChange('category', value)}
              />
            </Col>  

            <Col span={12}>
              <Autocomplete
                label="Sub Category"
                placeholder="Add SubCategory"
                data={categoriesWithSubcategories[purchasedItemFormData.category] || []}
                autoCapitalize="on"
                limit={Infinity}
                maxDropdownHeight={250}
                sx={{ width: "100%" }}
                value={purchasedItemFormData.subCategory}
                onChange={(value) => onChange('subCategory', value)}
                disabled={!purchasedItemFormData.category}
              />
            </Col>

            <Col span={12}>
              <TextInput
                label="Flavour/Feature"
                value={purchasedItemFormData.flavourOrFeature}
                onChange={(event) => onChange('flavourOrFeature', event.currentTarget.value)}
              />
            </Col>
          </Grid>
        </Box>
        <Box>
          <Divider my="xs" label="Item Price Details" labelPosition="center" />
          <Grid gutter="md" sx={{ width: "240px" }}>
              <Col span={12}>
                    <TextInput
                        label="C.P.(Cost Price)"
                        value={purchasedItemFormData.costPrice}
                        required
                        onChange={(event) => onChange('costPrice', getFloatNumFromStr(event.currentTarget.value) || 0)}
                        error={errors.costPrice}
                      />
                </Col>
                <Col span={12}>
                    <TextInput
                        label="S.P. (Selling Price)"
                        value={purchasedItemFormData.sellingPrice}
                        required
                        onChange={(event) => onChange('sellingPrice', getFloatNumFromStr(event.currentTarget.value) || 0)}
                        error={errors.sellingPrice}
                      />
                </Col>
                <Col span={12}>
                    <TextInput
                        label="Order Quantity"
                        value={purchasedItemFormData.stockQuantity}
                        required
                        onChange={(event) => onChange('stockQuantity', getFloatNumFromStr(event.currentTarget.value) || 0)}
                        error={errors.stockQuantity}
                      />
                </Col>
          </Grid>
        </Box>
        <Box>
          <Divider my="xs" label="Other Details" labelPosition="center" />
          <Grid gutter="md" sx={{ width: "240px" }}>
              <Col span={12}>
                    <Textarea
                        label="Item Remarks"
                        value={purchasedItemFormData.itemRemark}
                        onChange={(event) => onChange('itemRemark', event.currentTarget.value)}
                      />
              </Col>
              <Col span={12}>
                    <Checkbox
                        label="Is free items available?"
                        checked={purchasedItemFormData.freeItemsAvailable}
                        onChange={(event) => onChange('freeItemsAvailable', event.target.checked)}
                      />
              </Col>
              <Col span={12}>
                    <Checkbox
                        label="Is return policy available?"
                        checked={purchasedItemFormData.returnPolicyAvailable}
                        onChange={(event) => onChange('returnPolicyAvailable', event.target.checked)}
                    />
                </Col>
                {
                  purchasedItemFormData.returnPolicyAvailable && (<Col span={12}>
                    <Textarea
                        label="Return Policy Remarks"
                        value={purchasedItemFormData.returnPolicyRemarks}
                        onChange={(event) => onChange('returnPolicyRemarks', event.currentTarget.value)}
                      />
                </Col>)
                }
          </Grid>
        </Box>
        </Flex>
        <Flex>
          <Box>
            <Divider my="xs" label="Add Items Expiry" labelPosition="center" />
            <Flex gap="16px" align="center" wrap="wrap">
              <DatePicker 
                label="MFG Date." 
                inputFormat='DD/MM/YY'
                value={formExpiryDate.mfgDate}
                onChange={(value: Date) => onExpiryFormDateChange('mfgDate', value?.toISOString())}
                error={errors.mfgDate}
                withAsterisk
              />
              <DatePicker 
                label="Expiry Date." 
                inputFormat='DD/MM/YY' 
                onChange={(value: Date) => onExpiryFormDateChange('date', value?.toISOString())}
                disabled={!formExpiryDate.mfgDate}
                value={formExpiryDate.date}
                minDate={formExpiryDate.mfgDate ? new Date(formExpiryDate.mfgDate) : undefined}
                error={errors.date}
                withAsterisk
              />
              <TextInput
                label="Item Quantity"
                value={formExpiryDate.value}
                required
                error={errors.value}
                onChange={(event) => onExpiryFormDateChange('value', getNumberFromStr(event.currentTarget.value))}
              />
              <Button leftIcon={<IconPlus />} onClick={onAddExpiryDate}>
                Add
              </Button>
            </Flex>
            <ItemExpiryTable 
              expiryDates={purchasedItemFormData.expiryDates}
              onRemove={(idx: number)=> dispatch(removeItemExpiryDateByIdx(idx))}
              showTotal={true}
              showActions={true}
            />
          </Box>
        </Flex>
        <Box>
        <Flex gap="16px">
          <Button sx={{ width: "220px" }} onClick={handleSubmit} type="submit" fullWidth mt="lg">
                  Add Item
          </Button>
          <Button  sx={{ width: "220px" }}  variant='outline' onClick={()=> dispatch(resetPurchasedItemForm())} type="submit" fullWidth mt="lg">
                  Reset
          </Button>
        </Flex>
        </Box>
      </Flex>
      <QuestionModal
        opened={showSkuModal}
        onClose={onSkuModalClose}
        question="Any change in SKU fields will create new item. Do you want to continue?
        SKU Fields: Barcode, Item name, MRP, Packet Amount, Unit"
        onAgree={()=> {
          setShowSkuModal(false);
          dispatch(setPurchasedItemDetailForm({ item_id: undefined }));
        }}
        onDisagree={onSkuModalClose}
      />
      <LoadingOverlay visible={Boolean(loading)} />
    </Flex>
  );
};

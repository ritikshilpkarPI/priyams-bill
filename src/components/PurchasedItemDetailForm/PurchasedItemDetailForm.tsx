import React, { useState } from 'react';
import Joi from 'joi';
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
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useSelector, useDispatch } from 'react-redux';
import { selectPurchasedItemDetailForm } from '../../redux/purchasedItemDetailForm/purchasedItemSelectors';
import { addItemExpiryDateData, removeItemExpiryDateByIdx, setPurchasedItemDetailForm } from '../../redux/purchasedItemDetailForm/purchasedItemDetailFormSlice';
import { getNumberFromStr } from '../../utils/getNumberFromStr';
import { getFloatNumFromStr } from '../../utils/getFloatNumFromStr';
import { categoriesWithSubcategories } from '../../utils/constants/categoriesWithSubCategories';
import {  IconPlus } from '@tabler/icons-react';
import { ItemExpiryTable } from '../ItemExpiryTable/ItemExpiryTable';
import { PurchaseDetailFormAlert } from '../purchaseDetailFormAlert/purchaseDetailFormAlert';
import { getStrWithoutSpecChar } from '../../utils/getStrWithoutSpecChar';

export const PurchasedItemDetailForm: React.FC<PurchasedItemDetailFormProps> = ({
  onSubmit
}) => {
  const dispatch = useDispatch();
  const purchasedItemFormData = useSelector(selectPurchasedItemDetailForm);
  const defaulValuesExpiryItemForm = {
    mfgDate: null,
    date: null,
    quantity: ''
  }
  const [formExpiryDate, setFormExpiryDate] = useState(defaulValuesExpiryItemForm);
  const [errors, setErrors] = useState<any>({});

  const formValidationSchema = Joi.object({
    barcode: Joi.string().trim().required().messages({
      'string.empty': 'Barcode is required.'
    }),
    itemName: Joi.string().trim().required().messages({
      'string.empty': 'Item name is required.',
    }),
    itemQuantity: Joi.number().required().messages({
      'string.empty': 'Packet Quantity quantity is required.',
    }),
    unit: Joi.string().required().messages({
      'string.empty': 'Unit is required.',
    }),
    mrp: Joi.number().min(1).required().messages({
      'any.required': 'MRP is required.',
      'number.min': 'MRP must be greater than 0.',
    }),
    companyName: Joi.string().trim().required().messages({
      'string.empty': 'Company Name is required',
    }),
    brand: Joi.string().trim().required().messages({
      'string.empty': 'Brand Name is required',
    }),
    costPrice: Joi.number().min(1).required().messages({
      'any.required': 'Cost Price is required.',
      'number.min': 'Cost Price must be greater than 0.',
    }),
    sellingPrice: Joi.number().min(1).required().messages({
      'any.required': 'Selling Price is required.',
      'number.min': 'Selling Price must be greater than 0.',
    }),
    stockQuantity: Joi.number().min(1).required().messages({
      'any.required': 'Order Quantity is required.',
      'number.min': 'Order Quantity must be greater than 0.',
    }),
  });

  const expiryDateValidation = Joi.object({
    date: Joi.date().required().messages({
      'date.required': 'Mfg Date is required'
    }),
    mfgDate: Joi.date().required().messages({
      'date.required': 'Mfg Date is required'
    }),
    quantity: Joi.number().required().messages({
      'number.required': 'quantity is required'
    }),
  })

  const onChange = (field: string, value: string | number | boolean) => {
    dispatch(setPurchasedItemDetailForm({
      [field]: value,
    }));
  }

  const handleSubmit = () => {
    const { error } = formValidationSchema.validate(purchasedItemFormData, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.reduce((acc: any, err: any) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});

      setErrors(errorMessages);
    }
    onSubmit(purchasedItemFormData);
  }
  
  const onExpiryFormDateChange = (field: string, value: string | number | Date | null) => {
    const updatedExpiryDateForm = { ...formExpiryDate, [field]: value };
    if(field === 'mfgDate' && value === null) {
      updatedExpiryDateForm.date = null;
    }
    setFormExpiryDate(updatedExpiryDateForm)
  }

  const onAddExpiryDate = () => {
    const { error } = expiryDateValidation.validate(formExpiryDate, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.reduce((acc: any, err: any) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});

      return setErrors(errorMessages);
    }
    setErrors({});
    dispatch(addItemExpiryDateData(formExpiryDate));
    setFormExpiryDate(defaulValuesExpiryItemForm);
  }

  return (
    <Flex direction="column" gap="16px" mx="sm" mt="lg">
      <PurchaseDetailFormAlert />
      <Flex align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left" }}>
        <Title order={3}>Form</Title>
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
              />
            </Col>

            <Col span={12}>
              <TextInput
                label="Item Name"
                value={purchasedItemFormData.itemName}
                onChange={(event) => onChange('itemName', getStrWithoutSpecChar(event.currentTarget.value.toUpperCase()))}
                required
                error={errors.itemName}
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
              />
            </Col>

            <Col span={12}>
              <TextInput
                label="Brand Name"
                value={purchasedItemFormData.brand}
                required
                onChange={(event) => onChange('brand', event.currentTarget.value)}
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
            <Flex gap="16px" align="center">
              <DatePicker 
                label="MFG Date." 
                inputFormat='DD/MM/YY'
                value={formExpiryDate.mfgDate}
                onChange={(value) => onExpiryFormDateChange('mfgDate', value)}
                error={errors.mfgDate}
                withAsterisk
              />
              <DatePicker 
                label="Expiry Date." 
                inputFormat='DD/MM/YY' 
                onChange={(value) => onExpiryFormDateChange('date', value)}
                disabled={!formExpiryDate.mfgDate}
                value={formExpiryDate.date}
                minDate={formExpiryDate.mfgDate || undefined}
                error={errors.date}
                withAsterisk
              />
              <TextInput
                label="Item Quantity"
                value={formExpiryDate.quantity}
                required
                error={errors.quantity}
                onChange={(event) => onExpiryFormDateChange('quantity', getNumberFromStr(event.currentTarget.value))}
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
        <Button sx={{ width: "220px" }} onClick={handleSubmit} type="submit" fullWidth mt="lg">
                Add Item
        </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

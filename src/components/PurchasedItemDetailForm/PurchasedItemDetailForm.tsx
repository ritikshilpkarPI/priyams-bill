import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  LoadingOverlay,
  Alert,
  Text,
  Radio,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useSelector, useDispatch } from 'react-redux';
import { selectPurchasedItemDetailForm } from '../../redux/purchasedItemDetailForm/purchasedItemSelectors';
import {
  addItemExpiryDateData,
  removeItemExpiryDateByIdx,
  resetPurchasedItemForm,
  setPurchasedItemDetailForm,
} from '../../redux/purchasedItemDetailForm/purchasedItemDetailFormSlice';
import { categoriesWithSubcategories } from '../../utils/constants/categoriesWithSubCategories';
import {
  IconCheck,
  IconEdit,
  IconExclamationCircle,
  IconPlus,
  IconSquareRoundedPercentage,
} from '@tabler/icons-react';
import { ItemExpiryTable } from '../ItemExpiryTable/ItemExpiryTable';
import { getStrWithoutSpecChar } from '../../utils/getStrWithoutSpecChar';
import { QuestionModal } from '../questionModal/QuestionModal';
import { getItemSKU } from '../../utils/getItemSKU';
import { draftItemFormValidation } from '../../utils/validations/draftItemFormValidation';
import { itemExpiryFormValidation } from '../../utils/validations/itemExpiryFormValidation';
import { generateBarcode } from '../../utils/generateBarcode';
import { selectItemsSkuList } from '../../redux/items/itemsSelector';
import { getItemsSkuAPI } from '../../utils/apiUtils';
import { setItemsData } from '../../redux/items/itemsSlice';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import { radioGroupConfig, skuModalQuestion, YES } from 'src/constants/purchaseOrderConstants';



export const PurchasedItemDetailForm: React.FC<PurchasedItemDetailFormProps> = ({
  onSubmit,
  loading,
  isApprovedPO
}) => {
  const dispatch = useDispatch();
  const purchasedItemFormData = useSelector(selectPurchasedItemDetailForm);
  const [showSkuModal, setShowSkuModal] = useState(false);
  const itemsSKUList = useSelector(selectItemsSkuList);
  const formOldValuesRef = useRef<PurchasedItemDetailFormType | null>(null);
  const defaulValuesExpiryItemForm = {
    mfgDate: null as Date | null,
    date: null as Date | null,
    value: 0,
  };

  const [formExpiryDate, setFormExpiryDate] = useState(defaulValuesExpiryItemForm);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});

  const [isEditing, setIsEditing] = useState(false);
  const [updateChoice, setUpdateChoice] = useState<string>()

  const skuFields: Record<string, string> = {
    inputName: 'inputName',
    barcode: 'barcode',
    mrp: 'mrp',
    itemQuantity: 'itemQuantity',
    unit: 'unit',
  };

  const newItemSKU = useMemo(() => {
    return getItemSKU({
      barcode: purchasedItemFormData.barcode?.toString()?.trim(),
      itemName: purchasedItemFormData.inputName?.trim() || '',
      mrp: purchasedItemFormData.mrp,
      packetQty: purchasedItemFormData.itemQuantity,
      packetUnit: purchasedItemFormData.unit,
    });
  }, [
    purchasedItemFormData.barcode,
    purchasedItemFormData.inputName,
    purchasedItemFormData.mrp,
    purchasedItemFormData.unit,
    purchasedItemFormData.itemQuantity,
    purchasedItemFormData.item_id,
  ]);

  const isNewItemSKUExists = useMemo(() => {
    return itemsSKUList?.some(
      (itemSku: string) => itemSku?.toUpperCase() === newItemSKU?.toUpperCase()
    );
  }, [itemsSKUList, newItemSKU]);

  const isSameSKU = (field: string, value: string) => {
    const itemSKUData = {
      barcode: purchasedItemFormData?.barcode?.trim() || '',
      itemName: purchasedItemFormData?.inputName?.trim() || '',
      packetQty: purchasedItemFormData?.itemQuantity,
      packetUnit: purchasedItemFormData.unit,
      mrp: purchasedItemFormData.mrp,
    };
    let skuRelatedField = field;
    switch (field) {
      case 'inputName':
        skuRelatedField = 'itemName';
        break;
      case 'barcode':
        skuRelatedField = 'barcode';
        break;
      case 'itemQuantity':
        skuRelatedField = 'packetQty';
        break;
      case 'unit':
        skuRelatedField = 'packetUnit';
        break;
      case 'mrp':
        skuRelatedField = 'mrp';
        break;
    }
    const newItemSKU = getItemSKU({
      ...itemSKUData,
      [skuRelatedField]: value?.toString().trim(),
    });
    const oldItemSKU = getItemSKU(itemSKUData);
    return newItemSKU === oldItemSKU;
  };

  const onChange = (field: string, value: string | number | boolean) => {
    if (
      skuFields[field] &&
      purchasedItemFormData.item_id &&
      !isSameSKU(field, value?.toString())
    ) {
      formOldValuesRef.current = { ...purchasedItemFormData };
      setShowSkuModal(true);
    }
    dispatch(
      setPurchasedItemDetailForm({
        [field]: value,
      })
    );
  };

  const handleSubmit = async () => {
    try {
      // Validate the purchasedItemFormData
      await draftItemFormValidation.validate(purchasedItemFormData, {
        abortEarly: false,
      });
      const totalExpiryQty = purchasedItemFormData.expiryDates?.reduce(
        (total, expiryDate) => total + (Number(expiryDate.value) || 0),
        0
      );
      if (Number(totalExpiryQty) !== Number(purchasedItemFormData.stockQuantity)) {
        return setErrors({
          stockQuantity: 'order quantity and expiry items should be equal',
        });
      }
      setErrors({});
      onSubmit(purchasedItemFormData);
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  const onExpiryFormDateChange = (field: string, value: string | Date | null ) => {
    let stringVal: string | null = null;

    if (value instanceof Date) {
      stringVal = value.toISOString();
    } else if (typeof value === 'string') {
      stringVal = value;
    }

    setFormExpiryDate((prev) => ({
      ...prev,
      [field]: stringVal,
    }));
  };

  const onAddOrUpdateExpiryDate = async () => {
    try {
      await itemExpiryFormValidation.validate(formExpiryDate, {
        abortEarly: false,
      });
      setErrors({});
      dispatch(addItemExpiryDateData({ ...formExpiryDate }));
      setFormExpiryDate(defaulValuesExpiryItemForm);
      setIsEditing(false);
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  const onBarcodeGenerate = () => {
    if (purchasedItemFormData.item_id) {
      formOldValuesRef.current = { ...purchasedItemFormData };
      setShowSkuModal(true);
    }
    const newBarcode = generateBarcode();
    dispatch(setPurchasedItemDetailForm({ barcode: newBarcode }));
  };

  const onSkuModalClose = () => {
    setShowSkuModal(false);
    if (!formOldValuesRef.current) return;
    dispatch(setPurchasedItemDetailForm(formOldValuesRef.current));
  };

  const getItemsSku = async () => {
    const response = await getItemsSkuAPI();
    if (!response || response.isError) return;
    dispatch(setItemsData({ itemsSkuList: response.itemsSku }));
  };

  useEffect(() => {
    getItemsSku();
  }, []);

  const onEditExpiryDate = (idx: number) => {
    const itemToEdit = purchasedItemFormData.expiryDates[idx];
    dispatch(removeItemExpiryDateByIdx(idx));

    setFormExpiryDate({
      mfgDate: itemToEdit.mfgDate ?? null,
      date: itemToEdit.date ?? null,
      value: itemToEdit.value,
    });

    setIsEditing(true);
  };

  const profitMargin = (
    ((Number(purchasedItemFormData.sellingPrice) -
      Number(purchasedItemFormData.costPrice)) /
      Number(purchasedItemFormData.costPrice)) *
    100
  ).toFixed(2);

  return (
    <Flex direction="column" gap="16px" pos="relative">
      <Flex
        align="left"
        gap="16px"
        direction="column"
      >
        <Title order={3} display="flex" sx={{ gap: '8px' }}>
          <Flex wrap="wrap" gap="4px">
            Form
            <span>
              {purchasedItemFormData.item_id ? (
                <Badge>This item exists in inventory</Badge>
              ) : (
                <Badge color="green">You are adding new item</Badge>
              )}
            </span>
          </Flex>
        </Title>
        <Flex wrap="wrap" direction="row" gap="32px">
          <Box>
            <Divider my="xs" label="Item SKU Details" labelPosition="center" />
            <Grid gutter="md" sx={{ width: '240px' }}>
              <Col span={12}>
                <TextInput
                  label="Barcode"
                  value={purchasedItemFormData.barcode}
                  onChange={(event) =>
                    onChange('barcode', event.currentTarget.value.toUpperCase().trim())
                  }
                  required
                  error={errors.barcode}
                  placeholder="Enter barcode"
                  rightSection={
                    <>
                      <IconEdit
                        onClick={onBarcodeGenerate}
                        cursor="pointer"
                        size={20}
                        color="#228be6"
                      />
                    </>
                  }
                  disabled={isApprovedPO}
                />
              </Col>

              <Col span={12}>
                <TextInput
                  label="Item Name"
                  value={purchasedItemFormData.inputName}
                  onChange={(event) =>
                    onChange(
                      'inputName',
                      getStrWithoutSpecChar(event.currentTarget.value.toUpperCase())
                    )
                  }
                  required
                  error={errors.inputName}
                  placeholder="Enter Item name"
                  disabled={isApprovedPO}
                />
              </Col>

              <Col span={12}>
                <CustomNumberInput
                  label="Packet Qty."
                  value={purchasedItemFormData.itemQuantity}
                  onChange={(event) =>
                    onChange('itemQuantity', parseInt(event.currentTarget.value) || 0)
                  }
                  required
                  error={errors.itemQuantity}
                  placeholder="Enter Packet Quantity"
                  disabled={isApprovedPO}
                />
              </Col>

              <Col span={12}>
                <Select
                  label="Packet Unit"
                  data={['grams', 'kg', 'ml', 'liter', 'piece']}
                  value={purchasedItemFormData.unit}
                  required
                  onChange={(value) => onChange('unit', value!)}
                  disabled={isApprovedPO}
                />
              </Col>

              <Col span={12}>
                <CustomNumberInput
                  label="M.R.P."
                  value={purchasedItemFormData.mrp}
                  required
                  onChange={(event) => onChange('mrp', event.currentTarget.value)}
                  error={errors.mrp}
                  disabled={isApprovedPO}
                />
              </Col>
              <Col span={12}>
                {purchasedItemFormData.inputName && purchasedItemFormData.barcode ? (
                  isNewItemSKUExists && !purchasedItemFormData.item_id ? (
                    <Alert color="red">
                      <IconExclamationCircle
                        size={20}
                        color="red"
                        style={{ marginRight: '10px' }}
                      />
                      Item with this SKU already exists
                      <div>{newItemSKU}</div>
                      <div>
                        SKU: Barcode + Item Name + Packet Qty + Unit + MRP + MRP IN DIGITS
                      </div>
                    </Alert>
                  ) : (
                    <Alert color="green">
                      <IconCheck
                        size={20}
                        color="green"
                        style={{ marginRight: '10px' }}
                      />
                      ITEM SKU
                      <Text color="green" weight={600}>
                        {newItemSKU}
                      </Text>
                    </Alert>
                  )
                ) : (
                  <Alert color="yellow">
                    <IconExclamationCircle
                      size={20}
                      color="black"
                      style={{ marginRight: '10px' }}
                    />
                    SKU will be generated on adding item name and barcode
                  </Alert>
                )}
              </Col>
            </Grid>
          </Box>

          <Box>
            <Divider my="xs" label="Add Item Details" labelPosition="center" />
            <Grid gutter="md" sx={{ width: '240px' }}>
              <Col span={12}>
                <TextInput
                  label="Company Name"
                  value={purchasedItemFormData.companyName}
                  required
                  onChange={(event) => onChange('companyName', event.currentTarget.value)}
                  error={errors.companyName}
                  disabled={isApprovedPO}
                />
              </Col>
              <Col span={12}>
                <TextInput
                  label="Brand Name"
                  value={purchasedItemFormData.brand}
                  required
                  onChange={(event) => onChange('brand', event.currentTarget.value)}
                  error={errors.brand}
                  disabled={isApprovedPO}
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
                  sx={{ width: '100%' }}
                  value={purchasedItemFormData.category}
                  onChange={(value) => onChange('category', value)}
                  disabled={isApprovedPO}
                />
              </Col>
              <Col span={12}>
                <Autocomplete
                  label="Sub Category"
                  placeholder="Add SubCategory"
                  data={
                    categoriesWithSubcategories[purchasedItemFormData.category] || []
                  }
                  autoCapitalize="on"
                  limit={Infinity}
                  maxDropdownHeight={250}
                  sx={{ width: '100%' }}
                  value={purchasedItemFormData.subCategory}
                  onChange={(value) => onChange('subCategory', value)}
                  disabled={!purchasedItemFormData.category || isApprovedPO}
                />
              </Col>
              <Col span={12}>
                <TextInput
                  label="Flavour/Feature"
                  value={purchasedItemFormData.flavourOrFeature}
                  onChange={(event) =>
                    onChange('flavourOrFeature', event.currentTarget.value)
                  }
                  disabled={isApprovedPO}
                />
              </Col>
            </Grid>
          </Box>
          <Box>
            <Divider my="xs" label="Item Price Details" labelPosition="center" />
            <Grid gutter="md" sx={{ width: '240px' }}>
              <Col span={12}>
                <CustomNumberInput
                  label="C.P.(Cost Price)"
                  value={purchasedItemFormData.costPrice}
                  required
                  onChange={(event) => onChange('costPrice', event.currentTarget.value)}
                  error={errors.costPrice}
                  disabled={isApprovedPO}
                />
              </Col>
              <Col span={12}>
                <CustomNumberInput
                  label="S.P. (Selling Price)"
                  value={purchasedItemFormData.sellingPrice}
                  required
                  onChange={(event) => onChange('sellingPrice', event.currentTarget.value)}
                  error={errors.sellingPrice}
                  disabled={isApprovedPO}
                />
              </Col>
              <Col>
                <TextInput
                  label={
                    <>
                      Profit Margin{' '}
                      <IconSquareRoundedPercentage color="red" size={18} />
                    </>
                  }
                  value={`${Number(profitMargin) ? profitMargin : 0}`}
                  disabled
                />
              </Col>
              <Col span={12}>
                <CustomNumberInput
                  label="Order Quantity"
                  value={purchasedItemFormData.stockQuantity}
                  required
                  onChange={(event) =>
                    onChange('stockQuantity', parseInt(event.currentTarget.value))
                  }
                  error={errors.stockQuantity}
                  disabled={isApprovedPO}
                />
              </Col>
            </Grid>
          </Box>
          <Box>
            <Divider my="xs" label="Other Details" labelPosition="center" />
            <Grid gutter="md" sx={{ width: '240px' }}>
              <Col span={12}>
                <Textarea
                  label="Item Remarks"
                  value={purchasedItemFormData.itemRemark}
                  onChange={(event) => onChange('itemRemark', event.currentTarget.value)}
                  disabled={isApprovedPO}
                />
              </Col>
              <Col span={12}>
                 <Select
                  label="Is Free Items Available?"
                  value={purchasedItemFormData.freeItemsAvailable ? "true" : "false"}
                  data={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" }
                  ]}
                  onChange={(value) => onChange("freeItemsAvailable", value === "true")}
                  disabled={isApprovedPO}
                />
              </Col>
              { purchasedItemFormData.freeItemsAvailable &&
                <Col span={12}>
                  <Textarea
                    label="Free Items Remarks"
                    value={purchasedItemFormData.freeItemsRemarks}
                    onChange={(event) =>
                      onChange('freeItemsRemarks', event.currentTarget.value)
                    }
                    disabled={isApprovedPO}
                    />
                </Col>
              }
              <Col span={12}>
                  <Select
                  label="Is Return Policy Available?"
                  value={purchasedItemFormData.returnPolicyAvailable ? "true" : "false"}
                  data={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" }
                  ]}
                  onChange={(value) => onChange("returnPolicyAvailable", value === "true")}
                  disabled={isApprovedPO}
                />
              </Col>
              {purchasedItemFormData.returnPolicyAvailable && (
                <Col span={12}>
                  <Textarea
                    label="Return Policy Remarks"
                    value={purchasedItemFormData.returnPolicyRemarks}
                    onChange={(event) =>
                      onChange('returnPolicyRemarks', event.currentTarget.value)
                    }
                    disabled={isApprovedPO}
                  />
                </Col>
              )}
              <Col>
                <Select
                  label="Product Has Expiry Date"
                  value={ purchasedItemFormData.itemHasExpiry === null? "" : purchasedItemFormData.itemHasExpiry ? 'true' : 'false'}
                  data={[
                      { value: 'false', label: 'No' },
                      { value: 'true', label: 'Yes' },
                  ]}
                  error={errors.itemHasExpiry}
                  onChange={(value) => onChange('itemHasExpiry', value === 'true')}
                  withAsterisk
                  disabled={isApprovedPO}
                />               
              </Col>
            </Grid>
          </Box>
        </Flex>
        <Flex>
          <Box>
            <Divider my="xs" label="Add Items Expiry" labelPosition="center"/>
            <Flex gap="16px" align="center" wrap="wrap">
              <DatePicker
                label="MFG Date."
                inputFormat="DD/MM/YY"
                value={
                  formExpiryDate.mfgDate ? new Date(formExpiryDate.mfgDate) : null
                }
                onChange={(value: Date) => onExpiryFormDateChange('mfgDate', value)}
                error={errors.mfgDate}
                withAsterisk
                disabled={isApprovedPO}
              />
              <DatePicker
                label="Expiry Date."
                inputFormat="DD/MM/YY"
                onChange={(value: Date) => onExpiryFormDateChange('date', value)}
                disabled={!formExpiryDate.mfgDate}
                value={formExpiryDate.date ? new Date(formExpiryDate.date) : null}
                minDate={
                  formExpiryDate.mfgDate ? new Date(formExpiryDate.mfgDate) : undefined
                }
                error={errors.date}
                withAsterisk
                aria-disabled={isApprovedPO}
              />
              <CustomNumberInput
                label="Item Quantity"
                value={formExpiryDate.value}
                required
                error={errors.value}
                onChange={(event) =>
                  onExpiryFormDateChange('value', event.currentTarget.value)
                }
                disabled={isApprovedPO}
              />
              <Button leftIcon={<IconPlus />} onClick={onAddOrUpdateExpiryDate} disabled={isApprovedPO}>
                {isEditing ? 'Update' : 'Add'}
              </Button>
            </Flex>
            <ItemExpiryTable
              expiryDates={purchasedItemFormData.expiryDates}
              onRemove={(idx: number) => dispatch(removeItemExpiryDateByIdx(idx))}
              onEdit={onEditExpiryDate}
              showTotal={true}
              showActions={true}
            />
          </Box>
        </Flex>
        <Box>
          <Flex gap="16px">
            <Button
              sx={{ width: '220px' }}
              onClick={handleSubmit}
              type="submit"
              fullWidth
              mt="lg"
              disabled={isApprovedPO}
            >
              Add Item
            </Button>
            <Button
              sx={{ width: '220px' }}
              variant="outline"
              onClick={() => dispatch(resetPurchasedItemForm())}
              type="submit"
              fullWidth
              mt="lg"
              disabled={isApprovedPO}
            >
              Reset
            </Button>
          </Flex>
        </Box>
      </Flex>
      <QuestionModal
        opened={showSkuModal}
        onClose={onSkuModalClose}
        question={skuModalQuestion}
        onAgree={() => {
          setShowSkuModal(false);
          if (updateChoice === YES) {
            dispatch(setPurchasedItemDetailForm({ item_id: undefined }));
          }
        }}
        onDisagree={onSkuModalClose}
        isChangeCTADisabled={!Boolean(updateChoice)}
        children={
          <Radio.Group
        label={radioGroupConfig.label}
        name={radioGroupConfig.name}
        value={updateChoice}
        onChange={(val) => setUpdateChoice(val)}
      >
        {radioGroupConfig.options.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} />
        ))}
      </Radio.Group>
        }
      />
      <LoadingOverlay visible={Boolean(loading)} />
    </Flex>
  );
};

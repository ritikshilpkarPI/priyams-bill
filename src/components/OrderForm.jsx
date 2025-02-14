import {
  Drawer,
  Button,
  Group,
  Box,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Select,
  LoadingOverlay,
  Alert,
  Modal,
  Flex
} from '@mantine/core';
// import { DatePicker } from '@mantine/dates';
import ListDropDownItem from './ListDropDownItem';
import ShowSlabPricing from './ShowSlabPricing';
import '../CSS/orderForm.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import MyDatePicker from './DatePicker';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from "../utils/constants/apiPaths"
import { getItemsSkuAPI } from '../utils/apiUtils';
import { useDispatch } from 'react-redux';
import { setItemsData } from '../redux/items/itemsSlice';
import { useSelector } from 'react-redux';
import { selectItemsSkuList } from '../redux/items/itemsSelector';
import { getItemSKU } from "../utils/getItemSKU";
import { IconExclamationCircle, IconEdit } from '@tabler/icons-react';

const OrderForm = ({
  openDrawer,
  expiryQuantity,
  handleDateDelete,
  setExpiryQuantity,
  setOpenDrawer,
  setOpened,
  handleItemFrom,
  form,
  opened,
  handleExpiryDate,
  setDate,
  date,
  filterItems,
  filterItems2,
  handleSelectOrderItems,
  handleSelectOrderItems2,
  slabForm,
  addSlabPrice,
  deleteSlab,
  slabs,
  setSlabs,
  setLoading,
  itemLoading
}) => {
  const itemSkuList = useSelector(selectItemsSkuList);
  const dispatch = useDispatch();
  const [imageList, setImageList] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [isSelected, setIsSelected] = useState(true)
  const [toggle, setToggle] = useState(true);
  const [toggle1, setToggle1] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  // const [addImage, setAddImage] = useState(null)
  const imageInputRef = useRef(null);
  const formOldValuesRef = useRef(null);

  const newItemSku = useMemo(() => getItemSKU({
    barcode: form.values.barcode?.toString()?.trim(),
    itemName: form.values.inputName?.trim(),
    mrp: form.values.mrp,
    packetQty: form.values.itemQuantity,
    packetUnit: form.values.unit
  }), [form.values]);

  const isSkuAlreadyExists = useMemo(() => itemSkuList?.find(itemSku => itemSku === newItemSku), [newItemSku]);
  const [imageSearch, setImageSearch] = useState(form.values.inputName);

  const getItemsSku = async () => {
    const response = await getItemsSkuAPI();

    if(!response && response.isError) return;

    dispatch(setItemsData({ itemsSkuList: response.itemsSku }));
  }

  const onSkuChange = (name, value) => {
    formOldValuesRef.current = { ...form.values };
    if(form.values.item_id){
      setShowNewItemModal(true);
    } 
    form.setValues((values) => ({
      ...values,
      [name]: value
    }))
  }
  useEffect(() => {
    setImageSearch(form.values.inputName)
  }, [form.values.inputName])

  useEffect(() => {
    getItemsSku();
  }, [])

  const generateBarcode = () => {
    form.setValues(prev => ({ ...prev, barcode: `PSTR_${Date.now().toString().slice(-10)}` }))
  }

  const func1 = () => {
    setOpenDrawer(true);
  };
  const func2 = () => {
    setToggle(true);
    setToggle1(false);
  };
  const func3 = () => {
    setToggle1(true);
    setToggle(false);
  };
  const handleOnAddImages = async (count) => {
    setLoading(true)
    try {
      const response = await genericAxios({
        method: API_METHODS.POST,
        url: API_PATHS.GOOGLE_IMAGE.URL,
        data: {
          query: imageSearch,
          count: 10
        },
      });
      if (response.status === 200) {
        setImageList(response.data)
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false)
    }

  }
  const handleImageSearch = (e) => {
    const input = e.target.value
    setImageSearch(input)
  }

  const handleSelectImage = (link) => {
    setSelectedImage({
      public_id: "",
      secure_url: link
    })
    setIsSelected(true)
    setImageSearch('')
  }
  const handleKeyDown = () => {
    imageSearch && handleOnAddImages()
    setIsSelected(false)
  };

  const handleFileChange = async (file) => {
    try {
      setLoading(true)
      const dataUrl = await new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = reject;
      });
      const responce = await genericAxios({
        method: API_METHODS.POST,
        url: "/api/purchase/uploadImageCloudinary",
        data: {
          file: dataUrl
        },
      });

      if (responce.status !== 200) {
        console.log(responce);

      }
      const { secure_url, public_id } = responce.data
      setSelectedImage({ secure_url, public_id })

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);

    }
  };

  console.log({ formValues: form.values })

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        form.reset();
        setSlabs([]);
        setOpened(false);
      }}
      padding="sm"
      size="xl"
    >
      <LoadingOverlay visible={itemLoading} />
      <Box sx={{ maxWidth: 400 }} mx="auto" my={'lg'}>
        <form
          className="order-form"
          onSubmit={form.onSubmit((values) => {
            values.imageUrl = selectedImage
            handleItemFrom(values)
          })}
        >
          <Switch
            checked={form.values.validate}
            label="validate"
            {...form.getInputProps('validate')}
          />
          <Group className="order-flex-class">
            <TextInput
              withAsterisk={form.values.validate}
              // wrapperProps=""
              label="Barcode"
              className="form-input-tops"
              placeholder="barcode"
              onSelect={() => {
                func1();
                func2();
              }}
              {...form.getInputProps('barcode')}
              onChange={(e) => onSkuChange("barcode", e.target.value)}
              rightSection={<>
               <IconEdit onClick={()=> generateBarcode()} cursor="pointer" size={20} color="#228be6" />
              </>}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="M.R.P"
              style={{ width: '15vmin' }}
              required={form.values.validate}
              placeholder="mrp"
              precision={2}
              {...form.getInputProps('mrp')}
              onChange={(value) => onSkuChange("mrp", value)}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="Pkt. Amt."
              className="form-input-tops"
              required={form.values.validate}
              placeholder="amount in 1 pack"
              {...form.getInputProps('itemQuantity')}
              onChange={(value) => onSkuChange("itemQuantity", value)}
            />
            <Select
              label="unit"
              className="form-input-tops"
              placeholder="pick one"
              data={[
                { value: 'grams', label: 'grams' },
                { value: 'kg', label: 'kg' },
                { value: 'ml', label: 'ml' },
                { value: 'liter', label: 'liter' },
                { value: 'piece', label: 'piece' },
              ]}
              {...form.getInputProps('unit')}
              name="unit"
              onChange={(e) => onSkuChange("unit", e.target.value)}
            />

            {/* <TextInput
                            withAsterisk={form.values.validate}
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                        /> */}
            <TextInput
              withAsterisk
              label="Item Name"
              className="form-input-tops"
              required
              placeholder="item name"
              onClick={(e) => {
                func1();
                func3();
              }}
              {...form.getInputProps('inputName')}
              onChange={(e) => onSkuChange("inputName", e.target.value)}
            />
            {!form.values.item_id && isSkuAlreadyExists && (
              <Alert color="red" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconExclamationCircle size={20} color="red" style={{ marginRight: '10px' }} />
                  Item already exists with the same SKU
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#b50000' }}>
                  {newItemSku}
                </div>
              </Alert>
            )}
                </Group>
          <div className="barcode-filter-shift">
            {filterItems2.length > 1
              ? Boolean(filterItems2.length) &&
              toggle &&
              openDrawer && (
                <ListDropDownItem
                  itemList={filterItems2}
                  handleSelectOrderItems2={handleSelectOrderItems}
                />
              )
              : ''}
          </div>
          {Boolean(filterItems.length) && toggle1 && openDrawer && (
            <ListDropDownItem
              itemList={filterItems}
              handleSelectOrderItems2={handleSelectOrderItems2}
            />
          )}

          <div className='image-select-container'>
            <div className='image-input-container'>
              <label className='image-input-label' htmlFor="image-input">Image</label>
              {selectedImage &&
                <div className='selected-image-card'>
                  <img className='selected-image' src={selectedImage.secure_url} alt="" />
                </div>}
              <div className='image-input'>

                <input
                  id='image-input'
                  className='input'
                  value={imageSearch}
                  type="text"
                  placeholder='Search image'
                  onChange={(e) => handleImageSearch(e)}
                />

                <div
                  className={`search-image-button ${!imageSearch ? 'disabled' : ''}`}
                  onClick={imageSearch ? handleKeyDown : null}
                >
                  Search
                </div>
              </div>
            </div>
            {!isSelected && !imageList.length
              ? <>
                <p>This feature is currently unavailable</p>
                <Button onClick={() => imageInputRef.current.click()}
                  style={{ marginTop: '15px' }}
                >
                  Select Image
                </Button>
              </>
              : <div className='image-container'>
                {!isSelected && imageList.map((image) => (
                  <div className='image-card'
                    onClick={() => handleSelectImage(image?.link)}
                  >
                    <img className='image' src={image?.link} alt="" />
                  </div>
                ))
                }
              </div>
            }



            <input
              type="file"
              ref={imageInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e.target.files[0])}
              accept="image/*"
            />

            {/* {!isSelected &&
              <div className='show-more-image-container'>
                <p className='show-more-image-button' 
                onClick={handleAddCounter}
                >Show more</p>
              </div>
            } */}


          </div>

          <div className="date-container">
            {/* <DatePicker
              className="useby-date-picker"
              placeholder="Pick date"
              label="Expiry  date"
              inputFormat="MM/DD/YYYY"
              value={date}
              onChange={(day) => {
                let s = String(new Date(day).toLocaleDateString('en-US'));
                console.log({s});
                setDate(s);
              }}
              style={{ width: '140px' }}
            /> */}
            <MyDatePicker
              className="useby-date-picker"
              placeholder="Pick date"
              label="Expiry  date"
              inputFormat="MM/DD/YYYY"
              value={date}
              onChange={(day) => {
                let s = String(new Date(day).toLocaleDateString('en-US'));
                setDate(s);
              }}
              style={{ width: '140px' }}
              setDate={setDate}
              date={date}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: '15vmin' }}
              label="Quantity"
              placeholder="quantity"
              value={expiryQuantity}
              onChange={(qnt) => setExpiryQuantity(qnt)}
            />
            <Button onClick={handleExpiryDate}>Add Date</Button>
          </div>
          {form.values.expiryDates?.length
            ? form.values.expiryDates.map((date, index) => {
              return (
                <div className="expiry-date-showcase" key={index + 1}>
                  <TextInput
                    value={new Date(date.date).toLocaleDateString()}
                    readOnly
                  />
                  <TextInput readOnly value={date.value} />
                  <Button onClick={() => handleDateDelete(date)}>
                    Delete
                  </Button>
                </div>
              );
            })
            : ''}
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              label="Minimum Quantity"
              className="form-input-tops"
              placeholder="minimum quantity"
              {...form.getInputProps('minimumQuantity')}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="Current Stock"
              className="form-input-tops"
              placeholder="current stock quantity"
              disabled
              {...form.getInputProps('currentStock')}
            />
          </Group>
          <Group className="order-flex-class">
            <TextInput
              withAsterisk={form.values.validate}
              label="Brand Name"
              className="form-input-tops"
              placeholder="brand name"
              {...form.getInputProps('brand')}
            />
            <Select
              label="Category"
              className="form-input-tops"
              placeholder="pick one"
              data={[
                { value: 'Bakery', label: 'Bakery' },
                { value: 'Beverage', label: 'Beverage' },
                { value: 'Dairy and Frozen', label: 'Dairy and Frozen' },
                { value: 'Staple', label: 'Staple' },
                { value: 'Personal care', label: 'Personal care' },
                { value: 'Packaged Food', label: 'Packaged Food' },
                { value: 'Home and Kitchen', label: 'Home and Kitchen' },
                { value: 'Stationery', label: 'Stationery' },
                { value: 'Grocery', label: 'Grocery' },
                { value: 'Baby and kids', label: 'Baby and kids' },
                { value: 'Electronic', label: 'Electronic' },
                {
                  value: 'Spices and fast food',
                  label: 'Spices and fast food',
                },
                { value: 'Pooja', label: 'Pooja' },
                { value: 'Oil and ghee', label: 'Oil and ghee' },
                { value: 'Sweet and Chocolate', label: 'Sweet and Chocolate' },
                { value: 'Plastic', label: 'Plastic' },
                { value: 'Miscellanous', label: 'Miscellanous' },
              ]}
              {...form.getInputProps('category')}
            />
          </Group>
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              label="C.P"
              required={form.values.validate}
              style={{ width: '15vmin' }}
              placeholder="cost price"
              precision={2}
              {...form.getInputProps('costPrice')}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="S.P"
              required={form.values.validate}
              style={{ width: '15vmin' }}
              placeholder="selling price"
              precision={2}
              {...form.getInputProps('sellingPrice')}
            />
          </Group>
          <NumberInput
            withAsterisk={form.values.validate}
            label="Order Quantity"
            className="form-input-tops"
            placeholder="current stock quantity"
            {...form.getInputProps('stockQuantity')}
          />
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: '15vmin' }}
              label="Slab Start"
              placeholder="start quantity"
              {...slabForm.getInputProps('1')}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: '15vmin' }}
              label="Price"
              placeholder="price"
              precision={2}
              {...slabForm.getInputProps('2')}
            />
            <Button
              style={{ marginTop: '3.5vmin' }}
              onClick={(e) => {
                e.preventDefault();
                addSlabPrice();
              }}
              type=""
            >
              +
            </Button>
          </Group>
          <ShowSlabPricing deleteSlab={deleteSlab} slabs={slabs} />
          <Textarea
            label="Remarks"
            placeholder="remark"
            {...form.getInputProps('itemRemark')}
          />

          <Group position="right" mt="md">
            <Button disabled={!form.values.item_id && isSkuAlreadyExists} type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
      <Modal opened={showNewItemModal} withCloseButton={false} onClose={()=> {}} title="Caution" centered>
        <Flex
         direction="column"
         gap="16px"
        >
          Any change in SKU fields will create new item. Do you want to continue?
          <div>SKU Fields: Barcode, Item name, MRP, Packet Amount, Unit</div>
          <Flex justifyContent="space-between" gap="16px" sx={{ width: "100%" }}>
            <Button onClick={()=> {
              form.setValues((prev) => ({ ...prev, item_id: null, sku: null }));
              setShowNewItemModal(false);
            }}>Yes</Button>
            <Button onClick={()=> {
              setShowNewItemModal(false);
              if(!formOldValuesRef.current) return;
              form.setValues((state) => ({ ...formOldValuesRef.current }));
            }}>No</Button>
          </Flex>
        </Flex>
      </Modal>
    </Drawer>
  );
};
export default OrderForm;

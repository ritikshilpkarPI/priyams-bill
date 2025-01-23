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
  Autocomplete,
  Divider,
  Checkbox,
  Alert,
} from '@mantine/core';
// import { DatePicker } from '@mantine/dates';
import ListDropDownItem from './ListDropDownItem';
import ShowSlabPricing from './ShowSlabPricing';
import '../CSS/orderForm.css';
import { useEffect, useRef, useState } from 'react';
import MyDatePicker from './DatePicker';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from "../utils/constants/apiPaths"
import { DatePicker } from '@mantine/dates';
import { isShelfExpired } from 'src/utils/isShelfExpired';
import { getItemNameByItem } from 'src/utils/getItemNameByItem';
const OrderForm = ({
  openDrawer,
  expiryQuantity,
  handleDateDelete,
  setExpiryQuantity,
  mfgDate,
  setMfgDate,
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
  const [imageList, setImageList] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [isSelected, setIsSelected] = useState(true)
  // const [toggle, setToggle] = useState(true);
  // const [toggle1, setToggle1] = useState(false);
  // const [addImage, setAddImage] = useState(null)
  const imageInputRef = useRef(null);

  const [imageSearch, setImageSearch] = useState(form.values.inputName)
  useEffect(() => {
    setImageSearch(form.values.inputName)
  }, [form.values.inputName])

  const func1 = () => {
    setOpenDrawer(true);
  };
  const func2 = () => {
    // setToggle(true);
    // setToggle1(false);
  };
  const func3 = () => {
    // setToggle1(true);
    // setToggle(false);
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

  const categoriesWithSubcategories = {
    Bakery: [
      "Breads",
      "Cakes",
      "Cookies",
      "Pastries",
      "Buns & Bagels",
      "Croissants",
      "Muffins"
    ],
    Beverage: [
      "Tea",
      "Coffee",
      "Juices",
      "Energy Drinks",
      "Soft Drinks",
      "Flavored Milk",
      "Water (Mineral/Packaged)"
    ],
    "Dairy and Frozen": [
      "Milk",
      "Cheese",
      "Butter",
      "Paneer",
      "Yogurt/Curd",
      "Ice Cream",
      "Frozen Snacks (Nuggets, Fries, etc.)",
      "Frozen Vegetables"
    ],
    Staple: [
      "Rice",
      "Wheat Flour",
      "Lentils/Pulses",
      "Sugar",
      "Salt",
      "Spices",
      "Grains (Quinoa, Barley, etc.)"
    ],
    "Personal care": [
      "Skin Care (Lotions, Face Wash)",
      "Hair Care (Shampoos, Conditioners, Hair Oils)",
      "Oral Care (Toothpaste, Mouthwash)",
      "Hygiene Products (Sanitary Pads, Diapers)",
      "Deodorants & Perfumes",
      "Grooming Accessories (Razors, Trimmers)"
    ],
    "Packaged Food": [
      "Breakfast Cereals",
      "Instant Noodles",
      "Snacks (Chips, Namkeen)",
      "Biscuits & Cookies",
      "Sauces & Dips",
      "Ready-to-Eat Meals"
    ],
    "Home and Kitchen": [
      "Cleaning Supplies (Dishwashers, Floor Cleaners)",
      "Utensils (Cookware, Glassware)",
      "Storage (Containers, Jars)",
      "Decor (Candles, Table Mats)",
      "Electricals (Bulbs, Batteries)"
    ],
    Stationery: [
      "Notebooks",
      "Pens & Pencils",
      "Markers & Highlighters",
      "Sticky Notes",
      "Files & Folders",
      "Craft Supplies (Scissors, Glue, Tape)"
    ],
    Grocery: [
      "Fresh Vegetables",
      "Fresh Fruits",
      "Herbs & Spices",
      "Dry Fruits & Nuts",
      "Pickles & Sauces",
      "Grains & Pulses"
    ],
    "Baby and Kids": [
      "Baby Food",
      "Diapers",
      "Wipes",
      "Baby Accessories (Bottles, Soothers)",
      "Toys",
      "Clothing & Footwear"
    ],
    Electronic: [
      "Mobile Accessories (Chargers, Earphones)",
      "Small Appliances (Toasters, Irons)",
      "Batteries",
      "Light Bulbs & LEDs",
      "Cables & Adapters"
    ],
    "Spices and fast food": [
      "Whole Spices (Cloves, Cardamom)",
      "Ground Spices (Turmeric, Chili Powder)",
      "Spice Mixes (Garam Masala, Chat Masala)",
      "Fast Food Items (Noodles, Pizza Bases)",
      "Sauces & Ketchup"
    ],
    Pooja: [
      "Incense Sticks",
      "Camphor",
      "Diyas & Lamps",
      "Pooja Samagri (Rice, Flowers)",
      "Religious Books & Idols"
    ],
    "Oil and Ghee": [
      "Cooking Oils (Sunflower, Mustard, Coconut)",
      "Ghee (Cow, Buffalo)",
      "Cold-Pressed Oils",
      "Flavored Oils (Garlic Oil, Sesame Oil)"
    ],
    "Sweet and Chocolate": [
      "Chocolates",
      "Sweets (Laddoos, Barfis, Gulab Jamun)",
      "Candy & Toffees",
      "Chocolate Bars",
      "Gift Boxes (Sweet Combos)"
    ],
    Plastic: [
      "Buckets",
      "Containers",
      "Dustbins",
      "Plastic Bags",
      "Tubs & Storage Boxes"
    ],
    Miscellaneous: [
      "Seasonal Goods",
      "Small Tools (Screwdrivers, Tapes)",
      "Party Supplies",
      "Emergency Kits",
      "Travel Accessories (Locks, Pouches)"
    ]
  };

  const itemName = getItemNameByItem(form.values);

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
            values.imageUrl = selectedImage;
            handleItemFrom(values);
          })}
        >
          <Switch
            checked={form.values.validate}
            label="validate"
            {...form.getInputProps('validate')}
          />
        <Divider my="xs" label="Search" labelPosition="center" />
          <Group className='order-search-container'>
            <Select
                label="Search By"
                className="form-input-tops"
                placeholder="Search By"
                data={[
                  { value: 'barcode', label: 'Barcode' },
                  { value: 'inputName', label: 'Item Name' },
                ]}
                {...form.getInputProps('searchBy')}
              />
              <TextInput
                // wrapperProps=""
                label="Search"
                className="form-input-tops"
                placeholder="search"
                onSelect={() => {
                  func1();
                  func2();
                }}
                {...form.getInputProps('search')}
            />
          </Group>
          <Divider my="xs" label="Add Item Details" labelPosition="center" />
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
            />

            {/* <TextInput
                            withAsterisk={form.values.validate}
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                        /> */}
            <TextInput
              label="Item Name"
              className="form-input-tops"
              required
              placeholder="item name"
              onClick={(e) => {
                func1();
                func3();
              }}
              {...form.getInputProps('inputName')}
              value={itemName}
              disabled
            />
            <TextInput
              withAsterisk={form.values.validate}
              label="Company Name"
              className="form-input-tops"
              required={form.values.validate}
              placeholder="company name"
              onClick={(e) => {
                func1();
                func3();
              }}
              {...form.getInputProps('companyName')}
            />
            <TextInput
              withAsterisk={form.values.validate}
              label="Brand Name"
              required={form.values.validate}
              className="form-input-tops"
              placeholder="brand name"
              autoCapitalize
              height={100}
              limit={100}
              {...form.getInputProps('brand')}
            />
             <Autocomplete
              label="Add Category"
              placeholder="Add Category"
              data={Object.keys(categoriesWithSubcategories)}
              autoCapitalize
              limit={Infinity}
              maxDropdownHeight={250}
              {...form.getInputProps('category')}
            />
             <Autocomplete
              label="Add Sub Category"
              placeholder="Add Sub Category"
              data={categoriesWithSubcategories[form.values.category] || []}
              limit={Infinity}
              maxDropdownHeight={250}
              autoCapitalize
              disabled={!form.values.category?.trim()}
              {...form.getInputProps('subCategory')}
            />
            <TextInput
              withAsterisk={form.values.validate}
              label="Flavour/Feature"
              required={form.values.validate}
              className="form-input-tops"
              placeholder="Flavour/feature name"
              autoCapitalize
              height={100}
              limit={100}
              disabled={!form.values.category?.trim()}
              {...form.getInputProps('flavourOrFeature')}
            />
          </Group>
          <div className="barcode-filter-shift">
            {filterItems2.length > 1
              ? Boolean(filterItems2.length) &&
                openDrawer && (
                  <ListDropDownItem
                    itemList={filterItems2}
                    handleSelectOrderItems2={handleSelectOrderItems}
                  />
                )
              : ''}
          </div>
          {/* {Boolean(filterItems.length) && toggle1 && openDrawer && (
            <ListDropDownItem
              itemList={filterItems}
              handleSelectOrderItems2={handleSelectOrderItems2}
            />
          )} */}
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              label="Pkt. Amt."
              className="form-input-tops"
              required={form.values.validate}
              placeholder="amount in 1 pack"
              {...form.getInputProps('itemQuantity')}
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
            />
            <Select
              label="Sale Time"
              className="form-input-tops"
              placeholder="Sale Time"
              data={[
                { value: 'seasonal', label: 'Seasonal' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              {...form.getInputProps('saleTime')}
            />
            <Checkbox
              label="Return Policy Available?"
              {...form.getInputProps('returnPolicyAvailable')}
            />
            <Checkbox
              label="Free Items Available?"
              {...form.getInputProps('freeItemsAvailable')}
            />
            {
              form.values.returnPolicyAvailable && (<Textarea
                label="Return Policy Remarks"
                placeholder="Return Policy Remarks"
                {...form.getInputProps('returnPolicyRemakrs')}
              />)
            }
          </Group>
          <Divider my="xs" label="Item Image" labelPosition="center" />
          <div className="image-select-container">
            <div className="image-input-container">
              <label className="image-input-label" htmlFor="image-input">
                Image
              </label>
              {selectedImage && (
                <div className="selected-image-card">
                  <img
                    className="selected-image"
                    src={selectedImage.secure_url}
                    alt=""
                  />
                </div>
              )}
              <div className="image-input">
                <input
                  id="image-input"
                  className="input"
                  value={imageSearch}
                  type="text"
                  placeholder="Search image"
                  onChange={(e) => handleImageSearch(e)}
                />

                <div
                  className={`search-image-button ${
                    !imageSearch ? 'disabled' : ''
                  }`}
                  onClick={imageSearch ? handleKeyDown : null}
                >
                  Search
                </div>
              </div>
            </div>
            {!isSelected && !imageList.length ? (
              <>
                <p>This feature is currently unavailable</p>
                <Button
                  onClick={() => imageInputRef.current.click()}
                  style={{ marginTop: '15px' }}
                >
                  Select Image
                </Button>
              </>
            ) : (
              <div className="image-container">
                {!isSelected &&
                  imageList.map((image) => (
                    <div
                      className="image-card"
                      onClick={() => handleSelectImage(image?.link)}
                    >
                      <img className="image" src={image?.link} alt="" />
                    </div>
                  ))}
              </div>
            )}

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
          <Divider my="xs" label="Item Expiry Details" labelPosition="center" />
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
            <DatePicker
              className="useby-date-picker"
              placeholder="Pick Mfg. Dt."
              label="MFG.  date"
              inputFormat="MM/DD/YYYY"
              required={form.values.validate}
              withAsterisk={form.values.validate}
              onChange={(day) => {
                let s = String(new Date(day).toLocaleDateString('en-US'));
                setMfgDate(s);
              }}
              value={mfgDate}
            />
            <DatePicker
              className="useby-date-picker"
              placeholder="Pick date"
              label="Exp. Dt."
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
            ? form.values.expiryDates.map((expiryDateData, index) => {
                const isShelfExpiredItem = isShelfExpired(expiryDateData.mfgDate, expiryDateData.date);
                return (
                  <div className={`${isShelfExpiredItem ? 'shelf-expiry-date-container' : 'shelf-non-expiry-date-container'}`}>
                    <div className='expiry-date-showcase' key={index + 1}>
                      <TextInput
                        value={new Date(expiryDateData.mfgDate).toLocaleDateString()}
                        readOnly
                      />
                      <TextInput
                        value={new Date(expiryDateData.date).toLocaleDateString()}
                        readOnly
                      />
                      <TextInput readOnly value={expiryDateData.value} />
                    </div>
                    <Button onClick={() => handleDateDelete(expiryDateData)}>
                        Delete
                    </Button>
                    { isShelfExpiredItem && <Alert color={'red'}>These items are shelf expired</Alert> }
                  </div>
                );
              })
            : ''}
          <Divider my="xs" label="Stock Details" labelPosition="center" />
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
          <Divider my="xs" label="Price Details" labelPosition="center" />
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              label="M.R.P"
              style={{ width: '15vmin' }}
              required={form.values.validate}
              placeholder="mrp"
              precision={2}
              {...form.getInputProps('mrp')}
            />
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
          <Divider my="xs" label="Slab Details" labelPosition="center" />
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
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </Drawer>
  );
};
export default OrderForm;

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
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import ListDropDownItem from "./ListDropDownItem";
import ShowSlabPricing from "./ShowSlabPricing";
import '../../CSS/orderForm.css'
import { useState } from "react";
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
  slabForm,
  addSlabPrice,
  deleteSlab,
  slabs,
  setSlabs,
}) => {
  const[toggle,setToggle]=useState(true);
  const[toggle1,setToggle1]=useState(false);
  const func1=()=>{
    setOpenDrawer(true)
  }
  const func2=()=>{
    setToggle(true);
    setToggle1(false);
  }
  const func3=()=>{
    setToggle1(true);
    setToggle(false);
  }
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
      <Box sx={{ maxWidth: 400 }} mx="auto" my={"lg"}>
        <form className="order-form" onSubmit={form.onSubmit((values) => handleItemFrom(values))}>
          <Switch
            checked={form.values.validate}
            label="validate"
            {...form.getInputProps("validate")}
          />
          <Group className="order-flex-class">
            <TextInput
              withAsterisk={form.values.validate}
              // wrapperProps=""
              label="Barcode"
              className='form-input-tops'
              placeholder="barcode"
              onSelect={() => { func1(); func2();}}
              {...form.getInputProps("barcode")}
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
              className='form-input-tops'
              required
              placeholder="item name"
              onClick={() =>{ func1(); func3();}}
              {...form.getInputProps("inputName")}
            />
          </Group>
           <div className="barcode-filter-shift">
           {Boolean(filterItems2.length)  && toggle && openDrawer && (
            <ListDropDownItem
              itemList={filterItems2}
              handleSelectOrderItems={handleSelectOrderItems}
            />
          )}
          </div>
          {Boolean(filterItems.length) && toggle1 && openDrawer && (
            <ListDropDownItem
              itemList={filterItems}
              handleSelectOrderItems={handleSelectOrderItems}
            />
          )}
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              label="Pkt. Amt."
              className='form-input-tops'
              required={form.values.validate}
              placeholder="amount in 1 pack"
              {...form.getInputProps("itemQuantity")}
            />
            <Select
              label="unit"
              className='form-input-tops'
              placeholder="pick one"
              data={[
                { value: "grams", label: "grams" },
                { value: "kg", label: "kg" },
                { value: "ml", label: "ml" },
                { value: "liter", label: "liter" },
                { value: "piece", label: "piece" },
              ]}
              {...form.getInputProps("unit")}
            />
          </Group>
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              label="Minimum Quantity"
              className='form-input-tops'
              placeholder="minimum quantity"
              {...form.getInputProps("minimumQuantity")}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="Current Stock"
              className='form-input-tops'
              placeholder="current stock quantity"
              disabled
              {...form.getInputProps("currentStock")}
            />
          </Group>
          <Group className="order-flex-class">
            <TextInput
              withAsterisk={form.values.validate}
              label="Brand Name"
              className='form-input-tops'
              placeholder="brand name"
              {...form.getInputProps("brand")}
            />
            <Select
              label="Category"
              className='form-input-tops'
              placeholder="pick one"
              data={[
                { value: "Bakery", label: "Bakery" },
                { value: "Beverage", label: "Beverage" },
                { value: "Dairy and Frozen", label: "Dairy and Frozen" },
                { value: "Staple", label: "Staple" },
                { value: "Personal care", label: "Personal care" },
                { value: "Packaged Food", label: "Packaged Food" },
                { value: "Home and Kitchen", label: "Home and Kitchen" },
                { value: "Stationery", label: "Stationery" },
                { value: "Grocery", label: "Grocery" },
                { value: "Baby and kids", label: "Baby and kids" },
                { value: "Electronic", label: "Electronic" },
                { value: "Spices and fast food", label: "Spices and fast food" },
                { value: "Pooja", label: "Pooja" },
                { value: "Oil and ghee", label: "Oil and ghee" },
                { value: "Sweet and Chocolate", label: "Sweet and Chocolate" },
                { value: "Plastic", label: "Plastic" },
                { value: "Miscellanous", label: "Miscellanous" },
              ]}
              {...form.getInputProps("category")}
            />
          </Group>
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              label="M.R.P"
              style={{ width: "15vmin" }}
              required={form.values.validate}
              placeholder="mrp"
              precision={2}
              {...form.getInputProps("mrp")}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="C.P"
              required={form.values.validate}
              style={{ width: "15vmin" }}
              placeholder="cost price"
              precision={2}
              {...form.getInputProps("costPrice")}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="S.P"
              required={form.values.validate}
              style={{ width: "15vmin" }}
              placeholder="selling price"
              precision={2}
              {...form.getInputProps("sellingPrice")}
            />
          </Group>
          <NumberInput
            withAsterisk={form.values.validate}
            label="Order Quantity"
            className='form-input-tops'
            placeholder="current stock quantity"
            {...form.getInputProps("stockQuantity")}
          />
          <div className="date-container">
            {/* <DatePicker placeholder="Pick date" label="Event date" withAsterisk={form.values.validate}={true} value={date} onChange={(day) => setDate(day)} /> */}
            <DatePicker
              className="useby-date-picker"
              placeholder="Pick date"
              label="Expiry  date"
              inputFormat="MM/DD/YYYY"
              value={date}
              onChange={(day) => {
                setDate(day);
              }}
              style={{ width: "140px" }}
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
            : ""}
          <Group className="order-flex-class">
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: "15vmin" }}
              label="Slab Start"
              placeholder="start quantity"
              {...slabForm.getInputProps("1")}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: "15vmin" }}
              label="Price"
              placeholder="price"
              precision={2}
              {...slabForm.getInputProps("2")}
            />
            <Button
              style={{ marginTop: "3.5vmin" }}
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
            {...form.getInputProps("itemRemark")}
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

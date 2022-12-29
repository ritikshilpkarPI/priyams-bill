import {
  Drawer,
  Button,
  Group,
  Box,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import ListDropDownItem from "./ListDropDownItem";
import ShowSlabPricing from "./ShowSlabPricing";

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
  handleSelectOrderItems,
  slabForm,
  addSlabPrice,
  deleteSlab,
  slabs,
  setSlabs,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={() => {
        form.reset();
        setSlabs([]);
        setOpened(false);
      }}
      title="Item Details"
      padding="lg"
      size="xl"
    >
      <Box sx={{ maxWidth: 400 }} mx="auto" my={"lg"}>
        <form onSubmit={form.onSubmit((values) => handleItemFrom(values))}>
          <Switch
            checked={form.values.validate}
            label="validate"
            {...form.getInputProps("validate")}
          />
          <Group>
            <TextInput
              withAsterisk={form.values.validate}
              label="Barcode"
              placeholder="barcode"
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
              required
              placeholder="item name"
              onClick={() => setOpenDrawer(true)}
              {...form.getInputProps("inputName")}  
            />
          </Group>
          {Boolean(filterItems.length) && openDrawer && (
            <ListDropDownItem
              itemList={filterItems}
              handleSelectOrderItems={handleSelectOrderItems}
            />
          )}
          <Group>
            <NumberInput
              withAsterisk={form.values.validate}
              label="Pkt. Amt."
              required={form.values.validate}
              placeholder="amount in 1 pack"
              {...form.getInputProps("itemQuantity")}
            />
            <TextInput
              withAsterisk={form.values.validate}
              label="Unit"
              placeholder="unit"
              {...form.getInputProps("unit")}
            />
          </Group>
          <Group>
            <NumberInput
              withAsterisk={form.values.validate}
              label="Current Stock"
              placeholder="current stock quantity"
              disabled
              {...form.getInputProps("stockQuantity")}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              label="Minimum Quantity"
              placeholder="minimum quantity"
              {...form.getInputProps("minimumQuantity")}
            />
          </Group>

          <Group>
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
              width={"30px"}
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
                    <TextInput readOnly value={date.quantity} />
                    <Button onClick={() => handleDateDelete(date)}>
                      Delete
                    </Button>
                  </div>
                );
              })
            : ""}
          <Group>
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: "15vmin" }}
              label="Slab Start"
              placeholder="start quantity"
              {...slabForm.getInputProps("startValue")}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: "15vmin" }}
              label="Slab End"
              placeholder="end quantity"
              {...slabForm.getInputProps("endValue")}
            />
            <NumberInput
              withAsterisk={form.values.validate}
              style={{ width: "15vmin" }}
              label="Price"
              placeholder="price"
              precision={2}
              {...slabForm.getInputProps("pricing")}
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

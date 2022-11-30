
import { Drawer, Button, Group, Box, TextInput, Textarea, NumberInput, Select, FileInput, Table } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import ListDropDownItem from './ListDropDownItem';

const OrderForm = ({ openDrawer, expiryQuantity, setExpiryQuantity, setOpenDrawer, setOpened, handleItemFrom, form, opened, handleExpiryDate, setDate, date, filterItems, handleSelectOrderItems }) => {
    return (
        <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            title="Register"
            padding="lg"
            size="xl"
        >
            <Box sx={{ maxWidth: 400 }} mx="auto" my={'lg'} >
                <form onSubmit={form.onSubmit((values) => handleItemFrom(values))}>
                    <TextInput
                        withAsterisk
                        label="Barcode"
                        placeholder="barcode"
                        {...form.getInputProps('barcode')}
                    />
                    {/* <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                        /> */}
                    <TextInput
                        withAsterisk
                        label="Input Name"
                        placeholder="item name"
                        onClick={() => setOpenDrawer(true)}
                        {...form.getInputProps('inputName')}
                    />
                    {
                        filterItems && openDrawer &&
                        <ListDropDownItem itemList={filterItems} handleSelectOrderItems={handleSelectOrderItems} />
                    }

                    <NumberInput
                        withAsterisk
                        label="Stock Quantity"
                        placeholder="stock quantity"
                        {...form.getInputProps('stockQuantity')}
                    />
                    <NumberInput
                        withAsterisk
                        label="Minimum Quantity"
                        placeholder="minimum quantity"
                        {...form.getInputProps('minimumQuantity')}
                    />
                    <NumberInput
                        withAsterisk
                        label="Item Quantity"
                        placeholder="item quantity"
                        {...form.getInputProps('itemQuantity')}
                    />
                    <TextInput
                        withAsterisk
                        label="Unit"
                        placeholder="unit"
                        {...form.getInputProps('unit')}
                    />
                    <Select
                        label="Procurement Source"
                        placeholder='pick one'
                        data={[
                            { value: 'walmert', label: 'Walmert' },
                            { value: 'dmart', label: 'D Mart' },
                            { value: 'city', label: 'City' },
                            { value: 'distributor', label: 'Distributor' },
                        ]}
                        {...form.getInputProps("procurementSource")}
                    />
                    <TextInput
                        withAsterisk
                        label="Dealer Name"
                        placeholder="dealer name"
                        {...form.getInputProps('dealerName')}
                    />
                    <NumberInput
                        withAsterisk
                        label="Mobile Number"
                        placeholder="mobile number"
                        {...form.getInputProps('phoneNumber')}
                    />
                    <Textarea
                        label="Remarks"
                        placeholder="remark"
                        withAsterisk
                        {...form.getInputProps('itemRemark')}
                    />
                    {/* <FileInput
                            placeholder="Select Your Bill"
                            label="Your resume"
                            withAsterisk
                            {...form.getInputProps('billPhoto')}
                        /> */}
                    <NumberInput
                        withAsterisk
                        label="Selling Price"
                        placeholder="selling price"
                        {...form.getInputProps('sellingPrice')}
                    />
                    <NumberInput
                        withAsterisk
                        label="MRP"
                        placeholder="mrp"
                        {...form.getInputProps('mrp')}
                    />
                    <NumberInput
                        withAsterisk
                        label="Cost Price"
                        placeholder="cost price"
                        {...form.getInputProps('costPrice')}
                    />
                    <div className='date-container'>

                        {/* <DatePicker placeholder="Pick date" label="Event date" withAsterisk={true} value={date} onChange={(day) => setDate(day)} /> */}
                        <DatePicker
                            className="useby-date-picker"
                            placeholder="Pick date"
                            label="Expiry  date"
                            inputFormat="MM/DD/YYYY"
                            value={date}
                            onChange={(day) => setDate(day)}
                            style={{ width: "140px" }}
                        />
                        <NumberInput
                            withAsterisk
                            width={"30px"}
                            label="Quantity"
                            placeholder="quantity"
                            value={expiryQuantity}
                            onChange={(qnt) => setExpiryQuantity(qnt)}
                        />
                        <Button onClick={handleExpiryDate}>Enter Date</Button>
                    </div>
                    {
                        form.values.expiryDates.length ? form.values.expiryDates.map(date => {
                            return <div className='expiry-date-showcase' >
                                <TextInput
                                    value={date.date}
                                    readOnly

                                />
                                <TextInput
                                    readOnly
                                    value={date.quantity}
                                />
                                <Button>Delete</Button>
                            </div>
                        }) : ''
                    }



                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Box>
        </Drawer>
    )
}
export default OrderForm
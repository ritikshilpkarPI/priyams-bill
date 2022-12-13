
import { Drawer, Button, Group, Box, TextInput, Textarea, NumberInput, Switch } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import ListDropDownItem from './ListDropDownItem';
import ShowSlabPricing from './ShowSlabPricing';

const OrderForm = ({ openDrawer, expiryQuantity, handleDateDelete, setExpiryQuantity, setOpenDrawer, setOpened, handleItemFrom, form, opened, handleExpiryDate, setDate, date, filterItems, handleSelectOrderItems , slabForm,addSlabPrice,deleteSlab,slabs,setSlabs}) => {
    return (
        <Drawer
            opened={opened}
            onClose={() => {form.reset(); setSlabs([]); setOpened(false)}}
            title="Order Details"
            padding="lg"
            size="xl"
        >
                <Box sx={{ maxWidth: 400 }} mx="auto" my={'lg'} >
                <form onSubmit={form.onSubmit((values) => handleItemFrom(values))}>
                 <Switch checked={form.values.validate}  label='validate'  {...form.getInputProps('validate')} />
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
                        required
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
                        required
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
                        required
                        placeholder="item quantity"
                        {...form.getInputProps('itemQuantity')}
                    />
                    <TextInput
                        withAsterisk
                        label="Unit"
                        placeholder="unit"
                        {...form.getInputProps('unit')}
                    />
                    <Textarea
                        label="Remarks"
                        placeholder="remark"
                        withAsterisk
                        {...form.getInputProps('itemRemark')}
                    />
                    <NumberInput
                        withAsterisk
                        label="Selling Price"
                        required
                        placeholder="selling price"
                        {...form.getInputProps('sellingPrice')}
                    />
                    <NumberInput
                        withAsterisk
                        label="MRP"
                        required
                        placeholder="mrp"
                        {...form.getInputProps('mrp')}
                    />
                    <NumberInput
                        withAsterisk
                        label="Cost Price"
                        required
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
                        form.values.expiryDates?.length ? form.values.expiryDates.map((date, index) => {
                            return (<div className='expiry-date-showcase' key={index + 1} >
                                <TextInput
                                    value={date.date}
                                    readOnly

                                />
                                <TextInput
                                    readOnly
                                    value={date.quantity}
                                />
                                <Button onClick={() => handleDateDelete(date)}>Delete</Button>
                            </div>)
                        }) : ('')
                    }


                    <div style={{marginBottom:'1vmin'}}>Slab Pricing</div>
                    <Group>
                    <NumberInput
                            withAsterisk
                            style={{width:'15vmin'}}
                            label="Start Quantity"
                            placeholder="start quantity"
                            {...slabForm.getInputProps('startValue')}
                        />
                        <NumberInput
                            withAsterisk
                            style={{width:'15vmin'}}
                            label="End Quantity"
                            placeholder="end quantity"
                            {...slabForm.getInputProps('endValue')}
                        />
                        <NumberInput
                            withAsterisk
                            style={{width:'15vmin'}}
                            label="Price"
                            placeholder="price"
                            {...slabForm.getInputProps('pricing')}
                        />
                        <Button style={{marginTop:'3.5vmin'}} onClick={(e)=>{e.preventDefault(); addSlabPrice()}} type="">+</Button>
                    </Group>
                    <ShowSlabPricing deleteSlab={deleteSlab} slabs={slabs}/>
                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Box>
        </Drawer>
    )
}
export default OrderForm
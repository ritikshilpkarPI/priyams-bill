import {
    Card,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
} from '@mui/material';

import {
    Drawer,
    ScrollArea,
    Table,
    Badge,
    Chip,
} from '@mantine/core';

import {
    IconCaretDownFilled,
    IconCaretUpFilled,
} from '@tabler/icons-react';
import { ItemExpiryTable } from '../ItemExpiryTable/ItemExpiryTable';
import React from 'react';

export const POSummaryDrawer = ({ selectedOrder, opened, close }: any) => {
    const [openDealer, setOpenDealer] = React.useState(true);
    const [openItems, setOpenItems] = React.useState(true);
    const [openDetails, setOpenDetails] = React.useState(true);

    return (
        <Drawer
            opened={opened}
            position="right"
            padding="sm"
            size="70vw"
            onClose={close}
            title={<Badge color="grape">ID: {selectedOrder?._id}</Badge>}
        >
            <ScrollArea h={'90vh'}>
                <List
                    sx={{ width: '67vw', bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={() => setOpenDealer(!openDealer)}>
                        <ListItemText primary="Dealer Details" />
                        {openDealer ? (
                            <IconCaretUpFilled color="#6082B6" stroke={2} />
                        ) : (
                            <IconCaretDownFilled color="#6082B6" stroke={2} />
                        )}
                    </ListItemButton>
                    <Collapse
                        sx={{ padding: '10px' }}
                        in={openDealer}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Card sx={{ padding: '10px' }}>
                            <ScrollArea>
                                <Table withBorder withColumnBorders striped highlightOnHover>
                                    <thead>
                                        <tr>
                                            <th>Dealer Name</th>
                                            <th>Phone Number</th>
                                            <th>Procurement Source</th>
                                            <th>Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[selectedOrder].map((Order: any) => (
                                            <tr>
                                                <td>{Order?.dealerName}</td>
                                                <td>{Order?.phoneNumber}</td>
                                                <td>{Order?.procurementSource}</td>
                                                <td>{Order?.remark}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </ScrollArea>
                        </Card>
                    </Collapse>
                    <ListItemButton onClick={() => setOpenItems(!openItems)}>
                        <ListItemText primary="Purchased Items" />
                        {openItems ? (
                            <IconCaretUpFilled color="#6082B6" stroke={2} />
                        ) : (
                            <IconCaretDownFilled color="#6082B6" stroke={2} />
                        )}
                    </ListItemButton>
                    <Collapse
                        sx={{ padding: '10px' }}
                        in={openItems}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Card sx={{ padding: '10px' }}>
                            <ScrollArea>
                                <Table withBorder withColumnBorders striped highlightOnHover>
                                    <thead>
                                        <tr>
                                            <th>SKU</th>
                                            <th>Barcode</th>
                                            <th>Item Name</th>
                                            <th>Brand</th>
                                            <th>Company</th>
                                            <th>Category</th>
                                            <th>Sub Category</th>
                                            <th>New Item</th>
                                            <th>Unit</th>
                                            <th>Qty</th>
                                            <th>Stock</th>
                                            <th>Cost Price</th>
                                            <th>Selling Price</th>
                                            <th>MRP</th>
                                            <th>Profit %</th>
                                            <th>Expiry</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder?.purchasedItems?.map((item: any) => (
                                            <tr key={item._id}>
                                                <td>{item.sku}</td>
                                                <td>{item.barcode}</td>
                                                <td>{item.inputName}</td>
                                                <td>{item.brand}</td>
                                                <td>{item.companyName}</td>
                                                <td>{item.category}</td>
                                                <td>{item.subCategory}</td>
                                                <td>
                                                    {item.newItem ? (
                                                        <Chip defaultChecked>New</Chip>
                                                    ) : (
                                                        '---'
                                                    )}
                                                </td>
                                                <td>{item.unit}</td>
                                                <td>{item.itemQuantity}</td>
                                                <td>{item.stockQuantity}</td>
                                                <td>{item.costPrice}</td>
                                                <td>{item.sellingPrice}</td>
                                                <td>{item.mrp}</td>
                                                <td>{item.profitPercentage}</td>
                                                <td>
                                                    {' '}
                                                    <ItemExpiryTable
                                                        expiryDates={item.expiryDates}
                                                        onRemove={() =>
                                                            console.log('Function not implemented yet')
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </ScrollArea>
                        </Card>
                    </Collapse>
                    <ListItemButton onClick={() => setOpenDetails(!openDetails)}>
                        <ListItemText primary="Purchase Details" />
                        {openDetails ? (
                            <IconCaretUpFilled color="#6082B6" stroke={2} />
                        ) : (
                            <IconCaretDownFilled color="#6082B6" stroke={2} />
                        )}
                    </ListItemButton>
                    <Collapse
                        sx={{ padding: '10px' }}
                        in={openDetails}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Card sx={{ padding: '10px' }}>
                            <ScrollArea>
                                <Table withBorder withColumnBorders striped highlightOnHover>
                                    <thead>
                                        <tr>
                                            <th>Payment Type</th>
                                            <th>Total Items Cost</th>
                                            <th>Total Bill Amount</th>
                                            <th>Total Payable Amount</th>
                                            <th>Remark</th>
                                            <th>Credits</th>
                                            <th>Payments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[selectedOrder?.purchaseDetails].map((detail: any) => (
                                            <tr>
                                                <td>{detail?.paymentType}</td>
                                                <td>{detail?.totalItemsCost}</td>
                                                <td>{detail?.totalBillAmount}</td>
                                                <td>{detail?.totalPayableAmount}</td>
                                                <td>{detail?.remark}</td>
                                                <td>
                                                    {' '}
                                                    <Table
                                                        withBorder
                                                        withColumnBorders
                                                        striped
                                                        highlightOnHover
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>Credit Amount</th>
                                                                <th>Pay Date </th>
                                                                <th>Credit Limit In Days</th>
                                                                <th>Created At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {detail?.credits.map((credit: any) => (
                                                                <tr key={credit?._id}>
                                                                    <td>{credit?.creditAmount}</td>
                                                                    <td>{credit?.payDate}</td>
                                                                    <td>{credit?.creditLimitInDays}</td>
                                                                    <td>
                                                                        {new Date(
                                                                            credit.createdAt
                                                                        ).toLocaleDateString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                                <td>
                                                    {' '}
                                                    <Table
                                                        withBorder
                                                        withColumnBorders
                                                        striped
                                                        highlightOnHover
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>Payment Date</th>
                                                                <th>PaidBy </th>
                                                                <th>Paid Amount</th>
                                                                <th>created At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {detail?.payments.map((payment: any) => (
                                                                <tr key={payment?._id}>
                                                                    <td>
                                                                        {new Date(
                                                                            payment?.paymentDate
                                                                        ).toLocaleDateString()}
                                                                    </td>
                                                                    <td>{payment?.paidBy}</td>
                                                                    <td>{payment?.paidAmount}</td>
                                                                    <td>
                                                                        {new Date(
                                                                            payment?.createdAt
                                                                        ).toLocaleDateString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </ScrollArea>
                        </Card>
                    </Collapse>
                </List>
            </ScrollArea>
        </Drawer>
    )
}
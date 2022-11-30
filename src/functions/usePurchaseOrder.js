import { useState, useEffect } from "react";
import { useForm } from '@mantine/form';
import { Button } from "@mantine/core";
import useBarcodeSearchItems from "./useBarcodeSearchItems";
const usePurchaseOrder = () => {
    const [opened, setOpened] = useState(false);
    const [date, setDate] = useState("");
    const [expiryQuantity, setExpiryQuantity] = useState(0);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const [openDrawer, setOpenDrawer] = useState(false)
    const [orderDetails, setOrderDetails] = useState({
        items: [],
        payment: '',
        billAmount: '',
        paidAmount: '',
        remark: '',
        paidBy: ''
    })
    const [state, setState] = useState('')
    const form = useForm({
        initialValues: {
            barcode: '',
            inputName: '',
            stockQuantity: '',
            minimumQuantity: '',
            itemQuantity: '',
            unit: '',
            procurementSource: '',
            dealerName: '',
            phoneNumber: '',
            itemRemark: '',
            // billPhoto: '',
            sellingPrice: '',
            mrp: '',
            costPrice: '',
            expiryDates: []
        },

        validate: {
            phoneNumber: (value) => (/^[0-9]{10}$/.test(value) ? null : 'Invalid Mobile Number'),
        },
    });

    const handleSelectOrderItems = (item) => {
        form.setValues((prev) => ({
            barcode: item.itemBarcode,
            inputName: item.itemName,
            stockQuantity: item.itemStockQuantity,
            minimumQuantity: item.minimumStockQuantity,
            itemQuantity: '',
            unit: '',
            procurementSource: '',
            dealerName: '',
            phoneNumber: '',
            itemRemark: '',
            sellingPrice: item.itemSellingPricePerUnit,
            mrp: item.itemMRPperUnit,
            costPrice: item.itemCostPricePerUnit,
            expiryDates: []
        }));
        setOpenDrawer(false)
    }
    const handleItemFrom = (values) => {
        setOrderDetails((prev) => ({
            ...prev,
            items: [...prev.items, values],
        }));
        form.reset();
        setOpened(false)
    }
    const handleExpiryDate = () => {
        if (!date && expiryQuantity === 0) {
            return alert("add Date and expiry quantity ")
        }
        form.insertListItem('expiryDates', { date: new Date(date).toLocaleDateString("en-US", options), quantity: expiryQuantity });
        setDate("")
        setExpiryQuantity(0)
    }
    const {
        barcodeFilteredItem
    } = useBarcodeSearchItems(form.values.barcode, handleSelectOrderItems)
    useEffect(() => {
        if (Object.keys(barcodeFilteredItem).length) {
            handleSelectOrderItems(barcodeFilteredItem)
        }
        setState('')
    }, [form.values.barcode])
    const rows = orderDetails.items.map((element, index) => (
        <tr key={index + 1}>
            <td>{element.barcode}</td>
            <td>{element.inputName}</td>
            <td>{element.stockQuantity}</td>
            <td>{element.minimumQuantity}</td>
            <td>{element.itemQuantity}</td>
            <td>{element.unit}</td>
            <td>{element.procurementSource}</td>
            <td>{element.dealerName}</td>
            <td>{element.phoneNumber}</td>
            <td>{element.sellingPrice}</td>
            <td>{element.mrp}</td>
            <td>{element.costPrice}</td>
            <td>{element.expiryDates.map(date => {
                return <tr>
                    <td>Date: {date.date}</td>
                    <td>Quantity: {date.quantity}</td>
                </tr>
            })}</td>
            <td><Button>Edit</Button></td>
        </tr>
    ));
    console.log({ orderDetails });
    return {
        form,
        rows,
        opened,
        orderDetails,
        setOpened,
        handleItemFrom,
        handleExpiryDate,
        setDate,
        date,
        setOrderDetails,
        handleSelectOrderItems,
        openDrawer,
        setOpenDrawer,
        expiryQuantity,
        setExpiryQuantity
    }
}

export default usePurchaseOrder
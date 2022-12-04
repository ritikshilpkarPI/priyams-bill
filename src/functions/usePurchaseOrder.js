import { useState, useEffect } from "react";
import { useForm } from '@mantine/form';
import { Button } from "@mantine/core";
import useBarcodeSearchItems from "./useBarcodeSearchItems";
import { Axios } from "src/utils/axios";

const usePurchaseOrder = (history) => {
    const [opened, setOpened] = useState(false);
    const [date, setDate] = useState("");
    const [expiryQuantity, setExpiryQuantity] = useState(0);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const [openDrawer, setOpenDrawer] = useState(false)
    const [orderDetails, setOrderDetails] = useState({
        purchasedItems: [],
        payment: '',
        billAmount: '',
        paidAmount: '',
        remark: '',
        paidBy: '',
        procurementSource: '',
        dealerName: '',
        phoneNumber: '',
        chequeNumber: ''
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
            email: '',
            itemRemark: '',
            // billPhoto: '',
            sellingPrice: '',
            mrp: '',
            costPrice: '',
            expiryDates: []
        },

        validate: {
            stockQuantity: (value) => (value > 0 ? null : 'Stock Quantity should be greater than 0'),
            itemQuantity: (value) => (value > 0 ? null : 'Item Quantity should be greater than 0'),
            sellingPrice: (value) => (value > 0 ? null : 'Selling price should be greater than 0'),
            mrp: (value) => (value > 0 ? null : 'MRP should be greater than 0'),
            costPrice: (value) => (value > 0 ? null : 'Cost Price should be greater than 0'),
        },
    });

    const addPurchadeOrder = async () => {
        console.log({ orderDetails });
        try {
            const result = await Axios({
                method: "POST",
                url: '/api/purchaseOrder/addNewOrder',
                data: {
                    new_order: orderDetails
                }
            })
            console.log({ result });
            // history.push("/")
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleDateDelete = async (dateItem) => {
        const dates = form.values.expiryDates.filter(element => element.date !== dateItem.date)
        form.setValues((prev) => ({
            expiryDates: dates
        }));
    }

    const handleSelectOrderItems = (item) => {
        form.setValues((prev) => ({
            barcode: item.itemBarcode,
            inputName: item.itemName,
            stockQuantity: item.itemStockQuantity,
            minimumQuantity: item.minimumStockQuantity,
            itemQuantity: '',
            unit: '',
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
            purchasedItems: [...prev.purchasedItems, values],
        }));
        form.reset();
        setOpened(false)
    }
    const handledleItemEdit = (item) => {
        console.log({ item });
        setOpened(true)
        form.setValues((prev) => ({
            barcode: item.barcode,
            inputName: item.inputName,
            stockQuantity: item.stockQuantity,
            minimumQuantity: item.minimumQuantity,
            itemQuantity: item.itemQuantity,
            unit: item.unit,
            itemRemark: item.itemRemark,
            sellingPrice: item.sellingPrice,
            mrp: item.mrp,
            costPrice: item.costPrice,
            expiryDates: [...item.expiryDates]
        }));
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
    const rows = orderDetails.purchasedItems.map((element, index) => (
        <tr key={index + 1}>
            <td>{element.barcode}</td>
            <td>{element.inputName}</td>
            <td>{element.stockQuantity}</td>
            <td>{element.minimumQuantity}</td>
            <td>{element.itemQuantity}</td>
            <td>{element.unit}</td>
            <td>{element.sellingPrice}</td>
            <td>{element.mrp}</td>
            <td>{element.costPrice}</td>
            <td>{element.expiryDates.map(date => {
                return <tr>
                    <td>Date: {date.date}</td>
                    <td>Quantity: {date.quantity}</td>
                </tr>
            })}</td>
            <td><Button onClick={() => handledleItemEdit(element)}>Edit</Button></td>
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
        setExpiryQuantity,
        addPurchadeOrder,
        handleDateDelete,
        handledleItemEdit
    }
}

export default usePurchaseOrder
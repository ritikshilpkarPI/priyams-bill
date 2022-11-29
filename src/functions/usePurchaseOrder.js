import { useState, useEffect } from "react";
import { useForm } from '@mantine/form';
import { Button } from "@mantine/core";
const usePurchaseOrder = () => {
    const [opened, setOpened] = useState(false);
    const [date, setDate] = useState("");
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
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
        },
    });
    const handleItemFrom = (values) => {
        setOrderDetails((prev) => ({
            ...prev,
            items: [...prev.items, values],
        }));
        form.reset();
        setOpened(false)
    }
    const handleExpiryDate = () => {
        console.log({ date: new Date(date).toLocaleDateString("en-US", options) });
        form.insertListItem('expiryDates', new Date(date).toLocaleDateString("en-US", options));
        setDate("")
    }
    useEffect(() => {
        setState('')
    }, [])
    console.log({ orderDetails });
    const rows = orderDetails.items.map((element) => (
        <tr key={element.barcode}>
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
                return <tr> <td>{date}</td></tr>
            })}</td>
            <td><Button>Edit</Button></td>
        </tr>
    ));
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
        setOrderDetails
    }
}

export default usePurchaseOrder
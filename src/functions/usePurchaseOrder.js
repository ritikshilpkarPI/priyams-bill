import { useState, useEffect } from "react";
import { useForm } from '@mantine/form';
import { Button } from "@mantine/core";
import useBarcodeSearchItems from "./useBarcodeSearchItems";
import { Axios } from "src/utils/axios";

const usePurchaseOrder = (history) => {
    const [opened, setOpened] = useState(false);
    const [openPurchaseDrawer,setPurchaseDrawer] = useState(false);
    const [date, setDate] = useState("");
    const [expiryQuantity, setExpiryQuantity] = useState(0);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const [openDrawer, setOpenDrawer] = useState(false)
    const [orderDetails, setOrderDetails] = useState([])
    const [editIndex,setEditIndex] = useState(-1);
    const purchaseForm = useForm({
        initialValues:{
            payment: '',
            billAmount: 0,
            paidAmount: 0,
            remark: '',
            paidBy: '',
            procurementSource: '',
            dealerName: '',
            phoneNumber: 0,
            chequeNumber: '',
        },
        validate:{
            payment:(value) => (value.length > 0 ? null : 'Please fill this field'),
            remark:(value) => (value.length > 0 ? null : 'Please fill this field'),
            paidBy:(value) => (value.length > 0 ? null : 'Please fill this field'),
            dealerName:(value) => (value.length > 0 ? null : 'Please fill this field'),
            phoneNumber:(value) => (String(value).length === 10  ? null : 'Enter valid mobile number'),
            chequeNumber:(value) => (purchaseForm.values.chequeNumber === 'credit'?String(value).length > 0 ? null : 'Please fill this field':null),
            procurementSource:(value) => (value.length > 0 ? null : 'Please fill this field'),
        }
    })

    const [orderList, setOrderList] = useState([]);
    
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
            sellingPrice: '',
            mrp: '',
            costPrice: '',
            expiryDates: [],
            validate:false
        },
        validate: {
            stockQuantity: (value) => (form.values.validate ?(value > 0 ? null : 'Stock Quantity should be greater than 0'):null),
            itemQuantity: (value) => (form.values.validate ? value > 0 ? null : 'Item Quantity should be greater than 0':null),
            sellingPrice: (value) => (form.values.validate ? value > 0 ? null : 'Selling price should be greater than 0':null),
            mrp: (value) => (form.values.validate ? value > 0 ? null : 'MRP should be greater than 0':null),
            costPrice: (value) => (form.values.validate ? value > 0 ? null : 'Cost Price should be greater than 0':null),
        }
    }); 
    const [purchaseList,setPurchaseList] = useState({
        details:[],
        bills:[],
        orders:[],
    })
    console.log({purchaseList})
    console.log(purchaseList)
    const addDetails = () =>{
        
        if(purchaseForm.isValid()){
            setPurchaseList({...purchaseList,details:[...purchaseList.details,{...purchaseForm.values}]})
            purchaseForm.reset();
        }
        
    }
    const updateDetails = (e) =>{
        if(purchaseForm.isValid()){
            let detailArray = purchaseList.details.filter((item,index)=> index != editIndex);
            setPurchaseList({...purchaseList,details:[...detailArray,{...purchaseForm.values}]});
            purchaseForm.reset();
        }
        setEditIndex(-1);
        setPurchaseDrawer(false)

    }
    const addPurchadeOrder = async () => {
        
        try {
            const result = await Axios({
                method: "POST",
                url: '/api/purchaseOrder/addNewOrder',
                data: {
                    new_order: ''
                }
            })
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
            sellingPrice: item.itemSellingPricePerUnit,
            mrp: item.itemMRPperUnit,
            costPrice: item.itemCostPricePerUnit,
        }));
        setOpenDrawer(false)
    }
    const handlePurchaseDetail = (element,index) =>{
         purchaseForm.setValues((prev)=>({
            payment: element.payment,
            billAmount: element.billAmount,
            paidAmount: element.paidAmount,
            remark: element.remark,
            paidBy: element.paidBy,
            procurementSource: element.procurementSource,
            dealerName: element.dealerName,
            phoneNumber: element.phoneNumber,
            chequeNumber: element.chequeNumber,
         }))
         setEditIndex(index);
         setPurchaseDrawer(true);
    }
    const handleItemFrom = (values) => {
        let sum = 0;
        values.expiryDates.forEach(element => {
            sum += element.quantity
        })
        if (sum === values.stockQuantity) {
            if(orderDetails.length > 0){
                setOrderDetails([...orderDetails.filter((item)=> item.barcode !== values.barcode),values])
            }else{
                setOrderDetails([values]);
            }
            setPurchaseList({...purchaseList,orders:orderDetails})

            form.reset();
            setOpened(false)
           
            return;
        }
        
            alert("Total expiry dates and stock quantity  is not matching")
   }
    const handledleItemEdit = (item) => {
        
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
            expiryDates: [...item.expiryDates],
            unit:item.unit,
            validate:item.validate
        }));
        setOpened(true)

       
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
    const rows = orderDetails.map((element, index) => (
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
        handledleItemEdit,
        orderList,
        setOrderList,
        purchaseList,
        setPurchaseList,
        purchaseForm,
        addDetails,
        handlePurchaseDetail,
        openPurchaseDrawer,
        setPurchaseDrawer,
        updateDetails
    }
}

export default usePurchaseOrder
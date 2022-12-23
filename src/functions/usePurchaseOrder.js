import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import useBarcodeSearchItems from "./useBarcodeSearchItems";
import { Axios } from "src/utils/axios";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
const usePurchaseOrder = (history) => {
  const [opened, setOpened] = useState(false);
  const [openPurchaseDrawer, setPurchaseDrawer] = useState(false);
  const [date, setDate] = useState("");
  const [expiryQuantity, setExpiryQuantity] = useState(0);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [slabs, setSlabs] = useState([]);
  const [isNotGetUpdated,setIsNotGetUpdated] = useState(true); 
  const myLocation = useLocation();
  const locate = useHistory();
  const [cloudBills,setCloudBills] = useState([]);
  const [deleteBills,setDeleteBills] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [prevPaidAmount, setPrevPaidAmount] = useState(0);
  const [message, setMessage] = useState({
    success: false,
    failed: false,
    error: "",
    status: "",
  });
  const purchaseForm = useForm({
    initialValues: {
      payment: "",
      billAmount: 0,
      paidAmount: 0,
      remark: "",
      paidBy: "",
      procurementSource: "",
      dealerName: "",
      phoneNumber: 0,
      chequeNumber: "",
    },
    validate: {
      payment: (value) => (value.length > 0 ? null : "Please fill this field"),
      remark: (value) => (value.length > 0 ? null : "Please fill this field"),
      paidBy: (value) => (value.length > 0 ? null : "Please fill this field"),
      dealerName: (value) =>
        value.length > 0 ? null : "Please fill this field",
      phoneNumber: (value) =>
        String(value).length === 10 ? null : "Enter valid mobile number",
      chequeNumber: (value) =>
        purchaseForm.values.chequeNumber === "credit"
          ? String(value).length > 0
            ? null
            : "Please fill this field"
          : null,
      procurementSource: (value) =>
        value.length > 0 ? null : "Please fill this field",
        billAmount: (value) => value > 0 ? null:"Bill Amount should be greater than 0"
    },
  });

    const [orderList, setOrderList] = useState([]);
    const slabForm = useForm({
      initialValues:{
            startValue:1,
            endValue:1,
            pricing:0,
        },
        validate:{
            pricing:(value)=>(value>0?null:'price should be greated than 0')
        }
    })
    const form = useForm({
        initialValues: {
            barcode: '',
            inputName: '',
            stockQuantity: 0,
            minimumQuantity: 0,
            itemQuantity: 0,
            unit: 0,
            email: '',
            itemRemark: '',
            sellingPrice: 0,
            mrp: 0,
            costPrice: 0,
            expiryDates: [],
            validate:false,
            slabPrice:[]
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
        isSaved:false,
        isDraft:false
    })
  const id = myLocation.state?.id;
  const getDetails = async () => {
    try {
      const res = await Axios({
        method: "GET",
        url: "/api/purchaseOrder/orderDetails/" + id,
      });
      const data = res.data.data;

      purchaseForm.values.remark = data.remark;
      purchaseForm.values.payment =data.payment;
      purchaseForm.values.dealerName = data.dealerName?data.dealerName:"";
      purchaseForm.values.phoneNumber =data.phoneNumber;
      purchaseForm.values.procurementSource = data.procurementSource;
      purchaseForm.values.billAmount = data.billAmount;
      setCloudBills(data.billPhotos);
      setPurchaseList({
        orders: data.purchasedItems,
        details: data.purchaseDetails,
        remark: purchaseForm.values.remark,
        payment: purchaseForm.values.payment,
        procurementSource: purchaseForm.values.procurementSource,
        dealerName: purchaseForm.values.dealerName,
        phoneNumber: purchaseForm.values.phoneNumber,
        totalPaidAmount: Number(data.totalPaidAmount),
        billAmount:purchaseForm.values.billAmount,
        bills:[],
      });
    } catch (error) {
            console.log(error.message);
            setMessage({success:false,failed:true,error:error.message})
        }
    }
    const addPurchadeOrderValidate = async ()=>{
        purchaseList.orders.forEach((order)=>{
            if(!order.validate){
                alert('please validate all orders');
                return;
            }
        })
        addPurchadeOrder(true);
    }
    const handleDateDelete = async (dateItem) => {
        const dates = form.values.expiryDates.filter(element => element.date !== dateItem.date)
        form.setValues((prev) => ({
            expiryDates: dates
        }));
    }

  const addDetails = () => {
    purchaseForm.validate();
    if (purchaseForm.isValid()) {
      const {
        billAmount,
        remark,
        payment,
        procurementSource,
        dealerName,
        phoneNumber,
        paidAmount,
      } = purchaseForm.values;
      setPurchaseList({
        ...purchaseList,
        details: [
          ...purchaseList.details,
          {
            paidAmount: purchaseForm.values.paidAmount,
            paidBy: purchaseForm.values.paidBy,
            chequeNumber: purchaseForm.values.chequeNumber,
          },
        ],
        billAmount,
        remark,
        payment,
        procurementSource,
        dealerName,
        phoneNumber,
        totalPaidAmount: purchaseList.totalPaidAmount?purchaseList.totalPaidAmount + purchaseForm.values.paidAmount:purchaseForm.values.paidAmount,
        
      });

      purchaseForm.setValues((prev)=>({
        paidAmount:0,
        chequeNumber:'',
        paidBy:''
      }))
    
    }
  };
  const updateDetails = (e) => {
    let prevTotal = purchaseList.totalPaidAmount;
    let newPaidAmount = purchaseForm.values.paidAmount;
    let newTotal = prevPaidAmount > newPaidAmount ? prevTotal +(newPaidAmount - prevPaidAmount) : prevTotal - prevPaidAmount + newPaidAmount;
    if (true) {
      let detailArray = purchaseList.details.filter(
        (item, index) => index !== editIndex
      );
      setPurchaseList({
        ...purchaseList,
        details: [...detailArray,  {
          paidAmount: purchaseForm.values.paidAmount,
          paidBy: purchaseForm.values.paidBy,
          chequeNumber: purchaseForm.values.chequeNumber,
        },],
        totalPaidAmount:newTotal
      });
    }
    purchaseForm.setValues((prev)=>({
      paidAmount:0,
      chequeNumber:'',
      paidBy:''
    }))
    setEditIndex(-1);
    setPurchaseDrawer(false);
  };

  const addPurchadeOrder = async (isDraft) => {
    const errorObj = purchaseForm.validate().errors;
    if(errorObj.hasOwnProperty('phoneNumber')||errorObj.hasOwnProperty('procurementSource')||errorObj.hasOwnProperty('remark')||errorObj.hasOwnProperty('billAmount')){
      return;
    }
      const {
        billAmount,
        remark,
        payment,
        procurementSource,
        dealerName,
        phoneNumber,
      } = purchaseForm.values;
      const objvalues = {
        ...purchaseList,
          billAmount,remark,payment,procurementSource,dealerName,phoneNumber
      }
      setPurchaseList({
          ...objvalues
        })

    try {
      let result = id
        ? await updateOrderApi(isDraft, objvalues)
        : await addOrderApi(isDraft,objvalues);
      if (result.data.success) {
        setPurchaseList({
          details: [],
          bills: [],
          orders: [],
          billAmount: 0,
          remark: "",
          payment: "",
          procurementSource: "",
          dealerName: "",
          phoneNumber: 0,
          isDraft: false,
          totalPaidAmount: 0,
        });
        let status = isDraft ? "Draft Successfully" : "Saved Successfully";
        setMessage({ success: true, failed: false, status });
        purchaseForm.reset();
        locate.push('/approval')
      } else {
        setMessage({
          success: false,
          failed: true,
          error: result.data.message,
        });
      }
    } catch (error) {
      console.log(error.message);
      setMessage({ success: false, failed: true, error: error.message });
    }
  };
  const addOrderApi = async (isDraft,purchaseObj) => {
    return await Axios({
      method: "POST",
      url: "/api/purchaseOrder/addNewOrder",
      data: {
        new_order: { purchaseObj, isDraft},
        uploadedImages:cloudBills
      },
    });
  };

  const updateOrderApi = async (isDraft, purchaseObj) => {
    return await Axios({
      method: "POST",
      url: "/api/purchaseOrder/updateDetails",
      data: {
        new_order: { purchaseObj, isDraft, id},
        uploadedImages:cloudBills,
        deleteBills
      },
    });
  };
 const deleteCloudBills = (index) =>{
  setDeleteBills([...deleteBills,...cloudBills.filter((item,i) => i==index)])
  setCloudBills([...cloudBills.filter((item,i)=> i!==index)]);
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
    setOpenDrawer(false);
  };
  const handlePurchaseDetail = (element, index) => {
    purchaseForm.setValues((prev) => ({
      paidAmount: element.paidAmount||0,
      paidBy: element.paidBy||'',
      chequeNumber: element.chequeNumber||'',
    }));
    setPrevPaidAmount(element.paidAmount)
    setEditIndex(index);
    setPurchaseDrawer(true);
  };
  const handleItemFrom = (values) => {
    let sum = 0;
    values.expiryDates.forEach((element) => {
      sum += element.quantity;
    });
    if (sum === values.stockQuantity || !form.values.validate) {
      form.values.slabPrice = [...slabs];
      let ordersUpdated = [...purchaseList.orders.filter((order)=> order.barcode !== values.barcode)]
      setPurchaseList({
        ...purchaseList,
        orders: [
          ...ordersUpdated,
          values
        ],
      });

      form.reset();
      setSlabs([]);
      setOpened(false);
      setEditIndex(-1)
      setIsEditable(true)
      return;
    }
    alert("Total expiry dates and stock quantity  is not matching");
  };

  const handleItemEdit = (item,index) => {
    setIsEditable(false)
    if(index){
      setEditIndex(index);
    }
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
      unit: item.unit,
      validate: item.validate,
    }));
    setSlabs([...item.slabPrice]);
    setOpened(true);
  };
  const deleteOrder = (index) => {
    setPurchaseList({
      ...purchaseList,
      orders: [...purchaseList.orders.filter((item, i) => i !== index)],
    });
  };
  const deletePurchaseDetail = (index) => {
    setPurchaseList({
      ...purchaseList,
      details: [...purchaseList.details.filter((item, i) => i !== index)],
    });
  };
  const addSlabPrice = () => {
    slabForm.validate();
    if (slabForm.isValid()) {
      setSlabs([...slabs, { ...slabForm.values }]);
      slabForm.reset();
    }
  };
  const deleteSlab = (index) => {
    setSlabs([...slabs.filter((slab, i) => i !== index)]);
  };
  const handleExpiryDate = () => {
    if (!date && expiryQuantity === 0) {
      return alert("add Date and expiry quantity ");
    }
    form.insertListItem("expiryDates", {
      date: new Date(date).toLocaleDateString("en-US", options),
      quantity: expiryQuantity,
    });
    setDate("");
    setExpiryQuantity(0);
  };
  const { barcodeFilteredItem } = useBarcodeSearchItems(
    form.values.barcode,
    handleSelectOrderItems
  );
  useEffect(() => {
    if (id && isNotGetUpdated) {
      getDetails();
      setIsNotGetUpdated(false);
    }
    if (Object.keys(barcodeFilteredItem).length && isEditable) {
      handleSelectOrderItems(barcodeFilteredItem);
    }
  }, [form.values.barcode]);

  return {
    form,
    opened,
    setOpened,
    handleItemFrom,
    handleExpiryDate,
    setDate,
    date,
    handleSelectOrderItems,
    openDrawer,
    setOpenDrawer,
    expiryQuantity,
    setExpiryQuantity,
    addPurchadeOrder,
    handleDateDelete,
    orderList,
    setOrderList,
    purchaseList,
    setPurchaseList,
    purchaseForm,
    addDetails,
    handlePurchaseDetail,
    openPurchaseDrawer,
    setPurchaseDrawer,
    updateDetails,
    addPurchadeOrderValidate,
    deletePurchaseDetail,
    slabForm,
    addSlabPrice,
    deleteSlab,
    slabs,
    setSlabs,
    message,
    setMessage,
    handleItemEdit,
    deleteOrder,
    cloudBills,
    deleteCloudBills,
  };
};

export default usePurchaseOrder;

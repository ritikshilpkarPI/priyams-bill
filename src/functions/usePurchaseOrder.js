import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import useBarcodeSearchItems from "./useBarcodeSearchItems";
import { Axios } from "src/utils/axios";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { filter } from "mongodb/lib/core/connection/logger";

const usePurchaseOrder = (history) => {
  const { id } = useParams();
  const [opened, setOpened] = useState(false);
  const [openPurchaseDrawer, setPurchaseDrawer] = useState(false);
  const [date, setDate] = useState("");
  const [expiryQuantity, setExpiryQuantity] = useState(0);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [slabs, setSlabs] = useState([]);
  const [isNotGetUpdated, setIsNotGetUpdated] = useState(true);
  const locate = useHistory();
  const [cloudBills, setCloudBills] = useState([]);
  const [deleteBills, setDeleteBills] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [Loading, setLoading] = useState(false)
  const [, setPrevPaidAmount] = useState(0);
  const [, setState] = useState({})
  const [disableDraft,setDisableDraft] = useState(false)
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
      payment: (value) => (value?.length > 0 ? null : "Please fill this field"),
      paidBy: (value) => (value?.length > 0 ? null : "Please fill this field"),
      dealerName: (value) =>
        value?.length > 0 ? null : "Please fill this field",
      // phoneNumber: (value) =>
      //   String(value).length === 10 ? null : "Enter valid mobile number",
      chequeNumber: (value) =>
        purchaseForm.values.chequeNumber === "credit"
          ? String(value)?.length > 0
            ? null
            : "Please fill this field"
          : null,
      procurementSource: (value) =>
        value?.length > 0 ? null : "Please fill this field",
      billAmount: (value) => value > 0 ? null : "Bill Amount should be greater than 0",
    },
  });

  const [orderList, setOrderList] = useState([]);
  const slabForm = useForm({
    initialValues: {
      1: 0,
      2: 0,
    },
    validate: {
      2: (value) => (value > 0 ? null : 'price should be greated than 0')
    }
  })

  const form = useForm({
    initialValues: {
      barcode: '',
      inputName: '',
      stockQuantity: 0,
      currentStock: 0,
      minimumQuantity: 0,
      itemQuantity: 0,
      unit: '',
      email: '',
      itemRemark: '',
      sellingPrice: 0,
      brand: '',
      category: '',
      mrp: 0,
      costPrice: 0,
      expiryDates: [],
      validate: false,
      slabPrice: [],
      item_id: ''
    },
    validate: {
      itemQuantity: (value) => (form.values.validate ? value > 0 ? null : 'Item Quantity should be greater than 0' : null),
      // sellingPrice: (value) => (form.values.validate ? value > 0 ? null : 'Selling price should be greater than 0' : null),
      mrp: (value) => (form.values.validate ? value > 0 ? null : 'MRP should be greater than 0' : null),
      // costPrice: (value) => (form.values.validate ? value > 0 ? null : 'Cost Price should be greater than 0' : null),
    }
  });
  const [purchaseList, setPurchaseList] = useState({
    details: [],
    bills: [],
    orders: [],
    isSaved: false,
    isDraft: false
  })

  const getDetails = async (search_id) => {
    try {
      onLoader();
      const res = await Axios({
        method: "GET",
        url: "/api/purchaseOrder/orderDetails/" + search_id,
      });
      const data = res.data.data;
      console.log({data});
      purchaseForm.values.remark = data.remark;
      purchaseForm.values.payment = data.payment;
      purchaseForm.values.dealerName = data.dealerName ? data.dealerName : "";
      purchaseForm.values.phoneNumber = data.phoneNumber;
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
        billAmount: purchaseForm.values.billAmount,
        bills: [],
        isDraft: data.isDraft,
      });
      offLoader();
    } catch (error) {
      console.log(error.message);
      setMessage({ success: false, failed: true, error: error.message })
      offLoader();
    }
  };
  const addPurchadeOrderValidate = async () => {
    let flag = false;
    purchaseList.orders.forEach((order) => {
      if (!order.validate) {
        alert('please validate all orders');
        flag = true;
        return;
      }
    })
    if (flag) return;
    addPurchadeOrder(true);
  }
  const handleDateDelete = async (dateItem) => {
    const dates = form.values.expiryDates.filter(element => element.date !== dateItem.date)
    form.setValues((prev) => ({
      expiryDates: dates
    }));
  }
  const addDetails = async () => {
    const payment = {
      paidAmount: purchaseForm.values.paidAmount,
      chequeNumber: purchaseForm.values.chequeNumber,
      paidBy: purchaseForm.values.paidBy
    }
    try {
      onLoader();
      const { data } = id ? await updateSavedPayment(payment) : await savePayment(payment);
      const { order } = data;
      const { _id } = order;
      offLoader();
      if (id) {
        getDetails(id);
      } else {
        locate.push(`/purchase/${_id}`)
      }
    } catch (err) {
      offLoader();
      alert('something went wrong...')
      console.log({ err })
    }

  };
  const savePayment = async (payment) => {
    return await Axios({
      method: 'POST',
      url: '/api/payment/savePayment',
      data: {
        payment
      }
    })
  }
  const updateSavedPayment = async (payment) => {
    return await Axios({
      method: 'POST',
      url: `/api/payment/updateSavedPayment/${id}`,
      data: {
        payment,
      }
    })
  }
  const updateDetails = async (e) => {
    const payment = {
      paidBy: purchaseForm.values.paidBy,
      paidAmount: purchaseForm.values.paidAmount,
      chequeNumber: purchaseForm.values.chequeNumber
    }
    try {
      onLoader();
      await updatePaymentById(payment, editIndex);
      getDetails(id);
      offLoader();
    } catch (err) {
      offLoader();
      console.log({ err })
    }
  };
  const updatePaymentById = async (payment, index) => {
    await Axios({
      method: 'POST',
      url: `/api/payment/updatePaymentById/${id}`,
      data: {
        index,
        payment
      }
    })
  }
  const hideScrollBar = () => {
    window.scrollTo(0, 0);
    document.body.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
  }
  const showScrollBar = () => {
    document.body.style.overflowY = 'visible'
    document.body.style.overflowX = 'visible';
  }
  const addPurchadeOrder = async (isDraft) => {
    const errorObj = purchaseForm.validate().errors;
    if (errorObj.hasOwnProperty('phoneNumber') || errorObj.hasOwnProperty('procurementSource') || errorObj.hasOwnProperty('remark') || errorObj.hasOwnProperty('billAmount')) {
      return;
    }

    onLoader();
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
      billAmount, remark, payment, procurementSource, dealerName, phoneNumber
    }
    setPurchaseList({
      ...objvalues
    })

    try {
      let result = id
        ? await updateOrderApi(isDraft, objvalues)
        : await addOrderApi(isDraft, objvalues);
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
        offLoader();
        locate.push('/approval')
      } else {
        setMessage({
          success: false,
          failed: true,
          error: result.data.message,
        });
      }
      offLoader();
    } catch (error) {
      console.log(error.message);
      setMessage({ success: false, failed: true, error: error.message });
      offLoader();
    }
  };
  const addOrderApi = async (isDraft, purchaseObj) => {
    return await Axios({
      method: "POST",
      url: "/api/purchaseOrder/addNewOrder",
      data: {
        new_order: { purchaseObj, isDraft },
        uploadedImages: cloudBills
      },
    });
  };

  const updateOrderApi = async (isDraft, purchaseObj) => {
    return await Axios({
      method: "POST",
      url: "/api/purchaseOrder/updateDetails",
      data: {
        new_order: { purchaseObj, isDraft, id },
        uploadedImages: cloudBills,
        deleteBills
      },
    });
  };
  const deleteCloudBills = (index) => {
    setDeleteBills([...deleteBills, ...cloudBills.filter((item, i) => i === index)])
    setCloudBills([...cloudBills.filter((item, i) => i !== index)]);
  }
  //my function for onclick barcode
  const handleSelectOrderItems2=(item)=>{
    console.log(item);
    form.setValues((prev) => ({
      barcode: item.itemBarcode,
      inputName: item.itemName,
      currentStock: item.itemStockQuantity,
      stockQuantity: 0,
      minimumQuantity: item.minimumStockQuantity,
      brand: item.itemBrandName,
      category: item.itemCategory,
      sellingPrice: item.itemSellingPricePerUnit,
      mrp: item.itemMRPperUnit,
      costPrice: item.itemCostPricePerUnit,
      slabPrice: item.slabPricing,
      item_id: String(item._id),
      unit: item.quantityUnitName
    }));
    setSlabs(form.values.slabPrice)
    setOpenDrawer(false);
  }
  const handleSelectOrderItems = (item,filterItems2) => {
    console.log(item);
    console.log(filterItems2);
    if(filterItems2.length==1){
      form.setValues((prev) => ({
        barcode: item.itemBarcode,
        inputName: item.itemName,
        currentStock: item.itemStockQuantity,
        stockQuantity: 0,
        minimumQuantity: item.minimumStockQuantity,
        brand: item.itemBrandName,
        category: item.itemCategory,
        sellingPrice: item.itemSellingPricePerUnit,
        mrp: item.itemMRPperUnit,
        costPrice: item.itemCostPricePerUnit,
        slabPrice: item.slabPricing,
        item_id: String(item._id),
        unit: item.quantityUnitName
      }));
      setSlabs(form.values.slabPrice)
      setOpenDrawer(false);
    }
  };
  const handlePurchaseDetail = (element, index) => {
    purchaseForm.setValues((prev) => ({
      paidAmount: element.paidAmount || 0,
      paidBy: element.paidBy || '',
      chequeNumber: element.chequeNumber || '',
    }));
    setPrevPaidAmount(element.paidAmount)
    setEditIndex(index);
    setPurchaseDrawer(true);
  };
  const handleItemFrom = async (values) => {
    let sum = 0;
    values.expiryDates.forEach((element) => {
      sum += element.value;
    });
    if (sum === values.stockQuantity || !form.values.validate) {
      form.values.slabPrice = [...slabs];
      const new_order = { ...values }
      try {
        onLoader()

        const { data } = editIndex >= 0 ? await updateOrderByIndex(new_order, editIndex) : (id ? await updateSavedOrder(new_order) : await saveOrder(new_order));
        const { order } = data;
        const { _id } = order;
        offLoader();
        if (!id) {
          locate.push(`/purchase/${_id}`)
        } else {
          getDetails(id)
        }
      } catch (err) {
        console.log(err);
        offLoader();
        alert('unable to add order, something went wrong...')
      }

      form.reset();
      setSlabs([]);
      setOpened(false);
      setEditIndex(-1)
      setIsEditable(true)
      return;
    }
    alert("Total expiry dates and stock quantity  is not matching");
  };

  const saveOrder = async (new_order) => {
    return await Axios({
      method: 'POST',
      url: '/api/purchaseOrder/saveOrder',
      data: {
        new_order
      }
    })
  }
  const updateSavedOrder = async (new_order) => {
    return await Axios({
      method: 'POST',
      url: `/api/purchaseOrder/updateSavedOrder/${id}`,
      data: {
        new_order
      }
    })
  }
  const updateOrderByIndex = async (new_order, index) => {
    return await Axios({
      method: 'POST',
      url: `/api/purchaseOrder/updateOrderByIndex/${id}`,
      data: {
        new_order,
        index
      }
    })
  }
  const handleItemEdit = (item, index) => {
    setIsEditable(false)
    if (index >= 0) {
      setEditIndex(index);
    }
    form.setValues((prev) => ({
      barcode: item.barcode,
      inputName: item.inputName.trim(),
      stockQuantity: item.stockQuantity,
      currentStock: item.currentStock,
      minimumQuantity: item.minimumQuantity,
      itemQuantity: item.itemQuantity,
      unit: item.unit,
      itemRemark: item.itemRemark,
      sellingPrice: item.sellingPrice,
      mrp: item.mrp,
      costPrice: item.costPrice,
      expiryDates: [...item.expiryDates],
      validate: item.validate,
      item_id: item.item_id,
      brand: item.itemBrandName,
      category: item.itemCategory
    }));
    console.log({ item })
    setSlabs([...item.slabPrice]);
    setOpened(true);
  };
  const deleteOrder = async (order_id) => {
    try {
      onLoader();
      await Axios({
        method: 'POST',
        url: `/api/purchaseOrder/deleteItem/${id}`,
        data: {
          itemId: order_id
        }
      })
      offLoader()
      getDetails(id)
    } catch (err) {
      offLoader()
      console.log({ err })
    }
  };
  const onLoader = () => {
    setLoading(true);
    hideScrollBar();
  }
  const offLoader = () => {
    setLoading(false);
    showScrollBar();
  }
  const deletePurchaseDetail = async (index) => {
    try {
      onLoader();
      await Axios({
        method: 'POST',
        url: `/api/payment/deletePaymentById/${id}`,
        data: {
          index
        }
      })
      offLoader();
      getDetails(id);
    } catch (err) {
      console.log({ err })
    }
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
      value: expiryQuantity,
    });
    setDate("");
    setExpiryQuantity(0);
  };
  const { barcodeFilteredItem , filterItems2} = useBarcodeSearchItems(
    form.values.barcode,
    handleSelectOrderItems
  );
  //barcode changing
  useEffect(() => {
    if (id && isNotGetUpdated) {
      getDetails(id);
      setIsNotGetUpdated(false);
    }
    if (Object.keys(barcodeFilteredItem).length && isEditable) {
      handleSelectOrderItems(barcodeFilteredItem,filterItems2);
    }
    return () => {
      setState({}); // This worked for me
    };
    // eslint-disable-next-line
  }, [form.values.barcode]);

  useEffect(() => {
    let flag = false;
    purchaseList.orders.forEach((order) => {
      if (!order.validate) {
        flag = true;
        return;
      }
    })
    if(!purchaseForm.isValid()){
      flag = true;
    }
    setDisableDraft(flag)
  }, [purchaseList,purchaseForm])
  
  return {
    form,
    opened,
    setOpened,
    handleItemFrom,
    handleExpiryDate,
    setDate,
    date,
    handleSelectOrderItems,
    handleSelectOrderItems2,
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
    Loading,
    disableDraft
  };
};

export default usePurchaseOrder;

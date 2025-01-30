// import { AppStateContext } from '../../AppState/appState.context';
// React and Hooks
import React, { useState, useEffect, useContext } from 'react';
// import { useHistory as useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  Grid,
  Paper,
  Text,
  Input,
  Button,
  Table,
  Title,
  Alert,
  Loader,
  Group
} from '@mantine/core';
// import { PaymentExpiryTimer } from '../../components/PaymentExpiryTimer';
import Barcode from 'react-jsbarcode';
import "./NewBillPage.css"
import useSocket from '../../hooks/useSocket';
import {
  createRzpQrCodeAPI,
  getBillingLeanItemsAPI,
  getUserDataAPI,
  saveOrCacheBillAPI
} from '../../utils/apiUtils';
import { socketEvents } from '../../utils/constants/socketEvents';
// import {
//   calculateMRPTotal,
//   calculateAmountTotal,
//   calculateTotalItems,
//   calculateBillProfit,
//   calculateAmountReturn
// } from '../../utils/calculations';

const INITIAL_BILL_STATE = {
  billItems: [],
  customerName: '',
  customerPhone: '',
  billMRPTotal: 0,
  billAmountTotal: 0,
  billDiscountTotal: 0,
  totalNumberOfItems: 0,
  totalNumberOfUniqueItems: 0,
  totalBillProfit: 0,
  cashPay: 0,
  upiPay: 0,
  amountReturn: 0,
  billId: ''
};

<<<<<<< Updated upstream
const refreshPage = (setBill) => {
  let answer = window.confirm('Do you want to refresh page?');
  if (answer) {
    setBill(getBillInitialState())
  }
};

const NewBillPage = () => {
  const [itemsByName, setItemsByName] = useState([]);
  const [itemsByBarcode, setItemsByBarcode] = useState();
  const [itemBarCodesList, setItemBarCodesList] = useState([]);
  const [filterBarcodeData, setFilterBarcodeData] = useState([]);
  const [itemNamesList, setItemNamesList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [userProfileData, setUserDataProfile] = useState([]);
  const [bill, setBill] = useState(getBillInitialState());
  const [showProfileData, setShowProfileData] = useState(false);
  const [filterUserProfile, setFilterUserProfile] = useState([]);
  const [phoneError, setPhoneError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const barRef = useRef('');
  const [inputValue, setInputValue] = useState(INPUT_INITIAL_STATE);
  const [filteredData, setFilteredData] = useState([]);
  const { billItemsStateAndDispatch } = useContext(AppStateContext);
  const [billItems, dispatch] = billItemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(false);
  const [billBarcode, setBillBarcode] = useState('');
  const [billPaymentQRCode, setBillPaymentQRCode] = useState('');
  const [disableRegenerateQR, setDisableRegenerateQR] = useState(true);
  const [qrCodeErrorMsg, setQrCodeErrorMsg] = useState('');
  const [isQRCodeGenerating, setIsQRCodeGenerating] = useState("");
  const QR_EXPIRY_TIME_IN_SEC = 110;
  const { 
    addSocketEventListener, 
    removeSocketEventListener, 
    isConnected 
  } = useSocket({ billListener });

  function billListener(data = {}) {
    if (data?.isPaid && bill.billId === data?.billId) {
      setBillPaymentQRCode("");
      addNewBill({
        ...bill,
        rzpPaymentId: data?.paymentId,
        isUpiAmtPaid: data?.isPaid,
        billId: data?.billId,
      });
      removeSocketEventListener(`${socketEvents.BILLS}/${bill.billId}`);
    }
  }

  function handleItemNameFilter(event, setInputValue, itemsList, setData, key) {
    setInputValue((prev) => ({ ...prev, [key]: event.target.value }));
    const searchWord = event.target.value;
    const filteredData = itemsList?.filter((value) => {
      const elem = String(value);
      return elem?.toLowerCase()?.includes(searchWord?.toLowerCase());
    });
    setData(filteredData);
  }

  function findNameOrNumber(string, value) {
    for (let i = 0; i < value.toString().length; i++) {
      if (string.toString()[i] !== value[i]) {
        return false;
      }
    }
    return true;
  }

  // fetching user details
  const getUserData = async () => {
    try {
      const response = await getUserDataAPI();
      if (response.isError) return;
      setUserDataProfile(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  //   fetching items

  const getAllLeanItems = async () => {
    try {
      setLoaderDisplay(true);
      const response = await getBillingLeanItemsAPI();

      if (response.isError) return;
      if (response?.message) {
        setItemBarCodesList(response?.message?.itemBarCodesList);
        setItemsByBarcode(response?.message?.itemsBarCodeMap);
        setItemsByName(response?.message?.itemsNameMap);
        setItemNamesList(response?.message?.itemNamesList);
        setTotalItems(response?.message?.totalItemsCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoaderDisplay(false);
    }
  };

  //  handing the user search
  const handleUserSearch = (e) => {
    setShowProfileData(true);
    const users = userProfileData.filter((data) => {
      const str =
        e.target.dataset.name === 'name' ? data.customerName : data._id;
      return findNameOrNumber(str, e.target.value);
    });
    setFilterUserProfile(users);
  };

  // handling the input change
  function handleItemInputChange(event, setInputValue) {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  }

  const initializeBillState = (billItems, setBill) => {
    if (billItems.length === 0) {
      setBill(getBillInitialState());
    } else {
      setBill(billItems);
    }
  };

  // creating bill
  async function createBill(newBillId, setApiLoading) {
    const { newBillId: billUuid, ...billObject } = JSON.parse(
      localStorage.getItem(`newBill-${newBillId}`)
    );

    try {
      const addBillResponse = await saveOrCacheBillAPI({
          ...billObject,
          billID: bill.billId
      });
      if (addBillResponse.isError) {
        setApiLoading(false);
        throw Error();
      }
      setBillBarcode(addBillResponse.billBarcode);
      localStorage.removeItem(`newBill-${newBillId}`);
      setBill(getBillInitialState());
    } catch (error) {
      throw console.error({ error });
    }
  }

  //    adding new bill

  async function addNewBill(bill) {
    setBillApiCountToLocalStorage();
    const newBillId = bill.billId || `${uuidv4()}-${Date.now()}`;
    setApiLoading(true);
    let updateBill = {
      ...bill,
      [bill.updated]: bill?.updated?.push(Date.now()),
    };
    setBill(updateBill);
    // const editApi = {
    //   url: API_PATHS.BILLING.PUT_EDIT_BILL,
    //   method: API_METHODS.PUT,
    //   data: { id: billID, itemWithChanges: { ...bill } },
    // };
    // const objectOfInterest = billID ? editApi : createApi;

    localStorage.setItem(
      `newBill-${newBillId}`,
      JSON.stringify({
        newBillId,
        createdAt: new Date().toLocaleString(),
        ...{
          ...bill,
          billId: newBillId
        },
      })
    );
    await createBill(newBillId, setApiLoading);

    setApiLoading(false);
    setBillBarcode('');
    setBillPaymentQRCode('');
  }

  // To show prices according to slabs if exists
  const ItemPrice = ({ item, index }) => {
    let quantity = item['itemQuantityInBill'];
    let slabs = item['slabPricing'];
    let price = item['itemSellingPricePerUnit'];

    // if slabs exists
    if (slabs?.length && quantity) {
      for (let idx = slabs.length - 1; idx === 0; idx--) {
        const { 1: slabStartQuantity, 2: slabStartQuantityPrice } = slabs[idx];
        if (quantity >= slabStartQuantity) {
          price = slabStartQuantityPrice;
          break;
        }
      }
      bill.billItems[index].itemDetail.itemSellingPricePerUnit = Number(price);
      setBill(bill);
      return price;
    } else {
      // if slabs does not exist
      return item['itemSellingPricePerUnit'];
    }
  };

  const addItemToBill = ({ e, itemData, key = '' }) => {
    const itemKey = Boolean(key) ? key : e.target.innerText;
    const itemDetail = getItemDetail(itemData, itemKey);

    if (!itemDetail) return;

    const existingItemIndex = findExistingItemIndex(bill.billItems, itemDetail);

    if (existingItemIndex !== -1) {
      updateExistingItem(existingItemIndex, itemDetail);
    } else {
      addNewItemToBill(itemDetail);
    }

    resetInputState(Boolean(key));
  };

  const getItemDetail = (itemData, itemKey) => {
    return itemData[itemKey]?.[0] || itemData[itemKey];
  };

  const findExistingItemIndex = (billItems, itemDetail) => {
    return billItems.findIndex(
      (billItem) => billItem.itemDetail.itemName === itemDetail.itemName
    );
  };

  const updateExistingItem = (index, itemDetail) => {
    const updatedItem = {
      ...bill.billItems[index],
      itemDetail: {
        ...bill.billItems[index].itemDetail,
      },
      itemQuantityInBill: bill.billItems[index].itemQuantityInBill + 1,
    };
    bill.billItems.splice(index, 1);
    setBill((prev) => ({
      totalNumberOfItems: prev.totalNumberOfItems + 1,
      ...prev,
      billItems: [updatedItem, ...prev.billItems],
    }));
  };

  const addNewItemToBill = (itemDetail) => {
    const newItem = {
      itemDetail,
      itemMRPtotal: Number(itemDetail.itemMRPperUnit),
      itemDiscountTotal:
        itemDetail.itemMRPperUnit - itemDetail.itemSellingPricePerUnit,
      itemSellingPriceTotal: Number(itemDetail.itemSellingPricePerUnit),
      _id: itemDetail._id,
      itemQuantityInBill: 1,
    };

    setBill((prev) => ({
      ...prev,
      billItems: [newItem, ...prev.billItems],
    }));
  };

  const resetInputState = (isKeyPresent) => {
    setInputValue(INPUT_INITIAL_STATE);
    if (isKeyPresent) {
      setFilterBarcodeData([]);
    } else {
      setFilteredData([]);
    }
  };

  const updateBillValuesOnItemChange = (bill, setBill) => {
    let totalSum = 0;
    let mrpTotal = 0;
    let savedAmount = 0;
    let profitAmount = 0;
    let numOfItems = 0;
    bill.billItems.forEach((item) => {
      totalSum += Math.ceil(
        item.itemDetail['itemSellingPricePerUnit'] * item['itemQuantityInBill']
      );
      mrpTotal +=
        item.itemDetail['itemMRPperUnit'] * item['itemQuantityInBill'];
      savedAmount = mrpTotal - totalSum;
      numOfItems += item['itemQuantityInBill'];
      profitAmount +=
        (item.itemDetail['itemSellingPricePerUnit'] -
          item.itemDetail['itemCostPricePerUnit']) *
        item['itemQuantityInBill'];
    });

    setBill((prev) => ({
      ...prev,
      totalNumberOfUniqueItems: bill.billItems.length,
      totalNumberOfItems: numOfItems,
      billMRPTotal: mrpTotal,
      billAmountTotal: Math.ceil(totalSum),
      billDiscountTotal: savedAmount,
      totalBillProfit: profitAmount,
    }));
  };

  // updating bill amount
  const updateReturnAmount = (setBill, bill) => {
    setBill((prev) => ({
      ...prev,
      amountReturn: bill?.cashPay + bill?.upiPay - bill?.billAmountTotal,
    }));
  };

  const createQRByAmountAPI = async () => {
    setQrCodeErrorMsg("");
    const billId = bill.billId;
    addSocketEventListener({
      event: `${socketEvents.BILLS}/${billId}`,
      callback: billListener,
    });
    setDisableRegenerateQR(true);
    setIsQRCodeGenerating(true);
    const response = await createRzpQrCodeAPI({
      amountInRs: bill.upiPay,
      id: billId,
    })
    const billPaymentQR = response?.qrData?.image_url || '';
    if (response.isError) {
      setQrCodeErrorMsg('Unable to generate QR, please regenerate QR');
    } else {
      setBillPaymentQRCode(billPaymentQR);
    }
    setIsQRCodeGenerating(false);
  };

  const payBill = () => {
    if (bill.upiPay && process.env.REACT_APP_ENABLE_QR_CODE_BILL_PAYMENTS && isConnected)
      createQRByAmountAPI(bill.upiPay);
    else addNewBill(bill);
  };

  useEffect(
    () => initializeBillState(billItems, setBill),
    // eslint-disable-next-line
    []
  );

  useEffect(
    () => updateBillValuesOnItemChange(bill, setBill),
    // eslint-disable-next-line
    [bill.billItems]
  );

  useEffect(
    () => updateReturnAmount(setBill, bill),
    // eslint-disable-next-line
    [bill.cashPay, bill.upiPay, bill.billAmountTotal]
  );
=======
const useBillState = () => {
  const [billState, setBillState] = useState(INITIAL_BILL_STATE);
  // const { appState } = useContext(AppStateContext);
>>>>>>> Stashed changes

  useEffect(() => {
    // Initialize billId when component mounts
    setBillState(prev => ({
      ...prev,
      billId: `${uuidv4()}-${Date.now()}`
    }));
  }, []);

  const mergeDuplicateItems = (itemsList) => {
    const itemMap = {};
    itemsList.forEach((item) => {
      const key = `${item.itemDetail._id}-${item.itemDetail.itemName}`;
      if (itemMap[key]) {
        itemMap[key].itemQuantityInBill += item.itemQuantityInBill;
      } else {
        itemMap[key] = { ...item };
      }
    });
    const mergedItems = Array.from(Object.values(itemMap));
    return mergedItems;
  };

  const updateBillItems = (items) => {
    const mergedItemsList = mergeDuplicateItems(items)
    console.log({ mergedItemsList });
    setBillState(prev => {
      console.log({ billObj: prev });
      return ({
        ...prev,
        billItems: mergedItemsList,
        billMRPTotal: calculateMRPTotal(mergedItemsList),
        billAmountTotal: calculateAmountTotal(mergedItemsList),
        totalNumberOfItems: calculateTotalItems(mergedItemsList),
        totalNumberOfUniqueItems: mergedItemsList.length,
        totalBillProfit: calculateBillProfit(mergedItemsList)
      })
    });
  };

  const updateCustomerInfo = (field, value) => {
    setBillState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePayment = (type, amount) => {
    const numAmount = Number(amount) || 0;
    setBillState(prev => ({
      ...prev,
      [type]: numAmount,
      amountReturn: calculateAmountReturn(prev.billAmountTotal, {
        ...prev,
        [type]: numAmount
      })
    }));
  };

  const resetBillState = () => {
    setBillState({
      ...INITIAL_BILL_STATE,
      billId: `${uuidv4()}-${Date.now()}`
    });
  };

  return {
    billState,
    updateBillItems,
    updateCustomerInfo,
    updatePayment,
    resetBillState
  };
};

const useSocketConnection = (onBarcodeData) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(socketEvents.BARCODE_DATA, onBarcodeData);

    return () => {
      socket.off(socketEvents.BARCODE_DATA);
    };
  }, [socket, onBarcodeData]);

  return socket;
};

// ============= Helper Components =============
const CustomerInfo = ({ customerName, customerPhone, onChange }) => {
  return (
    <div className="customer-info">
      <Text size="lg" weight={500} mb="md">Customer Information</Text>
      <div className="input-group">
        <Input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => onChange('customerName', e.target.value)}
          mb="sm"
        />
        <Input
          placeholder="Phone Number"
          value={customerPhone}
          onChange={(e) => onChange('customerPhone', e.target.value)}
          mb="sm"
        />
      </div>
    </div>
  );
};

const BillItems = ({ items, onRemoveItem, bill, setBill }) => {
  const calculateItemPrice = (slabPricing, quantity, defaultPrice) => {
    if (!slabPricing || slabPricing.length === 0) {
      return defaultPrice; // Return default price if no slabs are defined
    }

    // Find the applicable slab price
    const applicableSlab = slabPricing.find(([start, end]) => {
      return quantity > start && quantity <= end;
    });

    return applicableSlab ? applicableSlab[2] : defaultPrice; // Use slab price if found, otherwise default
  };

  const handleQuantityChange = (item, idx, newQuantity) => {
    const updatedItems = [...bill.billItems];
    const updatedItem = { ...updatedItems[idx] };

    updatedItem.itemQuantityInBill = newQuantity;

    // Recalculate the item price based on slab pricing
    updatedItem.itemDetail.itemSellingPricePerUnit = calculateItemPrice(
      updatedItem.itemDetail.slabPricing,
      newQuantity,
      updatedItem.itemDetail.itemSellingPricePerUnit
    );

    updatedItems[idx] = updatedItem;
    setBill({ ...bill, billItems: updatedItems });
  };

  if (!items.length) {
    return (
      <Text color="dimmed" align="center" mt="xl">
        No items added to the bill yet.
      </Text>
    );
  }

  return (
    <div className="bill-items">
      <Table withBorder highlightOnHover>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>MRP</th>
            <th>Price</th>
            <th>Slab Pricing
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Price</th>
                </tr>
              </thead>
            </th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.itemDetail._id}>
              <td>{item.itemDetail.itemName}</td>
              <td>
                <Input
                  type="number"
                  className="quantity-input"
                  value={item.itemQuantityInBill}
                  onChange={(e) =>
                    handleQuantityChange(item, idx, Number(e.target.value))
                  }
                  style={{ width: '90px' }}
                  min={0}
                />
              </td>
              <td>{item.itemDetail.itemMRPperUnit}</td>
              <td>{item.itemDetail.itemSellingPricePerUnit}</td>
              <td>
                {item.itemDetail.slabPricing?.length ? (
                  <Table>
                    <tbody>
                      {item.itemDetail.slabPricing.map(
                        ([start, end, price], index) => (
                          <tr key={index}>
                            <td>{start}</td>
                            <td>{end}</td>
                            <td>₹{price}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                {(
                  item.itemQuantityInBill * item.itemDetail.itemSellingPricePerUnit
                ).toFixed(2)}
              </td>
              <td>
                <Button
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={() => onRemoveItem(item.itemDetail._id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const PaymentSection = ({
  cashPay,
  upiPay,
  amountReturn,
  totalAmount,
  onPaymentChange,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="payment-section">
      <Paper p="md" radius="md" withBorder>
        <Text size="lg" weight={500} mb="md">Payment Details</Text>

        <div className="amount-display">
          <Text size="xl" weight={700} color="blue">
            Total Amount: ₹{totalAmount}
          </Text>
        </div>

        <div className="payment-inputs">
          <Text size="lg" weight={700} mb="md">Cash Paid</Text>
          <Input
            label="Cash Payment"
            type="number"
            value={cashPay}
            onChange={(e) => onPaymentChange('cashPay', e.target.value)}
            mb="sm"
            min={0}
          />
          <Text size="lg" weight={700} mb="md">UPI Paid</Text>
          <Input
            label="UPI Payment"
            type="number"
            value={upiPay}
            onChange={(e) => onPaymentChange('upiPay', e.target.value)}
            mb="sm"
            min={0}
          />
        </div>

        {amountReturn > 0 && (
          <Alert color="orange" mb="md">
            Return Amount: ₹{amountReturn}
          </Alert>
        )}

        {/* <PaymentExpiryTimer onExpiry={onSubmit} /> */}

        <Button
          fullWidth
          onClick={onSubmit}
          loading={isLoading}
          disabled={totalAmount > (cashPay + upiPay) || totalAmount === 0}
        >
          Complete Payment
        </Button>
      </Paper>
    </div>
  );
};

const BarcodeScanner = ({ value }) => {
  return (
    <div className="barcode-scanner">
      <Paper p="md" radius="md" withBorder mb="md">
        <Text size="lg" weight={500} mb="md">Bill Barcode</Text>
        <Barcode value={value} options={{ format: 'code128' }} renderer="svg" />;
      </Paper>
    </div>
  );
};

const ItemSearch = ({ onItemSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsData, setItemsData] = useState([]);

  // Fetch items data once when component mounts
  useEffect(() => {
    const fetchItemsData = async () => {
      try {
        setIsLoading(true);
        const response = await getBillingLeanItemsAPI();
        if (!response?.isError && itemsData.length === 0) {
          setItemsData(response);
        } else {
          console.error('Error fetching items:', response.err);
          // Show error notification
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        // Show error notification
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemsData();
  }, []);

  // Handle search with local filtering
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value || !itemsData) {
      setSearchResults([]);
      return;
    }

    // Check if input is a barcode (only numbers)
    const isBarcode = /^\d+$/.test(value);
    let results = [];

    if (isBarcode) {
      // Search in barcode map
      const barcodeMatches = itemsData.itemsBarCodeMap[value] || [];
      results = barcodeMatches;
    } else {
      // Search in names map for partial matches
      const searchTermLower = value.toLowerCase();

      // Search in itemsNameMap
      results = Object.entries(itemsData.itemsNameMap)
        .filter(([itemName]) => {
          console.log({ itemName });

          return itemName.toLowerCase().includes(searchTermLower)
        })
        .map(([_, item]) => {
          console.log({ item });

          return item
        });

      // Also search in itemsBarCodeMap for item names
      const barcodeMapResults = Object.values(itemsData.itemsBarCodeMap)
        .flat() // Flatten because some barcodes might have multiple items
        .filter(item =>
          item.itemName.toLowerCase().includes(searchTermLower)
        );

      // Combine results and remove duplicates based on _id
      const allResults = [...results, ...barcodeMapResults];
      results = Array.from(new Map(allResults.map(item => [item._id, item])).values());
    }

    // Limit results for better performance
    setSearchResults(results.slice(0, 10));
  };

  const calculateItemPrice = (item, quantity) => {
    if (!item.slabPricing || item.slabPricing.length === 0) {
      return item.itemSellingPricePerUnit;
    }

    // Find applicable slab price
    const applicableSlab = item.slabPricing
      .sort((a, b) => b[0] - a[0])
      .find(([slabQuantity]) => quantity >= slabQuantity);

    return applicableSlab ? applicableSlab[2] : item.itemSellingPricePerUnit;
  };

  const handleItemClick = (item) => {
    onItemSelect({
      itemDetail: {
        _id: item._id,
        itemName: item.itemName,
        itemMRPperUnit: item.itemMRPperUnit,
        itemSellingPricePerUnit: calculateItemPrice(item, 1),
        // itemQuantityInBill: 1,
        itemBarcode: item.itemBarcode,
        itemStockQuantity: item.itemStockQuantity,
        slabPricing: item.slabPricing
      },
      itemQuantityInBill: 1
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="item-search">
      <Paper p="md" radius="md" withBorder mb="md">
        <Text size="lg" weight={500} mb="md">Search Items</Text>

        <Input
          placeholder="Enter item name or barcode"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          rightSection={isLoading ? <Loader size="sm" /> : null}
          mb="sm"
        />

<<<<<<< Updated upstream
          {/* Customer section */}

          <div style={{ display: 'flex', gap: '30px' }}>
            <TextInput
              label="Customer Name"
              data-name="name"
              style={{ width: '180px' }}
              value={bill.customerName}
              onBlur={(e) => {
                e.preventDefault();
                setShowProfileData(false);
              }}
              onChange={(e) => {
                setBill((prevBill) => ({
                  ...prevBill,
                  customerName: e.target.value,
                }));
                handleUserSearch(e);
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                type="number"
                label="Customer Phone No."
                value={bill.customerPhone}
                onBlur={(e) => {
                  e.preventDefault();
                  setShowProfileData(false);
                }}
                style={{ width: '180px', paddingBottom: '4px' }}
                onChange={(e) => {
                  e.target.value.length !== 10
                    ? setPhoneError('Phone number is Invalid!')
                    : setPhoneError('');
                  setBill((prevBill) => ({
                    ...prevBill,
                    customerPhone: e.target.value,
                  }));
                  handleUserSearch(e);
                }}
              />
              <div style={{ height: '10px', color: 'red' }}>{phoneError}</div>
            </div>

            {showProfileData && Boolean(filterUserProfile.length) ? (
              <div className="user-profile-data">
                <Table
                  withBorder
                  withColumnBorders
                  striped
                  highlightOnHover
                  style={{ backgroundColor: 'white' }}
                >
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Mobile No</td>
                    </tr>
                  </thead>
                  <tbody>
                    {filterUserProfile.map((value, key) => {
                      return (
                        <tr
                          onMouseDown={() => {
                            setBill((prevBill) => ({
                              ...prevBill,
                              customerPhone: value._id,
                              customerName: value.customerName,
                            }));
                            setShowProfileData(false);
                            setPhoneError('');
                          }}
                          key={key}
                          style={{
                            padding: '5px',
                            fontSize: '16px',
                            fontStyle: 'bold',
                            cursor: 'pointer',
                          }}
                          className="show-data"
                        >
                          <td>{value.customerName}</td>
                          <td>{value._id}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            ) : (
              ''
            )}
          </div>

          <Button
            sx={{ background: 'black', marginRight: '1rem' }}
            onClick={() => refreshPage(setBill)}
          >
            Refresh
          </Button>
          <Button
            sx={{ marginRight: '1rem' }}
            disabled={
              !bill.billItems.length || bill.amountReturn < 0 || apiLoading || isQRCodeGenerating
            }
            className="print-btn"
            onClick={() => payBill()}
            loading={apiLoading || isQRCodeGenerating}
          >
            Save and Print
          </Button>

          <BillNarrator billTotal={bill?.billAmountTotal} />
        </div>

        <div
          style={{
            display: 'flex',
          }}
        >
          <Table
            horizontalSpacing="sm"
            striped
            highlightOnHover
            className="bill-table"
          >
            <thead className="table-heading">
              <tr>
                <th>
                  <Text weight={700} color="black" size="lg">
                    Sl. No.
                  </Text>
                </th>
                <th>
                  <Text weight={700} color="black" size="lg">
                    Bar Code
                  </Text>
                </th>
                <th>
                  <Text
                    weight={700}
                    color="black"
                    className="header-print-text"
                    size="lg"
                  >
                    Item
                  </Text>
                </th>
                <th>
                  <Text
                    style={{ width: '100px' }}
                    weight={700}
                    color="black"
                    size="lg"
                    className="header-print-text"
                  >
                    Qty.
                  </Text>
                </th>
                <th className="header-slab-price">
                  <Text
                    style={{ width: '100px' }}
                    weight={700}
                    color="black"
                    size="lg"
                  >
                    Slab Prices
                  </Text>
                </th>
                <th>
                  <Text
                    style={{ width: '100px' }}
                    weight={700}
                    color="black"
                    size="lg"
                    className="header-print-text"
                  >
                    MRP
                  </Text>
                </th>
                <th>
                  <Text
                    style={{ width: '100px' }}
                    weight={700}
                    color="black"
                    size="lg"
                    className="header-print-text"
                  >
                    S.P
                  </Text>
                </th>

                <th>
                  <Text
                    style={{ width: '100px' }}
                    weight={700}
                    color="black"
                    size="lg"
                    className="header-print-text"
                  >
                    Total
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody
              style={{ display: loaderDisplay ? 'none' : '' }}
              className="body"
            >
              <tr className="data-result-barcode">
                <td>
                  <Text color="black" weight={700}>
                    {bill.billItems.length + 1}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={700}>
                    <span>Search BarCode</span>
                    <Input
                      className="bill-input"
                      ref={barRef}
                      type="number"
                      name="itemBarcode"
                      value={inputValue.itemBarcode}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        if (
                          itemsByBarcode[e.target.value] &&
                          itemsByBarcode[e.target.value]?.length === 1
                        ) {
                          addItemToBill({
                            e: e,
                            itemData: itemsByBarcode,
                            key: e.target.value,
                          });
                        } else {
                          handleItemNameFilter(
                            e,
                            setInputValue,
                            itemBarCodesList,
                            setFilterBarcodeData,
                            filterBarcodeData,
                            'itemBarcode'
                          );
                          handleItemInputChange(e, setInputValue);
                        }
                      }}
                      autoComplete="off"
                    />
                  </Text>
                  {Boolean(filterBarcodeData?.length) && (
                    <Table
                      className="barcode-suggestion-list"
                      style={{ backgroundColor: 'white' }}
                    >
                      <thead>
                        <td>Barcode</td>
                        <td>Name</td>
                        <td>MRP</td>
                      </thead>
                      <tbody>
                        {filterBarcodeData?.map((value, key) => {
                          const data = itemsByBarcode[value]?.[0] ?? [];
                          return (
                            <tr
                              key={key}
                              style={{
                                padding: '5px',
                                fontSize: '16px',
                                fontStyle: 'bold',
                                cursor: 'pointer',
                              }}
                              className="show-data"
                              onClick={(e) => {
                                addItemToBill({
                                  e: e,
                                  itemData: itemsByBarcode,
                                  key: value,
                                });
                                setInputValue(value);
                              }}
                            >
                              <td>{data?.itemBarcode}</td>
                              <td>{data?.itemName}</td>
                              <td>{data?.itemMRPperUnit}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </td>

                <td>
                  <Text color="black" weight={700}>
                    <span>Search Name</span>
                    <Input
                      className="bill-input"
                      type="text"
                      value={inputValue.itemName}
                      name="itemName"
                      placeholder="search here"
                      autoComplete="off"
                      onChange={(e) => {
                        handleItemNameFilter(
                          e,
                          setInputValue,
                          itemNamesList,
                          setFilteredData
                        );
                        handleItemInputChange(e, setInputValue);
                      }}
                    />
                  </Text>
                  {inputValue.itemName && Boolean(filteredData.length) && (
                    <div
                      onClick={(e) => {
                        addItemToBill({ e: e, itemData: itemsByName });
                      }}
                      className="data-result"
                      style={{ minWidth: 'fit-content' }}
                    >
                      <Table style={{ backgroundColor: 'white' }}>
                        <thead>
                          <td>Barcode</td>
                          <td>Name</td>
                          <td>MRP</td>
                        </thead>
                        <tbody>
                          {filteredData?.map((value, key) => {
                            return (
                              <tr
                                key={key}
                                style={{
                                  padding: '5px',
                                  fontSize: '16px',
                                  fontStyle: 'bold',
                                  cursor: 'pointer',
                                }}
                                className="show-data"
                              >
                                <td>{itemsByName[value]?.itemBarcode}</td>
                                <td>{itemsByName[value]?.itemName}</td>
                                <td>{itemsByName[value]?.itemMRPperUnit}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {bill.billItems.map((item, idx) => {
                const itemObj = { ...item.itemDetail, ...item };
                return (
                  <tr
                    className="bill-item-row"
                    key={`${idx}${itemObj['itemName']}`}
                  >
                    <td className="idx">
                      <Text color="black" weight={700} size="lg">
                        {idx + 1}
                      </Text>
                    </td>
                    <td className="itemBarcode">
                      {itemObj['itemBarcode'] && (
                        <Text color="black" weight={700} size="lg">
                          {itemObj['itemBarcode']}
                        </Text>
                      )}
                    </td>
                    <td className="itemName">
                      <Text
                        className="print-text"
                        color="black"
                        weight={700}
                        size="xl"
                      >
                        {itemObj['itemName']}
                      </Text>
                    </td>
                    <td className="itemQuantityInBill">
                      <QuantBtn
                        itemObj={itemObj}
                        idx={idx}
                        bill={bill}
                        setBill={setBill}
                      />
                    </td>
                    <td className="slabPricing">
                      <div>
                        {itemObj.slabPricing?.map((item, index) => {
                          return (
                            <div key={index} style={{ display: 'flex' }}>
                              <input
                                type="number"
                                style={{
                                  width: '40px',
                                  textAlign: 'center',
                                  border: 'none',
                                  outline: 'none',
                                }}
                                value={item[1]}
                                disabled
                              />{' '}
                              -
                              <input
                                type="number"
                                style={{
                                  width: '40px',
                                  textAlign: 'center',
                                  border: 'none',
                                  outline: 'none',
                                }}
                                disabled
                                defaultValue={
                                  index !== itemObj.slabPricing.length - 1
                                    ? Number(
                                        itemObj.slabPricing[index + 1][1]
                                      ) - 1
                                    : ''
                                }
                              />{' '}
                              =
                              <input
                                type="number"
                                style={{
                                  width: '40px',
                                  textAlign: 'center',
                                  border: 'none',
                                  outline: 'none',
                                }}
                                value={item[2]}
                                disabled
                              />
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="itemMRPperUnit">
                      <Text
                        className="print-text"
                        color="black"
                        weight={700}
                        size="xl"
                      >
                        {itemObj['itemMRPperUnit']}
                      </Text>
                    </td>
                    <td className="itemSellingPricePerUnit">
                      <Text
                        className="print-text"
                        color="black"
                        weight={700}
                        size="xl"
                      >
                        <ItemPrice item={itemObj} index={idx} />
                      </Text>
                    </td>

                    <td className="itemTotal">
                      <Text
                        className="print-text"
                        color="black"
                        weight={700}
                        size="xl"
                      >
                        {itemObj['itemSellingPricePerUnit'] *
                          itemObj['itemQuantityInBill']}
                      </Text>
                    </td>
                    <td className="last-clmn">
                      <Button
                        className="delete-btn"
                        onClick={() => {
                          const newBill = [...bill.billItems];
                          newBill.splice(idx, 1);
                          setBill({ ...bill, billItems: [...newBill] });
                        }}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="bill-total"
              style={{
                backgroundColor: 'black',
                width: 'fit-content',
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              <Text
                color="red"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
                td="underline"
              >
                Bill Total:
                <h2>{bill?.billAmountTotal?.toFixed(2)}</h2>
              </Text>
            </div>
            <div className="discount-line">
              <Text
                className="discount-text"
                size="xl"
                color="green"
                weight={700}
              >
                You saved {bill?.billDiscountTotal?.toFixed(2)} on MRP
              </Text>
            </div>
            <Table>
              <tbody>
                <tr className="final-bill">
                  <td>
                    <Text
                      color="black"
                      size="xl"
                      weight={800}
                      className="final-bill-text print-text"
                    >
                      Total Items: {bill?.totalNumberOfItems?.toFixed(2)}
                    </Text>
                  </td>
                  <td>
                    <Text
                      color="black"
                      size="xl"
                      weight={800}
                      className="final-bill-text print-text"
                    >
                      MRP Total: {bill?.billMRPTotal?.toFixed(2)}
                    </Text>
                  </td>
                </tr>
                <tr className="final-bill">
                  <td>
                    <Text
                      color="black"
                      size="xl"
                      weight={800}
                      className="final-bill-text print-text"
                    >
                      Cash Paid: {bill.cashPay}
                    </Text>
                    <Input
                      style={{ width: '90px' }}
                      type="number"
                      invalid={bill.amountReturn < 0}
                      value={bill.cashPay}
                      onChange={(e) =>
                        setBill((prev) => ({
                          ...prev,
                          cashPay: Number(e.target.value),
                        }))
                      }
                      className="quantity-input"
                      onWheel={(e) => e.target.blur()}
                    />
                  </td>
                  <td>
                    <Text
                      color="black"
                      size="xl"
                      weight={800}
                      className="final-bill-text print-text"
                    >
                      Upi Paid: {bill.upiPay}
                    </Text>
                    <Input
                      style={{ width: '90px' }}
                      type="number"
                      invalid={bill.amountReturn < 0}
                      value={bill.upiPay}
                      onChange={(e) =>
                        setBill((prev) => ({
                          ...prev,
                          upiPay: Number(e.target.value),
                        }))
                      }
                      className="quantity-input"
                      onWheel={(e) => e.target.blur()}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
            <Text
              color="black"
              size="xl"
              weight={800}
              className="final-bill-text print-text"
            >
              Amount Return: {Number(bill.amountReturn || 0)}
            </Text>
          </div>
        </div>
        <div
          style={{
            display: loaderDisplay ? 'flex' : 'none',
            justifyContent: 'center',
            width: '100%',
            padding: '30px',
          }}
        >
          <Loader />
          {bill.billId && (
            <div style={{ width: '50%' }}>
              <Table>
                <thead>
                  <th>
                    <Text weight={700} color="black" size="lg">
                      Created By
                    </Text>
                  </th>
                  <th>
                    <Text weight={700} color="black" size="lg">
                      Updated At
                    </Text>
                  </th>
                </thead>
                <tbody>
                  {bill?.updated?.map((value, key) => {
                    return (
                      <tr
                        key={key}
                        style={{
                          padding: '5px',
                          fontSize: '16px',
                          fontStyle: 'bold',
                        }}
                        className="show-data"
                      >
                        <td>
                          <Text weight={500} color="black" size="md">
                            User
                          </Text>
                        </td>
                        <td>
                          <Text weight={500} color="black" size="md">
                            {new Date(value).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </Text>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
        <div className="print-container">
          <div className="header">
            <h1>PRIYAM STORES</h1>
            <h3>112-C, Indrapuri, Bhopal - 462022</h3>
            <h3>Date: {new Date().toDateString()}</h3>
            <h3>Time: {new Date().toLocaleTimeString()}</h3>
          </div>
          {billBarcode && (
            <Barcode
              options={{
                height: 30,
                width: 1.2,
                displayValue: false,
              }}
              value={billBarcode}
            />
          )}
          <div className="print-table-head">
            <p>Name</p>
            <p>Qty.</p>
            <p>MRP</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div className="print-table-body">
            {bill.billItems.map((item, index) => {
              const itemObj = { ...item, ...item.itemDetail };
              return (
                <div key={index} className="print-table-row">
                  <p>{itemObj['itemName']}</p>
                  <p className="bold-text">{itemObj['itemQuantityInBill']}</p>
                  <p>{itemObj['itemMRPperUnit']}</p>
                  <p>{itemObj['itemSellingPricePerUnit']?.toFixed(2) || 0}</p>
                  <p className="bold-text">
                    {(
                      itemObj['itemSellingPricePerUnit'] *
                      itemObj['itemQuantityInBill']
                    )?.toFixed(2) || 0}
                  </p>
                </div>
              );
            })}
            <div className="bill-amount-row">
              <div>Quantity: {bill?.totalNumberOfItems?.toFixed(2)}</div>
              <div>Bill Total: {bill?.billAmountTotal?.toFixed(2)}</div>
            </div>
            <div className="amount-section">
              <p className="head">Amount Paid by Customer</p>
              <div className="show-amount">
                <div>
                  <p>Cash Paid</p>
                  <p className="final-amount">{bill.cashPay}</p>
                </div>
                <div>
                  <p>UPI Paid</p>
                  <p className="final-amount">{bill.upiPay}</p>
                </div>
                <div>
                  <p>Amount Returned</p>
                  <p className="final-amount">
                    {Number(bill.amountReturn || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="discount-section">
              <p>You saved {bill?.billDiscountTotal?.toFixed(2)} on MRP</p>
            </div>
          </div>
        </div>
      </div>

      {(billPaymentQRCode ||
        qrCodeErrorMsg) && (
          <Modal
            opened={billPaymentQRCode || qrCodeErrorMsg}
            onClose={() => setBillPaymentQRCode('')}
            title="Payment Required"
          >
            <div className="bill-payment-qr-container">
              <div className="bill-pay-timer-container">
                <PaymentExpiryTimer
                  id={billPaymentQRCode}
                  expiryTimeInSec={
                    billPaymentQRCode ? QR_EXPIRY_TIME_IN_SEC : 0
                  }
                  onTimerEnd={() => setDisableRegenerateQR(false)}
                />
                <Button
                  disabled={disableRegenerateQR}
                  className="bill-payment-btn"
                  variant="default"
                  color="teal"
                  onClick={() => !disableRegenerateQR && payBill()}
                >
                  &#x21bb; Regenerate QR
                </Button>
              </div>
              {isQRCodeGenerating ? (
                <Loader size="lg" />
              ) : qrCodeErrorMsg ? (
                qrCodeErrorMsg
              ) : disableRegenerateQR ? (
                <img
                  className="bill-payment-qr"
                  src={billPaymentQRCode}
                  alt="qrcodeimg"
                />
              ) : (
                'QR Expired, please regenerate QR'
              )}
=======
        {searchResults.length > 0 && (
          <Paper withBorder p="xs" style={{ maxHeight: '200px', overflow: 'auto' }}>
            {searchResults.length === 1 ? handleItemClick(searchResults[0]) : searchResults.map((item) => (
>>>>>>> Stashed changes
              <Button
                key={item._id}
                variant="subtle"
                fullWidth
                onClick={() => handleItemClick(item)}
                mb="xs"
              // disabled={item.itemStockQuantity <= 0}
              >
                <div style={{ textAlign: 'left', width: '100%' }}>
                  <Text>{item.itemName}</Text>
                  <Group spacing="xs">
                    <Text size="sm" color="dimmed">
                      MRP: ₹{item.itemMRPperUnit}
                    </Text>
                    <Text size="sm" color={item.itemStockQuantity > 0 ? 'green' : 'red'}>
                      Stock: {item.itemStockQuantity}
                    </Text>
                    {item.slabPricing?.length > 0 && (
                      <Text size="sm" color="blue">Has slab pricing</Text>
                    )}
                  </Group>
                </div>
              </Button>
            ))}
          </Paper>
        )}

        {searchTerm && searchResults.length === 0 && !isLoading && (
          <Text color="dimmed" align="center" size="sm">
            No items found
          </Text>
        )}
      </Paper>
    </div>
  );
};

// ============= Main Component =============
const NewBillPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    billState,
    updateBillItems,
    updateCustomerInfo,
    updatePayment,
    resetBillState,
  } = useBillState(); // Assume this hook is imported

  const handleRemoveItem = (itemId) => {
    const updatedItems = billState.billItems.filter(
      (item) => item.itemDetail._id !== itemId
    );
    updateBillItems(updatedItems);
  };

  const saveBillToDatabase = async (billData) => {
    try {
      const response = await saveOrCacheBillAPI(billData);

      if (!response || response.isError) {
        console.error('Error saving bill to database:', response?.error);
        // Show error notification
        return;
      }

      // Remove the bill from localStorage once saved successfully
      localStorage.removeItem(`bill-${billData.billId}`);
      console.log('Bill saved successfully and removed from localStorage');
    } catch (error) {
      console.error('Error saving bill to database:', error);
      // Show error notification
    }
  };

  const handlePaymentSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate payment
      const totalPayment = billState.cashPay + billState.upiPay;
      if (totalPayment < billState.billAmountTotal) {
        throw new Error('Payment amount is less than bill amount');
      }

      // Save bill to localStorage
      const billData = { ...billState };
      localStorage.setItem(`bill-${billData.billId}`, JSON.stringify(billData));
      // Save bill to database
      saveBillToDatabase(billData);
      window.print()

      // Clear bill state for the new bill
      resetBillState();
    } catch (error) {
      console.error('Error submitting bill:', error);
      // Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="new-bill-page">
      <div className="shop-details">
        <h2>Shop Name</h2>
        <p>Shop Address, City, State</p>
        <p>Phone: 123-456-7890</p>
      </div>

      {/* Savings Section */}
      <p className="savings">
        You Saved: ₹
        {(billState.billMRPTotal - billState.billAmountTotal).toFixed(2)} on your purchase!
      </p>
      <Container size="xl" py="md">
        <Title order={2} mb="lg">
          New Bill
        </Title>
        <Grid>
          <Grid.Col span={8}>
            <ItemSearch
              onItemSelect={(item) => {
                updateBillItems([item, ...billState.billItems]);
              }}
            />
            <BillItems
              items={billState.billItems}
              onRemoveItem={handleRemoveItem}
              bill={billState}
              setBill={(newBill) => {
                updateBillItems(newBill.billItems);
              }}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <PaymentSection
              cashPay={billState.cashPay}
              upiPay={billState.upiPay}
              amountReturn={billState.amountReturn}
              totalAmount={billState.billAmountTotal}
              onPaymentChange={updatePayment}
              onSubmit={handlePaymentSubmit}
              isLoading={isSubmitting}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};



// const QuantBtn = ({ itemObj, idx, bill, setBill }) => {
//   const handleQuantityChange = (e) => {
//     if (e.target.value < 0) return;
//     const billItemsCopy = [...bill.billItems];
//     billItemsCopy[idx].itemQuantityInBill = Number(
//       e.target.value
//     );
//     billItemsCopy[idx].itemQuantityInBill = Number(e.target.value);
//     setBill({ billItems: [...billItemsCopy] });
//   };
//   return (
//     <>
//       <Input
//         style={{ width: '90px' }}
//         className="quantity-input"
//         type="number"
//         value={itemObj['itemQuantityInBill']}
//         onChange={handleQuantityChange}
//         onWheel={(e) => e.target.blur()}
//       />
//     </>
//   );
// };

const calculateAmountReturn = (billTotal, payments) => {
  const totalPayment = (Number(payments.cashPay) || 0) + (Number(payments.upiPay) || 0);
  const returnAmount = totalPayment - billTotal;
  return returnAmount > 0 ? returnAmount : 0;
};

const calculateMRPTotal = (items) => {
  console.log({ items });

  return items.reduce((total, item) => {
    const itemMRP = Number(item.itemDetail.itemMRPperUnit) || 0;
    const quantity = Number(item.itemQuantityInBill) || 0;
    return total + (itemMRP * quantity);
  }, 0);
};

const calculateAmountTotal = (items) => {
  return items.reduce((total, item) => {
    const price = Number(item.itemDetail.itemSellingPricePerUnit) || 0;
    const quantity = Number(item.itemQuantityInBill) || 0;
    return total + (price * quantity);
  }, 0);
};

const calculateTotalItems = (items) => {
  return items.reduce((total, item) => {
    return total + (Number(item.itemQuantityInBill) || 0);
  }, 0);
};

const calculateBillProfit = (items) => {
  return items.reduce((total, item) => {
    const mrp = Number(item.itemDetail.itemMRPperUnit) || 0;
    const price = Number(item.itemDetail.itemSellingPricePerUnit) || 0;
    const quantity = Number(item.itemQuantityInBill) || 0;
    const itemProfit = (mrp - price) * quantity;
    return total + (itemProfit > 0 ? itemProfit : 0);
  }, 0);
};

// ============= Exports =============
export default NewBillPage;
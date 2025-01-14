import { Button, Input, Loader, Table, Text, TextInput } from '@mantine/core';
import { Modal } from '@mantine/core';
import { useContext, useEffect, useRef, useState } from 'react';
import BillNarrator from '../components/BillNarrator';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { AppStateContext } from '../AppState/appState.context';
import { v4 as uuidv4 } from 'uuid';
import { QuantBtn } from './Billing';
import Barcode from 'react-jsbarcode';
import useSocket from 'src/hooks/useSocket';
import { socketEvents } from 'src/utils/constants/socketEvents';
import { PaymentExpiryTimer } from 'src/components/PaymentExpiryTimer';

const getBillInitialState = () => ({
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
  billId: `${uuidv4()}-${Date.now()}`,
})

const INPUT_INITIAL_STATE = {
  itemBarcode: '',
  itemName: '',
  itemMRPperUnit: '',
  itemQuantityInBill: 1,
  itemSellingPricePerUnit: '',
};

const refreshPage = (setBill) => {
  let answer = window.confirm('Do you want to refresh page?');
  if (answer) {
    setBill(getBillInitialState())
  }
};

const NewBillPage = ({ billID = '' }) => {
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
      const response = await genericAxios({
        url: API_PATHS.BILLING.GET_USER_DETAILS,
        method: API_METHODS.GET,
      });
      if (response.error) return;
      setUserDataProfile(response.data.message);
    } catch (error) {
      console.error(error.message);
    }
  };

  //   fetching items

  const getAllLeanItems = async () => {
    try {
      setLoaderDisplay(true);
      const response = await genericAxios({
        url: API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING,
        method: API_METHODS.GET,
      });

      if (response.error) return;
      if (response?.data?.message) {
        setItemBarCodesList(response?.data?.message?.itemBarCodesList);
        setItemsByBarcode(response?.data?.message?.itemsBarCodeMap);
        setItemsByName(response?.data?.message?.itemsNameMap);
        setItemNamesList(response?.data?.message?.itemNamesList);
        setTotalItems(response?.data?.message?.totalItemsCount);
      }
    } catch (error) {
      console.error(error.message);
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
      const addBillResponse = await genericAxios({
        ...billObject,
        billId: newBillId,
        headers: {
          Cookie: '',
        },
      });
      if (addBillResponse.error) {
        setApiLoading(false);
        throw Error();
      }
      setBillBarcode(addBillResponse.data.billBarcode);
      localStorage.removeItem(`newBill-${newBillId}`);
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
    const createApi = {
      url: API_PATHS.BILLING.SAVE_OR_CACHE_BILL,
      method: API_METHODS.POST,
      data: { ...bill, billId: newBillId },
    };
    // const objectOfInterest = billID ? editApi : createApi;

    localStorage.setItem(
      `newBill-${newBillId}`,
      JSON.stringify({
        newBillId,
        createdAt: new Date().toLocaleString(),
        ...createApi,
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
    const response = await genericAxios({
      url: API_PATHS.RAZORPAY.QR,
      method: API_METHODS.POST,
      data: {
        amountInRs: bill.upiPay,
        id: billId,
      },
    });
    const billPaymentQR = response?.data?.qrData?.image_url || '';
    if (response.error) {
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

  useEffect(() => {
    getAllLeanItems();
    getUserData();
  }, []);

  // To save bill items in billItem Reducer
  useEffect(() => {
    dispatch({ type: 'BILL_ITEMS_LIST', payload: bill });
    // eslint-disable-next-line
  }, [bill]);

  useEffect(() => {
    billBarcode && window.print();
    setBill(getBillInitialState());
  }, [billBarcode]);

  const setBillApiCountToLocalStorage = () => {
    const todayKey = new Date().toLocaleDateString();

    const currentCount = parseInt(localStorage.getItem(todayKey));

    if (isNaN(currentCount)) {
      localStorage.setItem(todayKey, 1);
    } else {
      const updatedCount = currentCount + 1;
      localStorage.setItem(todayKey, updatedCount);
    }
  };

  return (
    <>
      <div>
        <h1>Billing Page</h1>
        <div className="billing-container">
          <p style={{ marginBottom: '20px', fontWeight: '700' }}>
            Total Items : {totalItems}
          </p>

          <div className="header">
            <h1>PRIYAM STORES</h1>
            <h3>112-C, Indrapuri, Bhopal - 462022</h3>
            <h3>Date: {new Date().toDateString()}</h3>
            <h3>Time: {new Date().toLocaleTimeString()}</h3>
          </div>

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
          {billID && (
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
              <Button
                className="bill-payment-btn"
                color="teal"
                onClick={() => addNewBill(bill)}
              >
                Save Bill
              </Button>
            </div>
          </Modal>
        )}
    </>
  );
};

export default NewBillPage;

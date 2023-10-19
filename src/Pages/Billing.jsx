import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, Loader, Table, Text, TextInput } from '@mantine/core';
import { AppStateContext } from '../AppState/appState.context';
import BillNarrator from '../components/BillNarrator';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { v4 as uuidv4 } from 'uuid';

const itemsByBarcode = {};
const itemsByName = {};
const BILL_INITIAL_STATE = {
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
};

const INPUT_INITIAL_STATE = {
  itemBarcode: '',
  itemName: '',
  itemMRPperUnit: '',
  itemQuantityInBill: 1,
  itemSellingPricePerUnit: '',
};

const refreshPage = (setBill, BILL_INITIAL_STATE) => {
  let answer = window.confirm('Do you want to refresh page?');
  if (answer) {
    setBill(BILL_INITIAL_STATE);
  }
};

const initializeBillState = (billItems, BILL_INITIAL_STATE, setBill) => {
  if (billItems.length === 0) {
    setBill(BILL_INITIAL_STATE);
  } else {
    setBill(billItems);
  }
};

const initializeBillForEdit = async (setBill, billID) => {
  const editBill = await genericAxios({
    url: `${API_PATHS.BILLING.GET_EDIT_BILL}/${billID}`,
    method: API_METHODS.GET,
    headers: {
      Cookie: '',
    },
  });
  if (editBill.error) return;
  if (editBill?.data?.message) {
    const { items = [], ...billObject } = editBill?.data?.message;
    const billObjectWithBillItems = { ...billObject, billItems: items };
    setBill(billObjectWithBillItems);
  }

  // setLoaderDisplay(false);
};

const createInitialObjectsForBilling = (
  itemsList,
  itemsByBarcode,
  itemsByName
) => {
  itemsList.forEach((obj) => {
    obj['itemDiscountPerUnit'] =
      obj['itemMRPperUnit'] - obj['itemSellingPricePerUnit'];
    obj['itemQuantityInBill'] = 1;
    if (obj['itemBarcode']) {
      itemsByBarcode[obj['itemBarcode']] = { ...obj };
    }
    if (obj['itemName']) {
      itemsByName[obj['itemName']] = { ...obj };
    }
  });
};

const addItemToBillByBarcode = (
  itemsByBarcode,
  inputValue,
  setInputValue,
  bill,
  setBill,
  INPUT_INITIAL_STATE,
  barRef
) => {
  if (itemsByBarcode[inputValue.itemBarcode]) {
    let index;
    const itemDetail = { ...itemsByBarcode[inputValue.itemBarcode] };
    bill.billItems.map((billItem) => {
      index = bill.billItems.findIndex((a) => a._id === billItem._id);
      if (
        itemsByBarcode[inputValue.itemBarcode].itemBarcode ===
        billItem.itemDetail.itemBarcode
      ) {
        const updatedItem = {
          ...billItem,
          itemDetail: {
            ...billItem.itemDetail,
            itemQuantityInBill: billItem.itemQuantityInBill + 1,
          },
          itemQuantityInBill: billItem.itemQuantityInBill + 1,
        };
        bill.billItems.splice(index, 1);
        setBill((prev) => ({
          totalNumberOfItems: prev.totalNumberOfItems + 1,
          ...prev,
          billItems: [updatedItem, ...prev.billItems],
        }));
      } else if (index === bill.totalNumberOfUniqueItems - 1) {
        setBill((prev) => ({
          ...prev,
          billItems: [
            {
              itemDetail,
              itemQuantityInBill: itemDetail.itemQuantityInBill,
              itemMRPtotal: Number(itemDetail.itemMRPperUnit),
              itemDiscountTotal: itemDetail.itemDiscountPerUnit,
              itemSellingPriceTotal: Number(itemDetail.itemSellingPricePerUnit),
              _id: itemDetail._id,
            },
            ...prev.billItems,
          ],
        }));
      }
      return <></>;
    });
    if (bill.totalNumberOfItems === 0) {
      setBill((prev) => ({
        ...prev,
        billItems: [
          {
            itemDetail,
            itemQuantityInBill: itemDetail.itemQuantityInBill,
            itemMRPtotal: Number(itemDetail.itemMRPperUnit),
            itemDiscountTotal: itemDetail.itemDiscountPerUnit,
            itemSellingPriceTotal: Number(itemDetail.itemSellingPricePerUnit),
            _id: itemDetail._id,
          },
          ...prev.billItems,
        ],
      }));
    }
    setInputValue(INPUT_INITIAL_STATE);
  }
  barRef.current.focus();
  // eslint-disable-next-line
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
    mrpTotal += item.itemDetail['itemMRPperUnit'] * item['itemQuantityInBill'];
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

const updateReturnAmount = (setBill, bill) => {
  setBill((prev) => ({
    ...prev,
    amountReturn: bill?.cashPay + bill?.upiPay - bill?.billAmountTotal,
  }));
};

function createBill(newBillId, setApiLoading) {
  const { newBillId: billUuid, ...billObject } = JSON.parse(
    localStorage.getItem(`newBill-${newBillId}`)
  );
  (async function () {
    try {
      const addBillResponse = await genericAxios({
        ...billObject,
        headers: {
          Cookie: '',
        },
      });
      if (addBillResponse.error) {
        setApiLoading(false);
        throw Error();
      }
      localStorage.removeItem(`newBill-${newBillId}`);
    } catch (error) {
      throw console.error({ error });
    }
  })();
}

async function addNewBill(
  setApiLoading,
  bill,
  setBill,
  BILL_INITIAL_STATE,
  itemsReducer,
  initialItemList,
  billID
) {
  setApiLoading(true);
  let updateBill = {
    ...bill,
    [bill.updated]: bill?.updated?.push(Date.now()),
  };
  setBill(updateBill);
  const editApi = {
    url: API_PATHS.BILLING.PUT_EDIT_BILL,
    method: API_METHODS.PUT,
    data: { id: billID, itemWithChanges: { ...bill } },
  };
  const createApi = {
    url: API_PATHS.BILLING.POST_NEW_BILL,
    method: API_METHODS.POST,
    data: { ...bill },
  };
  const objectOfInterest = billID ? editApi : createApi;

  const newBillId = uuidv4();

  localStorage.setItem(
    `newBill-${newBillId}`,
    JSON.stringify({
      newBillId,
      createdAt: new Date().toLocaleString(),
      ...objectOfInterest,
    })
  );
  createBill(newBillId, setApiLoading);

  window.print();
  setApiLoading(false);
  setBill(BILL_INITIAL_STATE);
  itemsReducer({ type: 'UPDATE_ITEMS_LIST', payload: [...initialItemList] });
}

function handleItemInputChange(event, setInputValue) {
  const { name, value } = event.target;
  setInputValue((prevState) => ({ ...prevState, [name]: value }));
}

// function addItemToBill(
//   event,
//   inputValue,
//   itemsByName,
//   setBill,
//   setInputValue,
//   INPUT_INITIAL_STATE
// ) {
//   event.preventDefault();
//   const itemDetail = {
//     ...inputValue,
//     itemDiscountPerUnit: inputValue.itemMRPperUnit
//       ? inputValue.itemMRPperUnit - inputValue.itemSellingPricePerUnit
//       : 0,
//   };

//   itemsByName[inputValue.itemName] = { ...itemDetail };
//   setBill((prev) => ({
//     ...prev,
//     billItems: [
//       {
//         itemDetail,
//         itemQuantityInBill: itemDetail.itemQuantityInBill,
//         itemMRPtotal: Number(itemDetail.itemMRPperUnit),
//         itemDiscountTotal: itemDetail.itemDiscountPerUnit,
//         itemSellingPriceTotal: Number(itemDetail.itemSellingPricePerUnit),
//       },
//       ...prev.billItems,
//     ],
//   }));
//   setInputValue(INPUT_INITIAL_STATE);
// }

function handleItemNameFilter(
  event,
  setInputValue,
  itemsList,
  setFilteredData
) {
  setInputValue((prev) => ({ ...prev, itemName: event.target.value }));
  const searchWord = event.target.value;
  const filteredData = itemsList.filter((value) => {
    return value.itemName.toLowerCase().includes(searchWord.toLowerCase());
  });
  setFilteredData(filteredData);
}
function findNameOrNumber(string, value) {
  for (let i = 0; i < value.toString().length; i++) {
    if (string.toString()[i] !== value[i]) {
      return false;
    }
  }
  return true;
}

const Billing = ({ billID = '', loaderDisplay }) => {
  const [inputValue, setInputValue] = useState(INPUT_INITIAL_STATE);
  const [filteredData, setFilteredData] = useState([]);
  const [bill, setBill] = useState(BILL_INITIAL_STATE);
  const [apiLoading, setApiLoading] = useState(false);
  const barRef = useRef('');
  const { itemsStateAndDispatch, billItemsStateAndDispatch } =
    useContext(AppStateContext);
  const [itemsList, itemsReducer] = itemsStateAndDispatch;
  const [billItems, dispatch] = billItemsStateAndDispatch;
  const initialItemList = [...itemsList];
  const [phoneError, setPhoneError] = useState('');
  const [userProfileData, setUserDataProfile] = useState([]);
  const [filterUserProfile, setFilterUserProfile] = useState([]);
  const [showProfileData, setShowProfileData] = useState(false);
  // const [loaderDisplay, setLoaderDisplay] = loaderState;
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
  useEffect(() => getUserData(), []);

  const handleUserSearch = (e) => {
    setShowProfileData(true);
    const users = userProfileData.filter((data) => {
      const str =
        e.target.dataset.name === 'name' ? data.customerName : data._id;
      return findNameOrNumber(str, e.target.value);
    });
    setFilterUserProfile(users);
  };
  // To refresh page

  // To save bill items in billItem Reducer
  useEffect(() => {
    dispatch({ type: 'BILL_ITEMS_LIST', payload: bill });
    // eslint-disable-next-line
  }, [bill]);

  // To get items through billItems Reducer
  useEffect(
    () => initializeBillState(billItems, BILL_INITIAL_STATE, setBill),
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    if (billID) {
      initializeBillForEdit(setBill, billID);
    }
  }, [billID]);

  useEffect(
    () =>
      createInitialObjectsForBilling(itemsList, itemsByBarcode, itemsByName),
    [itemsList]
  );

  useEffect(
    () =>
      addItemToBillByBarcode(
        itemsByBarcode,
        inputValue,
        setInputValue,
        bill,
        setBill,
        INPUT_INITIAL_STATE,
        barRef
      ),
    // eslint-disable-next-line
    [inputValue.itemBarcode, bill.billItems.length]
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

  // To show prices according to slabs if exists
  const ItemPrice = ({ item, index }) => {
    let quantity = item['itemQuantityInBill'];
    let slabs = item['slabPricing'];
    let price = item['itemSellingPricePerUnit'];

    // if slabs exists
    if (slabs.length && quantity) {
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

  return (
    <>
      <div className="billing-container">
        <p style={{ marginBottom: '20px' }}>Total Items : {itemsList.length}</p>
        <div className="header">
          <h1>PRIYAM STORES</h1>
          <h3>112-C, Indrapuri, Bhopal - 462022</h3>
          <h3>Date: {new Date().toDateString()}</h3>
          <h3>Time: {new Date().toLocaleTimeString()}</h3>
        </div>
        <div className="bill-btns">
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
            onClick={() => refreshPage(setBill, BILL_INITIAL_STATE)}
          >
            Refresh
          </Button>
          <Button
            sx={{ marginRight: '1rem' }}
            disabled={!bill.billItems.length || bill.amountReturn < 0}
            className="print-btn"
            onClick={() =>
              addNewBill(
                setApiLoading,
                bill,
                setBill,
                BILL_INITIAL_STATE,
                itemsReducer,
                initialItemList,
                billID
              )
            }
            loading={apiLoading}
          >
            Save and Print
          </Button>
          <BillNarrator billTotal={bill.billAmountTotal} />
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
              <tr>
                <td>
                  <Text color="black" weight={700}>
                    {bill.billItems.length + 1}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={700}>
                    <Input
                      className="bill-input"
                      ref={barRef}
                      type="number"
                      name="itemBarcode"
                      value={inputValue.itemBarcode}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => handleItemInputChange(e, setInputValue)}
                      autoComplete="off"
                    />
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={700}>
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
                          itemsList,
                          setFilteredData
                        );
                        handleItemInputChange(e, setInputValue);
                      }}
                    />
                  </Text>
                  {inputValue.itemName && Boolean(filteredData.length) && (
                    <div
                      onClick={(e) => {
                        if (itemsByName[e.target.innerText]) {
                          let index;
                          let itemDetail = itemsByName[e.target.innerText];
                          bill.billItems.map((billItem) => {
                            index = bill.billItems.findIndex(
                              (a) => a._id === billItem._id
                            );
                            if (
                              itemDetail.itemName ===
                              billItem.itemDetail.itemName
                            ) {
                              const updatedItem = {
                                ...billItem,
                                itemDetail: {
                                  ...billItem.itemDetail,
                                  itemQuantityInBill:
                                    billItem.itemQuantityInBill + 1,
                                },
                                itemQuantityInBill:
                                  billItem.itemQuantityInBill + 1,
                              };
                              bill.billItems.splice(index, 1);
                              setBill((prev) => ({
                                totalNumberOfItems: prev.totalNumberOfItems + 1,
                                ...prev,
                                billItems: [updatedItem, ...prev.billItems],
                              }));
                            } else if (
                              index ===
                              bill.totalNumberOfUniqueItems - 1
                            ) {
                              setBill((prev) => ({
                                ...prev,
                                billItems: [
                                  {
                                    itemDetail,
                                    itemQuantityInBill:
                                      itemDetail.itemQuantityInBill,
                                    itemMRPtotal: Number(
                                      itemDetail.itemMRPperUnit
                                    ),
                                    itemDiscountTotal:
                                      itemDetail.itemDiscountPerUnit,
                                    itemSellingPriceTotal: Number(
                                      itemDetail.itemSellingPricePerUnit
                                    ),
                                    _id: itemDetail._id,
                                  },
                                  ...prev.billItems,
                                ],
                              }));
                            }
                            return <></>;
                          });
                          if (bill.totalNumberOfItems === 0) {
                            setBill((prev) => ({
                              ...prev,
                              billItems: [
                                {
                                  itemDetail,
                                  itemQuantityInBill:
                                    itemDetail.itemQuantityInBill,
                                  itemMRPtotal: Number(
                                    itemDetail.itemMRPperUnit
                                  ),
                                  itemDiscountTotal:
                                    itemDetail.itemDiscountPerUnit,
                                  itemSellingPriceTotal: Number(
                                    itemDetail.itemSellingPricePerUnit
                                  ),
                                  _id: itemDetail._id,
                                },
                                ...prev.billItems,
                              ],
                            }));
                          }
                          setInputValue(INPUT_INITIAL_STATE);
                          setFilteredData([]);
                        }
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
                          {filteredData.map((value, key) => {
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
                                <td>{value.itemBarcode}</td>
                                <td>{value.itemName}</td>
                                <td>{value.itemMRPperUnit}</td>
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
                  {/* <td className="empty-slots"></td>
                <td className="empty-slots"></td>
                <td className="empty-slots"></td> */}
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
                  {/* <td>
                  <Text
                    color="black"
                    size="xl"
                    weight={800}
                    className="final-bill-text print-text"
                  >
                    Bill Total: {bill?.billAmountTotal?.toFixed(2)}
                  </Text>
                </td> */}
                </tr>
                <tr className="final-bill">
                  {/* <td className="empty-slots"></td>
                <td className="empty-slots"></td>
                <td className="empty-slots"></td> */}
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
                  {/* <td>
                    <Text
                      color="black"
                      size="xl"
                      weight={800}
                      className="final-bill-text print-text"
                    >
                      Amount Return: {Number(bill.amountReturn || 0)}
                    </Text>
                  </td> */}
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
        {/* <div className="discount-line">
          <Text className="discount-text" size="xl" color="black" weight={700}>
            You saved {bill?.billDiscountTotal?.toFixed(2)} on MRP
          </Text>
        </div> */}
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
      </div>
      <div className="print-container">
        <div className="header">
          <h1>PRIYAM STORES</h1>
          <h3>112-C, Indrapuri, Bhopal - 462022</h3>
          <h3>Date: {new Date().toDateString()}</h3>
          <h3>Time: {new Date().toLocaleTimeString()}</h3>
        </div>
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
                <p className="final-amount">{Number(bill.amountReturn || 0)}</p>
              </div>
            </div>
          </div>
          <div className="discount-section">
            <p>You saved {bill?.billDiscountTotal?.toFixed(2)} on MRP</p>
          </div>
        </div>
      </div>
    </>
  );
};

const QuantBtn = ({ itemObj, idx, bill, setBill }) => {
  const handleQuantityChange = (e) => {
    if (e.target.value < 0) return;
    const billItemsCopy = [...bill.billItems];
    billItemsCopy[idx].itemDetail['itemQuantityInBill'] = Number(
      e.target.value
    );
    billItemsCopy[idx]['itemQuantityInBill'] = Number(e.target.value);
    setBill((prev) => ({ ...prev, billItems: [...billItemsCopy] }));
  };
  return (
    <>
      <Text
        color="black"
        size="xl"
        weight={800}
        className="quantity-text print-text"
      >
        {itemObj['itemQuantityInBill'] || 0}
      </Text>
      <Input
        style={{ width: '90px' }}
        className="quantity-input"
        type="number"
        value={itemObj['itemQuantityInBill']}
        onChange={handleQuantityChange}
        onWheel={(e) => e.target.blur()}
      />
    </>
  );
};

export default Billing;

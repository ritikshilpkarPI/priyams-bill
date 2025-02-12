import { Button, Input, Loader, Table, Text, TextInput } from '@mantine/core';
import { useContext, useEffect, useRef, useState } from 'react';
import BillNarrator from '../components/BillNarrator';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { AppStateContext } from '../AppState/appState.context';
import { ReactBarcode } from 'react-jsbarcode';
import { v4 as uuidv4 } from 'uuid';
import { QuantBtn } from './Billing';

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
  returnedItems: [],
  refundAmount: 0,
  totalRefundAmount: 0,
};

const INPUT_INITIAL_STATE = {
  itemBarcode: '',
  itemName: '',
  itemMRPperUnit: '',
  itemQuantityInBill: 1,
  itemSellingPricePerUnit: '',
};

const ReturnBill = () => {
  const [slug, setSlug] = useState('');
  const [existingBill, setExistingBill] = useState({});
  const [refundAmount, setRefundAmount] = useState(0);
  const [returningItems, setReturningItem] = useState({});
  const [itemsByName, setItemsByName] = useState([]);
  const [itemsByBarcode, setItemsByBarcode] = useState();
  const [itemBarCodesList, setItemBarCodesList] = useState([]);
  const [filterBarcodeData, setFilterBarcodeData] = useState([]);
  const [itemNamesList, setItemNamesList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [bill, setBill] = useState(BILL_INITIAL_STATE);
  const [showReturnItems, setShowReturnItems] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const barRef = useRef('');
  const [inputValue, setInputValue] = useState(INPUT_INITIAL_STATE);
  const [filteredData, setFilteredData] = useState([]);
  const { returnBillItemsStateAndDispatch } = useContext(AppStateContext);
  const [billItems, dispatch] = returnBillItemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(false);
  const [isBillLoading, setBillLoading] = useState(false);
  const [billBarcode, setBillBarcode] = useState('');

  const getBillRequest = async () => {
    setBillLoading(true);
    const editBill = await genericAxios({
      url: `${API_PATHS.BILLING.GET_BILL}/${slug}`,
      method: API_METHODS.GET,
    });
    setBillLoading(false);
    if (editBill.error) return;
    if (editBill?.data?.message) {
      setExistingBill(editBill?.data?.message);
    }
  };

  const refreshPage = (setBill, BILL_INITIAL_STATE) => {
    let answer = window.confirm('Do you want to refresh page?');
    if (answer) {
      setBill(BILL_INITIAL_STATE);
    }
  };

  function handleItemNameFilter(event, setInputValue, itemsList, setData, key) {
    setInputValue((prev) => ({ ...prev, [key]: event.target.value }));
    const searchWord = event.target.value;
    const filteredData = itemsList?.filter((value) => {
      const elem = String(value);
      return elem?.toLowerCase()?.includes(searchWord?.toLowerCase());
    });
    setData(filteredData);
  }

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

  // handling the input change
  function handleItemInputChange(event, setInputValue) {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  }

  const initializeBillState = (billItems, BILL_INITIAL_STATE, setBill) => {
    if (billItems.length === 0) {
      setBill(BILL_INITIAL_STATE);
    } else {
      setBill(billItems);
    }
  };

  // creating bill
  async function createBill(newBillId, setApiLoading) {
    const { newBillId: billUuid, ...billObject } = JSON.parse(
      localStorage.getItem(`newReturnBill-${newBillId}`)
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
      localStorage.removeItem(`newReturnBill-${newBillId}`);
      setBillBarcode(addBillResponse.data.message._id);
    } catch (error) {
      throw console.error({ error });
    }
  }

  //    adding new bill
  async function addNewBill(setApiLoading, bill, setBill, BILL_INITIAL_STATE) {
    const newBillId = `${uuidv4()}-${Date.now()}`;
    setApiLoading(true);
    let updateBill = {
      ...bill,
      [bill.updated]: bill?.updated?.push(Date.now()),
    };
    setBill(updateBill);
    const createApi = {
      url: API_PATHS.BILLING.POST_RETURN_BILLS,
      method: API_METHODS.POST,
      data: {
        ...bill,
        billId: newBillId,
        id: existingBill._id,
        refundAmount,
      },
    };

    localStorage.setItem(
      `newReturnBill-${newBillId}`,
      JSON.stringify({
        newBillId,
        createdAt: new Date().toLocaleString(),
        ...createApi,
      })
    );
    await createBill(newBillId, setApiLoading);

    setApiLoading(false);
    setBill(BILL_INITIAL_STATE);
    setExistingBill({});
    setRefundAmount(0);
    setReturningItem({});
    setShowReturnItems(false);
    setBillBarcode('');
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

  const onItemAddToBill = ({ e, itemData, key = '', quantity = 1 }) => {
    if (itemData[Boolean(key) ? key : e.target.innerText]) {
      // let index;
      let itemDetail;
      if (Boolean(key)) {
        itemDetail = itemData[key]?.[0];
      } else {
        itemDetail = itemData[e.target.innerText];
      }

      bill.billItems.map((billItem, index) => {
        if (itemDetail.itemName === billItem.itemDetail.itemName) {
          const updatedItem = {
            ...billItem,
            itemDetail: {
              ...billItem.itemDetail,
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
                itemMRPtotal: Number(itemDetail.itemMRPperUnit),
                itemDiscountTotal: itemDetail.itemDiscountPerUnit,
                itemSellingPriceTotal: Number(
                  itemDetail.itemSellingPricePerUnit
                ),
                _id: itemDetail._id,
                itemQuantityInBill: quantity,
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
              itemMRPtotal: Number(itemDetail.itemMRPperUnit),
              itemDiscountTotal:
                itemDetail.itemMRPperUnit - itemDetail.itemSellingPricePerUnit,
              itemSellingPriceTotal: Number(itemDetail.itemSellingPricePerUnit),
              _id: itemDetail._id,
              itemQuantityInBill: quantity,
            },
            ...prev.billItems,
          ],
        }));
      }
      setInputValue(INPUT_INITIAL_STATE);
      if (Boolean(key)) {
        setFilterBarcodeData([]);
      } else {
        setFilteredData([]);
      }
    }
  };

  const updateBillValuesOnItemChange = (bill, setBill) => {
    let totalSum = 0;
    let mrpTotal = 0;
    let savedAmount = 0;
    let profitAmount = 0;
    let numOfItems = 0;
    let refund = 0;
    let totalRefundAmount = 0;

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

    const returnedItems = Object.values(returningItems);
    returnedItems?.forEach(
      ({ itemSellingPriceTotal }) => (refund += itemSellingPriceTotal)
    );
    setRefundAmount(refund);

    totalRefundAmount = refund - Math.ceil(totalSum);
    if (totalRefundAmount < 0) {
      totalRefundAmount = 0;
    }

    setBill((prev) => ({
      ...prev,
      totalNumberOfUniqueItems: bill.billItems.length,
      totalNumberOfItems: numOfItems,
      billMRPTotal: mrpTotal,
      billAmountTotal: Math.ceil(totalSum),
      billDiscountTotal: savedAmount,
      totalBillProfit: profitAmount,
      returnedItems,
      refundAmount: refund,
      totalRefundAmount,
    }));
  };

  // updating bill amount
  const updateReturnAmount = (setBill, bill) => {
    let amountReturn =
      bill?.cashPay + bill?.upiPay - bill?.billAmountTotal + refundAmount;
    if (
      bill?.totalRefundAmount > 0 &&
      bill?.totalRefundAmount >= amountReturn
    ) {
      amountReturn = 0;
    }
    setBill((prev) => ({
      ...prev,
      amountReturn,
    }));
  };

  useEffect(
    () => initializeBillState(billItems, BILL_INITIAL_STATE, setBill),
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    billBarcode && window.print();
  }, [billBarcode]);

  useEffect(
    () => updateBillValuesOnItemChange(bill, setBill),
    // eslint-disable-next-line
    [bill.billItems, returningItems]
  );

  useEffect(
    () => updateReturnAmount(setBill, bill),
    // eslint-disable-next-line
    [bill.cashPay, bill.upiPay, bill.billAmountTotal, refundAmount]
  );

  useEffect(() => {
    getAllLeanItems();
  }, []);

  useEffect(() => {
    dispatch({ type: 'BILL_ITEMS_LIST', payload: bill });
    // eslint-disable-next-line
  }, [bill]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: '5px',
          fontSize: '20px',
          padding: '20px',
        }}
      >
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={{ width: '250px' }}
        />
        <Button disabled={!slug} onClick={getBillRequest}>Get Bill</Button>
      </div>
      <div style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              fontSize: '20px',
              alignItems: 'flex-start',
            }}
          >
            <div>Customer Name: {existingBill?.customerName ?? ''}</div>
            <div>Customer Phone: {existingBill?.customerPhone ?? ''}</div>
            <div>
              Billing Time:{' '}
              {existingBill?.createdAt
                ? new Date(existingBill?.createdAt).toLocaleString()
                : ''}
            </div>
            <div>Available Credits: {existingBill?.availableCredits ?? ''}</div>
          </div>
        </div>
        <div style={{ width: 'fit-content' }}>
          <Button
            disabled={Object.keys(returningItems).length <= 0}
            onClick={() => setShowReturnItems(!showReturnItems)}
          >
            {showReturnItems ? 'Reset' : 'Return'}
          </Button>
        </div>

        {Boolean(existingBill?.items?.length) && !showReturnItems && (
          <Table
            className="barcode-suggestion-list"
            style={{
              backgroundColor: 'white',
              border: '1px solid #d3c7c7',
              margin: '20px 0',
            }}
          >
            <tbody>
              <tr>
                <td style={{ textAlign: 'start' }}>Return or Exchange</td>
                <td style={{ textAlign: 'center' }}>Barcode</td>
                <td style={{ textAlign: 'center' }}>Name</td>
                <td style={{ textAlign: 'center' }}>Item Per Unit Quantity</td>
                <td style={{ textAlign: 'center' }}>Quantity Unit Name</td>
                <td style={{ textAlign: 'center' }}>Selling Price Per Unit</td>
                <td style={{ textAlign: 'center' }}>Quantity In Bill</td>
                <td style={{ textAlign: 'center' }}>Selling Price Total</td>
              </tr>
              {existingBill?.items?.map((item, idx) => {
                const {
                  itemDetail,
                  itemQuantityInBill,
                  itemSellingPriceTotal,
                } = item;
                const {
                  _id,
                  itemName,
                  itemBarcode,
                  itemPerUnitQuantity,
                  quantityUnitName,
                  itemSellingPricePerUnit,
                } = itemDetail;
                return (
                  <tr
                    key={`tr-key-${idx}`}
                    style={{
                      padding: '5px',
                      fontSize: '16px',
                      fontStyle: 'bold',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (!returningItems[_id]) {
                        setReturningItem((state) => ({
                          ...state,
                          [_id]: item,
                        }));
                      } else {
                        setReturningItem((state) => {
                          const newState = {};
                          Object.entries(state).forEach(([key, val]) => {
                            if (_id !== key) newState[key] = val;
                          });
                          return newState;
                        });
                      }
                    }}
                  >
                    <td style={{ textAlign: 'start' }}>
                      <input
                        type="checkbox"
                        style={{
                          width: '25px',
                          height: '25px',
                          cursor: 'pointer',
                        }}
                        checked={Boolean(returningItems[_id])}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>{itemBarcode}</td>
                    <td style={{ textAlign: 'center' }}>{itemName}</td>
                    <td style={{ textAlign: 'center' }}>
                      {itemPerUnitQuantity}
                    </td>
                    <td style={{ textAlign: 'center' }}>{quantityUnitName}</td>
                    <td style={{ textAlign: 'center' }}>
                      {itemSellingPricePerUnit}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {itemQuantityInBill}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {returningItems[_id]
                        ? returningItems[_id].itemSellingPriceTotal
                        : itemSellingPriceTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <div
          style={{
            display: isBillLoading ? 'flex' : 'none',
            justifyContent: 'center',
            width: '100%',
            padding: '30px',
          }}
        >
          <Loader />
        </div>
        {showReturnItems && Object.values(returningItems).length > 0 && (
          <Table
            className="barcode-suggestion-list"
            style={{
              backgroundColor: 'white',
              border: '1px solid #d3c7c7',
              margin: '20px 0',
            }}
          >
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>Barcode</td>
                <td style={{ textAlign: 'center' }}>Name</td>
                <td style={{ textAlign: 'center' }}>PerUnitQuantity</td>
                <td style={{ textAlign: 'center' }}>SellingPricePerUnit</td>
                <td style={{ textAlign: 'center' }}>Return Quantity</td>
                <td style={{ textAlign: 'center' }}>QuantityInBill</td>
                <td style={{ textAlign: 'center' }}>SellingPriceTotal</td>
              </tr>
              {Object.values(returningItems)?.map((item, idx) => {
                const {
                  itemDetail,
                  itemQuantityInBill,
                  itemSellingPriceTotal,
                } = item;
                const {
                  _id,
                  itemName,
                  itemBarcode,
                  itemPerUnitQuantity,
                  quantityUnitName,
                  itemSellingPricePerUnit,
                } = itemDetail;
                const { itemQuantityInBill: existingItemQuantity } =
                  existingBill.items.find(
                    (item) => item.itemDetail._id === _id
                  );
                return (
                  <tr
                    key={`tr-key-${idx}`}
                    style={{
                      padding: '5px',
                      fontSize: '16px',
                      fontStyle: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ textAlign: 'center' }}>{itemBarcode}</td>
                    <td style={{ textAlign: 'center' }}>{itemName}</td>
                    <td style={{ textAlign: 'center' }}>
                      {itemPerUnitQuantity} {quantityUnitName}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {itemSellingPricePerUnit}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <select
                        style={{
                          width: '100px',
                          padding: '8px',
                          fontSize: '15px',
                        }}
                        onChange={(e) => {
                          const quantity = Number(e.target.value);
                          setReturningItem((state) => {
                            const newState = { ...state };
                            newState[_id] = {
                              ...newState[_id],
                              itemQuantityInBill: quantity,
                              itemSellingPriceTotal:
                                itemSellingPricePerUnit * quantity,
                            };
                            return newState;
                          });
                        }}
                        defaultValue={itemQuantityInBill}
                      >
                        {Array(Number(existingItemQuantity))
                          .fill(null)
                          .map((_, idx) => (
                            <option value={idx + 1}>{idx + 1}</option>
                          ))}
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {existingItemQuantity}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {returningItems[_id]
                        ? returningItems[_id].itemSellingPriceTotal
                        : itemSellingPriceTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
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
              style={{ textAlign: 'start' }}
            >
              Available Credits:
              <h2>{existingBill?.availableCredits?.toFixed(2)}</h2>
            </Text>
          </div>
          <Text
            color="black"
            size="xl"
            weight={800}
            className="final-bill-text print-text"
            style={{ textAlign: 'start' }}
          >
            Item Amount to be Returned: {refundAmount || 0}
          </Text>
        </div>
      </div>
      <div>
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

          <div style={{ display: 'flex', gap: '30px' }}>
            <TextInput
              label="Customer Name"
              data-name="name"
              style={{ width: '180px' }}
              value={bill.customerName ?? existingBill.customerName}
              onBlur={(e) => {
                e.preventDefault();
              }}
              onChange={(e) => {
                setBill((prevBill) => ({
                  ...prevBill,
                  customerName: e.target.value,
                }));
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                type="number"
                label="Customer Phone No."
                value={bill.customerPhone ?? existingBill.customerPhone}
                onBlur={(e) => {
                  e.preventDefault();
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
                }}
              />
              <div style={{ height: '10px', color: 'red' }}>{phoneError}</div>
            </div>
          </div>

          <Button
            sx={{ marginRight: '1rem' }}
            disabled={
              !Object.keys(returningItems).length || bill.amountReturn < 0
            }
            className="print-btn"
            onClick={() => {
              addNewBill(setApiLoading, bill, setBill, BILL_INITIAL_STATE);
            }}
            loading={apiLoading}
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
                          onItemAddToBill({
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
                                onItemAddToBill({
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
                        onItemAddToBill({ e: e, itemData: itemsByName });
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
                    style={{
                      background:
                        itemObj.itemQuantityInBill === 0
                          ? '#c76868'
                          : 'transparent',
                    }}
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
              style={{
                display: 'flex',
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
                  New Bill Total:
                  <h2>
                    {isNaN(bill.billAmountTotal) ? '' : bill.billAmountTotal}
                  </h2>
                </Text>
              </div>
              <div
                className="bill-total"
                style={{
                  backgroundColor: 'white',
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
                  {bill.totalRefundAmount > 0
                    ? 'Refund Amount'
                    : 'Amount Return'}
                  :
                  <h2>
                    {' '}
                    {bill.totalRefundAmount > 0
                      ? bill.totalRefundAmount
                      : bill.amountReturn}
                  </h2>
                </Text>
              </div>
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
        </div>
        <div className="print-container">
          <div className="header">
            <h1>PRIYAM STORES</h1>
            <h3>112-C, Indrapuri, Bhopal - 462022</h3>
            <h3>Date: {new Date().toDateString()}</h3>
            <h3>Time: {new Date().toLocaleTimeString()}</h3>
          </div>
          {/* <div className="print-table-head"> */}
          {billBarcode && (
            <ReactBarcode
              options={{
                height: 30,
                width: 1.2,
                displayValue: false,
              }}
              value={billBarcode}
            />
          )}
          {/* </div> */}
          {bill.billItems.length > 0 && (
            <div className="print-table-head">
              <p>Name</p>
              <p>Qty.</p>
              <p>MRP</p>
              <p>Price</p>
              <p>Total</p>
            </div>
          )}
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
                {Number(bill.totalRefundAmount) > 0 && (
                  <div>
                    <p>Amount Refunded</p>
                    <p className="final-amount">
                      {Number(bill.totalRefundAmount)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="discount-section">
              <p>You saved {bill?.billDiscountTotal?.toFixed(2)} on MRP</p>
            </div>
            <h2 style={{ color: 'red' }}>Returned Bill</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnBill;

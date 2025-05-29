import { 
  Button, 
  Input, 
  Loader, 
  Table, 
  Text, 
  Container, 
  Grid 
} from '@mantine/core';
import { useContext, useEffect, useRef, useState } from 'react';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { AppStateContext } from '../AppState/appState.context';
import { ReactBarcode } from 'react-jsbarcode';
import { v4 as uuidv4 } from 'uuid';
import "../CSS/returnBill.css";
import "../Pages/newBillPage/NewBillPage.css";

// New Billing UI imports
import { useBillState } from '../hooks/useBillState';
import { ItemSearch } from '../components/ItemSearch/ItemSearch';
import { BillItems } from '../components/BillItems/BillItems';
import { PaymentSection } from '../components/PaymentSection/PaymentSection';
import { useSelector, useDispatch } from "react-redux";
import { itemsFeedAPILoading, selectItemsFeedData } from 'src/redux/allItemsFeedData/allItemsFeedDataSelector';
import { fetchBillingLeanItems } from '../utils/fetchBillingLeanItems';
import { generateItemLists } from '../utils/apiUtils';

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
  const dispatch = useDispatch();
  // ---------- OLD UI STATES ----------
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
  const [billItems, dispatchContext] = returnBillItemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(false);
  const [isBillLoading, setBillLoading] = useState(false);
  const [billBarcode, setBillBarcode] = useState('');
  
  // ---------- NEW BILLING UI STATES ----------
  const { billState, updateBillItems, updatePayment, resetBillState } = useBillState(); 
  const loading = useSelector(itemsFeedAPILoading);
  const itemsFeedData = useSelector(selectItemsFeedData);
  const [itemsDataCount, setItemsDataCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (itemsFeedData) {
      setItemsDataCount(itemsFeedData.totalItemsCount);
    }
  }, [itemsFeedData]);

  const currentDateTime = `${new Date().toLocaleTimeString("en-IN", { hour12: false })}, ${new Date().toLocaleDateString("hi-IN", { weekday: 'long', month: 'long', day: 'numeric' })}`;
  const totalSaveOnBill = (billState.billMRPTotal - billState.billAmountTotal).toFixed(2);

  // ---------- OLD UI FUNCTIONS ----------
  const getBillRequest = async () => {
    setBillLoading(true);
    const editBill = await genericAxios({
      url: `${API_PATHS.BILLING.GET_BILL}/${slug}`,
      method: API_METHODS.GET,
    });
    setBillLoading(false);
    if (editBill.error) return;
    if (editBill?.data?.message) {
      setExistingBill(editBill.data.message);
      setBill(editBill.data.message);
    }
  };

  const refreshPage = () => {
    let answer = window.confirm('Do you want to refresh page?');
    if (answer) {
      setBill(BILL_INITIAL_STATE);
    }
  };

  function handleItemNameFilter(event, setInputValue, itemsList, setData, key) {
    setInputValue((prev) => ({ ...prev, [key]: event.target.value }));
    const searchWord = event.target.value;
    const filtered = itemsList?.filter((value) => {
      const elem = String(value);
      return elem.toLowerCase().includes(searchWord.toLowerCase());
    });
    setData(filtered);
  }

  const getAllLeanItems = async () => {
    try {
      const pincode = localStorage.getItem('userPincode');

      setLoaderDisplay(true);
      const response = await genericAxios({
        url:`${API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING}?pincode=${pincode}`,
        method: API_METHODS.GET,
      });
      if (response.error) return;
      if (response?.data?.message) {
        const { itemsNameMap, itemsBarCodeMap, totalItemsCount } = response.data.message;
        const { itemNamesList, itemBarCodesList } = generateItemLists(itemsNameMap, itemsBarCodeMap);
        
        setItemBarCodesList(itemBarCodesList);
        setItemsByBarcode(itemsBarCodeMap);
        setItemsByName(itemsNameMap);
        setItemNamesList(itemNamesList);
        setTotalItems(totalItemsCount);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoaderDisplay(false);
    }
  };

  function handleItemInputChange(event, setInputValue) {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  }

  async function createBill(newBillId, setApiLoading) {
    const { newBillId: billUuid, ...billObject } = JSON.parse(
      localStorage.getItem(`newReturnBill-${newBillId}`)
    );
    try {
      const addBillResponse = await genericAxios({
        ...billObject,
        billId: newBillId,
        headers: { Cookie: '' },
      });
      if (addBillResponse.error) {
        setApiLoading(false);
        throw Error();
      }
      localStorage.removeItem(`newReturnBill-${newBillId}`);
      setBillBarcode(addBillResponse.data.message._id);
    } catch (error) {
      console.error({ error });
    }
  }

  async function addNewBill() {
    const newBillId = `${uuidv4()}-${Date.now()}`;
    setApiLoading(true);
    let updateBill = {
      ...billState,
    };
    setBill(updateBill);
    setIsSubmitting(true)
    const createApi = {
      url: API_PATHS.BILLING.POST_RETURN_BILLS,
      method: API_METHODS.POST,
      data: {
        ...billState,
        billId: newBillId,
        id: existingBill._id,
        refundAmount,
        returnedItems: returningItems
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
    resetBillState()
    setIsSubmitting(false)
  }

  const ItemPrice = ({ item, index }) => {
    const quantity = item.itemQuantityInBill;
    const slabs = item.slabPricing;
    let price = item.itemSellingPricePerUnit;
    if (slabs?.length > 0 && quantity !== undefined) {
      for (let idx = slabs.length - 1; idx >= 0; idx--) {
        if (slabs[idx] !== undefined) {
          const slabStartQuantity = slabs[idx][1];
          const slabStartQuantityPrice = slabs[idx][2];
          if (quantity >= slabStartQuantity) {
            price = slabStartQuantityPrice;
            break;
          }
        }
      }
      const newBill = { ...bill };
      if (newBill.billItems && newBill.billItems[index]) {
        newBill.billItems[index].itemDetail.itemSellingPricePerUnit = Number(price);
      }
      setBill(newBill);
      return price;
    } else {
      return item.itemSellingPricePerUnit;
    }
  };

  const onItemAddToBill = ({ e, itemData, key = '', quantity = 1 }) => {
    if (itemData[Boolean(key) ? key : e.target.innerText]) {
      let itemDetail = Boolean(key)
        ? itemData[key]?.[0]
        : itemData[e.target.innerText];
      let itemExists = false;
      const updatedBillItems = bill.billItems?.map((billItem) => {
        if (billItem.itemDetail.itemName === itemDetail.itemName) {
          itemExists = true;
          return {
            ...billItem,
            itemQuantityInBill: billItem.itemQuantityInBill + 1,
          };
        }
        return billItem;
      }) || [];
      if (!itemExists) {
        updatedBillItems.unshift({
          itemDetail,
          itemMRPtotal: Number(itemDetail.itemMRPperUnit),
          itemDiscountTotal: itemDetail.itemDiscountPerUnit,
          itemSellingPriceTotal: Number(itemDetail.itemSellingPricePerUnit),
          _id: itemDetail._id,
          itemQuantityInBill: quantity,
        });
      }
      setBill({
        ...bill,
        totalNumberOfItems: (bill.totalNumberOfItems || 0) + 1,
        billItems: updatedBillItems,
      });
      setInputValue(INPUT_INITIAL_STATE);
      if (Boolean(key)) {
        setFilterBarcodeData([]);
      } else {
        setFilteredData([]);
      }
    }
  };

  const updateBillValuesOnItemChange = (bill, setBillCallback) => {
    let totalSum = 0,
      mrpTotal = 0,
      savedAmount = 0,
      profitAmount = 0,
      numOfItems = 0,
      refund = 0,
      totalRefundAmount = 0;
    if (bill.billItems?.length > 0) {
      bill.billItems.forEach((item) => {
        if (item && item.itemDetail) {
          totalSum += Math.ceil(item.itemDetail.itemSellingPricePerUnit * item.itemQuantityInBill);
          mrpTotal += item.itemDetail.itemMRPperUnit * item.itemQuantityInBill;
          savedAmount = mrpTotal - totalSum;
          numOfItems += item.itemQuantityInBill;
          profitAmount += (item.itemDetail.itemSellingPricePerUnit - item.itemDetail.itemCostPricePerUnit) * item.itemQuantityInBill;
        }
      });
    }
    const returnedItems = Object.values(returningItems || {});
    returnedItems.forEach(({ itemSellingPriceTotal }) => {
      refund += itemSellingPriceTotal;
    });
    totalRefundAmount = refund - Math.ceil(totalSum);
    if (totalRefundAmount < 0) totalRefundAmount = 0;
    setRefundAmount(refund);
    setBill({
      ...bill,
      totalNumberOfUniqueItems: bill.billItems?.length || 0,
      totalNumberOfItems: numOfItems,
      billMRPTotal: mrpTotal,
      billAmountTotal: Math.ceil(totalSum),
      billDiscountTotal: savedAmount,
      totalBillProfit: profitAmount,
      returnedItems,
      refundAmount: refund,
      totalRefundAmount,
    });
  };

  const updateReturnAmount = (setBillCallback, bill) => {
    let amountReturn = bill.cashPay + bill.upiPay - bill.billAmountTotal + refundAmount;
    if (bill.totalRefundAmount > 0 && bill.totalRefundAmount >= amountReturn) {
      amountReturn = 0;
    }
    setBill({
      ...bill,
      amountReturn,
    });
  };

  useEffect(() => {
    if (billItems?.length > 0) {
      setBill({ ...bill, billItems });
    } else {
      setBill(BILL_INITIAL_STATE);
    }
  }, []);

  useEffect(() => {
    if (billBarcode) window.print();
  }, [billBarcode]);

  useEffect(() => {
    updateBillValuesOnItemChange(bill, setBill);
  }, [bill.billItems, returningItems]);

  useEffect(() => {
    updateReturnAmount(setBill, bill);
  }, [bill.cashPay, bill.upiPay, bill.billAmountTotal, refundAmount]);

  useEffect(() => {
    getAllLeanItems();
  }, []);

  useEffect(() => {
    dispatchContext({ type: 'BILL_ITEMS_LIST', payload: bill });
  }, [bill]);

     useEffect(() => {
        dispatch(fetchBillingLeanItems());
      }, []);

  // -------------------- RENDER --------------------
  return (
    <div>
      {/* Top Section: Slug Input & Get Bill */}
      <div style={{ display: 'flex', width: '100%', gap: '5px', fontSize: '20px', padding: '20px' }}>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={{ width: '250px' }}
        />
        <Button disabled={!slug} onClick={getBillRequest}>Get Bill</Button>
      </div>
      {/* OLD UI: Bill Summary & Details */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '20px', alignItems: 'flex-start' }}>
            <div>Customer Name: {existingBill?.customerName ?? ''}</div>
            <div>Customer Phone: {existingBill?.customerPhone ?? ''}</div>
            <div>
              Billing Time: {existingBill?.createdAt ? new Date(existingBill.createdAt).toLocaleString() : ''}
            </div>
            <div>Available Credits: {existingBill?.availableCredits ?? ''}</div>
          </div>
        </div>
        <div style={{ width: 'fit-content' }}>
          <Button disabled={Object.keys(returningItems).length <= 0} onClick={() => setShowReturnItems(!showReturnItems)}>
            {showReturnItems ? 'Reset' : 'Return'}
          </Button>
        </div>
        {/* {!showReturnItems && ( */}
          <>
            {Boolean(existingBill?.items?.length) && (
              <Table className="barcode-suggestion-list" style={{ backgroundColor: 'white', border: '1px solid #d3c7c7', margin: '20px 0' }}>
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
                    const { itemDetail, itemQuantityInBill, itemSellingPriceTotal } = item;
                    const { _id, itemName, itemBarcode, itemPerUnitQuantity, quantityUnitName, itemSellingPricePerUnit } = itemDetail;
                    return (
                      <tr
                        key={`tr-key-${idx}`}
                        style={{ padding: '5px', fontSize: '16px', fontStyle: 'bold', cursor: 'pointer' }}
                        onClick={() => {
                          if (!returningItems[_id]) {
                            setReturningItem((state) => ({ ...state, [_id]: item }));
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
                            style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                            checked={Boolean(returningItems[_id])}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>{itemBarcode}</td>
                        <td style={{ textAlign: 'center' }}>{itemName}</td>
                        <td style={{ textAlign: 'center' }}>{itemPerUnitQuantity}</td>
                        <td style={{ textAlign: 'center' }}>{quantityUnitName}</td>
                        <td style={{ textAlign: 'center' }}>{itemSellingPricePerUnit}</td>
                        <td style={{ textAlign: 'center' }}>{itemQuantityInBill}</td>
                        <td style={{ textAlign: 'center' }}>
                          {returningItems[_id] ? returningItems[_id].itemSellingPriceTotal : itemSellingPriceTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
            <div style={{ display: isBillLoading ? 'flex' : 'none', justifyContent: 'center', width: '100%', padding: '30px' }}>
              <Loader />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="bill-total" style={{ backgroundColor: 'black', width: 'fit-content', padding: '10px', borderRadius: '10px' }}>
                <Text color="red" size="xl" weight={800} className="final-bill-text print-text" td="underline" style={{ textAlign: 'start' }}>
                  Available Credits:
                  <h2>{existingBill?.availableCredits?.toFixed(2)}</h2>
                </Text>
              </div>
              <Text color="black" size="xl" weight={800} className="final-bill-text print-text" style={{ textAlign: 'start' }}>
                Item Amount to be Returned: {refundAmount || 0}
              </Text>
            </div>
          </>
        {/* )} */}
      </div>
      {/* ------------------ NEW BILLING UI ------------------ */}
      {showReturnItems && (
        <div className="new-bill-page">
          <div className="shop-details">
            <h2>Priyam Store</h2>
            <p>Shop No 2, Plot No 2, Indrapuri, Bhopal, M.P.</p>
            <p>Phone: 123-456-7890</p>
            <p>{currentDateTime}</p>
          </div>
          {totalSaveOnBill > 0 && (
            <p className="savings">
              You Saved: ₹ {totalSaveOnBill} on your purchase!
            </p>
          )}
          <Container size="xl" py="md">
            <h2 className="item-count">
              Total items: {itemsDataCount}
              <Button className="refresh-bill-button" onClick={resetBillState} disabled={loading}>
                Refresh Bill
              </Button>
            </h2>
            <Grid className="items-payments-grid">
              <Grid.Col span={8}>
                <ItemSearch
                  onItemSelect={(item) => {
                    updateBillItems([item, ...billState.billItems]);
                  }}
                />
                <BillItems
                  items={billState.billItems}
                  onRemoveItem={(itemId) => {
                    const updatedItems = billState.billItems.filter(
                      (item) => item.itemDetail._id !== itemId
                    );
                    updateBillItems(updatedItems);
                  }}
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
                  onSubmit={addNewBill}
                  isLoading={isSubmitting}
                  refundAmount={refundAmount}
                />
                {billState.billId && (
                  <div className="barcode-container">
                    <ReactBarcode
                      value={billState.billId}
                      options={{
                        height: 40,
                        width: 1.1,
                        margin: 0,
                      }}
                    />
                  </div>
                )}
              </Grid.Col>
              {totalSaveOnBill > 0 && (
                <p className="savings-print-only">
                  You Saved: ₹ {totalSaveOnBill} on your purchase!
                </p>
              )}
            </Grid>
          </Container>
        </div>
      )}
    </div>
  );
};

export default ReturnBill;

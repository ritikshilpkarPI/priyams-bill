import React, { useState, useEffect } from 'react';
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
  // createRzpQrCodeAPI,
  getBillingLeanItemsAPI,
  // getUserDataAPI,
  saveOrCacheBillAPI
} from '../../utils/apiUtils';
import { socketEvents } from '../../utils/constants/socketEvents';

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

const useBillState = () => {
  const [billState, setBillState] = useState(INITIAL_BILL_STATE);
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

        {searchResults.length > 0 && (
          <Paper withBorder p="xs" style={{ maxHeight: '200px', overflow: 'auto' }}>
            {searchResults.length === 1 ? handleItemClick(searchResults[0]) : searchResults.map((item) => (
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

export default NewBillPage;
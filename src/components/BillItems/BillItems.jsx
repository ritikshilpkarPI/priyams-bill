import {
  Text,
  Input,
  Button,
  Table,
} from '@mantine/core';
import './BillItems.css'

export const BillItems = ({ items, onRemoveItem, bill, setBill }) => {
  const calculateItemPrice = (slabPricing, quantity, defaultPrice) => {
    if (!slabPricing || slabPricing.length === 0) {
      return defaultPrice; 
    }

    const applicableSlab = slabPricing.find(([start, end]) => {
      return quantity > start && quantity <= end;
    });

    return applicableSlab ? applicableSlab[2] : defaultPrice; 
  };

  const handleQuantityChange = (item, idx, newQuantity) => {
    const updatedItems = [...bill.billItems];
    const updatedItem = { ...updatedItems[idx], itemDetail: { ...updatedItems[idx].itemDetail } }; 
  
    updatedItem.itemQuantityInBill = newQuantity;
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
      <Table withBorder highlightOnHover className='bill-items-table'>
        <thead>
          <tr>
            <th className='bill-table-header'>Name</th>
            <th className='bill-table-header'>Qt.</th>
            <th className='bill-table-header'>MRP</th>
            <th className='bill-table-header'>Price</th>
            <th className='bill-table-header'>Slab Pricing
              <thead>
                <tr>
                  <th className='bill-table-header'>Start</th>
                  <th className='bill-table-header'>End</th>
                  <th className='bill-table-header'>Price</th>
                </tr>
              </thead>
            </th>
            <th className='bill-table-header'>Total</th>
            <th className='bill-table-header'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.itemDetail._id}>
              <td className='bill-body-tdata'>{item.itemDetail.itemName}</td>
              <td className='bill-body-tdata'>
                <Input
                  type="number"
                  className="quantity-input bill-inputs"
                  value={item.itemQuantityInBill}
                  onChange={(e) =>
                    handleQuantityChange(item, idx, Number(e.target.value))
                  }
                  style={{ width: '90px' }}
                  min={0}
                />
              </td>
              <td className='bill-body-tdata'>{item.itemDetail.itemMRPperUnit}</td>
              <td className='bill-body-tdata'>{item.itemDetail.itemSellingPricePerUnit}</td>
              <td className='bill-body-tdata'>
                {item.itemDetail.slabPricing?.length ? (
                  <Table>
                    <tbody>
                      {item.itemDetail.slabPricing.map(
                        ([start, end, price], index) => (
                          <tr key={index}>
                            <td className='bill-body-tdata'>{start}</td>
                            <td className='bill-body-tdata'>{end}</td>
                            <td className='bill-body-tdata'>₹{price}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                ) : (
                  'N/A'
                )}
              </td>
              <td className='bill-body-tdata'>
                {(
                  item.itemQuantityInBill * item.itemDetail.itemSellingPricePerUnit
                ).toFixed(2)}
              </td>
              <td className='bill-body-tdata'>
                <Button
                  variant="subtle"
                  color="red"
                  size="sm"
                  className='bill-item-remove-btn'
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
import {
  Text,
  Input,
  Button,
  Table,
  NumberInput,
  CardSection,
  Card,
  Flex,
} from '@mantine/core';
import './BillItemsCardView.css';
import { roundNumber } from '../../../src/utils/roundNumber';
import Delete from 'src/icons/Delete';
import { Cross } from 'src/icons/Cross';
import { useState } from 'react';
import { Caret } from 'src/icons/Caret';

export const BillItemsCardView = ({ items, onRemoveItem, bill, setBill }) => {
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
    const updatedItem = {
      ...updatedItems[idx],
      itemDetail: { ...updatedItems[idx].itemDetail },
    };

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
    <Flex direction={'column'} gap={8} className="bill-items-card-view">
      {items.map((item, idx) => (
        <ItemCard
          item={item}
          index={idx}
          key={item.itemDetail._id}
          onQuantityChange={handleQuantityChange}
        />
      ))}
    </Flex>
  );
};

const ItemCard = ({ item = {}, onQuantityChange = () => {}, index }) => {
  const [openSlabPricing, setOpenSlabPricing] = useState(false);
  const onChange = (quantity) => {
    onQuantityChange(item, index, Number(quantity));
  };
  return (
    <Card w="100%" withBorder p={0} style={{overflow: "visible"}}>
      <span style={{position: "absolute", top: "-10px", left: "-10px", zIndex: "100"}}>
            <Cross/>
        </span> 
      <Flex justify={'space-between'} >
        <Flex direction={'column'} gap={10} p={12}>
          <strong>{item.itemDetail.itemName} {item.itemDetail.itemName}</strong>
          <Flex gap={10} align={'flex-start'} wrap={'wrap'}>
            <s>{item.itemDetail.itemMRPperUnit}</s>
            <strong className='card-view-item-price'>{item.itemDetail.itemSellingPricePerUnit}</strong>
            {item?.itemDetail?.slabPricing?.length > 0 && (
              <span onClick={() => setOpenSlabPricing(!openSlabPricing)}>
                <Caret
                  className={`slab-caret-icon ${openSlabPricing && 'slab-caret-icon-rotate'}`}
                />
              </span>
            )}
          </Flex>
            {openSlabPricing && (
              <table className="slab-table" width="100px">
                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {item?.itemDetail?.slabPricing?.map((slabs, idx, arr) => {
                    return (
                      <tr key={idx}>
                        <td>
                          {`${slabs[1]}  ${
                            arr[idx + 1] ? `- ${arr[idx + 1][1] - 1}` : '+'
                          }`}
                        </td>
                        <td className="price-align">{slabs[2]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </Flex>
        <Flex direction={'column'} gap={10} align="center" maw="40%" h={30} p={6} fz={"18px"}>
            <Card withBorder p={0}>

          <Flex direction={'row'} gap={0} fz={"inherit"} >
            <Button
              fz="inherit"
              h="inherit"
              p={8}
              disabled={item.itemQuantityInBill <= 0}
              onClick={() =>
                item.itemQuantityInBill <= 0
                  ? {}
                  : onChange(item.itemQuantityInBill - 1)
              }
            >
              -
            </Button>
            <input
              type="number"
              className="bill-items-card-view-quantity-input"
              value={item.itemQuantityInBill}
              onChange={(e) => onChange(e.target.value)}
              min={0}
            />
            <Button
              h="inherit"
              fz="inherit"
              p={8}
              onClick={() => onChange(item.itemQuantityInBill + 1)}
            >
              +
            </Button>
          </Flex>
          </Card>

          <strong>
            {roundNumber(
              item.itemQuantityInBill * item.itemDetail.itemSellingPricePerUnit
            )}
          </strong>
        </Flex>
      </Flex>
    </Card>
  );
};

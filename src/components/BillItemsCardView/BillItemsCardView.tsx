import { Text, Button, Card, Flex, Image } from '@mantine/core';
import './BillItemsCardView.css';
import { roundNumber } from '../../utils/roundNumber';
import { Cross } from 'src/icons/Cross';
import { useState } from 'react';
import { Caret } from 'src/icons/Caret';
import { SlabPricingTable } from '../SlabPricingTable/SlabPricingTable';

export const BillItemsCardView = ({
  items,
  onRemoveItem,
  bill,
  setBill,
}: {
  items: BillItem[];
  onRemoveItem: (id: string) => {};
  bill: BillState;
  setBill: (bill: BillState) => void;
}) => {
  const calculateItemPrice = (
    slabPricing: number[][] | undefined,
    quantity: number,
    defaultPrice: number
  ) => {
    if (!slabPricing || slabPricing.length === 0) {
      return defaultPrice;
    }

    const applicableSlab = slabPricing.find(([start, end]) => {
      return quantity > start && quantity <= end;
    });

    return applicableSlab ? applicableSlab[2] : defaultPrice;
  };

  const handleQuantityChange = (idx: number, newQuantity: number) => {
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
          removeItem={() => onRemoveItem(item.itemDetail._id)}
        />
      ))}
    </Flex>
  );
};

const ItemCard = ({
  item,
  onQuantityChange = () => {},
  index,
  removeItem = () => {},
}: {
  item: BillItem;
  onQuantityChange: (idx: number, newQuantity: number) => void;
  index: number;
  removeItem: () => void;
}) => {
  const [openSlabPricing, setOpenSlabPricing] = useState(false);
  const onChange = (quantity: number) => {
    onQuantityChange(index, Number(quantity));
  };
  const hasSlabPricing = (item?.itemDetail?.slabPricing?.length ?? 0) > 0;
  return (
    <Card w="100%" withBorder p={0} className="item-card-main-container">
      <span className="remove-item-button-wrapper" onClick={removeItem}>
        <Cross />
      </span>
      <Flex justify={'space-between'} align={'center'} p={8} gap={5}>
        {/* Currently there is no image in itemDetail, once imageUrl is available please update this code likewise */}
        {item?.itemDetail?.itemImageUrl && (
          <Image src={item.itemDetail.itemImageUrl} width={50} />
        )}
        <Flex direction={'column'} gap={10} ml={12}>
          <strong className="card-view-item-name">
            {item.itemDetail.itemName}
          </strong>
          <Flex gap={10} align={'flex-start'} wrap={'wrap'}>
            <s>{item.itemDetail.itemMRPperUnit}</s>
            <strong className="card-view-item-price">
              {item.itemDetail.itemSellingPricePerUnit}
            </strong>
            {hasSlabPricing && (
              <span onClick={() => setOpenSlabPricing(!openSlabPricing)}>
                <Caret
                  className={`slab-caret-icon ${openSlabPricing && 'slab-caret-icon-rotate'}`}
                />
              </span>
            )}
          </Flex>
          {openSlabPricing && (
            <SlabPricingTable slabList={item?.itemDetail?.slabPricing || []} />
          )}
        </Flex>
        <Flex
          direction={'column'}
          gap={10}
          align="center"
          maw="40%"
          fz={'18px'}
        >
          <Card withBorder p={0}>
            <Flex direction={'row'} gap={0} fz={'inherit'}>
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
                onChange={(e) => onChange(Number(e.target.value))}
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

import { useEffect, useState } from "react";
import {
    Paper,
    Text,
    Input,
    Button,
    Loader,
    Group
  } from '@mantine/core';
import { useSelector } from "react-redux";
import { fuzzySearch } from "src/utils/searchUtils";
import { selectItemsFeedData } from "src/redux/allItemsFeedData/allItemsFeedDataSelector";

export const ItemSearch = ({ onItemSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [itemsData, setItemsData] = useState([]);
    const itemsFeedData = useSelector(selectItemsFeedData);

    useEffect(() => {
      if (!itemsFeedData || itemsFeedData.totalItemsCount === 0) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
        setItemsData(itemsFeedData);
      }
    }, [itemsFeedData]);

const handleSearch = (value) => {
  setSearchTerm(value);

  if (!value || !itemsData || !itemsData.itemsBarCodeMap || !itemsData.itemsNameMap) {
    setSearchResults([]);
    return;
  }

  const isBarcode = /^\d+$/.test(value); 
  let results = [];

  if (isBarcode) {
    const barcodeMatches = itemsData.itemsBarCodeMap[value] || [];
    results = barcodeMatches;
  } else {
    const allItems = Object.values(itemsData.itemsNameMap);
    const nameMatches = fuzzySearch(value, allItems);

    const barcodeMapResults = Object.values(itemsData.itemsBarCodeMap)
      .flat()
      .filter((item) => item.itemName.toLowerCase().includes(value.toLowerCase()));

    results = Array.from(new Map([...nameMatches, ...barcodeMapResults].map((item) => [item._id, item])).values());
  }

  setSearchResults(results.slice(0, 10)); 
};


  
const calculateItemPrice = (item, quantity) => {
  if (!item.slabPricing || item.slabPricing.length === 0) {
    return item.itemSellingPricePerUnit;
  }

  const sortedSlabPricing = item.slabPricing
    .map((slab) => [...slab])
    .sort((a, b) => b[0] - a[0]);

  const applicableSlab = sortedSlabPricing.find(
    ([slabQuantity]) => quantity >= slabQuantity
  );

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
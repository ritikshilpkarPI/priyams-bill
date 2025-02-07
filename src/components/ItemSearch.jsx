import { useEffect, useState } from "react";
import {
    Paper,
    Text,
    Input,
    Button,
    Loader,
    Group
  } from '@mantine/core';
import { selectBillingItems } from "src/redux/billing/billingSelectors";
import { useSelector } from "react-redux";

export const ItemSearch = ({ onItemSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [itemsData, setItemsData] = useState([]);
    const items = useSelector(selectBillingItems);

    
    useEffect(() => {
      if (!items) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
        setItemsData(items); 
      }
    
       }, [items]);
  
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
            return itemName.toLowerCase().includes(searchTermLower)
          })
          .map(([_, item]) => {
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
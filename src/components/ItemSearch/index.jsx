import { useEffect, useRef, useState } from 'react';
import { Paper, Text, Input, Button, Loader, Group, Badge } from '@mantine/core';
import { useSelector } from 'react-redux';
import { fuzzySearch } from 'src/utils/searchUtils';
import { itemsFeedAPILoading, selectItemsFeedData } from "src/redux/allItemsFeedData/allItemsFeedDataSelector";
import "./ItemSearch.css";
import { setItemsData } from 'src/redux/items/itemsSlice';
import { getItemsSkuAPI } from 'src/utils/apiUtils';
import { selectItemsSkuList } from 'src/redux/items/itemsSelector';
import { useDispatch } from 'react-redux';

export const ItemSearch = ({ onItemSelect, isApprovedPO, error = "" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [itemsData, setItemData] = useState([]);
    const itemsFeedData = useSelector(selectItemsFeedData);
    const loading = useSelector(itemsFeedAPILoading);
    const inputRef = useRef(null); 
    const dispatch = useDispatch();
    useEffect(() => {
      if (inputRef.current && !loading) {
        inputRef.current.focus(); 
      }
    }, [loading]); 
    
    
    useEffect(() => {
      if (!itemsFeedData || itemsFeedData.totalItemsCount === 0) {
      } else {
        setItemData(itemsFeedData);
      }
    }, [itemsFeedData]);


  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value || !itemsData || !itemsData.itemsBarCodeMap || !itemsData.itemsNameMap) {
      setSearchResults([]);
      return;
    }

    const isBarcode = /^(PSTR_[0-9A-Za-z]+|\d+)$/.test(value);
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
        slabPricing: item.slabPricing,
        itemShelfDates: item.itemShelfDates,

        itemQtyInStore: item.itemQtyInStore,
      },
      itemQuantityInBill: 1
    });
    setSearchTerm('');
    setSearchResults([]);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const getItemsSku = async () => {
    const response = await getItemsSkuAPI();

    if(!response && response.isError) return;
    dispatch(setItemsData({ itemsSkuList: response.itemsSku }));
  }

  useEffect(() => {
    getItemsSku();
  }, []);

  const itemsSkuList = useSelector(selectItemsSkuList);

  const itemsSkuMap = new Map(itemsSkuList.map((item) => [item._id, item.sku]));
  const getItemSKUByBarcodeAndName = (itemId) => {
    return itemsSkuMap.get(itemId) || null;
  };
  return (
    <div className="item-search">
      <Paper p="md" radius="md" withBorder mb="md">
        <Text size="lg" weight={500} mb="md" className="item-search-label">Search Items</Text>

        <Input
          placeholder="Enter item name or barcode"
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          rightSection={(loading || !itemsSkuList) ? <Loader size="sm" /> : null}
          mb="sm"
          disabled={loading || isApprovedPO || !itemsSkuList}
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
                      <Text>
                        {getItemSKUByBarcodeAndName(item._id) || item.itemName}
                      </Text>
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

        {searchTerm && searchResults.length === 0 && !loading && (
          <Text color="dimmed" align="center" size="sm">
            No items found
          </Text>
        )}
        {error.length>0 &&
          <Badge mt={10} color="red" size="xs">{error}</Badge>
        }
      </Paper>
    </div>
  );
};
import React from 'react';
import {
  Group,
  Text,
  Badge,
  ThemeIcon,
  UnstyledButton,
  Collapse,
  Table,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

export const renderTopQtyRow = (item: any, idx: number) => (
  <tr key={idx}>
    <td>
      <Group spacing="xs">
        <Text fw={500}>{item.sku || '-'}</Text>
        {item.brand && (
          <Badge size="sm" variant="light" color="grape">
            {item.brand}
          </Badge>
        )}
      </Group>
    </td>
    <td>{item.barcode || '-'}</td>
    <td>{item.itemName || '-'}</td>
    <td>
      <Badge size="lg" variant="filled" color="blue">
        {item.totalQuantity}
      </Badge>
    </td>
  </tr>
);

export const renderTopAmountRow = (item: any, idx: number) => (
  <tr key={idx}>
    <td>
      <Group spacing="xs">
        <Text fw={500}>{item.sku || '-'}</Text>
        {item.brand && (
          <Badge size="sm" variant="light" color="grape">
            {item.brand}
          </Badge>
        )}
      </Group>
    </td>
    <td>{item.barcode || '-'}</td>
    <td>{item.itemName || '-'}</td>
    <td>
      <Badge size="lg" variant="filled" color="green">
        ₹{item.totalAmount?.toFixed(2)}
      </Badge>
    </td>
  </tr>
);

export const renderCategoryRow = (
  item: any,
  idx: number,
  expandedCategories: Record<string, boolean>,
  setExpandedCategories: (value: Record<string, boolean>) => void,
  searchTerm: string
) => {
  const isExpanded = expandedCategories[item.category] || false;
  const filteredProducts = item.topProducts.filter((prod: any) => {
    const searchLower = searchTerm.toLowerCase();
    return !searchTerm || 
      (prod.sku?.toLowerCase().includes(searchLower)) ||
      (prod.barcode?.toLowerCase().includes(searchLower));
  });

  return (
    <React.Fragment key={idx}>
      <tr>
        <td colSpan={4}>
          <UnstyledButton
            onClick={() => setExpandedCategories({
              ...expandedCategories,
              [item.category]: !expandedCategories[item.category]
            })}
            style={{ width: '100%' }}
          >
            <Group position="apart">
              <Group>
                <ThemeIcon size="sm" radius="xl" color="blue">
                  <IconBuildingStore size={14} />
                </ThemeIcon>
                <Badge size="lg" variant="filled" color="blue">
                  {item.category}
                </Badge>
              </Group>
              {isExpanded ? (
                <IconChevronDown size={16} color="#228be6" />
              ) : (
                <IconChevronRight size={16} color="#228be6" />
              )}
            </Group>
          </UnstyledButton>
        </td>
      </tr>
      <tr>
        <td colSpan={4} style={{ padding: 0 }}>
          <Collapse in={isExpanded}>
            <Table withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Barcode</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod: any, i: number) => (
                  <tr key={`${idx}-${i}`} style={{ backgroundColor: '#f8f9fa' }}>
                    <td>{prod.sku}</td>
                    <td>{prod.barcode}</td>
                    <td>
                      <Badge size="lg" variant="filled" color="blue">
                        {prod.totalQuantity}
                      </Badge>
                    </td>
                    <td>
                      <Badge size="lg" variant="filled" color="green">
                        ₹{prod.totalAmount.toFixed(2)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Collapse>
        </td>
      </tr>
    </React.Fragment>
  );
};

export const renderBrandRow = (
  item: any,
  idx: number,
  expandedBrands: Record<string, boolean>,
  setExpandedBrands: (value: Record<string, boolean>) => void,
  searchTerm: string
) => {
  const isExpanded = expandedBrands[item.brand] || false;
  const filteredProducts = item.topProducts.filter((prod: any) => {
    const searchLower = searchTerm.toLowerCase();
    return !searchTerm || 
      (prod.sku?.toLowerCase().includes(searchLower)) ||
      (prod.barcode?.toLowerCase().includes(searchLower));
  });

  return (
    <React.Fragment key={idx}>
      <tr>
        <td colSpan={4}>
          <UnstyledButton
            onClick={() => setExpandedBrands({
              ...expandedBrands,
              [item.brand]: !expandedBrands[item.brand]
            })}
            style={{ width: '100%' }}
          >
            <Group position="apart">
              <Group>
                <ThemeIcon size="sm" radius="xl" color="grape">
                  <IconBuildingStore size={14} />
                </ThemeIcon>
                <Badge size="lg" variant="filled" color="grape">
                  {item.brand}
                </Badge>
              </Group>
              {isExpanded ? (
                <IconChevronDown size={16} color="#7950f2" />
              ) : (
                <IconChevronRight size={16} color="#7950f2" />
              )}
            </Group>
          </UnstyledButton>
        </td>
      </tr>
      <tr>
        <td colSpan={4} style={{ padding: 0 }}>
          <Collapse in={isExpanded}>
            <Table withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Barcode</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod: any, i: number) => (
                  <tr key={`${idx}-${i}`} style={{ backgroundColor: '#f8f9fa' }}>
                    <td>{prod.sku}</td>
                    <td>{prod.barcode}</td>
                    <td>
                      <Badge size="lg" variant="filled" color="blue">
                        {prod.totalQuantity}
                      </Badge>
                    </td>
                    <td>
                      <Badge size="lg" variant="filled" color="green">
                        ₹{prod.totalAmount.toFixed(2)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Collapse>
        </td>
      </tr>
    </React.Fragment>
  );
};

export const renderDealerQtyRow = (item: any, idx: number) => (
  <tr key={idx}>
    <td>
      <Group spacing="xs">
        <Text fw={500}>{item.dealerName}</Text>
        {item.brand && (
          <Badge size="sm" variant="light" color="grape">
            {item.brand}
          </Badge>
        )}
      </Group>
    </td>
    <td>
      <Badge size="lg" variant="filled" color="blue">
        {item.totalQuantity}
      </Badge>
    </td>
    <td>
      <Badge size="lg" variant="filled" color="green">
        ₹{item.totalAmount?.toFixed(2)}
      </Badge>
    </td>
  </tr>
);

export const renderDealerAmountRow = (item: any, idx: number) => (
  <tr key={idx}>
    <td>
      <Group spacing="xs">
        <Text fw={500}>{item.dealerName}</Text>
        {item.brand && (
          <Badge size="sm" variant="light" color="grape">
            {item.brand}
          </Badge>
        )}
      </Group>
    </td>
    <td>
      <Badge size="lg" variant="filled" color="green">
        ₹{item.totalAmount?.toFixed(2)}
      </Badge>
    </td>
    <td>
      <Badge size="lg" variant="filled" color="blue">
        {item.totalQuantity}
      </Badge>
    </td>
  </tr>
);

export const renderPurchasedRow = (item: any, idx: number) => (
  <tr key={idx}>
    <td>{item.sku || '-'}</td>
    <td>{item.itemName || '-'}</td>
    <td>{item.totalStock}</td>
    <td>₹{item.mrp?.toFixed(2)}</td>
    <td>₹{item.costPrice?.toFixed(2)}</td>
    <td>
      {item.lastPurchaseDate
        ? new Date(item.lastPurchaseDate).toLocaleDateString()
        : 'N/A'}
    </td>
    <td>{item.totalOrders}</td>
    <td>{item.suppliers?.join(', ') || 'N/A'}</td>
  </tr>
);

export const renderItemTrendRow = (item: any, idx: number) => (
  <tr key={idx}>
    <td>
      <Text
        component="a"
        href={`/bills/${item.billNo}`}
        target="_blank"
        size="sm"
      >
        {item.billNo}
      </Text>
    </td>
    <td>{new Date(item.billDate).toLocaleDateString()}</td>
    <td>{item.staffName}</td>
    <td>{item.itemQuantity}</td>
    <td>₹{item.sellingPriceTotal?.toFixed(2)}</td>
    <td>₹{item.discountTotal?.toFixed(2)}</td>
  </tr>
);

export const renderOverallBillingRow = (item: any, idx: number) => (
  <tr key={idx}>
    <td>{item.itemName}</td>
    <td>{item.barcode}</td>
    <td>{item.totalQuantity}</td>
    <td>₹{item.totalAmount?.toFixed(2)}</td>
    <td>₹{item.totalDiscount?.toFixed(2)}</td>
    <td>₹{item.totalMRPsum?.toFixed(2)}</td>
    <td>
      {item.firstSale ? new Date(item.firstSale).toLocaleDateString() : 'N/A'}
    </td>
    <td>
      {item.lastSale ? new Date(item.lastSale).toLocaleDateString() : 'N/A'}
    </td>
    <td>{item.staffName}</td>
  </tr>
); 
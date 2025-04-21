import React, { useState } from 'react';
import DataTable from '../DataTable';
import { Box, Button, LoadingOverlay, Modal } from '@mantine/core';

const ExpiryItemsBatch = () => {
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [expandedStatusId, setExpandedStatusId] = useState<string | null>(null);
  const [expandedCostId, setExpandedCostId] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });

  console.log(pagination);
  

  const [loader, setLoader] = useState(false);

  // const handlePageChange = (_: any, page: number) => {
  //   if (page > 0) {
  //     setPagination((prev) => ({ ...prev, page }));
  //   }
  // };
  const handlePageChange = (_: any, page: number) => {
    if (page > 0) {
      const callBack = (prev:any) => ({ ...prev, page });
      pagination ? setPagination(callBack) : setPagination(callBack);
    }
  };

  // const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setPagination((prev) => ({
  //     ...prev,
  //     pageSize: parseInt(e.target.value, 10),
  //   }));
  // };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(e.target.value, 10),
    }));
  };

  const data: any[] = [
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'B2C3D4E5',
      dealerId: 'dealer_002',
      transactionId: 'txn_234567',
      expiryImages: [],
      expiryBatchCost: 950.75,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_002',
          dateTime: '2024-04-02T11:00:00Z',
          browser: 'Firefox',
          os: 'MacOS',
          ipReferrer: '192.168.0.2',
          statusChangeRemark: 'Batch added',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-12T16:00:00Z',
        clearancePurchaseOrderId: 'po_002',
        dealerId: 'dealer_002',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: true,
      items: [
        {
          itemId: 'item_003',
          expiryDate: '2025-03-01',
          quantity: 8,
          purchaseOrderId: 'po_003',
          costPricePerUnit: 80.5,
          totalCostPrice: 644.0,
        },
        {
          itemId: 'item_004',
          expiryDate: '2025-07-01',
          quantity: 6,
          purchaseOrderId: 'po_004',
          costPricePerUnit: 55.0,
          totalCostPrice: 330.0,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_003', itemTotalCost: 644.0 },
        { itemId: 'item_004', itemTotalCost: 330.0 },
      ],
    },
    {
      boxId: 'C3D4E5F6',
      dealerId: 'dealer_003',
      transactionId: 'txn_345678',
      expiryImages: [],
      expiryBatchCost: 1500.0,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_003',
          dateTime: '2024-04-03T12:00:00Z',
          browser: 'Safari',
          os: 'iOS',
          ipReferrer: '192.168.0.3',
          statusChangeRemark: 'Initial batch',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-15T14:00:00Z',
        clearancePurchaseOrderId: 'po_005',
        dealerId: 'dealer_003',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_005',
          expiryDate: '2025-04-01',
          quantity: 15,
          purchaseOrderId: 'po_005',
          costPricePerUnit: 90.0,
          totalCostPrice: 1350.0,
        },
        {
          itemId: 'item_006',
          expiryDate: '2025-05-01',
          quantity: 3,
          purchaseOrderId: 'po_006',
          costPricePerUnit: 50.0,
          totalCostPrice: 150.0,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_005', itemTotalCost: 1350.0 },
        { itemId: 'item_006', itemTotalCost: 150.0 },
      ],
    },
    {
      boxId: 'D4E5F6G7',
      dealerId: 'dealer_004',
      transactionId: 'txn_456789',
      expiryImages: [],
      expiryBatchCost: 1100.0,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_004',
          dateTime: '2024-04-04T13:30:00Z',
          browser: 'Edge',
          os: 'Windows',
          ipReferrer: '192.168.0.4',
          statusChangeRemark: 'Saved batch',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-17T18:00:00Z',
        clearancePurchaseOrderId: 'po_007',
        dealerId: 'dealer_004',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: true,
      items: [
        {
          itemId: 'item_007',
          expiryDate: '2025-02-01',
          quantity: 12,
          purchaseOrderId: 'po_007',
          costPricePerUnit: 95.0,
          totalCostPrice: 1140.0,
        },
        {
          itemId: 'item_008',
          expiryDate: '2025-08-01',
          quantity: 4,
          purchaseOrderId: 'po_008',
          costPricePerUnit: 60.0,
          totalCostPrice: 240.0,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_007', itemTotalCost: 1140.0 },
        { itemId: 'item_008', itemTotalCost: 240.0 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
    {
      boxId: 'A1B2C3D4',
      dealerId: 'dealer_001',
      transactionId: 'txn_123456',
      expiryImages: [],
      expiryBatchCost: 1200.5,
      status: 'SAVED',
      statusHistory: [
        {
          status: 'SAVED',
          stafId: 'staff_001',
          dateTime: '2024-04-01T10:30:00Z',
          browser: 'Chrome',
          os: 'Windows',
          ipReferrer: '192.168.0.1',
          statusChangeRemark: 'Initial save',
        },
      ],
      clearanceDetails: {
        clearanceReason: 'CLEARED_BY_PURCHASE_ORDER',
        clearedOn: '2024-04-10T15:00:00Z',
        clearancePurchaseOrderId: 'po_001',
        dealerId: 'dealer_001',
        clearanceRemark: 'Approved and cleared',
      },
      isCleared: false,
      items: [
        {
          itemId: 'item_001',
          expiryDate: '2025-01-01',
          quantity: 10,
          purchaseOrderId: 'po_001',
          costPricePerUnit: 100.0,
          totalCostPrice: 1000.0,
        },
        {
          itemId: 'item_002',
          expiryDate: '2025-06-01',
          quantity: 5,
          purchaseOrderId: 'po_002',
          costPricePerUnit: 40.1,
          totalCostPrice: 200.5,
        },
      ],
      itemWiseTotalCost: [
        { itemId: 'item_001', itemTotalCost: 1000.0 },
        { itemId: 'item_002', itemTotalCost: 200.5 },
      ],
    },
  ];

  const columns = [
    { key: 'boxId', label: 'Box ID' },
    { key: 'dealerId', label: 'Dealer ID' },
    { key: 'transactionId', label: 'Transaction ID' },
    {
      key: 'expiryBatchCost',
      label: 'Batch Cost',
      render: (row: any) => `₹ ${row.expiryBatchCost.toFixed(2)}`,
    },
    { key: 'status', label: 'Status' },
    {
      key: 'isCleared',
      label: 'Cleared',
      render: (row: any) => (row.isCleared ? 'Yes' : 'No'),
    },
    {
      key: 'statusHistory',
      label: 'Status History',
      render: (row: any) => (
        <Button
          onClick={() =>
            setExpandedStatusId(
              row.boxId === expandedStatusId ? null : row.boxId
            )
          }
        >
          {row.boxId === expandedStatusId ? 'Hide' : 'Show'}
        </Button>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (row: any) => (
        <Button
          onClick={() =>
            setExpandedRowId(row.boxId === expandedRowId ? null : row.boxId)
          }
        >
          {row.boxId === expandedRowId ? 'Hide' : 'Show'}
        </Button>
      ),
    },
    {
      key: 'costDetails',
      label: 'Cost Details',
      render: (row: any) => (
        <Button
          onClick={() =>
            setExpandedCostId(row.boxId === expandedCostId ? null : row.boxId)
          }
        >
          {row.boxId === expandedCostId ? 'Hide' : 'Show'}
        </Button>
      ),
    },
  ];

  const selectedRow = data.find((row) => row.boxId === expandedRowId);
  const selectedStatusRow = data.find((row) => row.boxId === expandedStatusId);
  const selectedCostRow = data.find((row) => row.boxId === expandedCostId);

  return (
    <Box>
      <LoadingOverlay visible={loader} zIndex={1} />
      <DataTable
        columns={columns}
        data={data}
        isLoading={false}
        page={pagination.page}
        rowsPerPage={pagination.pageSize}
        // page={page}
        // rowsPerPage={rowsPerPage}
        onPageChange={() => handlePageChange}
        // onPageChange={()=>setPage()}
        onRowsPerPageChange={handleRowsPerPageChange}
        // onRowsPerPageChange={(e) => setRowsPerPage( parseInt(e.target.value))}
        rowCount={data.length}
        paginationMode="client"
        order="asc"
        orderBy=""
        onSort={() => {}}
      />

      {selectedRow && (
        <Modal
          opened={!!expandedRowId}
          onClose={() => setExpandedRowId(null)}
          title={`Items in Batch ${selectedRow.boxId}`}
          size="md"
        >
          <DataTable
            columns={[
              { key: 'itemId', label: 'Item ID' },
              { key: 'expiryDate', label: 'Expiry Date' },
              { key: 'quantity', label: 'Quantity' },
              {
                key: 'costPricePerUnit',
                label: 'Cost/Unit',
                render: (item: any) => `₹ ${item.costPricePerUnit.toFixed(2)}`,
              },
              {
                key: 'totalCostPrice',
                label: 'Total Cost',
                render: (item: any) => `₹ ${item.totalCostPrice.toFixed(2)}`,
              },
            ]}
            data={selectedRow.items}
            isLoading={false}
            page={0}
            rowsPerPage={selectedRow.items.length}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
            rowCount={selectedRow.items.length}
            paginationMode="client"
            order="asc"
            orderBy=""
            onSort={() => {}}
          />
        </Modal>
      )}

      {selectedStatusRow && (
        <Modal
          opened={!!expandedStatusId}
          onClose={() => setExpandedStatusId(null)}
          title={`Status History for ${selectedStatusRow.boxId}`}
          size="md"
        >
          <DataTable
            columns={[
              { key: 'status', label: 'Status' },
              { key: 'stafId', label: 'Staff ID' },
              { key: 'dateTime', label: 'Date Time' },
              { key: 'browser', label: 'Browser' },
              { key: 'os', label: 'OS' },
              { key: 'ipReferrer', label: 'IP Referrer' },
              { key: 'statusChangeRemark', label: 'Remark' },
            ]}
            data={selectedStatusRow.statusHistory}
            isLoading={false}
            page={0}
            rowsPerPage={selectedStatusRow.statusHistory.length}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
            rowCount={selectedStatusRow.statusHistory.length}
            paginationMode="client"
            order="asc"
            orderBy=""
            onSort={() => {}}
          />
        </Modal>
      )}

      {selectedCostRow && (
        <Modal
          opened={!!expandedCostId}
          onClose={() => setExpandedCostId(null)}
          title={`Cost Details for ${selectedCostRow.boxId}`}
          size="md"
        >
          <DataTable
            columns={[
              { key: 'itemId', label: 'Item ID' },
              {
                key: 'itemTotalCost',
                label: 'Total Cost',
                render: (item: any) => `₹ ${item.itemTotalCost.toFixed(2)}`,
              },
            ]}
            data={selectedCostRow.itemWiseTotalCost}
            isLoading={false}
            page={0}
            rowsPerPage={selectedCostRow.itemWiseTotalCost.length}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
            rowCount={selectedCostRow.itemWiseTotalCost.length}
            paginationMode="client"
            order="asc"
            orderBy=""
            onSort={() => {}}
          />
        </Modal>
      )}
    </Box>
  );
};

export default ExpiryItemsBatch;

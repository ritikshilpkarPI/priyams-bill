import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Grid,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { CONSTANTS } from '../../constants/constants';
import { IconTransfer } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  getSwap,
  removeTransactionItem,
  resetTransactionDestination,
  resetTransactionSource,
  setTransactionReason,
  resetStoreInventory,
} from '../../redux/stockTransactionManagement/StockTransactionManagement';
import { selectDealers } from 'src/redux/dealerlist/dealerSelectors';
import SelectDealer from '../selectDealer/SelectDealer';

interface StoreInventoryFormProps {
  onChangeSource: (field: string, value: string | number) => void;
  onChangeDestination: (field: string, value: string | number) => void;
  storesData: { value: string; label: string }[];
  warehouseData: { value: string; label: string }[];
  sourceStaff: { value: string; label: string }[];
  destinationStaff: { value: string; label: string }[];
}

const StoreInventoryForm: React.FC<StoreInventoryFormProps> = ({
  onChangeSource,
  onChangeDestination,
  storesData,
  warehouseData,
  sourceStaff,
  destinationStaff,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const stockTransaction = useSelector(
    (state: RootState) => state.stockTransaction
  );

  const { dealers } = useSelector((state: RootState) => state.dealer);

  return (
    <Grid>
      <Grid.Col span={4}>
        <Box
          sx={{
            border: '.5px solid rgb(222, 226, 230)',
            boxShadow: 'rgba(0, 0, 0, 0.05) 2px 3px 5px',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'left',
          }}
        >
          <Grid>
            <Grid.Col
              span={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Badge color="red" size="lg">
                OUT
              </Badge>
            </Grid.Col>

            <Grid.Col span={12}>
              <Select
                label="Source"
                placeholder="Pick Source"
                value={stockTransaction.source.sourceType}
                onChange={(value) => {
                  onChangeSource('sourceType', value ?? '');
                  dispatch(resetTransactionSource());
                }}
                data={[
                  { label: CONSTANTS.WAREHOUSE, value: CONSTANTS.WAREHOUSE },
                  { label: CONSTANTS.STORE, value: CONSTANTS.STORE },
                  {
                    label: CONSTANTS.DEALER,
                    value: CONSTANTS.DEALER,
                    disabled: true,
                  },
                ]}
              />
            </Grid.Col>

            {(stockTransaction.source.sourceType === CONSTANTS.STORE ||
              stockTransaction.source.sourceType === CONSTANTS.WAREHOUSE) && (
              <Grid.Col span={12}>
                <Select
                  label={
                    stockTransaction.source.sourceType === CONSTANTS.STORE
                      ? 'Select Store'
                      : 'Select Warehouse'
                  }
                  placeholder={
                    stockTransaction.source.sourceType === CONSTANTS.STORE
                      ? 'Pick Store'
                      : 'Pick Warehouse'
                  }
                  value={stockTransaction.source.sourceEntityId}
                  onChange={(value) => {
                    onChangeSource('sourceEntityId', value ?? '');
                    dispatch(resetTransactionDestination());
                  }}
                  data={
                    stockTransaction.source.sourceType === CONSTANTS.STORE
                      ? storesData
                      : warehouseData
                  }
                />
              </Grid.Col>
            )}

            {Boolean(stockTransaction.source.sourceEntityId.length) && (
              <Grid.Col span={12}>
                <Select
                  label={'Select staff'}
                  placeholder="Select staff"
                  data={sourceStaff}
                  value={stockTransaction.source.sourceStaff}
                  onChange={(value) =>
                    onChangeSource('sourceStaff', value ?? '')
                  }
                />
              </Grid.Col>
            )}

            <Grid.Col span={12}>
              <Textarea
                label="Remark"
                placeholder="Input placeholder"
                value={stockTransaction.source.sourceRemark}
                onChange={(event) =>
                  onChangeSource(
                    'sourceRemark',
                    event.currentTarget.value ?? ''
                  )
                }
              />
            </Grid.Col>
          </Grid>
        </Box>
      </Grid.Col>

      <Grid.Col span={isSmallScreen ? 12 : 4}>
        <Flex h={'100%'} w={'100%'} align={'center'} justify={'center'}>
          <Grid>
            <Grid.Col
              span={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActionIcon
                variant="filled"
                size="xl"
                radius="xl"
                color="indigo"
                onClick={() => {
                  dispatch(getSwap());
                  dispatch(resetStoreInventory());
                }}
              >
                <IconTransfer
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Grid.Col>
            <Grid.Col span={12}>
              <Box
                sx={{
                  border: '.5px solid rgb(222, 226, 230)',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 1px 1px 5px',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <Select
                  label="Transaction Reason"
                  value={stockTransaction.transactionReason}
                  data={Object.values(CONSTANTS.TRANSACTION_REASON)}
                  onChange={(value) => dispatch(setTransactionReason(value))}
                />
              </Box>
            </Grid.Col>
          </Grid>
        </Flex>
      </Grid.Col>

      <Grid.Col span={4}>
        <Box
          sx={{
            border: '.5px solid rgb(222, 226, 230)',
            boxShadow: 'rgba(0, 0, 0, 0.05) 2px 3px 5px',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'left',
          }}
        >
          <Grid>
            <Grid.Col
              span={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Badge color="green" size="lg">
                IN
              </Badge>
            </Grid.Col>

            <Grid.Col span={12}>
              <Select
                label="Destination"
                placeholder="Pick Destination"
                value={stockTransaction.destination.destinationType}
                onChange={(value) =>
                  onChangeDestination('destinationType', value ?? '')
                }
                data={[CONSTANTS.WAREHOUSE, CONSTANTS.STORE, CONSTANTS.DEALER]}
              />
            </Grid.Col>

            {(stockTransaction.destination.destinationType ===
              CONSTANTS.STORE ||
              stockTransaction.destination.destinationType ===
                CONSTANTS.WAREHOUSE) && (
              <Grid.Col span={12}>
                <Select
                  label={
                    stockTransaction.destination.destinationType ===
                    CONSTANTS.STORE
                      ? 'Select Store'
                      : 'Select Warehouse'
                  }
                  placeholder={
                    stockTransaction.destination.destinationType ===
                    CONSTANTS.STORE
                      ? 'Pick Store'
                      : 'Pick Warehouse'
                  }
                  value={stockTransaction.destination.destinationEntityId}
                  onChange={(value) =>
                    onChangeDestination('destinationEntityId', value ?? '')
                  }
                  data={
                    stockTransaction.destination.destinationType ===
                    CONSTANTS.STORE
                      ? storesData
                      : warehouseData
                  }
                />
              </Grid.Col>
            )}
            {stockTransaction.destination.destinationType ===
              CONSTANTS.DEALER && (
              <Grid.Col span={12}>
                <SelectDealer
                  label="Select Dealer"
                  placeholder="Select Dealer"
                  value={stockTransaction.destination.destinationEntityId}
                  onChange={(value) =>
                    onChangeDestination('destinationEntityId', value ?? '')
                  }
                />
              </Grid.Col>
            )}
            {stockTransaction.destination.destinationType ===
              CONSTANTS.DEALER &&
              Boolean(stockTransaction.destination.destinationEntityId) && (
                <Grid.Col span={12}>
                  <TextInput
                    label="Dealer number"
                    disabled
                    value={
                      dealers.find(
                        (dealer) =>
                          dealer._id ===
                          stockTransaction.destination.destinationEntityId
                      )?.dealerNumber || ''
                    }
                    />
                </Grid.Col>
              )}

            {(stockTransaction.destination.destinationType ===
              CONSTANTS.STORE ||
              stockTransaction.destination.destinationType ===
                CONSTANTS.WAREHOUSE) &&
              Boolean(stockTransaction.destination.destinationEntityId) && (
                <Grid.Col span={12}>
                  <Select
                    label={'Select staff'}
                    placeholder="Select staff"
                    data={destinationStaff}
                    value={stockTransaction.destination.destinationStaff}
                    onChange={(value) =>
                      onChangeDestination('destinationStaff', value ?? '')
                    }
                  />
                </Grid.Col>
              )}

            <Grid.Col span={12}>
              <Textarea
                label="Remark"
                placeholder="Input placeholder"
                value={stockTransaction.destination.destinationRemark}
                onChange={(event) =>
                  onChangeDestination(
                    'destinationStaff',
                    event.currentTarget.value ?? ''
                  )
                }
              />
            </Grid.Col>
          </Grid>
        </Box>
      </Grid.Col>
    </Grid>
  );
};

export default StoreInventoryForm;

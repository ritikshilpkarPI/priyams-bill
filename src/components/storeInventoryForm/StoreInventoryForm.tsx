import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { CONSTANTS } from '../../constants/constants';
import { IconTransfer } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  getSwap,
  resetTransactionDestination,
  resetTransactionSource,
  setTransactionReason,
  resetStoreInventory,
} from '../../redux/stockTransactionManagement/StockTransactionManagement';
import {
  setDealers,
  setDealersLoading,
} from 'src/redux/dealerlist/dealerSlice';
import { getAllDealersAPI } from 'src/utils/apiUtils';
import { pascalCase } from '../../utils/pascalCase';

interface StoreInventoryFormProps {
  onChangeSource: (field: string, value: string | number) => void;
  onChangeDestination: (field: string, value: string | number) => void;
  storesData: { value: string; label: string }[];
  warehouseData: { value: string; label: string }[];
  sourceStaff: { value: string; label: string }[];
  destinationStaff: { value: string; label: string }[];
  disabled?: boolean;
}

const StoreInventoryForm: React.FC<StoreInventoryFormProps> = ({
  onChangeSource,
  onChangeDestination,
  storesData,
  warehouseData,
  sourceStaff,
  destinationStaff,
  disabled = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const stockTransaction = useSelector(
    (state: RootState) => state.stockTransaction
  );
  const sourceTypeData = useSelector(
    (state: RootState) => state.stockTransaction.sourceTypeData
  );
  const destinationTypeData = useSelector(
    (state: RootState) => state.stockTransaction.destinationTypeData
  );

  const { dealers } = useSelector((state: RootState) => state.dealer);

  const dealersList = dealers
    .filter((dealer) => dealer.dealerName?.length)
    .map((dealer) => ({
      value: dealer._id || '',
      label: dealer.dealerName,
    }));

  const [sourceEntityData, setSourceEntityData] = useState<
    { value: string; label: string }[]
  >([]);
  const [destinationEntityData, setDestinationEntityData] = useState<
    { value: string; label: string }[]
  >([]);

  const [overlay, setOverlay] = useState(false);

  const onSelectSource = (lable: string, value: string) => {
    if (stockTransaction.transactionItems.length) {
      setOverlay(true);
    } else {
      if (lable === 'sourceType') {
        onChangeSource('sourceType', value ?? '');
        dispatch(resetTransactionSource());
      } else {
        onChangeSource('sourceEntityId', value ?? '');
      }
    }
  };

  const onSelectdestination = (lable: string, value: string) => {
   
      if (lable === 'destinationType') {
        onChangeDestination('destinationType', value ?? '');
        dispatch(resetTransactionDestination());
      } else {
        onChangeDestination('destinationEntityId', value);
      }
    
  };

  useEffect(() => {
    switch (stockTransaction.source.sourceType) {
      case CONSTANTS.STORE:
        setSourceEntityData(storesData);
        break;
      case CONSTANTS.WAREHOUSE:
        setSourceEntityData(warehouseData);
        break;
      default:
        setSourceEntityData([]);
        break;
    }
  }, [stockTransaction.source.sourceType]);

  useEffect(() => {
    switch (stockTransaction.destination.destinationType) {
      case CONSTANTS.STORE:
        setDestinationEntityData(storesData);
        break;
      case CONSTANTS.WAREHOUSE:
        setDestinationEntityData(warehouseData);
        break;
      case CONSTANTS.DEALER:
        setDestinationEntityData(dealersList);
        break;
      default:
        setDestinationEntityData([]);
        break;
    }
  }, [stockTransaction.destination.destinationType]);

  const getDealers = async () => {
    try {
      dispatch(setDealersLoading(true));
      const response = await getAllDealersAPI();
      dispatch(setDealers(response?.dealers));
    } catch (error) {
      console.error('Failed to fetch dealers:', error);
    } finally {
      dispatch(setDealersLoading(false));
    }
  };

  useEffect(() => {
    getDealers();
  }, []);

  return (
    <Grid>
      <Grid.Col span={isSmallScreen ? 12 : 4}>
        {overlay && (
          <>
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 1,
              }}
            />

            <Box
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                border: '1px solid #dee2e6',
                backgroundColor: '#fff',
                borderRadius: '8px',
                textAlign: 'left',
                padding: '24px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              <Text sx={{ marginBottom: '24px' }}>
                You can’t change source or destination with items added in the
                table. You need to remove all items to change them.
              </Text>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '24px',
                  mt: 3,
                }}
              >
                <Button
                  variant="filled"
                  color="red"
                  onClick={() => {
                    dispatch(resetStoreInventory());
                    setOverlay(false);
                  }}
                >
                  Remove All Items
                </Button>
                <Button
                  variant="filled"
                  color="gray"
                  onClick={() => setOverlay(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </>
        )}

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
                  onSelectSource('sourceType', value ?? '');
                }}
                data={sourceTypeData}
                disabled={disabled}
              />
            </Grid.Col>

            {Boolean(stockTransaction.source.sourceType) && (
              <Grid.Col span={12}>
                <Select
                  label={`Select ${pascalCase(stockTransaction.source.sourceType || '')} `}
                  placeholder={`Pick ${pascalCase(stockTransaction.source.sourceType || '')} `}
                  value={stockTransaction.source.sourceEntityId}
                  onChange={(value) =>
                    onSelectSource('sourceEntityId', value ?? '')
                  }
                  data={sourceEntityData}
                  disabled={disabled}
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
                  disabled={disabled}
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
                disabled={disabled}
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
                  if(disabled) return;
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
                  disabled={disabled}
                />
              </Box>
            </Grid.Col>
          </Grid>
        </Flex>
      </Grid.Col>

      <Grid.Col span={isSmallScreen ? 12 : 4}>
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
                onChange={(value) => {
                  onSelectdestination('destinationType', value ?? '');
                }}
                data={destinationTypeData}
                disabled={disabled}
              />
            </Grid.Col>

            {Boolean(stockTransaction.destination.destinationType) && (
              <Grid.Col span={12}>
                <Select
                  label={`Select ${pascalCase(stockTransaction.destination.destinationType ?? '')}`}
                  placeholder={`Pick ${pascalCase(stockTransaction.destination.destinationType ?? '')}`}
                  value={stockTransaction.destination.destinationEntityId}
                  onChange={(value) => {
                    const selectedValue = value ?? '';
                    onSelectdestination('destinationEntityId', selectedValue);
                  }}
                  data={destinationEntityData}
                  disabled={disabled}
                />
              </Grid.Col>
            )}

            {Boolean(stockTransaction.destination.destinationEntityId) &&
              (stockTransaction.destination.destinationType ===
              CONSTANTS.DEALER ? (
                <Grid.Col span={12}>
                  <TextInput
                    label="Dealer number"
                    disabled={disabled}
                    value={
                      dealers.find(
                        (dealer) =>
                          dealer._id ===
                          stockTransaction.destination.destinationEntityId
                      )?.dealerNumber || ''
                    }
                    
                  />
                </Grid.Col>
              ) : (
                <Grid.Col span={12}>
                  <Select
                    label={'Select staff'}
                    placeholder="Select staff"
                    data={destinationStaff}
                    value={stockTransaction.destination.destinationStaff}
                    onChange={(value) =>
                      onChangeDestination('destinationStaff', value ?? '')
                    }
                    disabled={disabled}
                  />
                </Grid.Col>
              ))}

            <Grid.Col span={12}>
              <Textarea
                label="Remark"
                placeholder="Input placeholder"
                value={stockTransaction.destination.destinationRemark}
                onChange={(event) =>
                  onChangeDestination(
                    'destinationRemark',
                    event.currentTarget.value ?? ''
                  )
                }
                disabled={disabled}
              />
            </Grid.Col>
          </Grid>
        </Box>
      </Grid.Col>
    </Grid>
  );
};

export default StoreInventoryForm;

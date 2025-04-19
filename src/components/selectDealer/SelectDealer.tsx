import { useEffect } from 'react';
import { Select, SelectProps } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { setDealers, setDealersLoading } from 'src/redux/dealerlist/dealerSlice';
import { getAllDealersAPI } from 'src/utils/apiUtils';
import { RootState } from 'src/redux/store'; // make sure this is correctly imported

interface SelectDealerProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const SelectDealer = ({ value, onChange, ...rest }: SelectDealerProps) => {
  const dispatch = useDispatch();
  const { dealers, loading } = useSelector((state: RootState) => state.dealer);

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

  const dealersList = dealers
    .filter((dealer) => dealer.dealerName?.length)
    .map((dealer) => ({
      value: dealer._id || '',
      label: dealer.dealerName,
    }));

  useEffect(() => {
    getDealers();
  }, []);

  return (
    <Select
      value={value}
      onChange={(val) => onChange(val ?? '')}
      data={dealersList}
      searchable
      disabled={loading}
      {...rest}
    />
  );
};

export default SelectDealer;

import { useState } from 'react';
import { Switch, Stack, Modal, Loader } from '@mantine/core';
import { toast } from 'react-toastify';
import { selectGeolocationPermission } from '../../redux/user/userSelectors';
import {
  setGeolocationPermissionGranted,
  setUserDeviceLocation,
} from '../../redux/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getGeoLocation } from 'src/utils/getGeoLocation';
export const GeoLocationPermission = () => {
  const isPermissioned = useSelector(selectGeolocationPermission);
  const [isAllowed, setIsAllowed] = useState<boolean>(isPermissioned);
  const [opened, setOpened] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleToggle = async () => {
    setIsAllowed((prev) => !prev);
    if (!isAllowed) {
      try {
        setLoading(true);
        const position = await getGeoLocation();
        dispatch(setGeolocationPermissionGranted(true));
        dispatch(setUserDeviceLocation(position));
      } catch (error: any) {
        setIsAllowed(false);
        console.error(error);
        toast.error(error?.message);
      } finally {
        setLoading(false);
}
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      closeOnClickOutside={false}
      title="Geolocation Settings"
      centered
    >
      <Stack align="center">
        <Switch
          checked={isAllowed}
          onChange={handleToggle}
          label="Allow Geolocation"
          size="lg"
          disabled={loading || isAllowed}
        />
        {loading && <Loader />}
      </Stack>
    </Modal>
  );
};

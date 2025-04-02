import { useState } from 'react';
import { Switch, Text, Stack, Modal, Loader } from '@mantine/core';
import { toast } from 'react-toastify';
import {
  selectGeolocationPermission,
  selectDeviceLocation,
} from '../../redux/user/userSelectors';
import {
  setGeolocationPermissionGranted,
  setUserDeviceLocation,
} from '../../redux/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getDeviceLocation } from 'src/utils/getDeviceLocationPoints';
export const GeolocationToggle = () => {
  const isGeolocationPermissionGranted = useSelector(
    selectGeolocationPermission
  );
  const deviceLocation = useSelector(selectDeviceLocation);

  const [isAllowed, setIsAllowed] = useState<boolean>(
    isGeolocationPermissionGranted
  );
  const [opened, setOpened] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleToggle = async () => {
    setIsAllowed((prev) => !prev);
    if (!isAllowed) {
      setLoading(true);
      getDeviceLocation()
        .then((position) => {
          dispatch(setGeolocationPermissionGranted(true));
          dispatch(setUserDeviceLocation(position));
        })
        .catch((e) => {
          setIsAllowed(false);
          console.log(e);
          toast.error(e.message);
        })
        .finally(() => setLoading(false));
    } else {
      setIsAllowed(false);
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
        {deviceLocation && (
          <Text size="sm" color="green">
            Latitude: {deviceLocation?.latitude}, Longitude:{' '}
            {deviceLocation?.longitude}
          </Text>
        )}
        {loading && <Loader />}
      </Stack>
    </Modal>
  );
};

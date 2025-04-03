import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectGeolocationPermission } from '../redux/user/userSelectors';
import {
  setGeolocationPermissionGranted,
  setUserDeviceLocation,
} from '../redux/user/userSlice';
import { getGeoLocation } from '../utils/getGeoLocation';
import { checkGeolocationPermission } from 'src/utils/checkGeolocationPermission';
import { GeoLocationPermission } from '../components/GeolocationPermission/GeolocationPermission';

const useGeolocationPermission = () => {
  const dispatch = useDispatch();
  const isGeolocationPermissionGranted = useSelector(
    selectGeolocationPermission
  );

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const granted = await checkGeolocationPermission();
        if(!granted) localStorage.removeItem("storeLocation");
        dispatch(setGeolocationPermissionGranted(granted));
      } catch (error: any) {
        console.error('Geolocation permission denied', error);
        toast.error(error?.message);
      }
    };

    checkPermission();
  }, [dispatch]);

  useEffect(() => {
    const fetchDeviceLocation = async () => {
      if (isGeolocationPermissionGranted) {
        try {
          const position = await getGeoLocation();
          dispatch(setUserDeviceLocation(position));
        } catch (error: any) {
          console.error('Geolocation error', error);
          toast.error(error?.message);
        }
      }
    };

    fetchDeviceLocation();
  }, [isGeolocationPermissionGranted, dispatch]);

  return { isGeolocationPermissionGranted, GeoLocationPermission };
};

export default useGeolocationPermission;

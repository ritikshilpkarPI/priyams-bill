export const getDeviceLocation = (): Promise<DeviceLocationType> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ message: 'Geolocation is not supported by this browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        localStorage.setItem("location",JSON.stringify(location));
        resolve(location);
      },
      (error) => {
        reject({ message: error.message });
      }
    );
  });
};

export const checkGeolocationPermissionGranted = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!navigator.permissions) {
      reject({ message: 'Permissions API is not supported by this browser.' });
      return;
    }

    navigator.permissions
      .query({
        name: 'geolocation',
      })
      .then(({ state }) => {
        resolve(state === 'granted');
      })
      .catch((e) => {
        reject({ message: e?.message });
      });
  });
};

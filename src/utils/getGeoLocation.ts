export const getGeoLocation = (): Promise<DeviceLocationType> => {
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
        localStorage.setItem("storeLocation",JSON.stringify(location));
        resolve(location);
      },
      (error) => {
        reject({ message: error.message });
      }
    );
  });
};


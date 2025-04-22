export const checkGeolocationPermission = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!navigator.permissions) {
      reject({ message: 'Permissions API is not supported by this browser.' });
      return;
    }

    navigator.permissions
      .query({ name: 'geolocation' })
      .then(({ state }) => resolve(state === 'granted'))
      .catch((e) => reject({ message: e?.message }));
  });
};

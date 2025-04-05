export const selectUser = (state: RootState) => state.user;
export const selectGeolocationPermission = (state: RootState) => state.user.isGeolocationPermissionGranted;
export const selectDeviceLocation = (state: RootState) => state.user.userDeviceLocation;

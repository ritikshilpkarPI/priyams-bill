import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserStateType = {
  isGeolocationPermissionGranted: false,
  userDeviceLocation: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setGeolocationPermissionGranted: (state,action) => {
      state.isGeolocationPermissionGranted = action.payload;
    },
    setUserDeviceLocation: (state,action: PayloadAction<DeviceLocationType>) => {
      state.userDeviceLocation = action.payload;
    },
  },
});

export const { 
  setGeolocationPermissionGranted,
  setUserDeviceLocation,
 } = userSlice.actions;

export default userSlice.reducer;

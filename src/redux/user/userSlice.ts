import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import MESSAGES from 'src/utils/constants/messages';
let defaultStoreData = {
  name: '',
  number: '',
  pincode: '',
};

  const stored = localStorage.getItem('storeData');
  if (stored) {
    defaultStoreData = JSON.parse(stored);
  }else{
    console.log(MESSAGES.NO_STORE_DATA_FOUND_IN_LOCAL_STORAGE)
  }

const initialState: UserStateType = {
  isGeolocationPermissionGranted: false,
  userDeviceLocation: {},
  storeData: defaultStoreData,
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
    setStoreData: (state, action: PayloadAction<StoreDataType>) => {
      state.storeData = action.payload;
    },
  },
});

export const { 
  setGeolocationPermissionGranted,
  setUserDeviceLocation,
  setStoreData
 } = userSlice.actions;

export default userSlice.reducer;

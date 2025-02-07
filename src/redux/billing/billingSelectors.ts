import { RootState } from '../store';

export const selectBillingItems = (state: RootState) => state.billing.items;


import { RootState } from '../store';
export const selectItemsFeedData = (state: RootState) => state.allItemsFeedData.itemsFeedData;
export const isLoading = (state: RootState) => state.allItemsFeedData.loading;
import { RootState } from '../store';
export const selectItemsFeedData = (state: RootState) => state.allItemsFeedData.itemsFeedData;
export const itemsFeedAPILoading = (state: RootState) => state.allItemsFeedData.itemsFeedAPILoading;
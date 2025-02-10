import { RootState } from '../store';
export const selectItemsFeedData = (state: RootState) => state.allItemsFeedData.itemsFeedData;
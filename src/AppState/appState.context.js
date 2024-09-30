import { createContext, useReducer } from 'react';

import { billItems, billItemReducer } from './reducers/billItem.reducer';
import { expenseList, expenseReducer } from './reducers/expense.reducer';
import {
  purchaseItems,
  purchaseItemReducer,
  purchaseNewItemInput,
  purchaseNewItemInputReducer,
} from './reducers/purchaseItem.reducer';
import { returnBillItemReducer, exchangeBillItems } from './reducers/returnbillItem.reducer';

export const AppStateContext = createContext();

export const AppStateContextProvider = ({ children }) => {
  const returnBillItemsStateAndDispatch = useReducer(returnBillItemReducer, exchangeBillItems);
  const billItemsStateAndDispatch = useReducer(billItemReducer, billItems);
  const expenseItemsStateAndDispatch = useReducer(expenseReducer, expenseList);
  const purchaseItemsStateAndDispatch = useReducer(
    purchaseItemReducer,
    purchaseItems
  );
  const purchaseInputItemStateAndDispatch = useReducer(
    purchaseNewItemInputReducer,
    purchaseNewItemInput
  );

  return (
    <AppStateContext.Provider
      value={{
        billItemsStateAndDispatch,
        expenseItemsStateAndDispatch,
        purchaseItemsStateAndDispatch,
        purchaseInputItemStateAndDispatch,
        returnBillItemsStateAndDispatch
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

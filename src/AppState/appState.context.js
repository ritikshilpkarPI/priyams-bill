import { createContext, useReducer } from "react";

import { itemsList, itemsReducer } from "./reducers/items.reducer";
import { billItems, billItemReducer } from "./reducers/billItem.reducer";
import { expenseList, expenseReducer } from "./reducers/expense.reducer";
import {purchaseItems, purchaseItemReducer} from "./reducers/purchaseItem.reducer";


export const AppStateContext = createContext();

export const AppStateContextProvider = ({ children }) => {
  const itemsStateAndDispatch = useReducer(itemsReducer, itemsList);
  const billItemsStateAndDispatch = useReducer(billItemReducer, billItems);
  const expenseItemsStateAndDispatch = useReducer(expenseReducer, expenseList);
  const purchaseItemsStateAndDispatch = useReducer(purchaseItemReducer, purchaseItems);
  
  return (
    <AppStateContext.Provider
      value={{
        itemsStateAndDispatch,
        billItemsStateAndDispatch,
        expenseItemsStateAndDispatch,
        purchaseItemsStateAndDispatch
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

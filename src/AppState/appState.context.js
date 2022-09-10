import { createContext, useReducer } from "react";

import { itemsList, itemsReducer } from "./reducers/items.reducer";
import { billItems, billItemReducer } from "./reducers/billItem.reducer";

export const AppStateContext = createContext();

export const AppStateContextProvider = ({ children }) => {
  const itemsStateAndDispatch = useReducer(itemsReducer, itemsList);
  const billItemsStateAndDispatch = useReducer(billItemReducer, billItems);
  
  return (
    <AppStateContext.Provider
      value={{
        itemsStateAndDispatch,
        billItemsStateAndDispatch
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

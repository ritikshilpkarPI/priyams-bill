import { createContext, useReducer } from "react";

import { itemsList, itemsReducer } from "./reducers/items.reducer";
export const AppStateContext = createContext();

export const AppStateContextProvider = ({ children }) => {
  const itemsStateAndDispatch = useReducer(itemsReducer, itemsList);
  return (
    <AppStateContext.Provider
      value={{
        itemsStateAndDispatch,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

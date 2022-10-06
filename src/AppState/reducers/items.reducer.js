export const itemsList = [];

export const itemsReducer = (state = itemsList, action) => {
  switch (action.type) {
    case "NEW_ITEMS_LIST":
    case "UPDATE_ITEMS_LIST":
      return [...action.payload];
    case "ADD_NEW_ITEM_TO_LIST":
      return [{ ...action.payload }, ...state];
    default:
      return state;
  }
};

export const itemsList = [];

export const itemsReducer = (state = itemsList, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, ...action.payload];
    case "UPDATE_LIST":
      return [...action.payload];
    default:
      return state;
  }
};

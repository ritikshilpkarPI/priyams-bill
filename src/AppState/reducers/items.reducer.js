export const itemsList = [];

export const itemsReducer = (state = itemsList, action) => {
  switch (action.type) {
    case "ADD_ITEM":
    case "UPDATE_ITEM":
    case "DELETE_ITEM":
      return [...state, ...action.payload];
    default:
      return state;
  }
};

const purchaseItems = [];
const purchaseNewItemInput = [];

const purchaseItemReducer = (state = purchaseItems, action) => {
  switch (action.type) {
    case "UPDATE_PURCHASE_ITEMS_LIST":
      return (state = action.payload);
    default:
      return state;
  }
};

const purchaseNewItemInputReducer = (state = purchaseNewItemInput, action) => {
  switch (action.type) {
    case "UPDATE_PURCHASE_INPUT_ITEM":
      console.log("itemInput", action.payload);
      return (state = action.payload);
    default:
      return state;
  }
};

export {
  purchaseItems,
  purchaseItemReducer,
  purchaseNewItemInput,
  purchaseNewItemInputReducer,
};

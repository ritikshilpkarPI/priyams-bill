const exchangeBillItems = [];

const returnBillItemReducer = (state = exchangeBillItems, action) => {
  switch (action.type) {
    case 'RETURN_BILL_ITEMS_LIST':
      return (state = action.payload);
    case 'RETURN_REFRESH_BILL_ITEMS_LIST':
      return (state = action.payload);
    default:
      return state;
  }
};

export { exchangeBillItems, returnBillItemReducer };

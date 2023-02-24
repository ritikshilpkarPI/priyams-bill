const billItems = [];

const billItemReducer = (state = billItems, action) => {
  switch (action.type) {
    case 'BILL_ITEMS_LIST':
      return (state = action.payload);
    case 'REFRESH_BILL_ITEMS_LIST':
      return (state = action.payload);
    default:
      return state;
  }
};

export { billItems, billItemReducer };

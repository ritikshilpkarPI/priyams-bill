const expenseList = [];

const expenseReducer = (state = expenseList, action) => {
    switch (action.type) {
        case "EXPENSE_LIST":
            return state = action.payload;
        case "REFRESH_EXPENSE_LIST":
            return state = action.payload;
        default:
            return state
    }
}

export { expenseList, expenseReducer };
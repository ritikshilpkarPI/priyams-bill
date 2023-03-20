import getStaff from "./getStaff";
import addBulkItems from "./addBulkItems";
import addDailyAttendanceArrival from "./addDailyAttendanceArrival";
import addDailyAttendanceLeaving from "./addDailyAttendanceLeaving";
import addItems from "./addItems";
import addExpense from "./addExpense";
import addNewBill from "./addNewBill";
import addOpenCloseProcedure from "./addOpenCloseProcedure";
import addOrder from "./addOrder";
import addStaff from "./addStaff";
import approveOrder from "./approveOrder";
import deleteBill from "./deleteBill";
import deleteExpense from "./deleteExpense";
import deleteOrderItemById from "./deleteOrderItemById";
import deletePaymentById from "./deletePaymentById";
import deleteStaff from "./deleteStaff";
import draftOrder from "./draftOrder";
import editBill from "./editBill";
import editItemById from "./editItemById";
import editOpenCloseProcedure from "./editOpenCloseProcedure";
import filterExpiryDates from "./filterExpiryDates";
import getAllBill from "./getAllBill";
import getAllProcedure from "./getAllProcedure";
import getDateRangeReport from "./getDateRangeReport";
import getDatesWiseAttendance from "./getDatesWiseAttendance";
import getDayWiseBills from "./getDayWiseBills";
import getDayWiseProcedures from "./getDayWiseProcedures";
import getDetailsById from "./getDetailsById";
import getEditBill from "./getEditBill";
import getItemsCategoryList from "./getItemsCategoryList";
import getItemsFeed from "./getItemsFeed";
import getMonthlyAttendance from "./getMonthlyAttendance";
import getOrders from "./getOrders";
import getOrdersByQuery from "./getOrdersByQuery";
import getPurchaseOrderByItem from "./getPurchaseOrderByItem";
// import loginUser from "./loginUser";
const loginUser = require("./loginUser")
import logoutUser from "./logoutUser";
import markAbsent from "./markAbsent";
import permanentlyOutOfStock from "./permanentlyOutOfStock";
import rejectOrder from "./rejectOrder";
import saveInventory from "./saveInventory";
import saveOrder from "./saveOrder";
import savePayment from "./savePayment";
import sendAllExpense from "./sendAllExpense";
import sendDayExpenses from "./sendDayExpenses";
import sendMessage from "./sendMessage";
import softDeleteItem from "./softDeleteItem";
import updateDetailsById from "./updateDetailsById";
import updateExpense from "./updateExpense";
import updateOrderByIndex from "./updateOrderByIndex";
import updatePaymentById from "./updatePaymentById";
import updateSavedOrders from "./updateSavedOrders";
import updateSavedPayment from "./updateSavedPayment";
import updateStaff from "./updateStaff";
import userDetails from "./userDetails";


module.exports = {
    getStaff,
    addBulkItems,
    addDailyAttendanceArrival,
    addDailyAttendanceLeaving,
    addItems,
    addExpense,
    addNewBill,
    addOpenCloseProcedure,
    addOrder,
    addStaff,
    approveOrder,
    deleteBill,
    deleteExpense,
    deleteOrderItemById,
    deletePaymentById,
    deleteStaff,
    draftOrder,
    editBill,
    editItemById,
    editOpenCloseProcedure,
    filterExpiryDates,
    getAllBill,
    getAllProcedure,
    getDateRangeReport,
    getDatesWiseAttendance,
    getDayWiseBills,
    getDayWiseProcedures,
    getDetailsById,
    getEditBill,
    getItemsCategoryList,
    getItemsFeed,
    getMonthlyAttendance,
    getOrders,
    getOrdersByQuery,
    getPurchaseOrderByItem,
    loginUser,
    logoutUser,
    markAbsent,
    permanentlyOutOfStock,
    rejectOrder,
    saveInventory,
    saveOrder,
    savePayment,
    sendAllExpense,
    sendDayExpenses,
    sendMessage,
    softDeleteItem,
    updateDetailsById,
    updateExpense,
    updateOrderByIndex,
    updatePaymentById,
    updateSavedOrders,
    updateSavedPayment,
    updateStaff,
    userDetails,
}
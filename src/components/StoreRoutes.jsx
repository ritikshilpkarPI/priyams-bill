import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Suspense } from 'react';
import CustomerBill from '../Pages/CustomerBill';
import ProtectedRoutes from '../components/ProtectedRoutes';
import ProtectedComponent from '../components/ProtectedComponent';
import access from '../access';
import {
  Home,
  BillFeed,
  Billing,
  DayWiseBillFeed,
  EditBill,
  ItemsList,
  OpenClose,
  StockQuantity,
  Report,
  Login,
  PurchaseOrder,
  Attendance,
  Approval,
  ExpiredItems,
} from '../Pages';
import Label from 'src/Pages/Label';

const StoreRoutes = ({ loaderDisplay, setLoaderDisplay }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route
          exact
          path="/showBill/:customerBillId"
          component={CustomerBill}
        />
        <div style={{ marginLeft: '100px' }}>
          <ProtectedRoutes>
            <Route
              path="/billing"
              exact
              render={() => (
                <Billing
                  loaderDisplay={loaderDisplay}
                  setLoaderDisplay={setLoaderDisplay}
                />
              )}
            />
            <Route path="/openClose" component={OpenClose} />
            <Route exact path="/inventory" component={ItemsList} />
                   <Route exact path="/" component={Home} />

            <ProtectedComponent role={access.DAY_BILL_ROUTE}>
              <Route exact path="/dayBill" component={DayWiseBillFeed} />

              {console.log('running')}
            </ProtectedComponent>
            <Route exact path="/attendance" component={Attendance} />
            <Route exact path="/stockquantity" component={StockQuantity} />
            <Route exact path="/allBill" component={BillFeed} />
            <Route exact path="/purchase" component={PurchaseOrder} />
            <Route exact path="/purchase/:id" component={PurchaseOrder} />
            {/* <Route exact path="/purchase/:id" component={PurchaseOrder} /> */}
            <ProtectedComponent role={access.REPORT_PAGE_ROUTE}>
              <Route exact path="/report" component={Report} />
            </ProtectedComponent>
            <Route exact path="/edit/:billingID" component={EditBill} />
            <Route exact path="/approval" component={Approval} />
            <Route exact path="/expiredItems" component={ExpiredItems} />
            <Route exact path="/label" component={Label} />
          </ProtectedRoutes>
        </div>
      </Switch>
    </Suspense>
  );
};
export default StoreRoutes;

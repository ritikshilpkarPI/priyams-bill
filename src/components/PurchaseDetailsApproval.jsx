import React, { useState } from 'react';
import PurchaseListApproval from './PurchaseListApproval';
import { Button, Table } from '@mantine/core';
import '../CSS/purchaseApproval.css';

import ShowPurchaseOrderTable from './ShowPurchaseOrderTable';
import ShowOrderDetailTable from './ShowOrderDetailTable';
import BillUploaderDetails from './BillUploaderDetails';

const PurchaseDetailsApproval = ({
  allPurchaseList,
  setAllPurchaseList,
  getOrders,
}) => {
  const [indexDetail, setIndexDetail] = useState(-1);
  
  
  return (
    <div className="purchase-approval">
      <h3>Purchase Details, approval required</h3>
      {/* permanently removed */}
      {/* <Select
        style={{ width: "200px", margin: "2vmin auto" }}
        label="Sort By"
        placeholder="All orders"
        data={role === "admin" ? adminList : manageList}
        // value={option.toLowerCase()}
        // defaultValue={option.toLowerCase()}
        onChange={getOrders}
      />  */}

      {allPurchaseList.length === 0 ? (
        <div className="message">No Orders</div>
      ) : (
        <Table className="purchase-list" withColumnBorders striped withBorder>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Dealer Name</th>
              <th>Phone Number</th>
              <th>Payment</th>
              <th>Total Bill Amount</th>
              <th>Paid Amount</th>
              <th>Procurement Source</th>
              <th>Created At</th>
              <th>Remark</th>
              <th>Share</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allPurchaseList
              ?.map((list, index) => {
                const isShelfExpired = list?.purchasedItems?.find(purchaseItem => purchaseItem?.expiryDates?.find(expiryDate => expiryDate?.isShelfExpired));
                return indexDetail >= 0 ? (
                  index === indexDetail ? (
                    <tr key={index} className={`${`${isShelfExpired ? 'shelf-expired-item-table-row' : 'N'}`}`}>
                      <PurchaseListApproval
                        allPurchaseList={allPurchaseList}
                        setAllPurchaseList={setAllPurchaseList}
                        list={list}
                        index={index}
                        setIndexDetail={setIndexDetail}
                        getOrders={getOrders}
                      />
                    </tr>
                  ) : (
                    <div key={index}></div>
                  )
                ) : (
                  <tr key={index} className={`${`${isShelfExpired ? 'shelf-expired-item-table-row' : 'N'}`}`}>
                    <PurchaseListApproval
                      allPurchaseList={allPurchaseList}
                      setAllPurchaseList={setAllPurchaseList}
                      list={list}
                      index={index}
                      setIndexDetail={setIndexDetail}
                      getOrders={getOrders}
                    />
                  </tr>
                );
              })
             }
          </tbody>
        </Table>
      )}
      {indexDetail >= 0 ? (
        <>
          <div className="closebtn">
            <Button onClick={() => setIndexDetail(-1)}>Close</Button>
          </div>
          <ShowPurchaseOrderTable purchaseList={allPurchaseList[indexDetail]} />
          <ShowOrderDetailTable purchaseList={allPurchaseList[indexDetail]} />
          <BillUploaderDetails
            cloudBills={allPurchaseList[indexDetail]['billPhotos']}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PurchaseDetailsApproval;

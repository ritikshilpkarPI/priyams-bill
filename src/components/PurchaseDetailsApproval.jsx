import React, { useState } from 'react';
import PurchaseListApproval from './PurchaseListApproval';
import { Button, Table } from '@mantine/core';
import '../CSS/purchaseApproval.css';

import { useQueryParam } from 'src/utils/getQuery';
import { CustomChip } from './customChip';
const PurchaseDetailsApproval = ({
  allPurchaseList,
  setAllPurchaseList,
  getOrders,
}) => {
  const option = useQueryParam('option');
  const [indexDetail, setIndexDetail] = useState(-1);
  
  console.log({indexDetail});
  
  return (
    <div className="purchase-approval">
      <CustomChip labelClassName={"custom-chip-label"} label={option}/>
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
      
    </div>
  );
};

export default PurchaseDetailsApproval;

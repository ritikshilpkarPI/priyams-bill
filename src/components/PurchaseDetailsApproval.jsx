import React, { useState } from 'react';
import PurchaseListApproval from './PurchaseListApproval';
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

  return (
    <div className="purchase-approval">
      <CustomChip labelClassName="custom-chip-label" label={option} />

      {allPurchaseList.length === 0 ? (
        <div className="message">No Orders</div>
      ) : (
        <PurchaseListApproval
          allPurchaseList={allPurchaseList}
          setAllPurchaseList={setAllPurchaseList}
          getOrders={getOrders}
          setIndexDetail={setIndexDetail}
          indexDetail={indexDetail}
        />
      )}
    </div>
  );
};

export default PurchaseDetailsApproval;

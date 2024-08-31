import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { genericAxios } from 'src/utils/genericAxiosMethod';

const PayPurchaseOrderBill = () => {
  const location = useLocation();
  const [unpaidPurchaseOrderData, setUnpaidPurchaseOrderData] = useState();
  const getPurchaseOrderdetails = async ({ poId }) => {
    try {
      const response = await genericAxios({
        method: API_METHODS.POST,
        url: '/api/purchaseOrder/getPurchaseOrderById',
        data: {
          id: poId,
        },
      });

      if (response.status === 200 && response.data) {
        setUnpaidPurchaseOrderData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const poId = searchParams.get('poId');
    getPurchaseOrderdetails({ poId });
  }, []);
  console.log({unpaidPurchaseOrderData});
  
  return (
    <div>
      <h1>Payment Purchase Order Bill</h1>
      {unpaidPurchaseOrderData ? (
        <img src={unpaidPurchaseOrderData?.billPhotos[0]?.secure_url} alt="" />
        
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};
export default PayPurchaseOrderBill;

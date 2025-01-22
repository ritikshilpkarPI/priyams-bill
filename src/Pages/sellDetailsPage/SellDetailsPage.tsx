import React from 'react';
import { LineGraph } from '../../components/lineGraph/LineGraph';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';

const SellDetailsPage = () => {
  const sampleData = {
    data: {
      items: [
        {
          itemName: "Sample Item",
          itemPrise: 150,
          soldAfterApproval: 100,
          soldInLastMonth: 50,
          soldInLastThreeMonths: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 165 },
            { date: "10:24:25", value: 172 },
          ],
          soldInLastYear: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 165 },
            { date: "10:24:25", value: 172 },
            { date: "10:26:25", value: 168 },
            { date: "10:28:25", value: 175 },
            { date: "10:28:24", value: 150 },
            { date: "10:24:24", value: 160 },
          ],
          lastThreePurchaseOrder:[
            { orderSequence:"First", approvalDate: "2024-01-10", amount: 100, costPrice: 50 },
            { orderSequence:"Second", approvalDate: "2023-12-10", amount: 80, costPrice: 40 },
            { orderSequence:"Third", approvalDate: "2023-11-10", amount: 60, costPrice: 30 }
          ],
        },
        {
          itemName: "Sample Item 2", 
          itemPrise: 150,
          soldAfterApproval: 100,
          soldInLastMonth: 50,
          soldInLastThreeMonths: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 160 },
            { date: "10:24:25", value: 172 },
          ],
          soldInLastYear: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 165 },
            { date: "10:24:25", value: 172 },
            { date: "10:26:25", value: 168 },
            { date: "10:28:25", value: 175 },
            { date: "10:28:24", value: 150 },
            { date: "10:28:23", value: 160 },
          ],
          lastThreePurchaseOrder:[
            { orderSequence:"First", approvalDate: "2024-01-10", amount: 100, costPrice: 50 },
            { orderSequence:"Second", approvalDate: "2023-12-10", amount: 80, costPrice: 40 },
            { orderSequence:"Third", approvalDate: "2023-11-10", amount: 60, costPrice: 30 }
          ],
        },
        {
          itemName: "Sample Item 3", 
          itemPrise: 150,
          soldAfterApproval: 100,
          soldInLastMonth: 50,
          soldInLastThreeMonths: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 160 },
            { date: "10:24:25", value: 172 },
          ],
          soldInLastYear: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 165 },
            { date: "10:24:25", value: 172 },
            { date: "10:26:25", value: 168 },
            { date: "10:28:25", value: 175 },
            { date: "10:28:24", value: 150 },
            { date: "10:28:23", value: 160 },
            { date: "10:27:23", value: 155 },
            { date: "10:26:23", value: 162 },
            { date: "10:25:23", value: 160 },
            { date: "10:24:23", value: 140 },
            { date: "10:23:23", value: 145 },
          ],
          lastThreePurchaseOrder:[
            { orderSequence:"First", approvalDate: "2024-01-10", amount: 100, costPrice: 50 },
            { orderSequence:"Second", approvalDate: "2023-12-10", amount: 80, costPrice: 40 },
            { orderSequence:"Third", approvalDate: "2023-11-10", amount: 60, costPrice: 30 }
          ],
        },
        {
          itemName: "Sample Item 4", 
          itemPrise: 150,
          soldAfterApproval: 100,
          soldInLastMonth: 50,
          soldInLastThreeMonths: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 160 },
            { date: "10:24:25", value: 172 },
          ],
          soldInLastYear: [
            { date: "10:20:25", value: 157 },
            { date: "10:22:25", value: 165 },
            { date: "10:24:25", value: 172 },
            { date: "10:26:25", value: 168 },
            { date: "10:28:25", value: 175 },
            { date: "10:28:24", value: 150 },
            { date: "10:28:23", value: 160 },
          ],
          lastThreePurchaseOrder:[
            { orderSequence:"First", approvalDate: "2024-01-10", amount: 100, costPrice: 50 },
            { orderSequence:"Second", approvalDate: "2023-12-10", amount: 80, costPrice: 40 },
            { orderSequence:"Third", approvalDate: "2023-11-10", amount: 60, costPrice: 30 }
          ],
        },
      ],
    },
    status: "true",
    statusCode: 200,
    message: "Sold item found successfully",
  };

  return (
    <div>
      <h1>Sell Details Page</h1>
      <SellDetailsTable tableData={sampleData.data.items} />
    </div>
  );
};

export default SellDetailsPage;
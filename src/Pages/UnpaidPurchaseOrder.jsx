import React from 'react'
import { useLocation } from 'react-router-dom'
import "../CSS/unpaidPurchaseOrder.css"
const UnpaidPurchaseOrder = () => {
    const location = useLocation();
    const { data } = location.state || {};
    console.log(data);
    console.log(data?.paidStatus?.purchasedItems);


    return (
        <div className='unpaidPurchaseOrder-container'>
            <h1 className='unpaidPurchaseOrder-title'>UnpaidPurchaseOrder</h1>
            <div className='unpaidPurchaseOrder-details'>
                <table className='unpaidPurchaseOrder-table'>
                    <thead className='unpaidPurchaseOrder-table-thead'>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Dealer Name</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.dealerName}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>PhoneNumber</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.phoneNumber}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Payment</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.payment}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>BillAmount</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.billAmount}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Total Paid Amount</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.totalPaidAmount}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Procurement Source</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.procurementSource}</th>
                        </tr>

                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Created At</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.createdAt}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Remark</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.remark ? data?.paidStatus?.remark : "..."}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Is Paid</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.isPaid ? "Paid" : "Unpaid"}</th>
                        </tr>
                    </thead>
                </table>
               
                    <div className='unpaidPurchaseOrder-bill-container'>
                        <img src={data?.paidStatus?.billPhotos[0]?.secure_url} alt="" />
                    </div>
            
            </div>
            <h3 className='unpaidPurchaseOrder-text'>Items</h3>
            {data?.paidStatus?.purchasedItems?.length &&
                <table className='unpaidPurchaseOrder-items-table'>
                    <thead className='unpaidPurchaseOrder-items-table-thead'>
                        <tr className='unpaidPurchaseOrder-items-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>inputName</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>brand</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>category</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>costPrice</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>sellingPrice</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>unit</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>createdAt</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>expiryDates</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>currentStock</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>itemQuantity</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th' >itemRemark</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>minimumQuantity</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>mrp</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>stockQuantity</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>validate</th>
                            <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>barcode</th>
                        </tr>
                    </thead>
                    <tbody className='unpaidPurchaseOrder-items-table-tbody'>
                        {data?.paidStatus?.purchasedItems.map((item) => (
                            <tr className='unpaidPurchaseOrder-items-table-tbody-tr'>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.inputName}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.brand}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.category}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.costPrice}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.sellingPrice}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.unit}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.createdAt}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{new Date(item?.expiryDates[0].date).toUTCString()}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.currentStock}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.itemQuantity}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.itemRemark ? item?.itemRemark : "..."}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.minimumQuantity}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.mrp}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.stockQuantity}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.validate ? "True" : "False"}</td>
                                <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{item?.barcode}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            }



        </div>
    )
}

export default UnpaidPurchaseOrder
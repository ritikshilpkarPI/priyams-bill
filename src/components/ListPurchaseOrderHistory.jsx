import React, { useEffect, useState } from 'react'
import { Axios } from "src/utils/axios";
import { useParams } from "react-router-dom";
import { Loader, Table } from '@mantine/core';
import ShowOrderDetailTable from './PurchaseApproval/ShowOrderDetailTable';
const ItemListPurchaseOrderHistory = (props) => {
    const [purchaseOrderList,setPurchaseOrderList]=useState([]);
    const [loader, setLoader] = useState(true);
    let { id } = useParams();
    useEffect(() => {
        const ItemData = async () => {
            setLoader(true);
            try {
                const data = await Axios.request({
                    url: `/api/purchaseOrder/orderDetails/${id}`,
                    method: "GET",
                });
                setPurchaseOrderList(data.data.data)
                setLoader(false);
            } catch (error) {

            }
        };

        ItemData();
    }, [id])

    const {dealerName,phoneNumber,payment,billAmount,totalPaidAmount,procurementSource,createdAt,remark}=purchaseOrderList
    return (
        <>
            {loader ?
                (
                    <div
                        style={{
                            height: "50vh",
                            width: "350%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Loader size="md" />
                    </div>
                )
                : (
                    <>
                        <h3>Purchase Details</h3>
                        <Table withColumnBorders striped withBorder>
                            <thead>
                                <tr>
                                    <th>Dealer Name</th>
                                    <th>Phone Number</th>
                                    <th>Payment</th>
                                    <th>Bill Amount</th>
                                    <th>Paid Amount</th>
                                    <th>Procurement Source</th>
                                    <th>Created At</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    purchaseOrderList ?
                                        (<>
                                            <tr>
                                                <td>{dealerName}</td>
                                                <td>{phoneNumber}</td>
                                                <td>{payment}</td>
                                                <td>{billAmount}</td>
                                                <td>{totalPaidAmount}</td>
                                                <td>{procurementSource}</td>
                                                <td>{new Date(createdAt).toLocaleDateString()}</td>
                                                <td>{remark}</td>
                                            </tr>
                                        </>)
                                        : ""
                                }
                            </tbody>
                        </Table>
                        <ShowOrderDetailTable purchaseList={purchaseOrderList} />
                    </>
                )
            }

        </>
    )
}

export default ItemListPurchaseOrderHistory
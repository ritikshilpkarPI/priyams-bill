import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Axios } from "src/utils/axios";
import { Table, Loader } from '@mantine/core';

const PerItemListPurchaseOrder = () => {
    const [response, setResponse] = useState([]);
    const [loader, setLoader] = useState(false);

    let { id } = useParams();

    useEffect(() => {
        const ItemsData = async () => {
            setLoader(true);
            try {
                console.log(id)
                const data = await Axios.request({
                    url: `/api/purchaseOrder/individualPurchaseOrder/${id}`,
                    method: "GET",
                });
                setResponse(data.data.message.result)
                setLoader(false);
            } catch (error) {

            }
        };

        ItemsData()

    },[id])
    console.log(response);
    return (
        <div>
            {loader ? (
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
            ) : (
                <>
                    <h1>Purchase Order Details for {id}</h1>
                    <Table striped highlightOnHover withBorder withColumnBorders>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Barcode</th>
                                <th>Qty</th>
                                <th>Stock Quantity</th>
                                <th>Min Qty</th>
                                <th>MRP</th>
                                <th>CostPrice</th>
                                <th>Selling Price</th>
                                <th>Expiry Date</th>
                                <th>Dealer's Name</th>
                            </tr>
                        </thead>
                        {
                            response.map((ele, index) => {
                                return (
                                    <tbody>
                                        <tr>

                                            {
                                                ele.itemDetails.slice(0,1).map((item, index) => {
                                                    return (
                                                        <>
                                                            <td>
                                                                {item.category}
                                                            </td>
                                                            <td>
                                                                {item.brand}
                                                            </td>
                                                            <td>
                                                                {item.barcode}
                                                            </td>
                                                            <td>
                                                                {item.itemQuantity}
                                                            </td>
                                                            <td>
                                                                {item.stockQuantity}
                                                            </td>
                                                            <td>
                                                                {item.minimumQuantity}
                                                            </td>
                                                            <td>
                                                                {item.mrp}
                                                            </td>
                                                            <td>
                                                                {item.costPrice}
                                                            </td>
                                                            <td>
                                                                {item.sellingPrice}
                                                            </td>
                                                            <td>
                                                                {new Date(item.expiryDates[0].date).toLocaleDateString()}
                                                            </td>
                                                            {/* <td>
                                                                {item.slabPrice.length}
                                                            </td> */}
                                                        </>
                                                    )
                                                })
                                            }
                                            <td>
                                                {ele._id}
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            })
                        }
                    </Table>
                </>
            )}

        </div>
    );
};

export default PerItemListPurchaseOrder;

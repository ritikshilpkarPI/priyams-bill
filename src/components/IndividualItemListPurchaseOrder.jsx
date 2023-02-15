import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Axios } from "src/utils/axios";
import { Table, Loader,Button } from '@mantine/core';
import { Link } from "react-router-dom";
const PerItemListPurchaseOrder = () => {
    const [individualItemPurchaseDetail,setIndividualItemPurchaseDetail]=useState([]);
    const [loader, setLoader] = useState(false);

    let { id } = useParams();

    useEffect(() => {
        const itemsData = async () => {
            setLoader(true);
            try {
                const data = await Axios.request({
                    url: `/api/purchaseOrder/individualPurchaseOrder/${id}`,
                    method: "GET",
                });
                setIndividualItemPurchaseDetail(data.data.message.result)
                setLoader(false);
            } catch (error) {

            }
        };

        itemsData()

    }, [id])
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
                    <Table striped highlightOnHover withBorder withColumnBorders style={{width:"auto"}}>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Barcode</th>
                                <th>Qty</th>
                                <th>Stock Qty</th>
                                <th>Min Qty</th>
                                <th>MRP</th>
                                <th>CP</th>
                                <th>SP</th>
                                <th>Expiry Date</th>
                                <th>Slab Price</th>
                                <th>Dealer's Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        {
                            individualItemPurchaseDetail.map((ele, index) => {
                                return (
                                    <tbody>
                                        <tr key={index}>

                                            {
                                                ele.itemDetails.slice(0, 1).map((item, index) => {
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
                                                                {Number(item.costPrice).toFixed(2)}
                                                            </td>
                                                            <td>
                                                                {item.sellingPrice}
                                                            </td>
                                                            <td>
                                                                {new Date(item.expiryDates[0].date).toLocaleDateString()}
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    {item.slabPrice?.map((arrEle,index) => {
                                                                        return (
                                                                            <div key={index} style={{ display: "flex" }}>
                                                                                <input
                                                                                    type="number"
                                                                                    style={{
                                                                                        width: "40px",
                                                                                        textAlign: "center",
                                                                                        border: "none",
                                                                                        outline: "none",
                                                                                    }}
                                                                                    value={arrEle[1]}
                                                                                    disabled
                                                                                />{" "}
                                                                                -
                                                                                <input
                                                                                    type="number"
                                                                                    style={{
                                                                                        width: "40px",
                                                                                        textAlign: "center",
                                                                                        border: "none",
                                                                                        outline: "none",
                                                                                    }}
                                                                                    disabled
                                                                                    defaultValue={
                                                                                        index !== item.slabPrice.length - 1
                                                                                          ? Number(
                                                                                            item.slabPrice[index + 1][1]
                                                                                            ) - 1
                                                                                          : ""
                                                                                      }
                                                                                />{" "}
                                                                                =
                                                                                <input
                                                                                    type="number"
                                                                                    style={{
                                                                                        width: "40px",
                                                                                        textAlign: "center",
                                                                                        border: "none",
                                                                                        outline: "none",
                                                                                    }}
                                                                                    value={arrEle[2]}
                                                                                    disabled
                                                                                />
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </td>
                                                        </>
                                                    )
                                                })
                                            }
                                            <td>
                                                {ele._id}
                                            </td>
                                            <td>
                                                <Link to={{
                                                    pathname: `/purchaseorder/${ele.dealerId}`
                                                }}>
                                                    <Button> Show PR</Button>
                                                </Link>
                                                
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

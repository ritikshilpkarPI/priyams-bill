import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import "../CSS/unpaidPurchaseOrder.css"
import Next from '../icons/next'
import Preview from '../icons/preview'
import WhatsApp from 'src/icons/whatsApp'
// import { Carousel } from 'react-responsive-carousel';
const UnpaidPurchaseOrder = () => {
    const location = useLocation();
    const { data } = location.state || {};
    console.log(data);
    console.log(data?.paidStatus?.purchasedItems);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const handlePrevious = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(currentPhotoIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentPhotoIndex < data?.paidStatus?.billPhotos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
    };

    return (
        <div className='unpaidPurchaseOrder-container'>
            <h1 className='unpaidPurchaseOrder-title'>Unpaid Purchase Order</h1>
            <div className='unpaidPurchaseOrder-table-container'>
                <table className='unpaidPurchaseOrder-table'>
                    <thead className='unpaidPurchaseOrder-table-thead'>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Dealer Name</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.dealerName}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Phone Number</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.phoneNumber}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Payment</th>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{data?.paidStatus?.payment}</th>
                        </tr>
                        <tr className='unpaidPurchaseOrder-table-thead-tr'>
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>Bill Amount</th>
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
                            <th className='unpaidPurchaseOrder-table-thead-tr-th'>{new Date(data?.paidStatus?.createdAt).toUTCString()}</th>
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
                <button className="unpaidPurchaseOrder-button"
                    onClick={() =>
                        window.open(
                            `https://wa.me/?text= paid due url`
                        )
                    }
                >
                    <WhatsApp />
                </button>
            </div>
            <div className='unpaidPurchaseOrder-bill-container'>
                {data?.paidStatus?.billPhotos?.length > 0 && (
                    <div className='carousel'>

                        <div className='carousel-image-container'>
                            <img
                                className='carousel-image'
                                src={data?.paidStatus?.billPhotos[currentPhotoIndex]?.secure_url}
                                alt={`Bill ${currentPhotoIndex + 1}`}
                            />
                        </div>

                        <div className='carousel-controls'>

                            <button
                                className='carousel-button'
                                onClick={handlePrevious}
                                disabled={currentPhotoIndex === 0}
                            ><Preview />
                            </button>

                            <button
                                className='carousel-button'
                                onClick={handleNext}
                                disabled={currentPhotoIndex === data?.paidStatus?.billPhotos?.length - 1}
                            ><Next />
                            </button>

                        </div>

                    </div>
                )}
            </div>
            <h3 className='unpaidPurchaseOrder-text'>Items</h3>
            <div className='unpaidPurchaseOrder-items-table-container'>
                {data?.paidStatus?.purchasedItems?.length &&
                    <table className='unpaidPurchaseOrder-items-table'>
                        <thead className='unpaidPurchaseOrder-items-table-thead'>
                            <tr className='unpaidPurchaseOrder-items-table-thead-tr'>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Name</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Brand</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Category</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Cost Price</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Selling Price</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Unit</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Created At</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Expiry Dates</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Current Stock</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Item Quantity</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th' >Remark</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Minimum Quantity</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>MRP</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Stock Quantity</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Validate</th>
                                <th className='unpaidPurchaseOrder-items-table-thead-tr-th'>Barcode</th>
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
                                    <td className='unpaidPurchaseOrder-items-table-tbody-tr-td'>{new Date(item?.expiryDates[0]?.date).toUTCString()}</td>
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
        </div>
    )
}

export default UnpaidPurchaseOrder
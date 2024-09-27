import '../CSS/expiredItemList.scss';
import React, { useEffect, useState } from 'react'
import { LoadingOverlay } from '@mantine/core';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';
const ExpiredItemList = () => {
    const [itemList, setItemList] = useState({})
    const [loading, setLoading] = useState(false);
    const tableHeads = ["Item Name", "Barcode", "Expire Date", "Expired", "Damaged", "Total Items", "Last Updated"]
    const getExpiredItemList = async () => {
        try {
            setLoading(true)
            const response = await genericAxios({
                url: API_PATHS.EXPIRED_ITEM.GET_EXPIRED_ITEMS,
                method: API_METHODS.GET
            })
            if (response) {
                const expiredItem = response.data
                setItemList(expiredItem)
            } else {
                console.log('Failed to fetch expired item:', response.status);
            }
        } catch (error) {
            console.error('Error fetching items:', error.message);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getExpiredItemList()
    }, [])

    return (
        <div className='add-expired-item-list-component'>
            <LoadingOverlay
                className="purchase-loader"
                visible={loading}
                overlayBlur={1}
            />
            <h4 className='add-expired-item-list-head'>Expired Item List</h4>
            <table className='add-expired-item-list-table'>
                <thead className='add-expired-item-list-table-thead'>
                    <tr className='add-expired-item-list-table-tr'>
                        {tableHeads.map((Head) => (
                            <th className='add-expired-item-list-table-th'>{Head}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className='add-expired-item-list-table-tbody'>
                    {
                        itemList?.expiredItems?.map((item) => (
                            <tr key={item._id} className='add-expired-item-list-table-tr'>
                                <td className='add-expired-item-list-table-td'>{item.itemId.itemName}</td>
                                <td className='add-expired-item-list-table-td'>{item.itemId.itemBarcode}</td>
                                <td className='add-expired-item-list-table-td'>{new Date(item.expireDate).toLocaleDateString()}</td>
                                <td className='add-expired-item-list-table-td'>{item.isExpired ? 'Yes' : 'No'}</td>
                                <td className='add-expired-item-list-table-td'>{item.isDamaged ? 'Yes' : 'No'}</td>
                                <td className='add-expired-item-list-table-td'>{item.totalItems}</td>
                                <td className='add-expired-item-list-table-td'>{new Date(item.updatedAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
export default ExpiredItemList
import '../CSS/expiredItemList.scss';
import React, { useEffect, useState } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';

const ExpiredItemList = () => {
    const [itemList, setItemList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [limit] = useState(50); 
    const tableHeads = [
        'Item Name',
        'Barcode',
        'Expire Date',
        'Expired',
        'Damaged',
        'Total Items',
        'Last Updated',
    ];
    const getExpiredItemList = async (skip = 0, limit = 50) => {
        try {
            setLoading(true);
            const response = await genericAxios({
                url: `${API_PATHS.EXPIRED_ITEM.GET_EXPIRED_ITEMS}?skip=${skip}&limit=${limit}`,
                method: API_METHODS.GET,
            });
            if (response && response.data) {
                const expiredItems = response.data.expiredItems;
                if (expiredItems) {
                    setItemList(expiredItems);
                } else {
                    console.log('No expired items found in the response.');
                }
            } else {
                console.log('Failed to fetch expired items:', response?.status);
            }
        } catch (error) {
            console.error('Error fetching items:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getExpiredItemList(skip, limit);
    }, [skip]);

    const paginationHandlerNext = () => {
        setSkip(skip + limit); 
    };

    const paginationHandlerBack = () => {
        if (skip > 0) {
            setSkip(skip - limit);
        }
    };

    return (
        <div className="add-expired-item-list-component">
            <LoadingOverlay className="purchase-loader" visible={loading} overlayBlur={1} />
            <h4 className="add-expired-item-list-head">Expired Item List</h4>
            <table className="add-expired-item-list-table">
                <thead className="add-expired-item-list-table-thead">
                    <tr className="add-expired-item-list-table-tr">
                        {tableHeads.map((Head, index) => (
                            <th key={index} className="add-expired-item-list-table-th">
                                {Head}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="add-expired-item-list-table-tbody">
                    {itemList?.map((item) => (
                        <tr key={item._id} className="add-expired-item-list-table-tr">
                            <td className="add-expired-item-list-table-td">{item.itemId.itemName}</td>
                            <td className="add-expired-item-list-table-td">{item.itemId.itemBarcode}</td>
                            <td className="add-expired-item-list-table-td">{new Date(item.expireDate).toLocaleDateString()}</td>
                            <td className="add-expired-item-list-table-td">{item.isExpired ? 'Yes' : 'No'}</td>
                            <td className="add-expired-item-list-table-td">{item.isDamaged ? 'Yes' : 'No'}</td>
                            <td className="add-expired-item-list-table-td">{item.totalItems}</td>
                            <td className="add-expired-item-list-table-td">{new Date(item.updatedAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="expired-item-list-navigation-button-container">
                <button
                    className="expired-item-list-navigation-button"
                    onClick={paginationHandlerBack}
                    disabled={skip === 0}
                >
                    Back
                </button>
                <p className="expired-item-list-page-counter">{(skip / limit) + 1}</p>
                <button
                    className="expired-item-list-navigation-button"
                    onClick={paginationHandlerNext}
                    disabled={itemList.length < limit}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ExpiredItemList;

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
    const [totalItems, setTotalItems] = useState(0); // State to hold total unique items
    const limit = 50;
    const tableHeads = [
        "S.No",
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
                const total = response.data.totalItems; // Get total unique items
                setTotalItems(total); // Set total unique items

                console.log(`Total unique expired items: ${total}`);

                if (expiredItems && expiredItems.length > 0) {
                    setItemList(expiredItems);
                } else {
                    console.log('No expired items found in the response.');
                    setItemList([]);
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

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

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
                    {itemList?.map((item, index) => (
                        <tr key={item._id} className="add-expired-item-list-table-tr">
                            <td className="add-expired-item-list-table-td">{index + 1}</td>
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

            {!itemList.length ?
                (
                    <div className='expired-item-list-not-found' >
                        <p>No Expired Item</p>
                    </div>
                )
                : (
                    <div className='expired-item-list-navigation-bar'>


                        <div className='expired-item-list-navigation-bar-side'>
                            <p className='expired-item-list-navigation-bar-side-p'>Total Items: <span className='expired-item-list-navigation-bar-side-span'>{totalItems}</span></p>
                        </div>
                        <div className="expired-item-list-navigation-button-container">
                            <button
                                className={(itemList.length < limit) ? "expired-item-list-navigation-button-disabled" : "expired-item-list-navigation-button"}
                                onClick={paginationHandlerBack}
                                disabled={skip === 0}
                            >
                                Back
                            </button>
                            <p className="expired-item-list-page-counter">
                                Page {Math.floor(skip / limit) + 1} of {totalPages}
                            </p>
                            <button
                                className={(itemList.length < limit) ? "expired-item-list-navigation-button-disabled" : "expired-item-list-navigation-button"}
                                onClick={paginationHandlerNext}
                                disabled={itemList.length < limit}
                            >
                                Next
                            </button>
                        </div>
                        <div className='expired-item-list-navigation-bar-side'></div>
                    </div>
                )
            }


        </div>
    );
};

export default ExpiredItemList;

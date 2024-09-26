import '../CSS/addExpiredItem.scss';
import React, { useEffect, useState } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';

const AddExpiredItem = () => {
    const [nameInput, setNameInput] = useState('');
    const [barcodeInput, setBarcodeInput] = useState('');
    const [itemsList, setItemsList] = useState([]);
    const [fliterItemsList, setFliterItemsList] = useState([]);

    const defaultFormData = {
        itemId:'',
        expireDate:'',
        isExpired:false,
        isDamaged:false,
        totalItems:''
    }
    const [formData,setFormData] = useState(defaultFormData)
    const [itemName, setItemName] = useState('')
    const [itemBarcode, setItemBarcode] = useState('')
    const [itemStockQuantity, setItemStockQuantity] = useState('')
    const [loading, setLoading] = useState(false);
    const [isEnable, setIsEnable] = useState(false)
    const getItemList = async () => {
        try {
            setLoading(true)
            const response = await genericAxios({
                url:API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING,
                method:API_METHODS.GET
            })
            if (response) {
                const items = response.data;
                setItemsList(Object.values(items.message.itemsNameMap));
            } else {
                console.log('Failed to fetch items:', response.status);
            }
        } catch (error) {
            console.error('Error fetching items:', error.message);
        } finally {
            setLoading(false)
        }
    };

    const searchHandlerWithName = (event) => {
        const filteredItems = itemsList.filter((item) => {
            return item.itemName && item.itemName.toLowerCase().includes(event.toLowerCase());
        });

        setFliterItemsList(filteredItems);
    };

    const searchHandlerWithBarcode = (event) => {
        const filteredItems = itemsList.filter((item) => {
            return item.itemBarcode && item.itemBarcode.toString().startsWith(event);
        });

        setFliterItemsList(filteredItems);
    };

    const itemIdHandler = (item) => {
        setFormData({ ...formData, itemId: item._id });
        setItemName(item.itemName);
        setItemBarcode(item.itemBarcode);
        setNameInput('');
        setBarcodeInput('');
        setItemStockQuantity(item.itemStockQuantity);
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await genericAxios({
                url: API_PATHS.EXPIRED_ITEM.ADD_EXPIRED_ITEM,
                method: API_METHODS.POST,
                data: formData,
            })

            if (response.status === 200) {
                alert('Expired item added successfully:');
                console.log('Expired item added successfully:', response.data);
                setFormData(defaultFormData);
                setItemName('');
                setItemBarcode('');
            } else {
                alert('Failed to add expired item:');
                console.log('Failed to add expired item:', response.status);
            }
        } catch (error) {
            alert('Error adding expired item:');
            console.error('Error adding expired item:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getItemList();
    }, []);

    useEffect(() => {
        searchHandlerWithName(nameInput);
    }, [nameInput]);

    useEffect(() => {
        searchHandlerWithBarcode(barcodeInput);
    }, [barcodeInput]);

    useEffect(() => {
        setIsEnable((formData.isDamaged || formData.isExpired) && formData.itemId && formData.expireDate && formData.totalItems);
    }, [formData]);

    return (
        <div className='add-expired-item-component' >
            <LoadingOverlay
                className="purchase-loader"
                visible={loading}
                overlayBlur={1}
            />
            <h4 className='add-expired-item-head-line'>Add Expired Item</h4>
            <div className='add-expired-item-container'>
                <div className='add-expired-item-get-container'>
                    <div className='add-expired-item-get'>
                        <label className='add-expired-item-get-label' htmlFor="input">Search Name</label>
                        <input
                            className='add-expired-item-get-input'
                            placeholder="Search by Name"
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                        />
                        <label className='add-expired-item-get-label' htmlFor="barcodeInput">Search Barcode</label>
                        <input
                            className='add-expired-item-get-input'
                            placeholder="Search by Barcode"
                            type="number"
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                        />
                    </div>
                    <div className='item-list-container'>
                        {(nameInput.length || barcodeInput.length) ?
                            (<table className='item-list-table'>
                                <thead className='item-list-table-thead'>
                                    <tr className='item-list-table-tr'>
                                        <th className='item-list-table-th'>Barcode</th>
                                        <th className='item-list-table-th'>Name</th>
                                    </tr>
                                </thead>
                                <tbody className='item-list-table-tbody'>
                                    {
                                        fliterItemsList.map((item) => (
                                            <tr
                                                className='item-list-table-tr'
                                                onClick={() => {
                                                    itemIdHandler(item)
                                                }}
                                            >
                                                <td className='item-list-table-td'>{item.itemBarcode}</td>
                                                <td className='item-list-table-td'>{item.itemName}</td>
                                            </tr >
                                        ))
                                    }
                                </tbody>
                            </table>)
                            : ''
                        }
                    </div>
                </div>
                <div className='add-expired-item-form-container'>
                    <form className='add-expired-item-form' action="">
                        <p className='add-expired-item-p'>Item Name: <span className='add-expired-item-p-span'>{itemName}</span></p>
                        <p className='add-expired-item-p'>Item Barcode: <span className='add-expired-item-p-span'>{itemBarcode}</span></p>
                        <label className='add-expired-item-label' htmlFor="">Expire Date</label>
                        <input
                            className='add-expired-item-input'
                            type="date"
                            value={formData.expireDate}
                            onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                            required
                        />
                        <div className='add-expired-item-radio-group'>
                            <div className='add-expired-item-radio-container'>
                                <label className='add-expired-item-label'>
                                    Is Expired
                                </label>
                                <input
                                    className='add-expired-item-input-radio'
                                    type="radio"
                                    name="itemStatus"
                                    value="expired"
                                    checked={formData.isExpired}
                                    onChange={() => setFormData({ ...formData, isExpired: true, isDamaged: false })}
                                    required
                                />
                            </div>
                            <div className='add-expired-item-radio-container'>
                                <label className='add-expired-item-label'>Is Damaged</label>
                                <input
                                    className='add-expired-item-input-radio'
                                    type="radio"
                                    name="itemStatus"
                                    value="damaged"
                                    checked={formData.isDamaged}
                                    onChange={() => setFormData({ ...formData, isExpired: false, isDamaged: true })}
                                />
                            </div>
                        </div>
                        <p className='add-expired-item-p'>Total Item in Shop: <span className='add-expired-item-p-span'>{itemStockQuantity}</span></p>
                        <label className='add-expired-item-label' htmlFor="">Total Items</label>
                        <input
                            className='add-expired-item-input'
                            type="number"
                            value={formData.totalItems}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (Number(value) <= Number(itemStockQuantity)) {
                                    setFormData({ ...formData, totalItems: value });
                                } else {
                                    alert(`You cannot enter more than ${itemStockQuantity} items.`);
                                }
                            }}
                            placeholder='Enter item count'
                            required
                        />
                        <button
                            className={isEnable ? 'add-expired-item-input-button' : 'add-expired-item-input-button-disabled'}
                            type='submit'
                            onClick={submitHandler}
                            disabled={!isEnable}
                        >submit</button>
                    </form>
                </div>
            </div>
        </div >
    );
};
export default AddExpiredItem;
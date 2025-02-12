import React, { useEffect, useRef, useState } from 'react';
import '../CSS/approvePurchaseOrderForm.css';
import ImageCarousel from './ImageCarousel';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_METHODS } from '../utils/constants/apiMethods';
import { Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const ApprovePurchaseOrderForm = ({ billAmount, poId }) => {
    const [paidAmount, setPaidAmount] = useState('');
    const [approvePayment, setApprovePayment] = useState(false);
    const [exactAmount, setExactAmount] = useState(false);
    const [imageUrlList, setImageUrlList] = useState([]);
    const [isLoading , setIsLoading] = useState(false)
    const fileInputRef = useRef(null);

    const navigate = useNavigate()

    const isFill = (paidAmount && approvePayment) ? "approvePurchaseOrderForm-amount-input-button" : "approvePurchaseOrderForm-amount-input-button-disabled"

    const handleCheckImage = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (file) => {
        try {
            const dataUrl = await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = reject;
            });

            const newimageUrlList = [...imageUrlList, dataUrl.toString()];
            setImageUrlList(newimageUrlList);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCheck = () => {
        setApprovePayment(!approvePayment);
    };

    const handleExactAmount = () => {
        setExactAmount(!exactAmount)
        if (exactAmount) {
            setPaidAmount('');
        } else {
            setPaidAmount(billAmount);
        }

    };

    const updatePurchaseData = async () => {
        try {

            setIsLoading(true)
            const response = await genericAxios({
                method: API_METHODS.POST,
                url: '/api/purchaseOrder/payPurchaseOrderBill',
                data: {
                    id: poId,
                    isPaid: approvePayment,
                    paidAmount: paidAmount,
                    payBillImages: imageUrlList,
                },
            });
            if (response.status === 200) {
                const result = response.data;
                navigate('/paidPOs')

            }
        } catch (error) {
            console.log(error);
        } finally{
            setIsLoading(false)
        }
    };

    const handleOnSavePayment = async (e) => {
        e.preventDefault();
        await updatePurchaseData();
    };

    return (
        <div className="approvePurchaseOrderForm-component">            
            <h3>Approve Purchase Order</h3>

            <ImageCarousel imageList={imageUrlList} setImageList={setImageUrlList} />
            <form
                onSubmit={handleOnSavePayment}
                className="approvePurchaseOrderForm-form"
            >
                <label className="approvePurchaseOrderForm-file-input-label">
                    Add Payment Bills
                </label>
                <input
                    className="approvePurchaseOrderForm-file-input"
                    type="file"
                    required
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    className="approvePurchaseOrderForm-file-input-button"
                    onClick={handleCheckImage}
                >
                    Add Payment Bills
                </button>

                {/* <button
                    type="button"
                    className="approvePurchaseOrderForm-amount-button"
                    onClick={handleExactAmount}
                >
                    Enter amount
                </button> */}

                <div className='approvePurchaseOrderForm-Exact-amount-input-container'>
                    <label className="approvePurchaseOrderForm-Exact-amount-input-label">
                        Enter Exact amount
                    </label>

                    <input type="checkbox"
                        className='approvePurchaseOrderForm-Exact-amount-input'
                        onChange={handleExactAmount}
                        checked={exactAmount}
                    />
                </div>


                <input
                    className="approvePurchaseOrderForm-amount-input"
                    placeholder="Enter amount"
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    required
                />
                <div className="approvePurchaseOrderForm-checkbox-input-container">
                    <label
                        className="approvePurchaseOrderForm-checkbox-input-label"
                        htmlFor="checkbox"
                    >
                        Approve Payment
                    </label>
                    <input
                        className="approvePurchaseOrderForm-checkbox-input"
                        type="checkbox"
                        required
                        checked={approvePayment}
                        onChange={handleCheck}
                    />
                </div>
                <button
                    type="submit"
                    className={isFill}

                >{
                    !isLoading?" Save payment":<Loader  height={"20px"} width={"20px"} />
                }
                </button>
            </form>
        </div>
    );
};

export default ApprovePurchaseOrderForm;

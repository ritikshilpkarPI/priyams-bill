import React from 'react';
import { Title, Select, TextInput, NumberInput, Textarea, Button } from '@mantine/core';

const PAYMENT_MODES = ['Cash', 'UPI', 'Credit', 'Cheque', 'Prepaid'];

const PurchaseDetail = () => {
    return (
        <div className='purchase-detail-container'>
            <Title order={2}>Purchase details</Title>
            <div className="buttons">
                <Button>New Mode</Button>
                <Button className='save-btn'>Save bill</Button>
            </div>
            <div className="purchase-details">
                <Select
                    label="Mode of Payment"
                    placeholder="Select one"
                    searchable
                    nothingFound="No options"
                    data={PAYMENT_MODES}
                />
                <TextInput label="Done by"></TextInput>
                <NumberInput label="Amount"></NumberInput>
                <TextInput label="Approver"></TextInput>
                <Textarea label="Remark" autosize className='remark-input'></Textarea>
            </div>
        </div>
    )
}

export default PurchaseDetail
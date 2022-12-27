import { Box, Button, Group, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import React from 'react'

const Forms = ({purchaseForm, addDetails}) => {
    
  return (
    <form onSubmit={(e)=>{e.preventDefault(); addDetails()}}>
    <   Box sx={{ maxWidth: "80%" }} mx="auto">
                    <Group>
                        <Select
                            label="Payment"
                            placeholder='pick one payment option'
                            data={[
                                { value: 'fullypaid', label: 'Fully Paid' },
                                { value: 'partiallypaid', label: 'Partially Paid' },
                                { value: 'credit', label: 'Credit' },
                            ]}
                           
                            {...purchaseForm.getInputProps('payment')}
                        />

                        <NumberInput
                            withAsterisk
                            label="Bill Amount"
                            placeholder="total bill amount"
                            
                            {...purchaseForm.getInputProps('billAmount')}
                        />
                        <Select
                            label="Paid by"
                            placeholder='pick one'
                            data={[
                                { value: 'cash', label: 'cash' },
                                { value: 'upi', label: 'UPI' },
                                { value: 'cheque', label: 'Cheque' },
                                { value: 'prepaid', label: 'Prepaid' },
                                { value: 'neft', label: 'NEFT' },
                            ]}
                            
                            {...purchaseForm.getInputProps('paidBy')}
                        />
                        <NumberInput
                            withAsterisk
                            label="Paid Amount"
                            placeholder="total paid amount"
                            
                            {...purchaseForm.getInputProps('paidAmount')}
                        />
                        <Select
                            label="Procurement Source"
                            placeholder='pick one'
                            required
                            data={[
                                { value: 'walmart', label: 'Walmart' },
                                { value: 'dmart', label: 'D Mart' },
                                { value: 'city', label: 'City' },
                                { value: 'distributor', label: 'Distributor' },
                            ]}
                            {...purchaseForm.getInputProps('procurementSource')}
                        />
                        <TextInput
                            withAsterisk
                            required
                            label="Dealer Name"
                            placeholder="dealer name"
                            {...purchaseForm.getInputProps('dealerName')}
                        />
                        <NumberInput
                            withAsterisk
                            label="Mobile Number"
                            placeholder="mobile number"
                           
                            formatter={(value) => String(value) === '0' ?'': String(value).length <= 10 ? value : String(value).substring(0,10)}
                            {...purchaseForm.getInputProps('phoneNumber')}
                        />
                       
                        {   
                            purchaseForm.getInputProps('paidBy').value === "cheque" &&
                            <NumberInput
                                withAsterisk
                                required
                                label="Cheque number"
                                placeholder="cheque number"
                                {...purchaseForm.getInputProps('chequeNumber')}
                            />
                        }
                    </Group>
                    <Textarea
                        sx={{ width: "60%", marginTop: "1rem" }}
                        placeholder="remarks"
                        label="Your Remarks"
                        {...purchaseForm.getInputProps('remark')}
                    />
                    <Group position="right" mt="md">
                        <Button type="submit">Add Details</Button>
                    </Group>                    
        </Box>
        </form>  
  )
}

export default Forms


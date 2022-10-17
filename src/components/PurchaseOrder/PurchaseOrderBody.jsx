import React from 'react'
import { Select, TextInput, NumberInput, Image } from '@mantine/core';
import { addItemRow } from './constant';

const rowItem = (item) => {

    const itemTypeMap = {
        TextInput: (item) => <TextInput className='text-input' defaultValue="hello"></TextInput>,
        NumberInput: (item) => <NumberInput className='number-input' defaultValue={20} hideControls />,
        Select: (item) => <Select
            className='select-input'
            data={item.data} />,
            Custom: (item) => <p>custom component</p>,
            icon: (item) => <Image src={item.src} width={20} />
    }
    return itemTypeMap[item.type](item)
    // if (item.type === 'TextInput') {
    //     return <TextInput className='text-input' defaultValue="hello"></TextInput>
    // } else if (item.type === 'NumberInput') {
    //     return <NumberInput className='number-input' defaultValue={20} hideControls />
    // } else if (item.type === 'Select') {
    //     return <Select
    //         className='select-input'
    //         data={item.data} />
    // } else if (item.type === 'Custom') {
    //     return <p>custom component</p>
    // } else if (item.type === 'icon') {
    //     return <Image src={item.src} width={20} />
    // }
}

const PurchaseOrderBody = () => {
    return (
        <tbody>
            <tr>
                {addItemRow.map((item, index) => {
                    return <td key={index}>
                        {rowItem(item)}
                    </td>
                })}
            </tr>
        </tbody>
    )
}

export default PurchaseOrderBody
import { useState } from 'react'
import { Select, TextInput, NumberInput, Image } from '@mantine/core';
import { addItemRow, itemInitialObj } from './constant';

// To set use by date on item while adding 
const UseByDateElement = ({ itemObjState }) => {
    const [useByDateData, setuseByDateData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    // To add new date 
    const addNewDate = (e) => {
        setSelectedDate(e.target.value);
        const dateSelected = useByDateData.findIndex((item) => item.date === e.target.value);
        if (dateSelected !== -1) {
            alert('date already selected!');
            return;
        }
        let dateArray = [...useByDateData, { date: e.target.value, value: 0 }]
        dateArray.sort((a, b) => {
            return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)
        });
        setuseByDateData([...dateArray]);
        itemObjState[1]({ ...itemObjState[0], "itemUseByDate": [...dateArray] })
    }

    // To change any date item quantity 
    const handleAddDateInputChange = (e, index) => {
        let newDateObj = { date: useByDateData[index].date, value: e };
        useByDateData.splice(index, 1, newDateObj);
        setuseByDateData(useByDateData);
        itemObjState[1]({ ...itemObjState[0], "itemUseByDate": useByDateData });
    }

    // To remove any date 
    const deleteDate = (e, index) => {
        useByDateData.splice(index, 1);
        setuseByDateData([...useByDateData]);
        itemObjState[1]({ ...itemObjState[0], "itemUseByDate": [...useByDateData] })
    }

    return (
        <div className='useby-date-container'>
            <input type="date" name="useByDate" id="useByDate" value={selectedDate} onChange={(e) => addNewDate(e)} />
            {useByDateData.map((item, index) => {
                return (
                    <div key={index} className="new-date-row">
                        <TextInput value={item.date} readOnly></TextInput>
                        <NumberInput className='per-date-quantity' value={item.value} onChange={(e) => handleAddDateInputChange(e, index)} hideControls></NumberInput>
                        <Image className='delete-icon' src='images/cross.svg' width={14} onClick={(e) => deleteDate(e, index)}></Image>
                    </div>
                )
            })}
        </div>
    )
}

const addItemToList = (itemObj, allItem) => {
    console.log(itemInitialObj);
    allItem[1]([...allItem[0], itemObj[0]]);
    itemObj[1]({...itemInitialObj})
}

// Add item row or first row
const RowItem = ({ item, itemState, allItem }) => {
    console.log('rowitem', itemState[0][item.name])
    const handleItemInputChange = (e, type, name) => {
        if (type === 'text') {
            itemState[1]({ ...itemState[0], [e.target.name]: e.target.value })
        } else if (type === 'number') {
            itemState[1]({ ...itemState[0], [name]: e })
        } else if (type === 'select') {
            itemState[1]({ ...itemState[0], [name]: e })
        }
    }

    const itemTypeMap = {
        TextInput: (item) => <TextInput className='text-input' value={itemState[0][item.name]} name={item.name} onChange={(e) => handleItemInputChange(e, 'text')}></TextInput>,
        NumberInput: (item) => <NumberInput className='number-input' value={itemState[0][item.name]} onChange={(e) => handleItemInputChange(e, 'number', item.name)} hideControls />,
        Select: (item) => <Select
            name={item.name}
            className='select-input'
            data={item.data}
            onChange={(e) => handleItemInputChange(e, 'select', item.name)}
        />,
        Custom: () => <UseByDateElement itemObjState={itemState} />,
        icon: (item) => <div className="add-icon" onClick={() => addItemToList(itemState, allItem)}><Image src={item.src} width={20} /></div>
    }

    return itemTypeMap[item.type](item)
}

const PurchaseOrderBody = () => {
    const [itemObj, setItemObj] = useState(itemInitialObj);
    const [allPurchasedItem, setAllPurchasedItem] = useState([]);
    console.log(allPurchasedItem);

    return (
        <tbody>
            <tr>
                {addItemRow.map((item, index) => {
                    return <td key={index}>
                        <RowItem item={item} allItem={[allPurchasedItem, setAllPurchasedItem]} itemState={[itemObj, setItemObj]} />
                    </td>
                })}
            </tr>
            <tr>
                <td>1210</td>
                <td>sdfasd</td>
                <td>asdf</td>
                <td>asdf</td>
                <td>asd</td>
            </tr>
        </tbody>
    )
}

export default PurchaseOrderBody;
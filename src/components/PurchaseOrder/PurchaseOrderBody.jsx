import { useState, useContext } from 'react'
import { Select, TextInput, NumberInput, Image } from '@mantine/core';
import { addItemRow, itemInitialObj } from './constant';
import { AppStateContext } from 'src/AppState/appState.context';

// To set use by date on item while adding 
const UseByDateElement = ({ itemObjState, elementDateData }) => {
    const [useByDateData, setuseByDateData] = useState(elementDateData || []);
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


// Add item row or first row
const RowItem = ({ item, itemObjState }) => {
    const { purchaseItemsStateAndDispatch } = useContext(AppStateContext);
    const [purchaseItems, dispatch] = purchaseItemsStateAndDispatch;
    const [itemObj, setItemObj] = itemObjState;

    // To add item in list 
    const addItemToList = () => {
        dispatch({ type: 'UPDATE_PURCHASE_ITEMS_LIST', payload: [...purchaseItems, itemObj] });
        setItemObj(itemInitialObj);
    }

    // Handle input change on different input fields
    const handleItemInputChange = (e, type, name) => {
        if (type === 'text') {
            setItemObj({ ...itemObj, [e.target.name]: e.target.value })
        } else if (type === 'number') {
            setItemObj({ ...itemObj, [name]: e })
        } else if (type === 'select') {
            setItemObj({ ...itemObj, [name]: e });
        }
    }


    const itemTypeMap = {
        TextInput: (item) => <TextInput className='text-input' value={itemObj[item.name]} name={item.name} onChange={(e) => handleItemInputChange(e, 'text')}></TextInput>,
        NumberInput: (item) => <NumberInput className='number-input' value={Number(itemObj[item.name])} onChange={(e) => handleItemInputChange(e, 'number', item.name)} hideControls />,
        Select: (item) => <Select
            name={item.name}
            className='select-input'
            data={item.data}
            onChange={(e) => handleItemInputChange(e, 'select', item.name)}
        />,
        Custom: () => <UseByDateElement itemObjState={[itemObj, setItemObj]} />,
        icon: (item) => <div className="add-icon" onClick={addItemToList}><Image src={item.src} width={20} /></div>
    }

    return itemTypeMap[item.type](item);
}

const AddItemRow = () => {
    const [itemObj, setItemObj] = useState(itemInitialObj);

    return (
        <tr>
            {addItemRow.map((item, index) => {
                return <td key={index}>
                    <RowItem item={item} itemObjState={[itemObj, setItemObj]} />
                </td>
            })}
        </tr>
    )
};

const ShowTableItems = () => {
    const { purchaseItemsStateAndDispatch } = useContext(AppStateContext);

    return (
        <>
            {
                purchaseItemsStateAndDispatch[0].map((element, index) => {
                    console.log(element);
                    return (
                        <tr key={index}>
                            <td>{element.itemBarcode}</td>
                            <td>{element.itemBrandName}</td>
                            <td>{element.itemName}</td>
                            <td>{element.itemCategory}</td>
                            <td>{element.itemQuantity}</td>
                            <td>{element.itemUnit}</td>
                            <td><UseByDateElement elementDateData={element.itemUseByDate} /></td>
                            <td>{element.itemMRPperUnit}</td>
                            <td>{element.itemCostPricePerUnit}</td>
                            <td>{element.itemSellingPricePerUnit}</td>
                            <td>{element.itemTotalStockQuantity}</td>
                        </tr>
                    )
                })
            }
        </>
    )
}

const PurchaseOrderBody = () => {
    return (
        <tbody>
            <AddItemRow />
            <ShowTableItems />
        </tbody>
    )
}

export default PurchaseOrderBody;
import { useState, useContext } from 'react';
import { Select, TextInput, NumberInput, Image } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import {
  addItemRow,
  itemInitialObj,
} from 'src/constants/purchaseOrderConstants';
import { AppStateContext } from 'src/AppState/appState.context';

// To set use by date on item while adding
const UseByDateElement = ({ itemObjState = [] }) => {
  const [newUseByDateVal, setNewUseByDateVal] = useState();
  const { purchaseInputItemStateAndDispatch } = useContext(AppStateContext);
  const { 1: purchaseItemInputDispatch } = purchaseInputItemStateAndDispatch;
  const [useByDateData = {}, setuseByDateData = () => {}] = itemObjState;

  const changedDateFormat = `${new Date(newUseByDateVal).getFullYear()}-${
    new Date(newUseByDateVal).getMonth() + 1 <= 9 ? 0 : ''
  }${new Date(newUseByDateVal).getMonth() + 1}-${
    new Date(newUseByDateVal).getDate() <= 9 ? 0 : ''
  }${new Date(newUseByDateVal).getDate()}`;

  // To add new date
  const addNewDate = (selectedDate) => {
    if (!newUseByDateVal) {
      alert('Select a date first!');
      return;
    }

    const dateSelected = useByDateData['itemUseByDate'].findIndex(
      (item) => item.date === selectedDate
    );

    if (dateSelected !== -1) {
      alert('date already selected!');
      return;
    }

    let dateArray = [
      ...useByDateData['itemUseByDate'],
      { date: selectedDate, value: 0 },
    ];
    dateArray.sort((a, b) => {
      return a.date > b.date ? 1 : b.date > a.date ? -1 : 0;
    });

    setuseByDateData({ ...useByDateData, itemUseByDate: dateArray });
    purchaseItemInputDispatch({
      type: 'UPDATE_PURCHASE_INPUT_ITEM',
      payload: { ...useByDateData, itemUseByDate: dateArray },
    });
  };

  // To change any date item quantity
  const handleAddDateInputChange = (e, index) => {
    let newDateObj = {
      date: useByDateData['itemUseByDate'][index].date,
      value: e,
    };
    useByDateData['itemUseByDate'].splice(index, 1, newDateObj);
    setuseByDateData({
      ...useByDateData,
      itemUseByDate: useByDateData['itemUseByDate'],
    });
  };

  // To remove any date
  const deleteDate = (e, index) => {
    useByDateData['itemUseByDate'].splice(index, 1);
    setuseByDateData({
      ...useByDateData,
      itemUseByDate: useByDateData['itemUseByDate'],
    });
  };

  return (
    <div className="useby-date-container">
      <div className="add-date-container">
        <DatePicker
          className="useby-date-picker"
          placeholder="Pick date"
          inputFormat="DD/MM/YYYY"
          value={newUseByDateVal}
          onChange={(day) => setNewUseByDateVal(day)}
          style={{ width: '140px' }}
        />
        <Image
          className="add-icon"
          src="images/add.svg"
          width={24}
          height={24}
          onClick={() => newUseByDateVal && addNewDate(changedDateFormat)}
        ></Image>
      </div>
      <div className="all-dates add-item-row-usebydate">
        {useByDateData?.itemUseByDate?.length &&
          useByDateData.itemUseByDate.map((item, index) => {
            return (
              <div key={index} className="new-date-row">
                <TextInput value={item.date} readOnly></TextInput>
                <NumberInput
                  className="per-date-quantity"
                  value={item.value}
                  style={{ padding: '7px 7px' }}
                  onChange={(e) => handleAddDateInputChange(e, index)}
                  hideControls
                ></NumberInput>
                <Image
                  className="delete-icon"
                  src="images/cross.svg"
                  width={14}
                  onClick={(e) => deleteDate(e, index)}
                ></Image>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// Add item row or first row
const RowItem = ({ item, itemObjState }) => {
  const { purchaseItemsStateAndDispatch, purchaseInputItemStateAndDispatch } =
    useContext(AppStateContext);
  const [purchaseItems, dispatch] = purchaseItemsStateAndDispatch;
  const { purchaseItemInput, purchaseItemInputDispatch } =
    purchaseInputItemStateAndDispatch;
  //   const [itemObj, setItemObj] = itemObjState;

  // To add item in list
  const addItemToList = () => {
    dispatch({
      type: 'UPDATE_PURCHASE_ITEMS_LIST',
      payload: [...purchaseItems, purchaseItemInput],
    });
    // setItemObj(itemInitialObj);
    purchaseItemInputDispatch({
      type: 'UPDATE_PURCHASE_INPUT_ITEM',
      payload: itemInitialObj,
    });
  };

  // Handle input change on different input fields
  const handleItemInputChange = (e, type, name) => {
    if (type === 'text') {
      //   setItemObj({ ...itemObj, [e.target.name]: e.target.value });
      purchaseItemInputDispatch({
        type: 'UPDATE_PURCHASE_INPUT_ITEM',
        payload: { ...purchaseItemInput, [e.target.name]: e.target.value },
      });
    } else if (type === 'number' || type === 'select') {
      //   setItemObj({ ...itemObj, [name]: e });
      purchaseItemInputDispatch({
        type: 'UPDATE_PURCHASE_INPUT_ITEM',
        payload: { ...purchaseItemInput, [name]: e },
      });
    }
  };

  const itemTypeMap = {
    TextInput: (item) => (
      <TextInput
        className="text-input"
        value={item.type}
        name={item.name}
        onChange={(e) => handleItemInputChange(e, 'text')}
      ></TextInput>
    ),
    NumberInput: (item) => (
      <NumberInput
        className="number-input"
        value={Number(item.type)}
        onChange={(e) => handleItemInputChange(e, 'number', item.name)}
        hideControls
      />
    ),
    Select: (item) => (
      <Select
        name={item.name}
        className="select-input"
        data={item.data}
        onChange={(e) => handleItemInputChange(e, 'select', item.name)}
      />
    ),
    Custom: () => (
      <UseByDateElement
        itemObjState={[purchaseItemInput, purchaseItemInputDispatch]}
      />
    ),
    icon: (item) => (
      <div className="add-icon" onClick={addItemToList}>
        <Image src={item.src} width={20} />
      </div>
    ),
  };

  return itemTypeMap[item.type](item);
};

const AddItemRow = () => {
  //   const [itemObj, setItemObj] = useState(itemInitialObj);
  return (
    <tr>
      {addItemRow.map((item, index) => {
        return (
          <td key={index}>
            <RowItem item={item} />
            {/* <RowItem item={item} itemObjState={[itemObj, setItemObj]} /> */}
          </td>
        );
      })}
    </tr>
  );
};

const ShowTableItems = () => {
  const { purchaseItemsStateAndDispatch } = useContext(AppStateContext);
  const [purchaseItems] = purchaseItemsStateAndDispatch;

  return (
    <>
      {purchaseItems.map((element, index) => {
        return (
          <tr key={index}>
            <td>{element.itemBarcode}</td>
            <td>{element.itemBrandName}</td>
            <td>{element.itemName}</td>
            <td>{element.itemCategory}</td>
            <td>{element.itemQuantity}</td>
            <td>{element.itemUnit}</td>
            <td>
              <UseByDateElement elementDateData={element.itemUseByDate} />
            </td>
            <td>{element.itemMRPperUnit}</td>
            <td>{element.itemCostPricePerUnit}</td>
            <td>{element.itemSellingPricePerUnit}</td>
            <td>{element.itemTotalStockQuantity}</td>
          </tr>
        );
      })}
    </>
  );
};

const PurchaseOrderBody = () => {
  return (
    <tbody>
      <AddItemRow />
      <ShowTableItems />
    </tbody>
  );
};

export default PurchaseOrderBody;

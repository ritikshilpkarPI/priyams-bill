import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Image,
  Loader,
  NumberInput,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { AppStateContext } from '../AppState/appState.context';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';

const AddExpense = ({ date }) => {
  const { expenseItemsStateAndDispatch } = useContext(AppStateContext);
  const expenseReducer = expenseItemsStateAndDispatch;

  const newDate = new Date();
  const todayDate = `${newDate.getFullYear()}-${(
    '0' +
    (newDate.getMonth() + 1)
  ).slice(-2)}-${('0' + newDate.getDate()).slice(-2)}`;
  const todayTime = `${('0' + newDate.getHours()).slice(-2)}:${(
    '0' + newDate.getMinutes()
  ).slice(-2)}:${('0' + newDate.getSeconds()).slice(-2)}`;

  // All States
  const [name, setName] = useState(
    JSON.parse(localStorage.getItem('priyam-store'))?.name || ''
  );
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState();
  const [dataDate, setDataDate] = useState(date);
  const [todayData, setTodayData] = useState();
  const [buttonLoad, setButtonLoad] = useState(false);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    setDataDate(date);
  }, [date]);

  // Convert time
  function timeConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? ' AM' : ' PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  }

  // To add new expense
  const addExpense = async (e) => {
 try{
  e.preventDefault();
  const obj = {
    user: name,
    description: description,
    amount: amount,
    date: todayDate,
    time: timeConvert(todayTime),
  };
  if (!obj.user || !obj.description || !obj.amount) {
    alert('Please enter all fields!');
  } else {
    setButtonLoad(true);
    const response = await genericAxios({
      url: API_PATHS.EXPENSE.POST_EXPENSE,
      method: API_METHODS.POST,
      data: { ...obj },
      headers: {
        Cookie: '',
      },
    });
    if (
      response.data.status === true &&
      response.data.message === 'expense added'
    ) {
      setDescription('');
      setAmount();
      setButtonLoad(false);
      setDataDate(todayDate);
      expenseReducer[1]({
        type: 'UPDATE_EXPENSE_LIST',
        payload: response.data.data,
      });
    } else {
      alert('Failed to save date!');
    }
  }
 }
 catch(err){
  console.log(err)
 }
  };

  // To get today expense data
  useEffect(() => {
    const getTodayData = async () => {
     try{
      const todayExpense = await genericAxios({
        url: `${API_PATHS.EXPENSE.GET_EXPENSE}/${dataDate}`,
        method: API_METHODS.GET,
        headers: {
          Cookie: '',
        },
      });
      setTodayData(todayExpense.data.data);
     }
     catch(err){
      console.log(err)
     }
    };
    getTodayData();
  }, [dataDate, buttonLoad, reload]);

  // To delete expense item
  const deleteExpense = async (id) => {
  try{
    const userResponse = window.confirm('Do you want to delete this item?');
    if (userResponse) {
      const response = await genericAxios({
        url: `${API_PATHS.EXPENSE.DELETE_EXPENSE}/${id}`,
        method: API_METHODS.DELETE,
        headers: {
          Cookie: '',
        },
      });
      if (
        response.data.status === true &&
        response.data.message === 'expense deleted'
      ) {
        setReload(!reload);
        expenseReducer[1]({
          type: 'UPDATE_EXPENSE_LIST',
          payload: response.data.data,
        });
      } else {
        alert('Failed to delete expense!');
      }
    }
  }
  catch(err){
    console.log(err)
  }
  };

  // To handle input for updating expense item
  const handleInputChange = (element, field, value, index) => {
    let newObj = { ...element, [field]: value };
    todayData.splice(index, 1, newObj);
    setTodayData([...todayData]);
  };

  // To update expense item
  const updateExpense = async (index) => {
    const itemToUpdate = todayData[index];
    const response = await genericAxios({
      url: `${API_PATHS.EXPENSE.PUT_EXPENSE}/${itemToUpdate._id}`,
      method: API_METHODS.PUT,
      data: { ...itemToUpdate },
      headers: {
        Cookie: '',
      },
    });
    if (
      response.data.status === true &&
      response.data.message === 'expense updated'
    ) {
      alert('Expense updated!');
      expenseReducer[1]({
        type: 'UPDATE_EXPENSE_LIST',
        payload: response.data.data,
      });
    } else {
      alert('Failed to update expense item!');
    }
  };

  return (
    <div
      style={{
        boxShadow: '0px 0px 15px -1px rgba(0,0,0,0.12)',
        borderRadius: '8px',
      }}
      className="add-expense-container"
    >
      <div
        className="input-section"
        style={{
          width: '900px',
          textAlign: 'left',
          padding: '15px 28px 20px',
        }}
      >
        <div>
          <input
            type="date"
            name="date"
            id="date"
            style={{ fontSize: '18px', padding: '4px' }}
            value={dataDate}
            onChange={(e) => setDataDate(e.target.value)}
          />
        </div>
        <form onSubmit={addExpense}>
          <TextInput
            label="Your name"
            placeholder="Your name"
            value={name}
            disabled={Boolean(JSON.parse(localStorage.getItem('priyam-store')))}
            onChange={(e) => setName(e.target.value)}
          />
          <NumberInput
            placeholder="Amount"
            label="Paid Amount"
            value={amount}
            onChange={(value) => setAmount(value)}
          />
          <TextInput
            label="Description"
            placeholder="Description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" loading={buttonLoad}>
            Pay
          </Button>
        </form>
      </div>
      <div
        style={{
          borderRadius: '8px',
          padding: '0 20px 5px',
          marginTop: '0px',
        }}
      >
        <Table sx={{ marginTop: '10px' }} id="expenseTable">
          <thead>
            <tr>
              <th>Time</th>
              <th>Description</th>
              <th>User</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {todayData?.map((element, index) => (
              <tr key={index}>
                <td>{element.time}</td>
                <td>
                  <TextInput
                    style={{ border: '0px solid red', outline: 'none' }}
                    variant="unstyled"
                    value={element.description}
                    onChange={(e) =>
                      handleInputChange(
                        element,
                        'description',
                        e.target.value,
                        index
                      )
                    }
                  />
                </td>
                <td>
                  <TextInput
                    variant="unstyled"
                    value={element.user}
                    onChange={(e) =>
                      handleInputChange(element, 'user', e.target.value, index)
                    }
                  />
                </td>
                <td>
                  <NumberInput
                    style={{ textAlign: 'center' }}
                    variant="unstyled"
                    value={element.amount}
                    onChange={(value) =>
                      handleInputChange(element, 'amount', value, index)
                    }
                  />
                </td>
                <td style={{ display: dataDate === todayDate ? '' : 'none' }}>
                  <Image
                    style={{ padding: '7px', width: '26px', cursor: 'pointer' }}
                    onClick={() => deleteExpense(element._id)}
                    src="images/cross.svg"
                  />
                </td>
                <td style={{ display: dataDate === todayDate ? '' : 'none' }}>
                  <Image
                    style={{ padding: '6px', width: '27px', cursor: 'pointer' }}
                    onClick={() => updateExpense(index)}
                    src="images/check.svg"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          {todayData?.length === 0 ? <Text>No data...</Text> : ''}
          {!todayData ? <Loader size="sm" /> : ''}
        </div>
      </div>
    </div>
  );
};

export default AddExpense;

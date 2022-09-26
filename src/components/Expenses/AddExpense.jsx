import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Title, NumberInput, TextInput, Button, Table } from '@mantine/core';

const AddExpense = ({dateState}) => {
    const InputStyle = { width: '100%', marginTop: '15px' };
    const newDate = new Date();
    const todayDate = `${newDate.getFullYear()}-${('0' + (newDate.getMonth() + 1)).slice(-2)}-${('0' + newDate.getDate()).slice(-2)}`;
    const todayTime = `${('0' + (newDate.getHours())).slice(-2)}:${('0' + (newDate.getMinutes())).slice(-2)}:${('0' + (newDate.getSeconds())).slice(-2)}`;

    // All States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState();
    const [dataDate, setDataDate] = dateState;
    const [todayData, setTodayData] = useState([]);
    const [buttonLoad, setButtonLoad] = useState(false)

    // Convert time
    function timeConvert(time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) {
            time = time.slice(1);
            time[5] = +time[0] < 12 ? ' AM' : ' PM';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }

    // To add new expense
    const addExpense = async (e) => {
        e.preventDefault();
        const obj = {
            user: name,
            description: description,
            amount: amount,
            date: todayDate,
            time: timeConvert(todayTime)
        }
        if (!obj.user || !obj.description || !obj.amount) {
            alert('Please enter all fields!');
        } else {
            setButtonLoad(true);
            const response = await axios.post('/api/expense', obj);
            if (response.data.status === true && response.data.message === 'expense added') {
                setName('');
                setDescription('');
                setAmount();
                setButtonLoad(false);
            } else {
                alert('Failed to save date');
            }
        }
    }

    useEffect(() => {
        const getTodayData = async () => {
            const todayExpense = await axios.get(`/api/expense/${dataDate}`);
            setTodayData(todayExpense.data.data);
        };
        getTodayData();
    }, [dataDate, buttonLoad]);

    return (
        <div>
            <div className="input-section" style={{ width: '500px', textAlign: 'left', padding: '15px 28px 28px', borderRadius: '8px', boxShadow: '0px 0px 15px -1px rgba(0,0,0,0.18)' }}>
                <form onSubmit={addExpense}>
                    <Title order={4} style={{ marginTop: '20px' }}>Add Expenses</Title>
                    <TextInput label="Your name" placeholder="Your name" style={InputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                    <TextInput label="Description" placeholder="Description" style={InputStyle} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <NumberInput placeholder="Amount" label="Paid Amount" style={InputStyle} value={amount} onChange={(value) => setAmount(value)} />
                    <Button style={{ ...InputStyle, height: '43px', marginTop: '20px' }} type="submit" loading={buttonLoad} >Pay</Button>
                </form>
            </div>
            <div style={{ borderRadius: '8px', boxShadow: '0px 0px 15px -1px rgba(0,0,0,0.18)', padding: '20px', marginTop: '25px' }}>
                <div>
                    <input type="date" name="date" id="date" style={{ fontSize: '18px', padding: '4px' }} value={dataDate} onChange={(e) => setDataDate(e.target.value)} />
                </div>
                <Table sx={{ marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Time</th>
                            <th style={{ textAlign: 'center' }}>Description</th>
                            <th style={{ textAlign: 'center' }}>User</th>
                            <th style={{ textAlign: 'center' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>{todayData.length === 0 ? <tr><td>Loading...</td></tr> : todayData.map((element, index) => (
                        <tr key={index}>
                            <td>{element.time}</td>
                            <td>{element.description}</td>
                            <td>{element.user}</td>
                            <td>{element.amount}</td>
                        </tr>
                    ))}</tbody>
                </Table>
            </div>
        </div>
    )
}

export default AddExpense
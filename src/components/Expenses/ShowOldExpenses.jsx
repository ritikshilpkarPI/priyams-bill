import { useState, useEffect } from 'react';
import axios from 'axios';
import { Title, Table } from '@mantine/core';

const ShowOldExpenses = ({ dateState }) => {
    const [allData, setAllData] = useState([]);

    const rows = allData.map((element, index) => (
        <tr key={index} onClick={() => { dateState[1](element._id) }} style={{ cursor: 'pointer' }}>
            <td>{element._id}</td>
            <td>{element.amount}</td>
        </tr>
    ));

    useEffect(() => {
        const getAllData = async () => {
            const allExpense = await axios.get(`/api/expense`);
            setAllData(allExpense.data.data);
        };
        getAllData();
    }, [])

    return (
        <div className="table-section" style={{ marginLeft: '25px', padding: '0 20px 20px', borderRadius: '8px', boxShadow: '0px 0px 15px -1px rgba(0,0,0,0.18)', width: '500px' }}>
            <Title order={4} sx={{ margin: '20px 0 20px' }}>Previous Expenses</Title>
            <Table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>Date</th>
                        <th style={{ textAlign: 'center' }}>Total Amount</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    )
}

export default ShowOldExpenses;
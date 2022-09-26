import React, { useState } from 'react';
import { Title } from '@mantine/core';
import AddExpense from 'src/components/Expenses/AddExpense';
import ShowOldExpenses from 'src/components/Expenses/ShowOldExpenses';

const MiscellaneousExpenses = () => {
    const newDate = new Date();
    const todayDate = `${newDate.getFullYear()}-${('0' + (newDate.getMonth() + 1)).slice(-2)}-${('0' + newDate.getDate()).slice(-2)}`;
    const dateState = useState(todayDate);
    
    return (
        <div style={{ display: 'inline-block' }}>
            <Title order={3} sx={{ margin: '55px 0 15px' }}>Miscellaneous Expenses</Title>
            <div className="container" style={{ display: 'flex', padding: '30px', alignItems: 'start' }}>
                <AddExpense dateState={dateState} />
                <ShowOldExpenses dateState={dateState} />
            </div>
        </div>
    )
};

export default MiscellaneousExpenses;
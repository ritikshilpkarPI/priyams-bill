import {
  Button,
  NumberInput,
  Popover,
  Select,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState, useContext } from 'react';
import { AppStateContext } from '../AppState/appState.context';
import AddExpense from '../components/AddExpense';
import ProtectedComponent from '../components/ProtectedComponent';
import access from '../access';
// import EmployeeAttendance from '../components/EmployeeAttendance';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
const INITIAL_VALS = {
  twoThousand: 0,
  fiveHundred: 0,
  twoHundred: 0,
  oneHundred: 0,
  fifty: 0,
  twenty: 0,
  ten: 0,
  five: 0,
  two: 0,
  one: 0,
};
let createdAtDate = '';
let id = '';

const OpenClose = () => {
  const { expenseItemsStateAndDispatch } = useContext(AppStateContext);
  const [expenseList, expenseDispatch] = expenseItemsStateAndDispatch;
  const currentDate = new Date().toJSON()?.split('T')[0];

  const [procedureValue, setProcedureValue] = useState('open');
  const [procedure, setProcedure] = useState([]);
  const [dayWiseProcedures, setDayWiseProcedures] = useState([]);
  const [openingNotes, setOpeningNotes] = useState(INITIAL_VALS);
  const [closingNotes, setClosingNotes] = useState(INITIAL_VALS);
  const [openingCoin, setOpeningCoin] = useState(INITIAL_VALS);
  const [closingCoin, setClosingCoin] = useState(INITIAL_VALS);
  const [upiSum, setUpiSum] = useState(0);
  const [allBills, setAllBills] = useState([]);
  const [expenseDataDate, setexpenseDataDate] = useState(currentDate);

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [apiLoading, setApiLoading] = useState(false);

  const handleOpeningNotesInput = (value, key) => {
    setOpeningNotes((prev) => ({ ...prev, [key]: value }));
  };
  const handleOpeningCoinInput = (value, key) => {
    setOpeningCoin((prev) => ({ ...prev, [key]: value }));
  };
  const handleClosingNotesInput = (value, key) => {
    setClosingNotes((prev) => ({ ...prev, [key]: value }));
  };
  const handleClosingCoinInput = (value, key) => {
    setClosingCoin((prev) => ({ ...prev, [key]: value }));
  };

  const indexArr = {
    twoThousand: 2000,
    fiveHundred: 500,
    twoHundred: 200,
    oneHundred: 100,
    fifty: 50,
    twenty: 20,
    ten: 10,
    five: 5,
    two: 2,
    one: 1,
  };

  const calculateSum = (dataObj) =>
    Object.keys(dataObj).reduce(
      (acc, curr) =>
        dataObj[curr] === undefined
          ? acc
          : acc + dataObj[curr] * indexArr[curr],
      0
    );

  let openingNotesSum = calculateSum(openingNotes);
  let openingCoinsSum = calculateSum(openingCoin);
  let closingNotesSum = calculateSum(closingNotes);
  let closingCoinsSum = calculateSum(closingCoin);

  const finalProcedureData = {
    procedure: procedureValue,
    notesSum: procedureValue === 'open' ? openingNotesSum : closingNotesSum,
    coinsSum: procedureValue === 'open' ? openingCoinsSum : closingCoinsSum,
    totalSum:
      procedureValue === 'open'
        ? openingNotesSum + openingCoinsSum
        : closingNotesSum + closingCoinsSum,
    notes:
      procedureValue === 'open' ? { ...openingNotes } : { ...closingNotes },
    coins: procedureValue === 'open' ? { ...openingCoin } : { ...closingCoin },
    upiSum: upiSum ?? 0,
  };

  const getAllProcedure = async () => {
    const allProcedures = await genericAxios({
      url: API_PATHS.OPENCLOSE.GET_ALL_PROCEDURE,
      method: API_METHODS.GET,
      headers: {
        Cookie: '',
      },
    });
    if (allProcedures.error) return;
    const { procedures } = allProcedures.data.message;
    setProcedure(procedures);
  };

  const getDayWiseProcedure = async () => {
    const allDayWiseProcedures = await genericAxios({
      url: API_PATHS.OPENCLOSE.GET_DAY_WISE_PROCEDURE,
      method: API_METHODS.GET,
      headers: {
        Cookie: '',
      },
    });
    if (allDayWiseProcedures.error) return;
    const { dayWiseProcedures } = allDayWiseProcedures.data.message;
    setDayWiseProcedures(dayWiseProcedures);
  };

  useEffect(() => {
    getAllProcedure();
    getDayWiseProcedure();
  }, [setProcedure, procedureValue, setDayWiseProcedures]);

  useEffect(() => {
    setOpeningNotes(INITIAL_VALS);
    setOpeningCoin(INITIAL_VALS);
    setClosingNotes(INITIAL_VALS);
    setClosingCoin(INITIAL_VALS);

    dayWiseProcedures.forEach((procedureObj) => {
      let date = procedureObj._id;

      if (selectedDate === date ) {

        setOpeningNotes( procedureObj?.openingNotes );
        setOpeningCoin( procedureObj?.openingCoins);

        setClosingNotes(procedureObj?.closingNotes );
        setClosingCoin(procedureObj?.closingCoins );
        setUpiSum(procedureObj?.closingUpiSum ?? 0);
      }
    });
  }, [dayWiseProcedures, currentDate, selectedDate]);
  const findSelectedProcedureDate = () => 
    dayWiseProcedures.find(procedureObj => selectedDate === procedureObj._id)?._id || '';
  
  const handleProcedure = async () => {
    setApiLoading(true);
  
    const selectedProcedureDate = findSelectedProcedureDate();
    const isNewProcedure = selectedProcedureDate !== currentDate && selectedDate === currentDate;
  
    const API_PATHS_MAP = {
      open: {
        post: API_PATHS.OPENCLOSE.POST_NEW_PROCEDURE_OPEN,
        put: API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_OPEN
      },
      close: {
        post: API_PATHS.OPENCLOSE.POST_NEW_PROCEDURE_CLOSE,
        put: API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_CLOSE
      }
    };
  
    const { post, put } = API_PATHS_MAP[procedureValue];
  console.log({selectedProcedureDate, procedureValue});
  
    if (isNewProcedure) {
      const response = await genericAxios({ 
        url: post, 
        method: API_METHODS.POST, 
        data: { ...finalProcedureData }, 
        headers: { Cookie: '' } 
      });
  
      if (response?.error) {
        setApiLoading(false);
        return;
      }
    } else if (selectedDate === selectedProcedureDate) {

      await genericAxios({ 
        url: put, 
        method: API_METHODS.PUT, 
        data: { date: selectedDate, procedureType: procedureValue, procedureToBeUpdated: { ...finalProcedureData } }, 
        headers: { Cookie: '' } 
      });
    }
  
    await getDayWiseProcedure();
    setApiLoading(false);
  };
  
  useEffect(() => {
    if (!expenseList.length) {
      const getAllData = async () => {
        const allExpense = await genericAxios({
          url: API_PATHS.EXPENSE.GET_EXPENSE,
          method: API_METHODS.GET,
          headers: {
            Cookie: '',
          },
        });
        if (allExpense.error) return;
        expenseDispatch({
          type: 'UPDATE_EXPENSE_LIST',
          payload: allExpense.data.data,
        });
      };
      getAllData();
    }
    // eslint-disable-next-line
  }, [expenseDispatch]);

  useEffect(() => {
    (async () => {
      const dayBill = await genericAxios({
        url: API_PATHS.BILLING.GET_ALL_DAILY_BILLS,
        method: API_METHODS.GET,
        headers: {
          Cookie: '',
        },
      });
      if (dayBill.error) return;
      setAllBills(dayBill.data.message.allDailyBills);
    })();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: '30px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ marginLeft: '18px' }}>
          <h4>Selected date:</h4>
          <input
            onChange={(e) => setSelectedDate(e.target.value)}
            type="date"
            id="date-procedure"
            name="date-procedure"
            value={selectedDate}
            min="2022-09-14"
            max={currentDate}
            style={{
              padding: '8px',
              border: '1px solid #d5dadf',
              borderRadius: '4px',
            }}
          ></input>
        </div>
        <Select
          placeholder="Select Procedure"
          data={[
            { value: 'open', label: 'Open' },
            { value: 'close', label: 'Close' },
          ]}
          value={procedureValue}
          onChange={setProcedureValue}
          style={{ marginTop: '18px', marginLeft: '28px' }}
        />
      </div>

      <Text id="mainTitle" style={{ width: '100vw' }} size="xl" weight={700}>
        {procedureValue === 'open' ? 'Opening' : 'Closing'}
      </Text>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          gap: '20px',
          marginTop: '20px',
          padding: "20px",
          flexWrap: "wrap",
          width: "100%"
        }}
        className="left-side-opening-container"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0px 0px 15px -1px rgba(0,0,0,0.12)',
            borderRadius: '8px',
            padding: '10px 15px 15px 5px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '70px',
                marginTop: '40px',
              }}
            >
              {Object.values(indexArr).map((key, index) => (
                <Title
                  key={index}
                  order={6}
                  style={{
                    width: '70px',
                    lineHeight: '26px',
                  }}
                >
                  {key}
                </Title>
              ))}
              <Title order={4}>Total</Title>
            </div>
            {['notes', 'coins'].map((denominationForm, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div>
                  <Text style={{ height: '30px' }}>
                    {denominationForm === 'notes' ? 'Notes' : 'Coins'}
                  </Text>
                  {Object.keys(INITIAL_VALS).map((key, index) => (
                    <div key={index}>
                      {procedureValue === 'open' ? (
                        <NumberInput
                          name={`${key}`}
                          size="xs"
                          style={{
                            width: '70px',
                            padding: '3px 0',
                          }}
                          onChange={(value) =>
                            denominationForm === 'notes'
                              ? handleOpeningNotesInput(value, key)
                              : handleOpeningCoinInput(value, key)
                          }
                          value={
                            denominationForm === 'notes'
                              ? openingNotes[key]
                              : openingCoin[key]
                          }
                        />
                      ) : (
                        <NumberInput
                          name={`${key}`}
                          size="xs"
                          style={{
                            width: '70px',
                            padding: '3px 0',
                          }}
                          onChange={(value) =>
                            denominationForm === 'notes'
                              ? handleClosingNotesInput(value, key)
                              : handleClosingCoinInput(value, key)
                          }
                          value={
                            denominationForm === 'notes'
                              ? closingNotes[key]
                              : closingCoin[key]
                          }
                        />
                      )}
                    </div>
                  ))}
                  {procedureValue === 'open' ? (
                    <Text
                      style={{ margin: '0 4px', width: '70px' }}
                      size="md"
                      weight={500}
                    >
                      {denominationForm === 'notes'
                        ? openingNotesSum
                        : openingCoinsSum}
                    </Text>
                  ) : (
                    <Text
                      style={{ margin: '0 4px', width: '70px' }}
                      size="md"
                      weight={500}
                    >
                      <span>
                        {denominationForm === 'notes'
                          ? closingNotesSum
                          : closingCoinsSum}
                      </span>
                    </Text>
                  )}
                </div>
              </div>
            ))}
          </div>
          {procedureValue === "close" && <div 
            style={{
              display:"flex", 
              gap: "20px", 
              alignItems: "flex-end", 
              padding: "12px",
              boxShadow: '0px 0px 15px -1px rgba(0,0,0,0.12)',
              borderRadius: '8px',
              marginLeft: '8px',
            }}
          >
            <NumberInput
              placeholder="Amount"
              label="UPI Amount"
              value={upiSum}
              onChange={(value) => setUpiSum(value)}
              style={{
                width: "100%",
                textAlign: "start"
              }}
            />
          </div>}
          <div style={{ marginTop: '20px' }}>
            {procedureValue === 'open' ? (
              <Text size="xl" weight={700}>
                Total sum= {openingNotesSum + openingCoinsSum}
              </Text>
            ) : (
              <Text size="xl" weight={700}>
                Total sum= {closingNotesSum + closingCoinsSum}
              </Text>
            )}
            <Button
              loading={apiLoading}
              style={{ width: '100px', marginTop: '5px' }}
              onClick={handleProcedure}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="right-side-opening-container">
          <AddExpense date={expenseDataDate} />
          {/* <EmployeeAttendance /> */}
        </div>
      </div>
      <Title style={{ margin: '44px' }} order={2}>
        All Procedures
      </Title>

      <Table striped highlightOnHover>
        <thead className="heading">
          <tr>
            <th>
              <Text>Date</Text>
            </th>
            <th>
              <Text>Opening Time</Text>
            </th>
            <th>
              <Text>Opening Sum</Text>
            </th>
            {/* <th>
              <Text>Opening Notes Sum</Text>
            </th>
            <th>
              <Text>Opening Coins Sum</Text>
            </th> */}
            <th>
              <Text>Closing Time</Text>
            </th>
            <th>
              <Text>Closing Sum</Text>
            </th>
            {/* <th>
              <Text>Closing Notes Sum</Text>
            </th>
            <th>
              <Text>Closing Coins Sum</Text>
            </th> */}
            <th>
              <Text>Closing - Opening</Text>
            </th>
            <th>
              <Text>Expense</Text>
            </th>
            <th>
              <Text>Cash - Amt Ret</Text>
            </th>
            <ProtectedComponent role={access.CHECK_AMOUNT_ROW}>
              <th>
                <Text>Cash Check</Text>
              </th>
            </ProtectedComponent>
            <th>
              <Text>Total UPI Pay</Text>
            </th>
            <th>
              <Text>Closing UPI sum</Text>
            </th>
            <ProtectedComponent role={access.CHECK_AMOUNT_ROW}>
              <th>
                <Text>UPI Check</Text>
              </th>
            </ProtectedComponent>
          </tr>
        </thead>
        <tbody className="body">
          <ProtectedComponent role={access.OPEN_CLOSE_TABLE}>
            {dayWiseProcedures.map((item, idx) => {
              return (
                <TableRow
                  key={idx}
                  item={item}
                  idx={idx}
                  expense={expenseList}
                  bill={allBills}
                  expenseDate={setexpenseDataDate}
                />
              );
            })}
          </ProtectedComponent>
        </tbody>
      </Table>
    </div>
  );
};

const PopoverComponent = (sum, denominations) => {
  return (
    <Popover width={250} radius="md" position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Text color="black" weight={500}>
          {sum}
        </Text>
      </Popover.Target>
      <Popover.Dropdown style={{ padding: '0' }}>
        <Table>
          <thead>
            <tr style={{ backgroundColor: 'initial' }}>
              <th>
                <Text>Denomination</Text>
              </th>
              <th>
                <Text>Number</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(denominations)
              .filter((key) => denominations[key] !== 0)
              .map((key) => (
                <tr key={key}>
                  <td>
                    <Text size="sm">{key}:</Text>
                  </td>
                  <td>
                    <Text size="sm">{denominations[key]}</Text>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Popover.Dropdown>
    </Popover>
  );
};

const TableRow = ({ item, idx, expense, bill, expenseDate }) => {
  const {
    _id,
    openingNotes,
    openingCoins,
    openingNotesSum,
    openingCoinsSum,
    openingTime,
    openingSum,
    closingNotes,
    closingCoins,
    closingCoinsSum,
    closingNotesSum,
    closingTime,
    closingSum,
    closingUpiSum,
  } = item;

  const filteredItem = expense.filter((element) => {
    if (element._id === item._id) {
      return element;
    } else {
      return 0;
    }
  });

  const filteredBill = bill.filter((element) => {
    if (element._id === item._id) {
      return element;
    } else {
      return 0;
    }
  });

  const billBalanceCheck = (idx) => {
    const closeOpen = closingSum - openingSum;
    const expense = filteredItem.length ? filteredItem[idx].amount : 0;
    const cashAmountReturn = filteredBill.length
      ? filteredBill[idx].totalCashPay - filteredBill[idx].totalAmountReturn
      : 0;
    return closeOpen + expense - cashAmountReturn;
  };

  const showExpenseOf = () => {
    expenseDate(item._id);
  };

  return (
    <>
      <tr>
        <td>
          <Text color="black" weight={500}>
            {new Date(_id).toDateString()}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {openingTime === 0
              ? 0
              : new Date(openingTime).toLocaleTimeString('en-US')}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {openingSum}
          </Text>
        </td>
        {/* <td>
          <Text color="black" weight={500}>
            {PopoverComponent(openingNotesSum, openingNotes)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {PopoverComponent(openingCoinsSum, openingCoins)}
          </Text>
        </td> */}
        <td>
          <Text color="black" weight={500}>
            {closingTime === 0
              ? 0
              : new Date(closingTime).toLocaleTimeString('en-US')}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {closingSum}
          </Text>
        </td>
        {/* <td>
          <Text color="black" weight={500}>
            {PopoverComponent(closingNotesSum, closingNotes)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {PopoverComponent(closingCoinsSum, closingCoins)}
          </Text>
        </td> */}
        <td>
          <Text color="black" weight={500}>
            {closingSum - openingSum}
          </Text>
        </td>
        <td>
          <a
            href="#mainTitle"
            color="black"
            weight={500}
            onClick={showExpenseOf}
            style={{ textDecoration: 'none', color: 'black', fontWeight: 600 }}
          >
            {filteredItem.length ? filteredItem[0].amount : 0}
          </a>
        </td>
        <td>
          <Text color="black" weight={500}>
            {filteredBill.length
              ? filteredBill[0].totalCashPay - filteredBill[0].totalAmountReturn
              : 0}
          </Text>
        </td>
        <ProtectedComponent role={access.CHECK_AMOUNT_ROW}>
          <td>
            <Text color="black" weight={500}>
              {filteredBill.length ? billBalanceCheck(0) : 0}
            </Text>
          </td>
        </ProtectedComponent>
        <td>
          <Text color="black" weight={500}>
            {filteredBill[0]?.totalUpiPay ?? 0}
          </Text>
        </td>
        <td>
            <Text color="black" weight={500}>
              {(closingUpiSum ?? 0)}
            </Text>
          </td>
        <ProtectedComponent role={access.CHECK_AMOUNT_ROW}>
          <td>
            <Text color="black" weight={500}>
              {(closingUpiSum ?? 0)-(filteredBill[0]?.totalUpiPay ?? 0)}
            </Text>
          </td>
        </ProtectedComponent>
      </tr>
    </>
  );
};

export default OpenClose;

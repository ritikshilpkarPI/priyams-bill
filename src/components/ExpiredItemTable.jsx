import { Button, Loader, Table, Card, Title, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import React, { useState, useEffect } from 'react';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';

const addDays = (date, days) => {
  let dayToIncr = {
    1: 0,
    7: 2,
    15: 8,
    30: 16,
  };

  let currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + dayToIncr[days]);
  let endDate = new Date(date);
  endDate.setDate(endDate.getDate() + days);
  return { currentDate, endDate };
};

const getExpiredItemsData = async (startDate, endDate) => {
  try {
    const { status, data } = await genericAxios({
      url: API_PATHS.INVENTORY.POST_FILTER_EXPIRY_DATES,
      method: API_METHODS.POST,
      data: {
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
      },
    });
    return { status, data };
  } catch (error) {
    return { error };
  }
};

const ExpiredItemTable = ({ day }) => {
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(addDays(new Date(), 30));
  const [expiredItemsArr, setExpiredItemsArr] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const { currentDate, endDate } = addDays(startDateValue, day);

  useEffect(() => {
    const getExpiredData = async () => {
      setLoader(true);
      const { status, data } = await getExpiredItemsData(currentDate, endDate);
      if (status === 200) {
        setExpiredItemsArr(data.message.expiredItems);
        setLoader(false);
      } else {
        setErrorMsg('Error try again later');
        setLoader(false);
      }
    };
    // eslint-disable-next-line
    getExpiredData();
    // eslint-disable-next-line
  }, []);

  const handleDateSearch = async () => {
    setLoader(true);
    const { status, data } = await getExpiredItemsData(
      startDateValue,
      endDateValue
    );
    if (status === 200) {
      setExpiredItemsArr(data.message.expiredItems);
      setLoader(false);
    } else {
      setErrorMsg('Error try again later');
      setLoader(false);
    }
  };
  return (
    <div className="outer-div">
      <Card shadow="sm" p="lg" radius="md" withBorder className="toggle-height">
        <Card.Section>
          <Title order={2} className="position-heading">
            {`${day} days (${expiredItemsArr.length})`}
          </Title>
          <Text size="md">{`on ${endDate.toDateString()}`}</Text>
        </Card.Section>
        {day === 30 && (
          <Card.Section>
            <div className="parent-datePicker">
              <DatePicker
                placeholder="Start date"
                value={startDateValue}
                withAsterisk
                onChange={setStartDateValue}
              />
              <DatePicker
                placeholder="End date"
                value={endDateValue}
                withAsterisk
                onChange={setEndDateValue}
              />
              <Button onClick={handleDateSearch}>Search</Button>
            </div>
          </Card.Section>
        )}
        <Card.Section className="table-scroll">
          <Table striped highlightOnHover withBorder withColumnBorders>
            <thead>
              <th>Barcode</th>
              <th>Name</th>
              <th>Expiry</th>
              <th>Total Qty</th>
            </thead>
            {loader ? (
              <div
                style={{
                  height: '50vh',
                  width: '350%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Loader size="md" />
              </div>
            ) : (
              <tbody>
                {expiredItemsArr.length ? (
                  expiredItemsArr.map((expiredItemObj, index) => {
                    return (
                      <tr key={index}>
                        <td>{expiredItemObj.itemBarcode}</td>
                        <td>{expiredItemObj.itemName}</td>
                        <td>
                          {new Date(
                            expiredItemObj.useByDate.date
                          ).toLocaleDateString()}
                        </td>
                        <td>{expiredItemObj.useByDate.value}</td>
                      </tr>
                    );
                  })
                ) : (
                  <div className="error">
                    <h3>{errorMsg}</h3>
                  </div>
                )}
              </tbody>
            )}
          </Table>
        </Card.Section>
      </Card>
    </div>
  );
};

export default ExpiredItemTable;

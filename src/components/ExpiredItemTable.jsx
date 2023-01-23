import { Button, Loader, Table, Card, Title } from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import { Axios } from "src/utils/axios";
import React, { useState, useEffect } from 'react';

const addDays = (date, days) => {

   let dayToIncr={
        1:0,
        7:2,
        15:8,
        30:16
    }
   
    let currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate()+dayToIncr[days]);
    let endDate = new Date(date);
    endDate.setDate(endDate.getDate()+days );
    return {currentDate,endDate}

};

const getExpiredApiData = async (startDate, endDate) => {
    const { data } = await Axios.request({
        url: "/api/inventory/filterExpiryDates",
        method: "POST",
        data: {
            startDate: startDate.toLocaleDateString(),
            endDate: endDate.toLocaleDateString(),
        }
    });

    return data;
}

const ExpiredItemTable = ({ day }) => {
    const [startDateValue, setStartDateValue] = useState(new Date());
    const [endDateValue, setEndDateValue] = useState(addDays(new Date(), 30));
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const getExpiredData = async () => {
            const {currentDate,endDate} = addDays(startDateValue, day);
            setLoader(true);
            const response = await getExpiredApiData(currentDate, endDate);
            setData(response.message.expiredItems);
            setLoader(false);
        }
        // eslint-disable-next-line
        getExpiredData();
        // eslint-disable-next-line
    }, []);

    const handleDateSearch = async () => {
        setLoader(true);
        const response = await getExpiredApiData(startDateValue, endDateValue);
        setData(response.message.expiredItems);
        setLoader(false);
    }
    console.log(day, data);
    return (
        <div className="outer-div" >
            {loader ? (
                <div
                    style={{
                        height: "95vh",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Loader size="md" />
                </div>
            ) :
                (<Card shadow="sm" p="lg" radius="md" withBorder className=" toggle-height">

                    <Card.Section>
                        <Title order={2} className="position-heading">{day} days</Title>
                    </Card.Section>
                    <Card.Section>
                        <div className="parent-datePicker">
                            {day === 30 && <DatePicker placeholder="Start date" value={startDateValue} withAsterisk onChange={setStartDateValue} />}
                            {day === 30 && <DatePicker placeholder="End date" value={endDateValue} withAsterisk onChange={setEndDateValue} />}
                            {day === 30 && <Button onClick={handleDateSearch}>Search</Button>}
                        </div>

                    </Card.Section>
                    <Card.Section className="table-scroll">
                        <Table striped highlightOnHover withBorder withColumnBorders >
                            <thead>
                                <th>Barcode</th>
                                <th>Name</th>
                                <th>Expiry</th>
                                <th>Total Qty</th>
                            </thead>
                            <tbody>
                                {data &&
                                    data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.itemBarcode}</td>
                                                <td>{item.itemName}</td>
                                                <td>{new Date(item.useByDate.date).toLocaleDateString()}</td>
                                                <td>{item.useByDate.quantity}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </Table>
                    </Card.Section>
                </Card>
                )}
        </div>
        // </>

    )
}

export default ExpiredItemTable
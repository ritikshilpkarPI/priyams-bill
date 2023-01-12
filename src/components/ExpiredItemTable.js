import { Button, Loader, Table, Card, Title } from "@mantine/core";
import { Grid } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import React, { useState, useEffect } from "react";
import { Axios } from "src/utils/axios";
function ExpiredItemTable({ header }) {
    console.log(header)
    const [expiredItems, setExpiredItems] = useState([]);
    const [loader, setLoader] = useState(false);
    const [startDate, setStartDate] = useState("11/16/2022");
    const [endDate, setEndDate] = useState("1/7/2023");
    const [render, setRender] = useState(false);
    const [startDateRange, setStartDateRange] = useState('');
    const [endDateRange, setEndDateRange] = useState('');
    const SearchDateFilter = () => {
        let s = (String(new Date(startDateRange).toLocaleDateString("en-US")));
        let e = (String(new Date(endDateRange).toLocaleDateString("en-US")));
        setRender(!render);
        setStartDate(s);
        setEndDate(e);
    }

    const myApiCall = async () => {
        setLoader(true);
        const { data } = await Axios.request({
            url: "/api/inventory/filterExpiryDates",
            method: "POST",
            data: {
                startDate: startDate,
                endDate: endDate,
            },
            headers: {
                Cookie: "",
            },
        });

        data.message.sort(function (a, b) {
            let dateA = new Date(a.useByDate[0].date);
            let dateB = new Date(b.useByDate[0].date);
            return dateA - dateB;
        });
        setExpiredItems(data.message);
        setLoader(false);
    }
    const handlingDate = (day, start_Date, end_Date) => {
        end_Date = start_Date.setDate(start_Date.getDate() + day);
        end_Date = String(new Date(end_Date).toLocaleDateString("en-US"));
        start_Date = new Date();
        start_Date = String(new Date(start_Date).toLocaleDateString("en-US"));

        return [day, start_Date, end_Date]
    }
    const getExpiredData = async () => {
        try {
            let start_Date = new Date();
            let day = 0;
            let end_Date

            if (header === "1 day") {

                day = Number(1);
                [day, start_Date, end_Date] = handlingDate(day, start_Date, end_Date)
            }
            else if (header === "7 days") {
                day = Number(7);
                [day, start_Date, end_Date] = handlingDate(day, start_Date, end_Date)
            }
            else if (header === "15 days") {
                day = Number(15);
                [day, start_Date, end_Date] = handlingDate(day, start_Date, end_Date)
            }
            else if (header === "30 days") {
                day = Number(30);
                [day, start_Date, end_Date] = handlingDate(day, start_Date, end_Date)
            }
            setLoader(true);
            const { data } = await Axios.request({
                url: "/api/inventory/filterExpiryDates",
                method: "POST",
                data: {
                    startDate: start_Date,
                    endDate: end_Date,
                },
                headers: {
                    Cookie: "",
                },
            });

            data.message.sort(function (a, b) {
                let dateA = new Date(a.useByDate[0].date);
                let dateB = new Date(b.useByDate[0].date);
                return dateA - dateB;
            });
            setExpiredItems(data.message);
            setLoader(false);
        } catch (err) {
            console.log({ err });
        }
    };
    useEffect(() => {
        myApiCall();
        // eslint-disable-next-line
    }, [render])

    useEffect(() => {
        const timer = setTimeout(() => {
            getExpiredData();
        }, 1000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line
    }, [])

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
                    <Loader size="xl" />
                </div>
            ) :
                (<Card shadow="sm" p="lg" radius="md" withBorder className=" toggle-height">

                    <Card.Section>
                        <Title order={2} className="position-heading">{header}</Title>
                        {(header === "30 days") ?
                            (
                                <Grid className="date-margin">
                                    <Grid.Col span={4}>
                                        <DatePicker placeholder="Start date" value={startDateRange} withAsterisk onChange={setStartDateRange} />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <DatePicker placeholder="End date" value={endDateRange} withAsterisk onChange={setEndDateRange} />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Button className="search-filter-btn" onClick={() => SearchDateFilter()} >Search Date Filter</Button>
                                    </Grid.Col>
                                </Grid>
                            )
                            :
                            ""
                        }
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
                                {expiredItems &&
                                    expiredItems.map((item) => {
                                        return (
                                            <tr>
                                                <td>{item._doc.itemBarcode}</td>
                                                <td>{item._doc.itemName}</td>
                                                <Table withBorder withColumnBorders>
                                                    <tbody>
                                                        {item.useByDate.map((expiry) => {
                                                            return (
                                                                <tr>
                                                                    <td style={{ width: "40%" }}>{`${new Date(
                                                                        expiry.date
                                                                    ).getDay()}/${new Date(expiry.date).getMonth() + 1
                                                                        }/${new Date(expiry.date).getFullYear()}`}</td>
                                                                    <td>{expiry.value}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                                <td>{item.totalItems}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </Table>
                    </Card.Section>
                </Card>
                )}
        </div>
    )
}

export default ExpiredItemTable
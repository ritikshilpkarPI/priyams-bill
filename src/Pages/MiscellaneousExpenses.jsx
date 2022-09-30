import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  NumberInput,
  TextInput,
  Button,
  Table,
  Loader,
  Image,
} from "@mantine/core";
import { Axios } from "../utils/axios";

const ShowOldExpenses = ({ dateState, reloadState }) => {
  const [allData, setAllData] = useState();

  // To get all expense data
  useEffect(() => {
    const getAllData = async () => {
      const allExpense = await Axios.request({
        url: "/api/expense",
        method: "get",
        headers: {
          Cookie: "",
        },
      });
      setAllData(allExpense.data.data);
    };
    getAllData();
  }, [reloadState]);

  return (
    <div
      className="table-section"
      style={{
        marginLeft: "25px",
        padding: "0 20px 20px",
        borderRadius: "8px",
        boxShadow: "0px 0px 15px -1px rgba(0,0,0,0.18)",
        width: "500px",
      }}
    >
      <Title order={4} sx={{ margin: "20px 0 20px" }}>
        Previous Expenses
      </Title>
      <Table>
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Date</th>
            <th style={{ textAlign: "center" }}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {allData?.map((element, index) => (
            <tr
              key={index}
              onClick={() => {
                dateState[1](element._id);
              }}
              style={{ cursor: "pointer" }}
            >
              <td>{element._id}</td>
              <td>{element.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div
        style={{
          marginTop: "10px",
          display: allData ? "none" : "inline-block",
        }}
      >
        <Loader size="sm" />
      </div>
    </div>
  );
};

const AddExpense = ({ dateState, reloadState }) => {
  const InputStyle = { width: "100%", marginTop: "15px" };
  const newDate = new Date();
  const todayDate = `${newDate.getFullYear()}-${(
    "0" +
    (newDate.getMonth() + 1)
  ).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}`;
  const todayTime = `${("0" + newDate.getHours()).slice(-2)}:${(
    "0" + newDate.getMinutes()
  ).slice(-2)}:${("0" + newDate.getSeconds()).slice(-2)}`;

  // All States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState();
  const [dataDate, setDataDate] = dateState;
  const [todayData, setTodayData] = useState();
  const [buttonLoad, setButtonLoad] = useState(false);
  const [reload, setReload] = useState(true);

  // Convert time
  function timeConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? " AM" : " PM";
      time[0] = +time[0] % 12 || 12;
    }
    return time.join("");
  }

  // To add new expense
  const addExpense = async (e) => {
    e.preventDefault();
    const obj = {
      user: name,
      description: description,
      amount: amount,
      date: todayDate,
      time: timeConvert(todayTime),
    };
    if (!obj.user || !obj.description || !obj.amount) {
      alert("Please enter all fields!");
    } else {
      setButtonLoad(true);
      const response = await Axios.request({
        url: "/api/expense",
        method: "post",
        data: { ...obj },
        headers: {
          Cookie: "",
        },
      });
      if (
        response.data.status === true &&
        response.data.message === "expense added"
      ) {
        setName("");
        setDescription("");
        setAmount();
        setButtonLoad(false);
        reloadState[1](!reloadState[0]);
      } else {
        alert("Failed to save date!");
      }
    }
  };

  // To get today expense data
  useEffect(() => {
    const getTodayData = async () => {
      const todayExpense = await Axios.request({
        url: `/api/expense/${dataDate}`,
        method: "get",
        headers: {
          Cookie: "",
        },
      });
      setTodayData(todayExpense.data.data);
    };
    getTodayData();
  }, [dataDate, buttonLoad, reload]);

  // To delete expense item
  const deleteExpense = async (id) => {
    const userResponse = window.confirm("Do you want to delete this item?");
    if (userResponse) {
      const response = await Axios.request({
        url: `/api/expense/${id}`,
        method: "delete",
        headers: {
          Cookie: "",
        },
      });
      if (
        response.data.status === true &&
        response.data.message === "expense deleted"
      ) {
        setReload(!reload);
        reloadState[1](!reloadState[0]);
      } else {
        alert("Failed to delete expense!");
      }
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
    const response = await Axios.request({
      url: `/api/expense/${itemToUpdate._id}`,
      method: "put",
      data: { ...itemToUpdate },
      headers: {
        Cookie: "",
      },
    });
    if (
      response.data.status === true &&
      response.data.message === "expense updated"
    ) {
      alert("Expense updated!");
      reloadState[1](!reloadState[0]);
    } else {
      alert("Failed to update expense item!");
    }
  };

  return (
    <div>
      <div
        className="input-section"
        style={{
          width: "900px",
          textAlign: "left",
          padding: "15px 28px 28px",
          borderRadius: "8px",
          boxShadow: "0px 0px 15px -1px rgba(0,0,0,0.18)",
        }}
      >
        <form onSubmit={addExpense}>
          <Title order={4} style={{ marginTop: "20px" }}>
            Add Expenses
          </Title>
          <div style={{ display: "flex" }}>
            <TextInput
              label="Your name"
              placeholder="Your name"
              style={InputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <NumberInput
              placeholder="Amount"
              label="Paid Amount"
              style={{ ...InputStyle, marginLeft: "15px" }}
              value={amount}
              onChange={(value) => setAmount(value)}
            />
          </div>
          <TextInput
            label="Description"
            placeholder="Description"
            style={InputStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            style={{ ...InputStyle, height: "43px", marginTop: "20px" }}
            type="submit"
            loading={buttonLoad}
          >
            Pay
          </Button>
        </form>
      </div>
      <div
        style={{
          borderRadius: "8px",
          boxShadow: "0px 0px 15px -1px rgba(0,0,0,0.18)",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <div>
          <input
            type="date"
            name="date"
            id="date"
            style={{ fontSize: "18px", padding: "4px" }}
            value={dataDate}
            onChange={(e) => setDataDate(e.target.value)}
          />
        </div>
        <Table sx={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Time</th>
              <th>Description</th>
              <th>User</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {todayData?.map((element, index) => (
              <tr key={index}>
                <td style={{ padding: "0 6px" }}>{element.time}</td>
                <td style={{ width: "350px", padding: "0 6px" }}>
                  <TextInput
                    style={{ border: "0px solid red", outline: "none" }}
                    variant="unstyled"
                    value={element.description}
                    onChange={(e) =>
                      handleInputChange(
                        element,
                        "description",
                        e.target.value,
                        index
                      )
                    }
                  />
                </td>
                <td style={{ padding: "0 6px", width: "180px" }}>
                  <TextInput
                    variant="unstyled"
                    value={element.user}
                    onChange={(e) =>
                      handleInputChange(element, "user", e.target.value, index)
                    }
                  />
                </td>
                <td style={{ padding: "0 6px", width: "130px" }}>
                  <NumberInput
                    style={{ textAlign: "center" }}
                    variant="unstyled"
                    value={element.amount}
                    onChange={(value) =>
                      handleInputChange(element, "amount", value, index)
                    }
                  />
                </td>
                <td style={{ display: dataDate === todayDate ? "" : "none" }}>
                  <Image
                    style={{ padding: "7px", width: "26px", cursor: "pointer" }}
                    onClick={() => deleteExpense(element._id)}
                    src="images/cross.svg"
                  />
                </td>
                <td style={{ display: dataDate === todayDate ? "" : "none" }}>
                  <Image
                    style={{ padding: "6px", width: "27px", cursor: "pointer" }}
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
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          {todayData?.length === 0 ? <Text>No data...</Text> : ""}
          {!todayData ? <Loader size="sm" /> : ""}
        </div>
      </div>
    </div>
  );
};
const MiscellaneousExpenses = () => {
  const newDate = new Date();
  const todayDate = `${newDate.getFullYear()}-${(
    "0" +
    (newDate.getMonth() + 1)
  ).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}`;
  const [reload, setreload] = useState(true);
  const dateState = useState(todayDate);

  return (
    <div style={{ display: "inline-block" }}>
      <Title order={3} sx={{ margin: "55px 0 10px" }}>
        Miscellaneous Expenses
      </Title>
      <div
        className="container"
        style={{ display: "flex", padding: "30px", alignItems: "start" }}
      >
        <AddExpense dateState={dateState} reloadState={[reload, setreload]} />
        <ShowOldExpenses dateState={dateState} reloadState={reload} />
      </div>
    </div>
  );
};

export default MiscellaneousExpenses;

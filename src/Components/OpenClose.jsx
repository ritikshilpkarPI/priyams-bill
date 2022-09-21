import {
  Button,
  NumberInput,
  Popover,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Axios } from "../utils/axios";

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
let createdAtDate = "";
let id = "";

export const OpenClose = () => {
  const currentDate = new Date().toJSON().split("T")[0];

  const [procedureValue, setProcedureValue] = useState("open");
  const [procedure, setProcedure] = useState([]);
  const [dayWiseProcedures, setDayWiseProcedures] = useState([]);
  const [openingNotes, setOpeningNotes] = useState(INITIAL_VALS);
  const [closingNotes, setClosingNotes] = useState(INITIAL_VALS);
  const [openingCoin, setOpeningCoin] = useState(INITIAL_VALS);
  const [closingCoin, setClosingCoin] = useState(INITIAL_VALS);

  const [selectedDate, setSelectedDate] = useState(currentDate);

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
    notesSum: procedureValue === "open" ? openingNotesSum : closingNotesSum,
    coinsSum: procedureValue === "open" ? openingCoinsSum : closingCoinsSum,
    totalSum:
      procedureValue === "open"
        ? openingNotesSum + openingCoinsSum
        : closingNotesSum + closingCoinsSum,
    notes:
      procedureValue === "open" ? { ...openingNotes } : { ...closingNotes },
    coins: procedureValue === "open" ? { ...openingCoin } : { ...closingCoin },
  };

  const getAllProcedure = async () => {
    const allProcedures = await Axios.request({
      url: `/api/openClose/getAllProcedure`,
      method: "get",
      headers: {
        Cookie: "",
      },
    });
    const { procedures } = allProcedures.data.message;
    setProcedure(procedures);
  };

  const getDayWiseProcedure = async () => {
    const allDayWiseProcedures = await Axios.request({
      url: `/api/openClose/getDayWiseProcedure`,
      method: "get",
      headers: {
        Cookie: "",
      },
    });
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
    
    procedure.forEach((procedureObj) => {
      let date = procedureObj.createdAt;
      createdAtDate = date.split("T")[0];

      if (selectedDate === createdAtDate && procedureObj.procedure === "open") {
        setOpeningNotes(procedureObj.notes);
        setOpeningCoin(procedureObj.coins);
      }
      if (
        selectedDate === createdAtDate &&
        procedureObj.procedure === "close"
      ) {
        setClosingNotes(procedureObj.notes);
        setClosingCoin(procedureObj.coins);
      }
    });
  }, [procedure, currentDate, selectedDate]);

  let selectedProcedureDate = "";

  const addNewOpenProcedure = async () => {
    id = "";
    procedure.forEach((procedureObj) => {
      let date = procedureObj.createdAt;
      createdAtDate = date.split("T")[0];
      if (selectedDate === createdAtDate && procedureObj.procedure === "open") {
        id = procedureObj._id;
        selectedProcedureDate = createdAtDate;
      }
    });
    let procedureToEdit = procedure?.find((x) => x._id === id);
    if (
      createdAtDate !== currentDate ||
      (id === "" && selectedDate === currentDate)
    ) {
      const newOpenProcedure = await Axios.request({
        url: `/api/openClose/newProcedure/open`,
        method: "post",
        data: { ...finalProcedureData },
        headers: {
          Cookie: "",
        },
      });
      let dateFromDb = newOpenProcedure.data.message.createdAt;
      createdAtDate = dateFromDb.split("T")[0];
      id = newOpenProcedure.data.message._id;
    } else if (
      selectedDate === selectedProcedureDate &&
      procedureToEdit.procedure === "open"
    ) {
      await Axios.request({
        url: `/api/openClose/editProcedure/open`,
        method: "put",
        data: { id, procedureToBeUpdated: { ...finalProcedureData } },
        headers: {
          Cookie: "",
        },
      });
      getAllProcedure();
      getDayWiseProcedure();
    }
  };
  const addNewCloseProcedure = async () => {
    id = "";
    procedure.forEach((procedureObj) => {
      let date = procedureObj.createdAt;
      createdAtDate = date.split("T")[0];
      if (
        selectedDate === createdAtDate &&
        procedureObj.procedure === "close"
      ) {
        id = procedureObj._id;
        selectedProcedureDate = createdAtDate;
      }
    });
    let procedureToEdit = procedure.find((x) => x._id === id);
    if (
      createdAtDate !== currentDate ||
      (id === "" && selectedDate === currentDate)
    ) {
      const newCloseProcedure = await Axios.request({
        url: `/api/openClose/newProcedure/close`,
        method: "post",
        data: { ...finalProcedureData },
        headers: {
          Cookie: "",
        },
      });
      let dateFromDb = newCloseProcedure.data.message.createdAt;
      createdAtDate = dateFromDb.split("T")[0];
      id = newCloseProcedure.data.message._id;
    } else if (
      selectedDate === selectedProcedureDate &&
      procedureToEdit?.procedure === "close"
    ) {
      await Axios.request({
        url: `/api/openClose/editProcedure/close`,
        method: "put",
        data: { id, procedureToBeUpdated: { ...finalProcedureData } },
        headers: {
          Cookie: "",
        },
      });
      getAllProcedure();
      getDayWiseProcedure();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          gap: "30px",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div style={{ marginLeft: "18px" }}>
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
              padding: "8px",
              border: "1px solid #d5dadf",
              borderRadius: "4px",
            }}
          ></input>
        </div>
        <Select
          placeholder="Select Procedure"
          data={[
            { value: "open", label: "Open" },
            { value: "close", label: "Close" },
          ]}
          value={procedureValue}
          onChange={setProcedureValue}
          style={{ marginTop: "18px" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <Text style={{ width: "100vw" }} size="xl" weight={700}>
          {procedureValue === "open" ? "Opening" : "Closing"}
        </Text>
        <div
          style={{
            display: "flex",
            width: "100vw",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ display: "flex", gap: "10px", marginLeft: "80px" }}>
              {Object.values(indexArr).map((key, index) => (
                <Title key={index} order={4} style={{ width: "70px" }}>
                  {key}
                </Title>
              ))}
            </div>
            {["notes", "coins"].map((denominationForm, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Text style={{ margin: "0 10px" }} size="lg" weight={500}>
                  {denominationForm === "notes" ? "Notes" : "Coins"}:
                </Text>

                {Object.keys(INITIAL_VALS).map((key, index) => (
                  <div key={index}>
                    {procedureValue === "open" ? (
                      <NumberInput
                        name={`${key}`}
                        style={{ width: "70px" }}
                        onChange={(value) =>
                          denominationForm === "notes"
                            ? handleOpeningNotesInput(value, key)
                            : handleOpeningCoinInput(value, key)
                        }
                        value={
                          denominationForm === "notes"
                            ? openingNotes[key]
                            : openingCoin[key]
                        }
                      />
                    ) : (
                      <NumberInput
                        name={`${key}`}
                        style={{ width: "70px" }}
                        onChange={(value) =>
                          denominationForm === "notes"
                            ? handleClosingNotesInput(value, key)
                            : handleClosingCoinInput(value, key)
                        }
                        value={
                          denominationForm === "notes"
                            ? closingNotes[key]
                            : closingCoin[key]
                        }
                      />
                    )}
                  </div>
                ))}
                {procedureValue === "open" ? (
                  <Text
                    style={{ margin: "0 4px", width: "80px" }}
                    size="lg"
                    weight={500}
                  >
                    ={" "}
                    {denominationForm === "notes"
                      ? openingNotesSum
                      : openingCoinsSum}
                  </Text>
                ) : (
                  <Text
                    style={{ margin: "0 4px", width: "100px" }}
                    size="lg"
                    weight={500}
                  >
                    ={" "}
                    <span>
                      {denominationForm === "notes"
                        ? closingNotesSum
                        : closingCoinsSum}
                    </span>
                  </Text>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "40px" }}>
            {procedureValue === "open" ? (
              <Text size="xl" weight={700}>
                Total sum= {openingNotesSum + openingCoinsSum}
              </Text>
            ) : (
              <Text size="xl" weight={700}>
                Total sum= {closingNotesSum + closingCoinsSum}
              </Text>
            )}
            <Button
              style={{ width: "80px", marginTop: "30px" }}
              onClick={
                procedureValue === "open"
                  ? addNewOpenProcedure
                  : addNewCloseProcedure
              }
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <Title style={{ margin: "44px" }} order={2}>
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
            <th>
              <Text>Opening Notes Sum</Text>
            </th>
            <th>
              <Text>Opening Coins Sum</Text>
            </th>
            <th>
              <Text>Closing Time</Text>
            </th>
            <th>
              <Text>Closing Sum</Text>
            </th>
            <th>
              <Text>Closing Notes Sum</Text>
            </th>
            <th>
              <Text>Closing Coins Sum</Text>
            </th>
            <th>
              <Text>Total Sum</Text>
            </th>
          </tr>
        </thead>
        <tbody className="body">
          {dayWiseProcedures.map((item, idx) => {
            return <TableRow key={idx} item={item} idx={idx} />;
          })}
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
      <Popover.Dropdown style={{ padding: "0" }}>
        <Table>
          <thead>
            <tr style={{ backgroundColor: "initial" }}>
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
const TableRow = ({ item, idx }) => {
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
  } = item;

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
            {new Date(openingTime).toLocaleTimeString("en-US")}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {openingSum}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {PopoverComponent(openingNotesSum, openingNotes)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {PopoverComponent(openingCoinsSum, openingCoins)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {new Date(closingTime).toLocaleTimeString("en-US")}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {closingSum}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {PopoverComponent(closingNotesSum, closingNotes)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {PopoverComponent(closingCoinsSum, closingCoins)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {openingSum + closingSum}
          </Text>
        </td>
      </tr>
    </>
  );
};

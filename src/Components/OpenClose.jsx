import { NumberInput, Text } from "@mantine/core";
import { useState } from "react";

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

export const OpenClose = () => {
  const [openingNotes, setOpeningNotes] = useState(INITIAL_VALS);
  const [closingNotes, setClosingNotes] = useState(INITIAL_VALS);
  const [openingCoin, setOpeningCoin] = useState(INITIAL_VALS);
  const [closingCoin, setClosingCoin] = useState(INITIAL_VALS);

  const handleOpeningNotesInput = (value, key) => {
    console.log(value, key);
    setOpeningNotes((prev) => ({ ...prev, [key]: value }));

    console.log(openingNotes);
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
    0: 2000,
    1: 500,
    2: 200,
    3: 100,
    4: 50,
    5: 20,
    6: 10,
    7: 5,
    8: 2,
    9: 1,
  };
  const calculateSum = (dataObj) =>
    Object.values(dataObj).reduce(
      (acc, curr, index) =>
        curr === undefined ? acc : acc + curr * indexArr[index],
      0
    );
  let openingNotesSum = calculateSum(openingNotes);
  let openingCoinsSum = calculateSum(openingCoin);
  let closingNotesSum = calculateSum(closingNotes);
  let closingCoinsSum = calculateSum(closingCoin);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <Text style={{ width: "100px" }} size="xl" weight={700}>
          Opening
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            Notes:
          </Text>
          {Object.keys(openingNotes).map((key) => (
            <div>
              <label>{key.toUpperCase()}</label>
              <NumberInput
                name={`${key}`}
                onChange={(value) => handleOpeningNotesInput(value, key)}
                value={key}
              />
            </div>
          ))}
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            = {openingNotesSum}
          </Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            Coins:
          </Text>
          {Object.keys(openingCoin).map((key) => (
            <div>
              <label>{key.toUpperCase()}</label>
              <NumberInput
                name={`${key}`}
                onChange={(value) => handleOpeningCoinInput(value, key)}
                value={key}
              />
            </div>
          ))}
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            = {openingCoinsSum}
          </Text>
        </div>
        <Text
          style={{ position: "absolute", right: "18px", top: "250px" }}
          size="xl"
          weight={700}
        >
          Total opening sum= {openingNotesSum + openingCoinsSum}
        </Text>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <Text style={{ width: "100px" }} size="xl" weight={700}>
          Closing
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            Notes:
          </Text>
          {Object.keys(closingNotes).map((key) => (
            <div>
              <label>{key.toUpperCase()}</label>
              <NumberInput
                name={`${key}`}
                onChange={(value) => handleClosingNotesInput(value, key)}
                value={key}
              />
            </div>
          ))}
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            = {closingNotesSum}
          </Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            Coins:
          </Text>
          {Object.keys(closingCoin).map((key) => (
            <div>
              <label>{key.toUpperCase()}</label>
              <NumberInput
                name={`${key}`}
                onChange={(value) => handleClosingCoinInput(value, key)}
                value={key}
              />
            </div>
          ))}
          <Text style={{ width: "100px" }} size="lg" weight={500}>
            = {closingCoinsSum}
          </Text>
        </div>
        <Text
          style={{ position: "absolute", right: "18px", top: "250px" }}
          size="xl"
          weight={700}
        >
          Total closing sum={closingNotesSum + closingCoinsSum}
        </Text>
      </div>
    </div>
  );
};

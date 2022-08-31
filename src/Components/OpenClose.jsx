import { NumberInput } from "@mantine/core";
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

  const handleOpeningNotesInput = (e) => {
    const { value, name } = e.target;
    setOpeningNotes((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpeningCoinInput = (e) => {
    const { value, name } = e.target;
    setOpeningCoin((prev) => ({ ...prev, [name]: value }));
  };
  const handleClosingNotesInput = (e) => {
    const { value, name } = e.target;
    setClosingNotes((prev) => ({ ...prev, [name]: value }));
  };
  const handleClosingCoinInput = (e) => {
    const { value, name } = e.target;
    setClosingCoin((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div>
        {Object.keys(openingNotes).map((key) => (
          <>
            <label>{key.toUpperCase()}</label>
            <NumberInput
              size="xs"
              name={`${key}`}
              onChange={handleOpeningNotesInput}
              value={key}
            />
          </>
        ))}
        {Object.keys(openingCoin).map((key) => (
          <>
            <label>{key.toUpperCase()}</label>
            <NumberInput
              size="xs"
              name={`${key}`}
              onChange={handleOpeningCoinInput}
              value={key}
            />
          </>
        ))}
      </div>
      {Object.keys(closingNotes).map((key) => (
        <>
          <label>{key.toUpperCase()}</label>
          <NumberInput
            size="xs"
            name={`${key}`}
            onChange={handleClosingNotesInput}
            value={key}
          />
        </>
      ))}
      {Object.keys(closingCoin).map((key) => (
        <>
          <label>{key.toUpperCase()}</label>
          <NumberInput
            size="xs"
            name={`${key}`}
            onChange={handleClosingCoinInput}
            value={key}
          />
        </>
      ))}
    </div>
  );
};

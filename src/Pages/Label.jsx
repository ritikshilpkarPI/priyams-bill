import React, { useState, useEffect } from 'react';
import { Loader, Button, Input, Checkbox } from '@mantine/core';
import { CloseButton } from '@mantine/core';

const Label = () => {
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [render, setRender] = useState(false);
  const [display, setDisplay] = useState(true);
  const [newData, setNewData] = useState([]);
  const [checked, setChecked] = useState(false);
  const getData = () => {
    setLoader(true);
    fetch(`${process.env.REACT_APP_LABEL_API}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data.message.items);
        setDisplay(true);
        setLoader(false);
      });
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const myData = data.filter(function (item) {
      // eslint-disable-next-line
      return item.itemName === value || item.itemBarcode == value;
    });

    if (myData.length) {
      setNewData([...newData, myData[0]]);
      setDisplay(false);
    }
    // eslint-disable-next-line
  }, [render]);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    searchTerm = String(searchTerm);
    setValue(searchTerm);
    setRender(!render);
  };

  const handleChange = () => {
    setChecked(!checked);
  };
  const handleRemoveItem = (idx) => {
    setNewData(newData.filter((item, index) => index !== idx));
  };
  const callPrint = () => {
    window.print();
  };
  var regExp = /[a-zA-Z]/g;
  return (
    <>
      <div className="search-container">
        <div className="search-inner">
          <Input
            placeholder="Item Name"
            variant="filled"
            radius="md"
            size="md"
            value={value}
            onChange={onChange}
            className="input-item-search"
          />
          <Button size="md" radius="md" onClick={() => onSearch(value)}>
            {' '}
            Search{' '}
          </Button>
          <Checkbox
            label="Alignment"
            checked={checked}
            onChange={handleChange}
            className="checkbox"
            id="mantine-vehxkegqj"
          />
          <Button size="md" radius="md" onClick={callPrint}>
            Print
          </Button>
        </div>
        <div className="dropdown">
          {data
            .filter((item) => {
              if (regExp.test(value)) {
                const searchTerm = value.toLowerCase();
                const itemName = item.itemName.toLowerCase();

                return (
                  searchTerm &&
                  itemName.includes(searchTerm) &&
                  itemName !== searchTerm
                );
              } else {
                const searchTerm = String(value);
                const itemBarcode = String(item.itemBarcode);

                return (
                  searchTerm &&
                  itemBarcode.includes(searchTerm) &&
                  itemBarcode !== searchTerm
                );
              }
            })
            .slice(0, 10)
            .map((item) => (
              <div
                onClick={() => onSearch(item.itemName)}
                className="dropdown-row"
                key={item.itemName}
              >
                <span className="search-item-name-dropdown">
                  {' '}
                  {item.itemBarcode}
                </span>
                <span> {item.itemName} </span>
                {/* <hr/> */}
              </div>
            ))}
        </div>
      </div>
      {loader ? (
        <div
          style={{
            height: '95vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size="xl" />
        </div>
      ) : (
        <div className="main-outer-box">
          {display &&
            data &&
            data.map((item, index) => {
              const sellPrice =
                (item.slabPricing.length && item.slabPricing[0][2]) ||
                item.itemSellingPricePerUnit;
              const hasSlab = item.slabPricing.length > 1;

              const truthyIndex = [
                item.itemMRPperUnit > sellPrice && !hasSlab,
                item.itemMRPperUnit > sellPrice && hasSlab,
                item.itemMRPperUnit === sellPrice && !hasSlab,
                item.itemMRPperUnit === sellPrice && hasSlab,
              ].indexOf(true);

              const fontStyles = [
                'Line-through-text-size',
                'Line-through-size',
                'Font6rem',
                'Font8rem',
              ];

              return (
                <div key={index} className="main-inner-box">
                  <h4>{item.itemName.slice(0, 30)}</h4>
                  <hr />
                  <div className="outer-div">
                    <div
                      style={{
                        width: `${hasSlab ? '50%' : '100%'}`,
                        display: `${hasSlab ? 'block' : 'flex'}`,
                        justifyContent: `${
                          !hasSlab ? 'space-around' : 'center'
                        }`,
                        marginTop: '0.5rem',
                      }}
                    >
                      <div>
                        <h6>MRP</h6>
                        <h4 className={`${fontStyles[truthyIndex]}`}>
                          {item.itemMRPperUnit}
                        </h4>
                      </div>
                      {item.itemMRPperUnit > sellPrice && (
                        <div>
                          <h6>Our Price</h6>
                          <h2
                            className={` ${
                              hasSlab ? 'Font6rem' : 'FontSize110px'
                            }`}
                          >
                            {Number(sellPrice).toFixed(0)}
                          </h2>
                        </div>
                      )}
                    </div>
                    {hasSlab && (
                      <div className="table-settings">
                        <table className="tableLayout">
                          <thead>
                            <tr>
                              <th>Range</th>
                              <th className="price-align">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.slabPricing.map((slabs, idx, arr) => {
                              return (
                                <tr key={idx}>
                                  <td>{`
                                    ${slabs[1]} - ${
                                    arr[idx + 1] ? arr[idx + 1][1] - 1 : 'more'
                                  }`}</td>
                                  <td className="price-align">{slabs[2]}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          {/* mynewData */}
          {!display &&
            newData &&
            newData.map((item, index) => {
              const sellPrice =
                (item.slabPricing.length && item.slabPricing[0][2]) ||
                item.itemSellingPricePerUnit;
              const hasSlab = item.slabPricing.length > 1;

              const truthyIndex = [
                item.itemMRPperUnit > sellPrice && !hasSlab,
                item.itemMRPperUnit > sellPrice && hasSlab,
                item.itemMRPperUnit === sellPrice && !hasSlab,
                item.itemMRPperUnit === sellPrice && hasSlab,
              ].indexOf(true);

              const fontStyles = [
                'Line-through-text-size',
                'Line-through-size',
                'Font6rem',
                'Font8rem',
              ];

              return (
                <div className="show-search-item">
                  <div
                    key={index}
                    className={`myLabel ${checked && 'checked'} length${
                      String(item.itemMRPperUnit).length
                    }`}
                  >
                    <h4 className={`${checked && 'h4-checked'}`}>
                      {item.itemName.slice(0, 30)}
                    </h4>
                    <hr />
                    <div className={`mylabel-content ${checked && 'checked'}`}>
                      <div
                        style={{
                          width: `${hasSlab ? '50%' : '100%'}`,
                          display: `${hasSlab ? 'block' : 'flex'}`,
                          justifyContent: `${
                            !hasSlab ? 'space-around' : 'center'
                          }`,
                          flexDirection: checked ? 'column' : '',
                        }}
                      >
                        <div>
                          <h6>MRP</h6>
                          <h4 className={`${fontStyles[truthyIndex]}`}>
                            {item.itemMRPperUnit}
                          </h4>
                        </div>
                        {item.itemMRPperUnit > sellPrice && (
                          <div>
                            <h6>Our Price</h6>
                            <h2
                              className={` ${
                                hasSlab ? 'Font6rem' : 'FontSize110px'
                              }`}
                            >
                              {Number(sellPrice).toFixed(0)}
                            </h2>
                          </div>
                        )}
                      </div>
                      {hasSlab && (
                        <div
                          className={`${checked && 'table-settings-checked'}`}
                        >
                          <table
                            className={`tableLayout ${checked && 'checked'}`}
                          >
                            <thead>
                              <tr>
                                <th>Range</th>
                                <th className="price-align">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.slabPricing.map((slabs, idx, arr) => {
                                return (
                                  <tr key={idx}>
                                    <td>
                                      <span>{`
                                    ${slabs[1]} - ${
                                        arr[idx + 1]
                                          ? arr[idx + 1][1] - 1
                                          : 'more'
                                      }`}</span>
                                    </td>
                                    <td className="price-align">{slabs[2]}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  <CloseButton
                    aria-label="Close modal"
                    onClick={() => handleRemoveItem(index)}
                    className="close-btn"
                  />
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default Label;

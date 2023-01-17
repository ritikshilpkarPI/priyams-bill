import React, { useState, useEffect } from 'react'
import { Loader, Button } from '@mantine/core';
import { CloseButton } from '@mantine/core';

const Label = () => {
    const [value, setValue] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [render, setRender] = useState(false);
    const [display, setDisplay] = useState(true);
    const [newData, setNewData] = useState([]);
    const [checked, setChecked] = useState(false);
    const getData = () => {
        setLoader(true);
        fetch(`${process.env.REACT_APP_LABEL_API}`).then((response) => response.json()).then((data) => {
            setData(data.message.items)
            setDisplay(true);
            setLoader(false);
        });

    }
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        const myData = data.filter(function (item) {
            // eslint-disable-next-line  
            return (item.itemName === value || item.itemBarcode == value);
        });

        if (myData.length) {
            setNewData([...newData, myData[0]]);
            setDisplay(false);
        }
        // eslint-disable-next-line  
    }, [render])

    const onChange = (event) => {
        setValue(event.target.value);
    };
 

    const onSearch = (searchTerm) => {
        searchTerm = String(searchTerm);
        setValue(searchTerm);
        let toggle = !render;
        setRender(toggle)
        console.log("search ", searchTerm);
    };
    
    const handleChange = () => {
        setChecked(!checked);
    };
    const handleRemoveItem=(idx)=>{
        console.log(idx);
        setNewData(newData.filter((item,index) => index !== idx));
    }
   
    var regExp = /[a-zA-Z]/g;
    return (
        <>
            <div className="search-container">
                <div className="search-inner">
                    <input type="text" placeholder='Item Name' value={value} onChange={onChange} className='input-item-search' />
                    <Button onClick={() => onSearch(value)} className='search-btn'> Search </Button>
                    <label for="myCheck" className='label'>Alignment</label>
                    <input type="checkbox" id="myCheck" checked={checked}
                        onChange={handleChange} className='checkbox' />
                </div>
                <div className='dropdown'>
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
                            }
                            else {
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
                                <span className='search-item-name-dropdown'> {item.itemBarcode}</span> 
                                <span >  {item.itemName} </span>
                                <hr/>
                                
                            </div>
                        ))}
                    
                </div>
            </div>
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
            ) : (
                <div className='main-outer-box'>
                    {display && data && data.map((item, index) => {
                        const sellPrice = (item.slabPricing.length && item.slabPricing[0][2]) || item.itemSellingPricePerUnit;
                        const hasSlab = item.slabPricing.length > 1;

                        const truthyIndex = [item.itemMRPperUnit > sellPrice && !hasSlab,
                        item.itemMRPperUnit > sellPrice && hasSlab,
                        item.itemMRPperUnit === sellPrice && !hasSlab,
                        item.itemMRPperUnit === sellPrice && hasSlab].indexOf(true);

                        const fontStyles = ['Line-through-text-size', 'Line-through-size', 'Font6rem', 'Font8rem'];

                        return (
                            <div key={index} className='main-inner-box'>
                                <h4>{item.itemName.slice(0, 30)}</h4>
                                <hr />
                                <div className='outer-div'>
                                    <div style={{ width: `${hasSlab ? '50%' : '100%'}`, display: `${hasSlab ? 'block' : 'flex'}`, justifyContent: `${!hasSlab ? 'space-around' : "center"}`, marginTop: "0.5rem" }}>
                                        <div>
                                            <h6 >MRP</h6>
                                            <h4 className={`${fontStyles[truthyIndex]}`}>{item.itemMRPperUnit}</h4>
                                        </div>
                                        {item.itemMRPperUnit > sellPrice && <div>
                                            <h6 >Our Price</h6>
                                            <h2 className={` ${hasSlab ? 'Font6rem' : 'FontSize110px'}`}>{Number(sellPrice).toFixed(0)}</h2>
                                        </div>}
                                    </div>
                                    {hasSlab && (
                                        <div className='table-settings' style={{ width: '50%' }}>
                                            <table className='tableLayout'>
                                                <thead>
                                                    <tr>
                                                        <th >Range</th>
                                                        <th className='price-align' >Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.slabPricing.map((slabs, idx, arr) => {
                                                        return (
                                                            <tr key={idx}>
                                                                <td >{`
                                    ${slabs[1]} - ${arr[idx + 1] ? arr[idx + 1][1] - 1 : 'more'}`}</td>
                                                                <td className='price-align'>{slabs[2]}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    {/* mynewData */}
                    {!display && newData && newData.map((item, index) => {
                        console.log(index);
                        const sellPrice = (item.slabPricing.length && item.slabPricing[0][2]) || item.itemSellingPricePerUnit;
                        const hasSlab = item.slabPricing.length > 1;

                        const truthyIndex = [item.itemMRPperUnit > sellPrice && !hasSlab,
                        item.itemMRPperUnit > sellPrice && hasSlab,
                        item.itemMRPperUnit === sellPrice && !hasSlab,
                        item.itemMRPperUnit === sellPrice && hasSlab].indexOf(true);

                        const fontStyles = ['Line-through-text-size', 'Line-through-size', 'Font6rem', 'Font8rem'];

                        return (
                            <div className='show-search-item'>
                                <div key={index} style={{ height: checked ? "auto" : "360px", padding: "5px 0", width: String(item.itemMRPperUnit).length > 3 ? "520px" : String(item.itemMRPperUnit).length > 2 ? "430px" : "340px", border: '1px solid black', margin: '5px 0', marginTop: "2rem" }} id='myLabel'>
                                    <h4 style={{ textAlign: "center", width: checked ? '60%' : '', margin: checked ? "0 auto" : "", marginTop: checked ? "0.2rem" : "", marginBottom: checked ? "0.3rem" : "5px" }}>
                                        {item.itemName.slice(0, 30)}
                                    </h4>
                                    <hr />
                                    <div style={{ display: "flex", flexDirection: checked ? "column" : "", alignItems: checked ? "center" : "", justifyContent: checked ? "center" : "" }}>
                                        <div style={{ width: `${hasSlab ? '50%' : '100%'}`, display: `${hasSlab ? 'block' : 'flex'}`, justifyContent: `${!hasSlab ? 'space-around' : "center"}`, flexDirection: checked ? "column" : "" }}>
                                            <div>
                                                <h6 >MRP</h6>
                                                <h4 className={`${fontStyles[truthyIndex]}`} >{item.itemMRPperUnit}</h4>
                                            </div>
                                            {item.itemMRPperUnit > sellPrice && <div>
                                                <h6 >Our Price</h6>
                                                <h2 className={` ${hasSlab ? 'Font6rem' : 'FontSize110px'}`}>{Number(sellPrice).toFixed(0)}</h2>
                                            </div>}
                                        </div>
                                        {hasSlab && (
                                            <div className='table-settings' style={{ width: '50%', display: checked ? "flex" : "", justifyContent: checked ? "center" : "" }}>
                                                <table className='tableLayout' style={{ position: checked ? "relative" : "", left: checked ? "0.5rem" : "" }}>
                                                    <thead>
                                                        <tr>
                                                            <th >Range</th>
                                                            <th className='price-align' >Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.slabPricing.map((slabs, idx, arr) => {
                                                            return (
                                                                <tr key={idx}>
                                                                    <td ><span>{`
                                    ${slabs[1]} - ${arr[idx + 1] ? arr[idx + 1][1] - 1 : 'more'}`}</span></td>
                                                                    <td className='price-align'>{slabs[2]}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <CloseButton aria-label="Close modal" onClick={()=>handleRemoveItem(index)} className='close-btn'/>
                            </div>
                        )
                    })}
                </div>
            )}

        </>
    )
}

export default Label
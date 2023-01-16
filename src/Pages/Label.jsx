import React, { useState, useEffect } from 'react'
import { Loader,Button } from '@mantine/core';

const Label = () => {
    const [value, setValue] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [render, setRender] = useState(false);
    const [disp, setDisp] = useState(true);
    const [newData, setNewData] = useState([]);
    const [checked, setChecked] = useState(false);
    const getData = () => {
        setLoader(true);
        fetch('https://dev--priyams.netlify.app/.netlify/functions/app/api/inventory/items?filters=%7B%22minStockOnly%22:false,%22isDeleted%22:false%7D').then((response) => response.json()).then((data) => {
            setData(data.message.items)
            setDisp(true);
            setLoader(false);
        });

    }
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        const myData = data.filter(function (item) {
            return item.itemName === value;
        });
        setNewData(myData);
        setDisp(false);
      // eslint-disable-next-line  
    }, [render])
    const onChange = (event) => {
        setValue(event.target.value);
    };

    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        setRender(!render)
        console.log("search ", searchTerm);
    };
    const handleChange = () => {
        setChecked(!checked);
    };
   
    return (
        <>
            <div className="search-container">
                <div className="search-inner">
                    <input type="text" value={value} onChange={onChange} className='input-item-search'/>
                    <Button onClick={() => onSearch(value)} className='search-btn'> Search </Button>
                    <label for="myCheck" className='label'>Alignment</label>
                    <input type="checkbox" id="myCheck" checked={checked}
                        onChange={handleChange} className='checkbox' />
                </div>
                <div className='dropdown'>
                    {data
                        .filter((item) => {
                            const searchTerm = value.toLowerCase();
                            const itemName = item.itemName.toLowerCase();

                            return (
                                searchTerm &&
                                itemName.includes(searchTerm) &&
                                itemName !== searchTerm
                            );
                        })
                        .slice(0, 10)
                        .map((item) => (
                            <div
                                onClick={() => onSearch(item.itemName)}
                                className="dropdown-row"
                                key={item.itemName}
                            >
                                {item.itemName}
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center" }}>
                    {disp && data && data.map((item, index) => {
                        const sellPrice = (item.slabPricing.length && item.slabPricing[0][2]) || item.itemSellingPricePerUnit;
                        const hasSlab = item.slabPricing.length > 1;

                        const truthyIndex = [item.itemMRPperUnit > sellPrice && !hasSlab,
                        item.itemMRPperUnit > sellPrice && hasSlab,
                        item.itemMRPperUnit === sellPrice && !hasSlab,
                        item.itemMRPperUnit === sellPrice && hasSlab].indexOf(true);

                        const fontStyles = ['Line-through-text-size', 'Line-through-size', 'Font6rem', 'Font8rem'];
                        
                        return (
                            <div key={index} style={{ height: "auto", padding: "5px 0", width: "520px", border: '1px solid black', margin: '5px 0' }}>
                                <h4 style={{ textAlign: "center", marginBottom: "5px" }}>{item.itemName.slice(0, 30)}</h4>
                                <hr />
                                <div className='outer-div'>
                                    <div style={{ width: `${hasSlab ? '50%' : '100%'}`, display: `${hasSlab ? 'block' : 'flex'}`, justifyContent: `${!hasSlab ? 'space-around' : "center"}` }}>
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
                    {!disp && newData && newData.map((item, index) => {
                        const sellPrice = (item.slabPricing.length && item.slabPricing[0][2]) || item.itemSellingPricePerUnit;
                        const hasSlab = item.slabPricing.length > 1;

                        const truthyIndex = [item.itemMRPperUnit > sellPrice && !hasSlab,
                        item.itemMRPperUnit > sellPrice && hasSlab,
                        item.itemMRPperUnit === sellPrice && !hasSlab,
                        item.itemMRPperUnit === sellPrice && hasSlab].indexOf(true);

                        const fontStyles = ['Line-through-text-size', 'Line-through-size', 'Font6rem', 'Font8rem'];
                        
                        return (
                            <div key={index} style={{ height: "auto", padding: "5px 0", width: String(item.itemMRPperUnit).length > 3 ? "520px" : String(item.itemMRPperUnit).length > 2 ? "430px" : "340px", border: '1px solid black', margin: '5px 0' }} id='myLabel'>
                                <h4 style={{ textAlign: "center", marginBottom: "5px" }}>{item.itemName.slice(0, 30)}</h4>
                                <hr />
                                <div style={{ display:"flex",flexDirection:checked?"column":"",alignItems:checked?"center":"",justifyContent:checked?"center":""}}>
                                    <div style={{ width: `${hasSlab ? '50%' : '100%'}`, display: `${hasSlab ? 'block' : 'flex'}`, justifyContent: `${!hasSlab ? 'space-around' : "center"}`,flexDirection:checked?"column":"" }}>
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
                                        <div className='table-settings' style={{ width: '50%' ,display:checked?"flex":"",justifyContent:checked?"center":""}}>
                                            <table className='tableLayout' style={{position:checked?"relative":"",left:checked?"0.5rem":""}}>
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
                        )
                    })}
                </div>
            )}

        </>
    )
}

export default Label
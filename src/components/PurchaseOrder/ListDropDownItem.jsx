import { Button, Table } from "@mantine/core"
import { useState } from "react";


const ListDropDownItem = ({ itemList, handleSelectOrderItems}) => {
    const [state, setState] = useState(true);
    const rows = itemList.map((element, index) => (
        <tr onClick={() => handleSelectOrderItems(element)} key={index + 1}>
            <td>{element.itemBarcode}</td>
            <td>{element.itemName}</td>
            <td>{element.itemMRPperUnit}</td>
        </tr>
    ));
    return (
      <>
      {state?
        <div className="dropdown-list-container">
        <div className="center"><Button onClick={()=> setState(false)}>X</Button></div>
        <Table withColumnBorders striped>
            <thead>
                <tr>
                    <th>Barcode</th>
                    <th>Item Name</th>
                    <th>MRP</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>
    </div>
    :<></>
      }
      </>
    )
}

export default ListDropDownItem
import { Table } from "@mantine/core"


const ListDropDownItem = ({ itemList, handleSelectOrderItems }) => {
    console.log({ itemList });
    const rows = itemList.map((element, index) => (
        <tr onClick={() => handleSelectOrderItems(element)} key={index + 1}>
            <td>{element.itemBarcode}</td>
            <td>{element.itemName}</td>
            <td>{element.itemMRPperUnit}</td>
        </tr>
    ));
    return (
        <div className="dropdown-list-container">
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
    )
}

export default ListDropDownItem
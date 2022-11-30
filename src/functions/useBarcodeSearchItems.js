
import { useContext } from "react";
import { AppStateContext } from "src/AppState/appState.context";
const itemsByBarcode = {};

const useBarcodeSearchItems = (searchValue, handleSelectOrderItems) => {
    const { itemsStateAndDispatch, billItemsStateAndDispatch } =
        useContext(AppStateContext);
    const [itemsList, itemsReducer] = itemsStateAndDispatch;
    if (!Object.keys(itemsByBarcode).length) {
        itemsList.forEach(obj => {
            if (obj["itemBarcode"]) {
                itemsByBarcode[obj["itemBarcode"]] = { ...obj };
            }
        });
    }
    const barcodeFilteredItem = { ...itemsByBarcode[searchValue] }
    return {
        barcodeFilteredItem
    }
}

export default useBarcodeSearchItems
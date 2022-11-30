import { useContext } from "react";
import { AppStateContext } from "src/AppState/appState.context";

const useNameSearchItem = (searchWord) => {
    const { itemsStateAndDispatch, billItemsStateAndDispatch } =
        useContext(AppStateContext);
    const [itemsList, itemsReducer] = itemsStateAndDispatch;
    const filterItems = itemsList.filter(item => item.itemName && searchWord && item.itemName.toLowerCase().includes(searchWord.toLowerCase()))
    return {
        itemsList,
        filterItems

    }
}

export default useNameSearchItem
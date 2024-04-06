const useNameSearchItem = (searchWord, itemsList) => {
  const filteredItemsByName = itemsList.filter(
    (item) =>
      item.itemName &&
      searchWord &&
      item.itemName.toLowerCase().includes(searchWord.toLowerCase())
  );
  return {
    itemsList,
    filteredItemsByName,
  };
};

export default useNameSearchItem;

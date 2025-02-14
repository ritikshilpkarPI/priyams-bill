import Fuse from "fuse.js";


export const fuzzySearch = (searchTerm: string, items: SearchItem[]): SearchItem[] => {
  const fuse = new Fuse(items, {
    keys: ["itemName","itemBarcode"], 
    threshold: 0.4, 
    distance: 100, 
    includeScore: true, 
  });

  const results = fuse.search(searchTerm);

  return results.map((result) => result.item);
};
import mongoose from 'mongoose';

type Mode = 'ADD' | 'SUBTRACT';

export const updateItemShelfDates = (
  existingShelves: any[],
  newShelves: any[],
  transactionId?: mongoose.Types.ObjectId,
  mode: Mode = 'ADD'
) => {
  for (const inputShelf of newShelves) {
    const inputExpiry = new Date(inputShelf.expiryDate ?? '').getTime();
    const inputMfg = new Date(inputShelf.manufacturingDate ?? '').getTime();

    const matchingShelf = existingShelves.find((shelf) => {
      const shelfExpiry = new Date(shelf.expiryDate ?? '').getTime();
      const shelfMfg = new Date(shelf.manufacturingDate ?? '').getTime();
      return shelfExpiry === inputExpiry && shelfMfg === inputMfg;
    });

    const quantityDelta = inputShelf.quantityToAdd ?? 0;

    if (matchingShelf) {
      matchingShelf.currentStockQuantity =
        (matchingShelf.currentStockQuantity ?? 0) +
        (mode === 'ADD' ? quantityDelta : -quantityDelta);
    } else {
      existingShelves.push({
        ...inputShelf,
        initialStockQuantity: quantityDelta,
        currentStockQuantity: quantityDelta,
        transactionId: transactionId,
      });
    }
  }
};

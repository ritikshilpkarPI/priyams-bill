import { DealerModel } from '../db-models/dealer-model';

export const createNewDealer = async (
  dealerName: string,
  dealerNumber: number,
  dealerBrands: string[] = [],
  dealerCompanies: string[] = []
) => {
  try {
    const newDealer = await DealerModel.create({
      dealerName,
      dealerBrands,
      dealerCompanies,
      dealerNumber,
    });

    return { dealer: newDealer, success: true };
  } catch (error) {
    return { dealer: {}, success: false };
  }
};

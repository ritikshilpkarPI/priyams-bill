import axios from 'axios';
import { AddressComponent } from 'server/types';

const olaApiKey = process.env.OLA_API_KEY;

export const getPincodeFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${olaApiKey}`
    );

    const addressComponents: AddressComponent[] =
      response.data?.results?.[0]?.address_components || [];

    for (const comp of addressComponents) {
      if (!isNaN(Number(comp.long_name))) {
        return comp.long_name;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching pincode from Ola API:', error);
    return null;
  }
};

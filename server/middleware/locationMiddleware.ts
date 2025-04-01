import axios from 'axios';
import { StoreModel } from '../db-models/store-model';
import { NextFunction, Request,Response } from 'express';
import { AddressComponent } from 'server/types';
import { MESSAGES } from '../constants/messages';

const olaApiKey = process.env.OLA_API_KEY;

const locationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { pincode } = req.body;

        if (!pincode) {
            const { latitude, longitude } = req.body;
            if (!latitude || !longitude) {
                return res.status(400).json({ error: MESSAGES.LAT_LONG_REQUIRED });
            }

            const olaResponse = await axios.get(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${olaApiKey}`);
            const addressComponents = olaResponse.data?.results?.[0]?.address_components || [];
            const pincodeObj = addressComponents.find((comp: AddressComponent) => comp.types.includes('postal_code'));
            pincode = pincodeObj?.long_name;

            if (!pincode) {
                return res.status(500).json({ error: MESSAGES.PINCODE_FETCH_FAILED });
            }

            req.body.fetchedPincode = pincode;
        }

        const store = await StoreModel.findOne({ pincode: pincode || req.body.fetchedPincode });
        if (!store) {
            return res.status(404).json({ error: MESSAGES.STORE_NOT_FOUND });
        }

        req.body.storeData = store;
        req.body.pincode = pincode || req.body.fetchedPincode;

        next(); 
    } catch (error) {
        console.error('Error in location middleware:', error);
        res.status(500).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export default locationMiddleware;

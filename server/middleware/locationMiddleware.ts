import { StoreModel } from '../db-models/store-model';
import { NextFunction, Request,Response } from 'express';
import { MESSAGES } from '../constants/messages';
import { getPincodeFromCoordinates } from '../util/getPincodeFromCoordinates';


const locationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { pincode } = req.body;

        if (!pincode) {
            const { latitude, longitude } = req.body;
            if (!latitude || !longitude) {
                return res.status(400).json({ error: MESSAGES.LAT_LONG_REQUIRED });
            }

            pincode = await getPincodeFromCoordinates(latitude, longitude);

            if (!pincode) {
                return res.status(400).json({ error: MESSAGES.PINCODE_FETCH_FAILED });
            }

        }

        const store = await StoreModel.findOne({ pincode });
        if (!store) {
            return res.status(404).json({ error: MESSAGES.STORE_NOT_FOUND });
        }

        req.body.storeData = store;
        req.body.pincode = pincode ;

        next(); 
    } catch (error) {
        console.error('Error in location middleware:', error);
        res.status(500).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export default locationMiddleware;

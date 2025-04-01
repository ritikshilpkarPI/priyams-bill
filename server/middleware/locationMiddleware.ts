import { StoreModel } from '../db-models/store-model';
import { NextFunction, Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';
import { getPincodeFromCoordinates } from '../util/getPincodeFromCoordinates';

const locationMiddleware = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        let { pincode } = req.body;

        if (!pincode) {
            const { latitude, longitude } = req.body;
            if (!latitude || !longitude) {
                res.status(400).json({ error: MESSAGES.LAT_LONG_REQUIRED });
                return;
            }

            pincode = await getPincodeFromCoordinates(latitude, longitude);

            if (!pincode) {
                res.status(400).json({ error: MESSAGES.PINCODE_FETCH_FAILED });
                return;
            }
        }

        const store = await StoreModel.findOne({ pincode });
        if (!store) {
            res.status(404).json({ error: MESSAGES.STORE_NOT_FOUND });
            return;
        }

        req.body.storeData = store;
        req.body.pincode = pincode;

        next(); 
    } catch (error) {
        console.error('Error in location middleware:', error);
        next(error); // Ensure next() is only called with the error and no response is returned
    }
};

export default locationMiddleware;

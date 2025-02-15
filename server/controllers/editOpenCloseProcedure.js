const { OpenClose } = require('../db-models/open-close-model');

const editOpenCloseProcedure = async (req, res,next) => {
    try {
      const { date, procedureType , procedureToBeUpdated } = req.body;

    if (!date || !procedureType) {
      return res.status(400).json({ success: false, message: "Date and ProcedureType is required" });
    }
  
    // Normalize date by setting time to 00:00:00 UTC
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // Find the existing procedure by createdDate (ignoring time)
    const procedure = await OpenClose.findOne({
      createdAt: { $gte: normalizedDate, $lt: new Date(normalizedDate.getTime() + 86400000) },
      procedure: procedureType
    });
  
      if (!procedure) {
        return res.status(404).json({ success: false, message: "Procedure not found for the given date" });
      }

    // Update the document directly
    Object.assign(procedure, procedureToBeUpdated);

    // Save the updated document
    const updatedProcedure = await procedure.save();
      
    res.status(200).json({ message: updatedProcedure });
    } catch (error) {
      next(error)
    }
  };

  module.exports = editOpenCloseProcedure;
const { OpenClose } = require("../db-models/open-close-model");

const getAllProcedure = async (req, res) => {
  try {
    const procedures = await OpenClose.find({ isDeleted: false });
    const procedureCount = await OpenClose.countDocuments();
    res.status(200).json({ message: { procedures, procedureCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getDayWiseProcedures = async (req, res) => {
  try {
    const dayWiseProcedures = await OpenClose.aggregate([
      {
        $project: {
        openingNotes: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: "$notes", else: 0 }
        },
        openingCoins: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: "$coins", else: 0 }
        },
        openingNotesSum: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: "$notesSum", else: 0 }
        },
        openingCoinsSum: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: "$coinsSum", else: 0 }
        },
        openingSum: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: "$totalSum", else: 0 }
        },
        openingTime: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: "$createdAt", else: 0 }
        },
        closingNotes: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: 0, else: "$notes" }
        },
        closingCoins: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: 0, else: "$coins" }
        },
        closingNotesSum: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: 0, else: "$notesSum" }
        },
        closingCoinsSum: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: 0, else: "$coinsSum" }
        },
        closingSum: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: 0, else: "$totalSum" }
        },
        closingTime: {
          $cond: { if: { $eq: [ "$procedure", "open" ] }, then: 0, else: "$createdAt" }
        },
        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } ,
      },
    },
    {$group: {
        _id:  "$date",
        openingNotes: { $max: "$openingNotes" },
        openingCoins: { $max: "$openingCoins" },
        openingNotesSum: { $max: "$openingNotesSum" },
        openingCoinsSum: { $max: "$openingCoinsSum" },
        openingTime: { $max: "$openingTime" },
        openingSum: { $max: "$openingSum" },
        closingNotes: { $max: "$closingNotes" },
        closingCoins: { $max: "$closingCoins" },
        closingCoinsSum: { $max: "$closingCoinsSum" },
        closingNotesSum: { $max: "$closingNotesSum" },
        closingTime: { $max: "$closingTime" },
        closingSum: { $max: "$closingSum" }
    }}
    ]).sort({ _id: -1 });
    res.status(200).json({ message: { dayWiseProcedures } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addOpenCloseProcedure = async (req, res) => {
  const { procedure, notesSum, coinsSum, totalSum, notes, coins } = req.body;

  try {
    const newOpenCloseProcedure = await new OpenClose({
      procedure,
      notesSum,
      coinsSum,
      totalSum,
      notes,
      coins,
    }).save();
    res.status(200).json({ message: newOpenCloseProcedure });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const editOpenCloseProcedure = async (req, res) => {
  try {
    const { id, procedureToBeUpdated } = req.body;
    const changeOpenCloseProcedure = await OpenClose.findByIdAndUpdate(
      id,
      procedureToBeUpdated,
      {
        new: true,
      }
    );

    res.status(200).json({ message: changeOpenCloseProcedure });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProcedure,
  addOpenCloseProcedure,
  editOpenCloseProcedure,
  getDayWiseProcedures,
};

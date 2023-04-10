const { default: mongoose } = require("mongoose");
const { orderSchema, Order } = require("../db-models/orderSchema");

const dbAppConnection = () => {
    try {
      const conn = mongoose.createConnection(process.env.APP_MONGODB_URI, { useNewUrlParser: true });
      console.log("App Database Connected Successfully!");
      conn.model("Orders", orderSchema);
      const pipeline =  [
          { $match : {"operationType" : "update" } }
       ]
      const changeStream = Order.watch(pipeline, { fullDocument: "updateLookup" });
      changeStream.on("change", async(data) => {
        const order = data.fullDocument;
        const {orderNumber,orderStatus} = order
        // Update Order in App Database
        await conn.models.Orders.findOneAndUpdate({orderNumber},{orderStatus}, {new: true});   
      });
    } catch (error) {
      console.error({ error });
    }
  };

module.exports = dbAppConnection
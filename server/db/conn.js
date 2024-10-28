const { default: mongoose } = require("mongoose");
const { orderSchema, Order } = require("../db-models/orderSchema");

const dbAppConnection = () => {
  try {
    const db = mongoose.createConnection(process.env.APP_MONGODB_URI, { useNewUrlParser: true });
    
    db.on('connecting', function () {
      console.log('connecting to MongoDB...');
    });

    db.on('error', function (error) {
      console.error('Error in MongoDb connection: ' + error);
      mongoose.disconnect();
    });
    db.on('connected', function () {
      console.log('MongoDB connected!');

    });
    db.once('open', async function () {
      console.log('MongoDB connection opened!');
      db.model("Orders", orderSchema);
      // const pipeline = [
      //   { $match: { "operationType": "update" } }
      // ]
      const pipeline = [{ $match: { $or: [{ operationType: "update" }, { operationType: "insert" }, { operationType: "delete" }] } }];

       const Order = db.model("Orders", orderSchema);
      
      
      const changeStream = Order.watch(pipeline, { fullDocument: "updateLookup" });
      
     
      changeStream.on("change", async (data) => {
       
        const order = data.fullDocument;
        const { orderNumber, orderStatus } = order
        // Update Order in App Database

        const updateddata = await db.models.Orders.findOneAndUpdate({ orderNumber }, { orderStatus }, { new: true });
        console.log({ updateddata });
      });
    });
    db.on('reconnected', function () {
      console.log('MongoDB reconnected!');
    });
    db.on('disconnected', function () {
      console.log('MongoDB disconnected!');
      mongoose.connect(process.env.APP_MONGODB_URI, { server: { auto_reconnect: true }, useNewUrlParser: true });
    });
  } catch (error) {
    console.error({ error });
  }
};

module.exports = dbAppConnection
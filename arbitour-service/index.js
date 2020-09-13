const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/:currencyPair/orderbook/:entryCount", async (req, res) => {
  const orderBookData = { 
    currencyPair : req.params.currencyPair,
    asks : [],
    bids : [],
    lastChange : ""
  };

  await axios.get(`https://api.valr.com/v1/public/${orderBookData.currencyPair}/orderbook`, { timeout: 5000 })
    .then(response => {
      const orderBook = response.data;

      orderBook.Asks.slice(0, req.params.entryCount).map(askItem => {
        orderBookData.asks.push(askItem);
      });

      orderBook.Bids.slice(0, req.params.entryCount).map(bidItem => {
        orderBookData.bids.push(bidItem);
      });

      orderBookData.lastChange = orderBook.LastChange;
    })
    .catch(error => {
      console.log(`Failed to retrieve order book data for ${orderBookData.currencyPair}. Error: ` + error);
      // debuglog(error);
    });

  res.status(200).send(orderBookData);
});

// app.get("/orders/open", async (req, res) => {
//   const openOrders = [{ 
//     orderId: "",
//     customerOrderId: "",
//     createdAt: "",
//     side: "",
//     currencyPair: "",
//     price: ""
//   }];

//   await axios.get(`https://api.valr.com/v1/orders/open`, { timeout: 500 })
//     .then(response => {
//       const ordersData = response.data;

//       ordersData.map(order => {
//         openOrders.push(order);
//       });
//     })
//     .catch(error => {
//       console.log(`Failed to retrieve open orders data. Error: ` + error);
//       // debuglog(error);
//     });

//   res.status(200).send(openOrders);
// });

app.listen("9000", () => {
  console.log("Arbitour v0.0.1: Listening on port 9000");
});
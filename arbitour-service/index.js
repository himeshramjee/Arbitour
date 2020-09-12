const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/:currencyPair/orderbook/", async (req, res) => {
  const orderBookData = { 
    currencyPair : req.params.currencyPair,
    asks : [],
    bids : [],
    lastChange : ""
  };

  await axios.get(`https://api.valr.com/v1/public/${orderBookData.currencyPair}/orderbook`, { timeout: 500 })
    .then(response => {
      const orderBook = response.data;

      orderBook.Asks.map(askItem => {
        orderBookData.asks.push(askItem);
      });

      orderBook.Bids.map(bidItem => {
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

app.listen("9000", () => {
  console.log("Arbitour v0.0.1: Listening on port 9000");
});
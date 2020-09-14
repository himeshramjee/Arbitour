const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const security = require("../../security/security");

app.use(cors());
app.use(express.json());

exports.testRequestSigning = () => {
  let request = {
    id: "11",
    verb: "GET",
    path: "orders/open",
    params: {
      skip: 0,
      limit: 20
    }
  };

  return security.signValrRequest(request);
};

exports.getOrderBook = async (currencyPair, entryCount) => {
  const orderBookData = { 
    currencyPair : currencyPair,
    asks : [],
    bids : [],
    lastChange : ""
  };

  await axios.get(`https://api.valr.com/v1/public/${currencyPair}/orderbook`, { timeout: 5000 })
    .then(response => {
      const orderBook = response.data;
      console.log("Entry count: " + entryCount);
      orderBook.Asks.slice(0, entryCount).map(askItem => {
        orderBookData.asks.push(askItem);
      });

      orderBook.Bids.slice(0, entryCount).map(bidItem => {
        orderBookData.bids.push(bidItem);
      });

      orderBookData.lastChange = orderBook.LastChange;
    })
    .catch(error => {
      console.log(`Failed to retrieve order book data for ${currencyPair}. Error: ` + error);
    });

  return orderBookData;
};

exports.getOpenOrders = async () => {
  let openOrders = [];
  // [{ 
  //   orderId: "",
  //   customerOrderId: "",
  //   createdAt: "",
  //   side: "",
  //   currencyPair: "",
  //   price: ""
  // }];

  await axios.get(`https://api.valr.com/v1/orders/open`, { timeout: 500 })
    .then(response => {
      const ordersData = response.data;

      ordersData.map(order => {
        openOrders.push(order);
      });
    })
    .catch(error => {
      console.log(`Failed to retrieve open orders data. Error: ` + error);
      // debuglog(error);
    });

  return openOrders;
};
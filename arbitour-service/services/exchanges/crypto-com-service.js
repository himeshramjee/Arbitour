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
    method: "private/get-open-orders",
    params: {
        instrument_name: "BTC_ZAR",
        page_size: 3,
        page: 0
    }
  };
  
  return security.signCryptoComRequest(request);
};

exports.getOrderBook = async (currencyPair, entryCount) => {
  const orderBookData = { 
    currencyPair : currencyPair,
    asks : [],
    bids : [],
    lastChange : ""
  };

  let usdZarExchangeRate;

  await axios.get("https://api.ratesapi.io/api/latest?base=USD&symbols=ZAR")
    .then(response => {
      usdZarExchangeRate = response.data.rates.ZAR;
      console.log("USDZAR rate: " + usdZarExchangeRate);
    })
    .catch(error => {
      console.log("Failed to get USDZAR exchange rate. Error: " + error);
    });

  await axios.get(`https://api.crypto.com/v2/public/get-book?instrument_name=${currencyPair}`, { timeout: 5000 })
    .then(response => {
      const orderBook = response.data.result.data;
      console.log(orderBook["bids"]);
      
      orderBook.asks.slice(0, entryCount).map(askItem => {
        let price = askItem[0];
        let quantity = askItem[1];
        let orderCount = askItem[2];
        orderBookData.asks.push({ price: price, quantity: quantity, orderCount: orderCount });
      });

      orderBook.bids.slice(0, entryCount).map(bidItem => {
        let price = bidItem[0];
        let quantity = bidItem[1];
        let orderCount = bidItem[2];
        orderBookData.bids.push({ price: price, quantity: quantity, orderCount: orderCount });
      });

      orderBookData.lastChange = new Date(orderBook.t).toString();
    })
    .catch(error => {
      console.log(`Failed to retrieve order book data for ${currencyPair}. Error: ` + error);
      console.log(error.data);
    });

  return orderBookData;
};

exports.getOpenOrders = async (currencyPair) => {
  let openOrders = [];
  // [{ 
  //   orderId: "",
  //   customerOrderId: "",
  //   createdAt: "",
  //   side: "",
  //   currencyPair: "",
  //   price: ""
  // }];

  await axios.post(`https://uat-api.3ona.co/v2/get-open-orders`, { 
      timeout: 500,
      // instrument_name: {currencyPair},
      // page_size: 3,
      // page: 0
    })
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
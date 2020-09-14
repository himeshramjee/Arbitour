const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const security = require("./security/security");
const valrService = require("./services/exchanges/valr-service");
const cryptoDotComService = require("./services/exchanges/crypto-com-service");

app.use(cors());
app.use(express.json());

// https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  security.signValrRequest(config);
  
  console.log(config);
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

app.get("/exchange/auth/:exchangeName", (req, res) => {
  let signedRequest;

  if (req.params.exchangeName.toLowerCase() === "valr") {
    signedRequest = valrService.testRequestSigning();
  } else if(req.params.exchangeName.toLowerCase() === "cryptocom") {
    signedRequest = cryptoDotComService.testRequestSigning();
  } else {
    res.status(401).send({ "error": "Invalid exchange name: " + req.params.exchangeName });
  }

  res.status(200).send(signedRequest);
});

app.get("/:exchangeName/:currencyPair/orderbook/:entryCount", async (req, res) => {
  let orderBookData;

  if (req.params.exchangeName.toLowerCase() === "valr") {
    orderBookData = await valrService.getOrderBook(req.params.currencyPair);
  } else if(req.params.exchangeName.toLowerCase() === "cryptocom") {
    orderBookData = await cryptoDotComService.getOrderBook(req.params.currencyPair);
  } else {
    res.status(401).send({ "error": "Invalid exchange name: " + req.params.exchangeName });
  }

  // console.log(orderBookData);

  res.status(200).send(orderBookData);
});

app.get("/:exchangeName/orders/open", async (req, res) => {
  let openOrders;

  if (req.params.exchangeName.toLowerCase() === "valr") {
    openOrders = await valrService.getOpenOrders();
  } else if(req.params.exchangeName.toLowerCase() === "cryptocom") {
    openOrders = await cryptoDotComService.getOpenOrders();
  } else {
    res.status(401).send({ "error": "Invalid exchange name: " + req.params.exchangeName });
  }

  res.status(200).send(openOrders);
});

app.listen("9000", () => {
  console.log("Arbitour v0.0.1: Listening on port 9000");
});
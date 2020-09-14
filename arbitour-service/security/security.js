const crypto = require('crypto');
const cryptoJS = require("crypto-js");
const secretStuff = require("./secrets.json");

exports.signValrRequest = function(request) {
  const signatureTimestamp = Date.now().toString();
  
  request.sig = crypto
    .createHmac("sha512", secretStuff.valr.apiSecret)
    .update(signatureTimestamp)
    .update(request.method.toUpperCase())
    .update(request.url)
    .update(getParamsString(request.params))
    .digest("hex");

  let header = request.method === "get" ? request.headers.get : request.headers.post;

  header = {
    "X-VALR-API-KEY": secretStuff.valr.apiKey,
    "X-VALR-SIGNATURE": request.sig,
    "X-VALR-TIMESTAMP": signatureTimestamp
  };

  request.headers = header;

  return request;
};

exports.signCryptoComRequest = function (request) {
  const signatureTimestamp = Date.now().toString();
  const { id, method } = request;
  const sigPayload = method + id + secretStuff["crypto.com"].apiKey + getParamsString(request.params) + signatureTimestamp;

  request.sig = cryptoJS
    .HmacSHA256(sigPayload, secretStuff["crypto.com"].apiSecret)
    .toString(cryptoJS.enc.Hex);

  request.nonce = signatureTimestamp;
  
  request.api_key = secretStuff["crypto.com"].apiKey;

  return request;
};

function getParamsString(params) {
  return params == null
      ? ""
      : Object.keys(params)
          .sort()
          .reduce((a, b) => {
            return a + b + params[b];
          }, "");
}
const fs = require('fs');
const crypto = require('crypto');

export default () => {
  const API_KEY_HEADER_NAME = "X-VALR-API-KEY";
  const REQUEST_SIGNATURE_HEADER_NAME = "X-VALR-SIGNATURE";
  const REQUEST_TIMESTAMP_HEADER_NAME = "X-VALR-TIMESTAMP";

  const secrets = JSON.parse(fs.readFileSync('secrets.json'));

  function signRequest(apiSecret, timestamp, verb, path, body = '') {
      return crypto
        .createHmac("sha512", apiSecret)
        .update(timestamp.toString())
        .update(verb.toUpperCase())
        .update(path)
        .update(body)
        .digest("hex");
  }

  function getSignedRequest(request) {
    

    return request;
  }
}
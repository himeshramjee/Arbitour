import React from 'react';
import OrderBookContainer from "./OrderBookContainer"

export default () => {
    return <div className="app-main-section">
        <div className="container">
            <div className="">
                <OrderBookContainer exchangeName="Valr" currencyPair="BTCZAR" entryType="Asks"/>
            </div>
            <div className="">
                <OrderBookContainer exchangeName="Valr" currencyPair="BTCZAR" entryType="Bids"/>
            </div>
            <div className="">
                <OrderBookContainer exchangeName="Crypto" currencyPair="BTC_USDT" entryType="Asks"/>
            </div>
            <div className="">
                <OrderBookContainer exchangeName="Crypto" currencyPair="BTC_USDT" entryType="Bids"/>
            </div>
        </div>
    </div>
};
import React from 'react';
import OrderBookContainer from "./OrderBookContainer"

export default () => {
    return <div className="container">
        <div className="row">
            <div className="col">
                <OrderBookContainer currencyPair="BTCZAR" entryType="Asks"/>
            </div>
            <div className="col">
                <OrderBookContainer currencyPair="BTCZAR" entryType="Bids"/>
            </div>
        </div>
    </div>
};
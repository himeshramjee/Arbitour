import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default ({ currencyPair, entryType }) => {
    const [orderBook, setOrderBook] = useState('');

    const fetchOrderBookForCurrencyPair = () => {
        axios.get(`http://localhost:9000/${currencyPair}/orderbook`, { timeout: 3000 })
        .then((response) => {
            if (response && response.data) {
                setOrderBook(response.data);
            } else {
                console.log(`No order book data for ${currencyPair}.`);
            }
        })
        .catch(error => {
          console.log(`Failed to retrieve order book data for ${currencyPair}. Error: ` + error);
          // console.log(error);
        });
    };

    useEffect(() => {
        fetchOrderBookForCurrencyPair();
    }, []);

    if (!orderBook.asks) {
        return <div>Data missing</div>;
    }

    const renderedAsks = (<div>
        <h3>{currencyPair}: Ask Prices</h3>
        <i>Last change: {orderBook.lastChange}</i>
        <ul>
            {getRenderedPriceEntries(orderBook, true)}
        </ul>
    </div>);

    const renderedBids = (<div>
        <h3>{currencyPair}: Bid Prices</h3>
        <i>Last change: {orderBook.lastChange}</i>
        <ul>
            {getRenderedPriceEntries(orderBook, false)}
        </ul>
    </div>);

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
            <div className="card">
                {entryType === "Asks" ? renderedAsks : ''}
                {entryType === "Bids" ? renderedBids : ''}
            </div>
        </div>
    );
};

function getRenderedPriceEntries(orderBook, asksOnly) {
    if (!orderBook || (asksOnly && !orderBook.asks) | (!asksOnly && !orderBook.bids)) {
        return <div className="card-body" key={orderBook.currencyPair}>No data</div>
    }

    const items = asksOnly ? orderBook.asks : orderBook.bids;
    return items.map(bookItem => {
        return <li key={orderBook.currencyPair + "-" + bookItem.price}>{bookItem.price} / {bookItem.quantity}</li>
    });
}
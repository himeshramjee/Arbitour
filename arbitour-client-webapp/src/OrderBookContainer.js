import React, { useState, useEffect } from 'react';
import axios from 'axios';

const zarNumberFormatter = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumSignificantDigits: 10 });

export default ({ exchangeName, currencyPair, entryType }) => {
    const [orderBook, setOrderBook] = useState('');
    const [openTrades, setOpenTrades] = useState('');

    const fetchOrderBookForCurrencyPair = () => {
        axios.get(`http://localhost:9000/${exchangeName}/${currencyPair}/orderbook/5`, { timeout: 5000 })
        .then((response) => {
            if (response && response.data) {
                setOrderBook(response.data);
            } else {
                console.log(`No order book data for ${currencyPair}.`);
            }
        })
        .catch(error => {
          console.log(`Failed to retrieve order book data for ${currencyPair}. Error: ` + error);
        });
    };

    const fetchOpenTradesForCurrencyPair = () => {
        setOpenTrades({});
    };

    useEffect(() => {
        fetchOrderBookForCurrencyPair();
        fetchOpenTradesForCurrencyPair();
    }, []);

    const renderedAsks = <div className="order-book asks">
        <h3>{exchangeName}: Seller Asks</h3>
        <div className="post-info-red flex-row">
            <span>
                <i className="fa fa-money-bill-alt text-gray"></i>
                &nbsp;&nbsp;{currencyPair}
            </span>
            <span>
                <i className="fa fa-handshake text-gray"></i>
                &nbsp;&nbsp;
                {(openTrades) && (openTrades > 0) ? openTrades : 0}
            </span>
        </div>
        <ul>
            {getRenderedPriceEntries(orderBook, true)}
        </ul>
        <i className="timestamp">Last change: {orderBook.lastChange}</i>
        {/* <div className="post-info flex-row">
            <span>
                <i className="fa fa-list-alt text-gray"></i>
                &nbsp;&nbsp;Show more
            </span>
        </div> */}
    </div>;

    const renderedBids = <div className="order-book bids">
        <h3>{exchangeName}: Buyer Bids</h3>
        <div className="post-info-green">
            <span>
                <i className="fa fa-money-bill-alt text-gray"></i>
                &nbsp;&nbsp;{currencyPair}
            </span>
            <span>
                <i className="fa fa-handshake text-gray"></i>
                &nbsp;&nbsp;
                {(openTrades) && (openTrades > 0) ? openTrades : 0}
            </span>
        </div>
        <ul>
            {getRenderedPriceEntries(orderBook, false)}
        </ul>
        <i className="timestamp">Last change: {orderBook.lastChange}</i>
        {/* <div className="post-info flex-row">
            <span>
                <i className="fa fa-list-alt text-gray"></i>
                &nbsp;&nbsp;Show more
            </span>
        </div> */}
    </div>;

    return (
        <div className="order-book">
            <div>
                {entryType === "Asks" ? renderedAsks : ''}
            </div>
            <div>
                {entryType === "Bids" ? renderedBids : ''}
            </div>
        </div>
    );
};

function getRenderedPriceEntries(orderBook, asksOnly) {
    if (!orderBook || (asksOnly && !orderBook.asks) | (!asksOnly && !orderBook.bids)) {
        return <div className="" key={orderBook.currencyPair}>No data</div>
    }

    const items = asksOnly ? orderBook.asks : orderBook.bids;

    return items.map(bookItem => {
        const price = zarNumberFormatter.format(bookItem.price);

        return <li className="orde-book-entry" key={orderBook.currencyPair + "-" + bookItem.price}>
            <i>{bookItem.orderCount}</i>x <i>{bookItem.quantity}</i> @ <i>{price}</i>
            </li>
    });
}
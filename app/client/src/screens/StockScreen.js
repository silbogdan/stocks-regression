import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './StockScreen.css'
import AnyChart from 'anychart-react';
import anychart from 'anychart';
const axios = require('axios');
const config = require('../config.json');

const timestampToDate = (timestamp) => {
    let date = new Date(timestamp);

    let year = date.getFullYear().toString();

    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
        month = "0" + month;
    }

    let day = date.getDate().toString();
    if (day.length < 2) {
        day = "0" + day;
    }

    return `${year}-${month}-${day}`;
}

/*
    Creates an AnyChart stock datatable from Polygon.io aggregate response

    https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to

    polygonResponse = {
        "ticker": String,
        "queryCount": Int,
        "resultsCount": Int,
        "adjusted": Boolean,
        "results": [
            {
                "v": Float, // Volume
                "vw": Float, // Volume weighted average price
                "o": Float, // Open price
                "c": Float, // Close price
                "h": Float, // High price
                "l": Float, // Low price
                "t": Int, // Unix Timestamp
                "n": Int // Number of transactions
            }
        ],
        "resultsCount": Int,
        "status": String,
        "ticker": String
    }
*/
const polygonToDataTable = (polygonResponse) => {
    let dataTable = anychart.data.table();
    let responseList = [];
    try {
        // Iterate through each candlestick of response tick history
        for (let stick of polygonResponse.results) {
            let price = [
                timestampToDate(stick.t),
                stick.o,
                stick.h,
                stick.l,
                stick.c
            ];

            responseList.push(price);
        }
    } catch (err) {
        return dataTable;
    }

    dataTable.addData(responseList);
    return dataTable;
}

const getStockChart = (stockResponse) => {
    let dataTable = polygonToDataTable(stockResponse);
    let chart = anychart.stock();
    let firstPlot = chart.plot(0);
    firstPlot.area(dataTable.mapAs({'value': 4})).name(stockResponse.ticker);
    chart.scroller().area(dataTable.mapAs({'value': 4}));
    return chart;
}

export const StockScreen = () => {
    const location = useLocation();
    const [chart, setChart] = useState(getStockChart({}));

    useEffect(() => {
        const getStockData = async () => {
            let settings = {
                method: 'get',
                url: `https://api.polygon.io/v2/aggs/ticker/${location.state.tick}/range/1/day/2019-07-22/2021-07-22?adjusted=true&sort=asc&limit=5000`,
                headers: { 
                  'Authorization': `Bearer ${config.API_KEY}`
                }
              };
              
            const response = await axios(settings);
            const newChart = getStockChart(response.data);
            setChart(newChart);
        }

        getStockData();
    }, []);

    // let chart = getStockChart(stockResponse);

    return (
        // <div>
        //     <h1>Here is the state: { location.state.fullName } </h1>
        // </div>
        <div className="stock-container">
            <div className="title-container"> 
                <h1 className="text-title">{ location.state.fullName }</h1>
            </div>
            <div className="chart-container">
            <AnyChart
                width={1400}
                height={600}
                instance={chart}
             />
            </div>
        </div>
    )
}

export default StockScreen;
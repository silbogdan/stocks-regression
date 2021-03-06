import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './StockScreen.css';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
const config = require('../config.json');
const axios = require('axios');

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

// Stores data for the chart
let responseList = [];

/*
    Creates an AnyChart stock newDataTable from Polygon.io aggregate response

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
const polygonTonewDataTable = (polygonResponse) => {
    responseList = [];
    let newDataTable = anychart.data.table();
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
        return newDataTable;
    }

    newDataTable.addData(responseList);
    return newDataTable;
}

const getStockChart = (stockResponse) => {
    let newDataTable = polygonTonewDataTable(stockResponse);
    let chart = anychart.stock();
    let firstPlot = chart.plot(0);
    firstPlot.area(newDataTable.mapAs({ 'value': 4 })).name(stockResponse.ticker);
    chart.scroller().area(newDataTable.mapAs({ 'value': 4 }));
    return chart;
}


export const StockScreen = () => {
    const location = useLocation();
    const investRef = useRef();
    const durationRef = useRef();
    const futureValue = useRef();
    const [chart, setChart] = useState("");

    useEffect(() => {
        responseList = [];
        const getStockData = async () => {
            let settings = {
                method: 'get',
                url: `https://api.polygon.io/v2/aggs/ticker/${location.state.tick}/range/1/month/2019-07-22/2022-01-15?adjusted=true&sort=asc&limit=5000`,
                headers: {
                    'Authorization': `Bearer ${config.API_KEY}`
                }
            };

            const response = await axios(settings);
            // const response = config.response;
            const newChart = getStockChart(response.data);
            setChart(newChart);
        }

        getStockData();
    }, []);

    const handleRef = async () => {
        let data = {
            predictionTime: durationRef.current.value,
            values: responseList
        }

        let settings = {
            method: 'post',
            url: 'http://127.0.0.1:5000/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        };

        let response = await axios(settings);

        let finalValue = (investRef.current.value * response.data.finalPrice) / responseList[responseList.length - 1][4]
        futureValue.current.textContent = `In ${durationRef.current.value} months, your investment will have a value of $${Number.parseFloat(finalValue).toFixed(2)}`;

        // Create a new chart from API response.
        responseList = [];
        let newDataTable = anychart.data.table();
        for (let stick of response.data.prediction) {
            stick[0] = timestampToDate(stick[0]);
            responseList.push(stick);
        }
        newDataTable.addData(responseList);

        let newChart = anychart.stock();
        let firstPlot = newChart.plot(0);
        firstPlot.area(newDataTable.mapAs({ 'value': 4 })).name(location.state.tick);
        newChart.scroller().area(newDataTable.mapAs({ 'value': 4 }));
        setChart(newChart);

        investRef.current.value = "";
    }

    return (
        <div className="stock-container">
            <div className="title-container">
                <h1 className="text-title">{location.state.fullName}</h1>
            </div>
            <div className="chart-container">
                <AnyChart
                    width={1400}
                    height={450}
                    instance={chart}
                />
            </div>
            <div className="selection-container">
                <p className="text-investment">Select your desired investment</p>
                <div className="box">
                    <input type="text" className="input-box" placeholder="$100" ref={investRef} />
                    <select name="duration" id="duration" ref={durationRef} className="input-box">
                        <option value="12">1 year</option>
                        <option value="36">3 years</option>
                        <option value="60">5 years</option>
                    </select>
                    <button className="invest-button" onClick={handleRef}>INVEST</button>
                </div>
            </div>
            <p ref={futureValue}></p>
        </div>
    )
}

export default StockScreen;
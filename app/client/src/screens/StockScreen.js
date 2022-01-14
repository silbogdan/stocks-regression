import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import './StockScreen.css'
import Chart from '../components/Chart';

// const axios = require('axios');
// const config = require('../config.json');

export const StockScreen = () => {
    const location = useLocation();
    const [investValue, setInvestValue] = useState('');

    return (
        <div className="stock-container">
            <div className="title-container"> 
                <h1 className="text-title">{ location.state.fullName }</h1>
            </div>
            <div className="chart-container">
                <Chart tick={location.state.tick} />
            </div>
            <div className="selection-container">
                <p className="text-investment">Select your desired investment</p>
                <div className="box">
                    <input type="text" className="input-box" placeholder="$100" value={investValue} onChange={e => setInvestValue(e.target.value)} />
                    <button className="invest-button">INVEST</button>
                </div>
            </div>
        </div>
    )
}

export default StockScreen;
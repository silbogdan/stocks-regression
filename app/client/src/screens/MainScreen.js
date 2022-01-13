import React from 'react'
import Logo from '../assets/Logo'
import AppleLogo from '../assets/AAPLLogo'
import BRKBLogo from '../assets/BRKBLogo'
import { SP500Logo } from '../assets/SP500Logo'
import Card from '../components/Card'
import './MainScreen.css'

const MainScreen = () => {
    return (
        <div>
            <div className="logo-container"> 
                <Logo />
            </div>
            <div className="text-container">
                <p className="text-main">Choose your favorite stock</p>
            </div>
            <div className="cards-container">
                <Card bgColor="#264653" fullName="Apple Incorporation" tick="AAPL" logo={<AppleLogo />} />
                <Card bgColor="#E9C46A" fullName="Berkshire Hathaway" tick="BRK-B" logo={<BRKBLogo />} />
                <Card bgColor="#2A9D8F" fullName="Standard & Poor’s 500" tick="S&P500" logo={<SP500Logo />} />
            </div>
        </div>
    )
}

export default MainScreen;

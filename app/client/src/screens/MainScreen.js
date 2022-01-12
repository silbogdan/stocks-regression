import React from 'react'
import Logo from '../assets/Logo'
import AppleLogo from '../assets/AAPLLogo'
import BRKBLogo from '../assets/BRKBLogo'
import { SP500Logo } from '../assets/SP500Logo'
import Card from '../components/Card'
import './MainScreen.css'
import { Link } from 'react-router-dom'

const MainScreen = () => {
    return (
        <div class="container">
            <div class="logo-container"> 
                <Logo />
            </div>
            <div class="text-container">
                <p class="text-main">Choose your favorite stock</p>
            </div>
            <div class="cards-container">
                <Link to="stocks" params={{ testvalue: "hello" }} class="text-link">
                    <Card bgColor="#264653" fullName="Apple Incorporation" tick="AAPL" logo={<AppleLogo />} />
                </Link>
                <Link to="stocks" class="text-link">
                    <Card bgColor="#E9C46A" fullName="Berkshire Hathaway" tick="BRK-B" logo={<BRKBLogo />} />
                </Link>
                <Link to="stocks" class="text-link">
                    <Card bgColor="#2A9D8F" fullName="Standard & Poor’s 500" tick="S&P500" logo={<SP500Logo />} />
                </Link>
            </div>
        </div>
    )
}

export default MainScreen;

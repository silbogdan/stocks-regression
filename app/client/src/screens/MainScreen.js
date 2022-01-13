import React from 'react'
import Logo from '../assets/Logo'
import AppleLogo from '../assets/AAPLLogo'
import VanguardLogo from '../assets/VanguardLogo'
import DisneyLogo from '../assets/DisneyLogo'
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
                <Card bgColor="#E9C46A" fullName="Vanguard Real Estate Index" tick="VNQ" logo={<VanguardLogo />} />
                <Card bgColor="#2A9D8F" fullName="The Walt Disney Company" tick="DIS" logo={<DisneyLogo />} />
            </div>
        </div>
    )
}

export default MainScreen;

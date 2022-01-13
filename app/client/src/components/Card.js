import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

export const Card = (props) => {
    return (
        <Link to="stock" state={{ fullName: props.fullName, tick: props.tick }} className="text-link">
            <div className="card-container">
                <div className="card-header" style={{backgroundColor: props.bgColor}}>
                    { props.logo }
                </div>
                <div className="card-footer">
                    <p className="text-name">{ props.fullName }</p>
                    <p className="text-tick">{ props.tick }</p>
                </div>
            </div>
        </Link>
    )
}

export default Card;
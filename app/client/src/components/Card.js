import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

export const Card = (props) => {
    return (
        <Link to="stock" state={{ fullName: props.fullName, tick: props.tick }} class="text-link">
            <div class="card-container">
                <div class="card-header" style={{backgroundColor: props.bgColor}}>
                    { props.logo }
                </div>
                <div class="card-footer">
                    <p class="text-name">{ props.fullName }</p>
                    <p class="text-tick">{ props.tick }</p>
                </div>
            </div>
        </Link>
    )
}

export default Card;
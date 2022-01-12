import React from 'react';
import './Card.css';

export const Card = (props) => {
    return (
        <div class="card-container">
            <div class="card-header" style={{backgroundColor: props.bgColor}}>
                { props.logo }
            </div>
            <div class="card-footer">
                <p class="text-name">{ props.fullName }</p>
                <p class="text-tick">{ props.tick }</p>
            </div>
        </div>
    )
}

export default Card;
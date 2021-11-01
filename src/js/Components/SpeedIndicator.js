import React from 'react';

function SpeedIndicator(props) {
    return (
        <div className="speed-indicator-container"
            style={{ opacity: props.hidden ? 0 : 1 }}
        >
            {props.speed.toFixed(1)}
        </div>
    )
}

export default SpeedIndicator;
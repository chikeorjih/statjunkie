import React from 'react';

const RankStat = (props) => {

    return (
        <div className="rank-stat">
            <div className="label">{props.label}</div>
            <div className="stat">
                <span>{props.ranking}</span>
                <span>{props.stat}</span>
            </div>
        </div>
    );
}

export default RankStat;

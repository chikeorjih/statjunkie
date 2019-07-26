import React from 'react';

const RankStat = (props) => {
    const rank = props.ranking && props.ranking.slice(0,-2);
    const fill = (rank > 0 && rank < 11) ? '#80c762' : (rank > 10 && rank < 20) ? '#ecc05b' : '#ec1c1c';
    const style = { background: fill };
    return (
        <div className="rank-stat">
            <div className="label">{props.label}</div>
            <div className="stat">
                <span>{props.ranking}</span>
                <span style={style}>{props.stat}</span>
            </div>
        </div>
    );
}

export default RankStat;

import React from 'react';

const RankChart = (props) => {
    const rank = props.ranking && props.ranking.slice(0,-2);
    const fillPercent = 100 - ((((rank-1)/31).toFixed(2))*100);
    const fill = (rank > 0 && rank < 11) ? '#80c762' : (rank > 10 && rank < 20) ? '#ecc05b' : '#ec1c1c';
    const style = {
        width: `${fillPercent}%`,
        height: '100%',
        background: fill
    };

    return (
        <div className="rank-chart">
            <div className="label">{props.label}</div>
            <div  className="chart">
                <span className="fill" style={style}></span>
                <span className="rank-tag">{props.ranking}</span>
            </div>
        </div>
    );
}

export default RankChart;

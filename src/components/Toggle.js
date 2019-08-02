import React from 'react';
import {TeamContext} from '../pages/Team';

const Toggle = (props) => {
    const updatePlayers = (showGoalies) => {
        props.updatePlayers(showGoalies);
    };

    return (
        <TeamContext.Consumer>
            {(context) => {
                const showGoalies = context.state.showGoalies;
                const styles = (isGoalie) => {
                    return (showGoalies === isGoalie) ? 'active' : '';
                };

                return (
                    <div className="toggle">
                        <button className={styles(false)} onClick={updatePlayers.bind(this,false)}>Skaters</button>
                        <button className={styles(true)} onClick={updatePlayers.bind(this,true)}>Goalies</button>
                    </div>
                );
            }}
        </TeamContext.Consumer>
    );
}

export default Toggle;

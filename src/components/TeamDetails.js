import React, { Component } from 'react';
import RankChart from '../components/ranking/RankChart';
import RankStat from '../components/ranking/RankStat';
import DropDown from '../components/DropDown';
import TeamIds from '../helpers/teamIds';
import {TeamContext} from '../pages/Team';
import Image from './Image';

const TEAMLOGO = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/';

class TeamDetails extends Component {

  render() {
    return (
        <TeamContext.Consumer>
            {(context) => {
                const team = context.state.teamInfo;
                const teamStats = team.stats;
                let loadedCss = (context.state.isLoading) ? 'loading' : 'loaded';

                return (
                    <div className={`team-info ${loadedCss}`}>
                        <div className="team-details">
                        <div className="details">
                            <Image cssName={'logo'} url={TEAMLOGO} player={this.props.teamId} type='svg'/>
                            <div className="team-name">
                                    <span>{team.city}</span>
                                    <span className="name">
                                        <DropDown label={team.teamName} list={TeamIds} updateTeam={context.updateTeam}/> 
                                    </span>
                                    <div className="record">
                                        <span>{teamStats.pts} pts</span>
                                        <span>{teamStats.wins}-{teamStats.losses}-{teamStats.ot}</span>
                                    </div>
                            </div>
                            </div>
                            <div className="rankings">
                                <RankChart label="Goals For" ranking={team.ranks.goalsPerGame} />
                                <RankChart label="Goals Against" ranking={team.ranks.goalsAgainstPerGame} />
                                <RankChart label="Powerplay" ranking={team.ranks.powerPlayPercentage} />
                                <RankChart label="Penalty Kill" ranking={team.ranks.penaltyKillPercentage} />
                            </div>
                            <div className="rankings row">
                                <RankStat label="FaceOffs" ranking={team.ranks.faceOffWinPercentage} stat={`${team.stats.faceOffWinPercentage}%`} />
                                <RankStat label="Possession" ranking={team.ranks.evGGARatio} stat={`${team.stats.evGGARatio}`} />
                                <RankStat label="Shooting %" ranking={team.ranks.shootingPctRank} stat={`${team.stats.shootingPctg}%`} />
                                <RankStat label="Save %" ranking={team.ranks.savePctRank} stat={`${team.stats.savePctg}%`} />
                            </div>
                        </div>
                    </div>
                )
            }}
        </TeamContext.Consumer>
    );
  }
}

export default TeamDetails;

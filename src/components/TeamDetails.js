import React, { Component } from 'react';
import RankChart from '../components/ranking/RankChart';
import RankStat from '../components/ranking/RankStat';
import DropDown from '../components/DropDown';
import TeamIds from '../helpers/teamIds';
import {TeamContext} from '../pages/Team';

const API = 'https://statsapi.web.nhl.com/api/v1/teams/';
const TEAMLOGO = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/';

class TeamDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        teamInfo: {
            stats: {},
            ranks: { ranking: {} }
        },
        error: null
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});

    const TEAM_INFO = `${this.props.teamId}?expand=team.stats`;

    fetch(API + TEAM_INFO)
      .then(response => {
        if (response.ok){
          return response.json()
        }else{
          throw new Error('He\'s dead Jim');
        }
      })
      .then(data => this.setState({ 
        data, 
        teamInfo: this.getTeaminfo(data), 
        isLoading: false }))
      .catch(error => this.setState({error, isLoading: false}));
  }

  render() {
    const team = this.state.teamInfo;
    const teamStats = team.stats;
    console.log(team);
    return (
        <TeamContext.Consumer>
            {(context) => (
                <div className="team-info">
                    <div className="team-details">
                    <div className="details">
                        <img alt="team" src={`${TEAMLOGO}${this.props.teamId}.svg`}/>
                        <div className="team-name">
                                <span>{team.city}</span>
                                <span className="name">
                                    <DropDown label={team.teamName} list={TeamIds} updateTeam={context.updateTeam}/>
                                </span>
                                <div className="record">
                                    {teamStats.wins}-{teamStats.losses}-{teamStats.ot}
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
            )}
        </TeamContext.Consumer>
    );
  }

  getTeaminfo(data) {
    return (
        {
            city: data.teams[0].locationName,
            teamName: data.teams[0].teamName,
            venue: data.teams[0].venue.name,
            division: data.teams[0].division,
            conference: data.teams[0].conference,
            stats: data.teams[0].teamStats[0].splits[0].stat,
            ranks: data.teams[0].teamStats[0].splits[1].stat,
        }
    );
  }

}

export default TeamDetails;

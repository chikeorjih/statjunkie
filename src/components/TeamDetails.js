import React, { Component } from 'react';

const API = 'https://statsapi.web.nhl.com/api/v1/teams/';
const TEAMLOGO = 'https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/';

class TeamDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        activeTeam: this.props.teamId,
        teamInfo: '',
        error: null
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});

    const TEAM_INFO = `${this.state.activeTeam}?expand=team.stats`;

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
    const teamStats = (team.stats !== undefined) ? team.stats : {};
    console.log(team);
    return (
        <div className="team-info">
            <div className="team-details">
                <img alt="team" src={`${TEAMLOGO}${this.state.activeTeam}.svg`}/>
                <div className="team-name">
                    <span>{team.city}</span>
                    <span>{team.teamName}</span>
                    <div className="record">
                      {teamStats.wins}-{teamStats.losses}-{teamStats.ot}
                    </div>
                </div>
            </div>
        </div>
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

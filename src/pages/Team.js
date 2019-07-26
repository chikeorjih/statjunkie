import React, { Component } from 'react';
import TeamDetails from '../components/TeamDetails';
import TeamView from '../components/TeamView';

const TeamContext = React.createContext(null);
const API = 'https://statsapi.web.nhl.com/api/v1/teams/';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTeam: '19',
      isLoading: false,
        teamInfo: {
            stats: {},
            ranks: { ranking: {} }
        },
        error: null
    }
  }

  componentDidMount() {
    this.fetchDetails();
  }

  updateTeam(newTeam) {
    this.setState({currentTeam: newTeam.toString()}, ()=> {
      this.fetchDetails();
    });
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

  fetchDetails() {
    this.setState({isLoading: true});

    const TEAM_INFO = `${this.state.currentTeam}?expand=team.stats`;

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
      return (
        <TeamContext.Provider value={{state: this.state, updateTeam: this.updateTeam.bind(this)}}>
          <div className="team">
            <TeamDetails teamId={this.state.currentTeam} />
            <TeamView teamId={this.state.currentTeam} />
          </div>
        </TeamContext.Provider>
      );
  }
}

export { Team, TeamContext};

import React, { Component } from 'react';
import TeamDetails from '../components/TeamDetails';
import TeamView from '../components/TeamView';
import Api from '../helpers/api';
import Mappers from '../helpers/mappers';

const TeamContext = React.createContext(null);
const TEAM_API = 'https://statsapi.web.nhl.com/api/v1/teams/';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: null,
      currentTeam: '19',
      currentSeason: '20182019',
      teamData:null,
      playerData:null,
      players: [],
      teamInfo: {
          stats: {},
          ranks: { ranking: {} }
      }
    }
  }

  componentDidMount() {
    this.fetchTeamDetails();
  }

  updateTeam(newTeam) {
    this.setState({currentTeam: newTeam.toString()}, ()=> {
      this.fetchTeamDetails();
    });
  }

  fetchTeamDetails() {
    const TEAM_INFO = `${this.state.currentTeam}?expand=team.stats`;
    const TEAM_SUMMARY = `${this.state.currentTeam}?hydrate=franchise(roster(season=${this.state.currentSeason},person(name,stats(splits=[yearByYear]))))`;
    
    this.setState({isLoading: true});

    Api.callApi(TEAM_API,TEAM_INFO)
      .then(data => this.setState({ teamData: data, teamInfo: Mappers.getTeaminfo(data)}))
      .then(
        Api.callApi(TEAM_API,TEAM_SUMMARY)
        .then(data => this.setState({ 
          playerData: data, 
          players: Mappers.getPlayerDetails(data, {currentTeam: this.state.currentTeam, currentSeason: this.state.currentSeason}),
          isLoading: false }))
        .catch(error => this.setState({error, isLoading: false}))
      )
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

export {Team, TeamContext};

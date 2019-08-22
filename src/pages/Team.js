import React, { Component } from 'react';
import TeamDetails from '../components/TeamDetails';
import SkaterView from '../components/SkaterView';
import GoalieView from '../components/GoalieView';
import Toggle from '../components/Toggle';
import Api from '../helpers/api';
import Mappers from '../helpers/mappers';
import {navigate} from 'hookrouter';
import PlayerModal from '../components/PlayerModal';

const TeamContext = React.createContext(null);
const TEAM_API = 'https://statsapi.web.nhl.com/api/v1/teams/';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: null,
      currentTeam: (this.props.currentTeam === undefined) ? '19' : this.props.currentTeam,
      currentSeason: '20182019',
      teamData:null,
      playerData:null,
      players: [],
      goalies: [],
      teamInfo: {
          stats: {},
          ranks: { ranking: {} }
      },
      showGoalies: false,
      playerModal: {
        isOpen: false,
        activePlayer: ''
      }
    }
  }

  componentDidMount() {
    this.fetchTeamDetails();
  }

  updateTeam(newTeam) {
    this.setState({currentTeam: newTeam.toString()}, ()=> {
      navigate(`/team/${newTeam}`);
      this.fetchTeamDetails();
    });
  }

  updatePlayers(showGoalies) {
    this.setState({showGoalies: showGoalies});
  }

  showPlayerModal(player) {
    console.log(player);
  }

  fetchTeamDetails() {
    const TEAM_INFO = `${this.state.currentTeam}?expand=team.stats`;
    const TEAM_SUMMARY = `${this.state.currentTeam}?hydrate=franchise(roster(season=${this.state.currentSeason},person(name,stats(splits=[yearByYear]))))`;
    const currentDetails = {
      currentTeam: this.state.currentTeam, 
      currentSeason: this.state.currentSeason
    };
    
    this.setState({isLoading: true});

    Api.callApi(TEAM_API,TEAM_INFO)
      .then(data => this.setState({ teamData: data, teamInfo: Mappers.getTeaminfo(data), isLoading: false}))
      .catch(error => this.setState({error, isLoading: false}));

    Api.callApi(TEAM_API,TEAM_SUMMARY)
      .then(data => this.setState({ 
        playerData: data, 
        players: Mappers.getPlayerDetails(data,currentDetails,false),
        goalies: Mappers.getPlayerDetails(data,currentDetails,true),
        isLoading: false }))
      .catch(error => this.setState({error, isLoading: false}))
  }

  render() {
      const players = (this.state.showGoalies) ? 
        <GoalieView teamId={this.state.currentTeam} /> : 
        <SkaterView teamId={this.state.currentTeam} showPlayerModal={this.showPlayerModal.bind(this)}/>;

      const playerModal = (this.state.playerModal.isOpen) && <PlayerModal />

      return (
        <TeamContext.Provider value={{state: this.state,updateTeam: this.updateTeam.bind(this)}}>
            <div className="team">
              <TeamDetails teamId={this.state.currentTeam} />
              <Toggle updatePlayers={this.updatePlayers.bind(this)}/>
              {players}
              {playerModal}
            </div>
        </TeamContext.Provider>
      );
  }
}

export {Team, TeamContext};

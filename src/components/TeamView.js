import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';


const API = 'https://statsapi.web.nhl.com/api/v1/teams/';

class TeamView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTeam: this.props.teamId,
      season: '20182019',
      players: [],
      data: null,
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});

    const TEAM_SUMMARY = `${this.state.activeTeam}?hydrate=franchise(roster(season=${this.state.season},person(name,stats(splits=[yearByYear]))))`;

    fetch(API + TEAM_SUMMARY)
      .then(response => {
        if (response.ok){
          return response.json()
        }else{
          throw new Error('He\'s dead Jim');
        }
      })
      .then(data => this.setState({ 
          data, players: 
          this.getPlayerDetails(data), 
        isLoading: false }))
      .catch(error => this.setState({error, isLoading: false}));
  }

  render() {
    const players = this.getSummary(this.state.players);
    const avatarFormater = (cell,row) => {
        return (
            <img alt="player" src={`https://nhl.bamcontent.com/images/headshots/current/60x60/${cell}.jpg`}/>
        );
    }

    const columns = [{
        dataField: 'picture',
        text: '',
        formatter: avatarFormater
    }, {
        dataField: 'name',
        text: 'Player',
        sort: true
    }, {
        dataField: 'gp',
        text: 'Games',
        sort: true
    }, {
        dataField: 'goals',
        text: 'Goals',
        sort: true
    }, {
        dataField: 'assists',
        text: 'Assists',
        sort: true
    }, {
        dataField: 'points',
        text: 'Points',
        sort: true
    }, {
        dataField: 'plusMinus',
        text: 'Plus/Minus',
        sort: true
    }];

    return (
        <div className="team">
            <BootstrapTable keyField='picture' data={ players } columns={ columns } />
        </div>
    );
  }

  getPlayerDetails(data) {
    let players = [];
    const rawPlayers = data.teams[0].franchise.roster.roster;

    players = rawPlayers.map(player => {
        return (
            {
                name: player.person.fullName,
                details: player.person,
                currentStats:  this.getCurrentPlayerStats(player.person)
            }
        );
    });

    return players;
  }

  getCurrentPlayerStats(person) {

    const stats = person.stats[0].splits.filter((year) => {
        return (
            year.season === this.state.season && 
            year.team.id === parseInt(this.state.activeTeam) && 
            year.league.id === 133 //133 = NHL
        );
    });

    return stats[0].stat;
  }

  getSummary(players) {
    return players.map(player => {
        return (
            {
                picture: player.details.id,
                name: player.name,
                gp: player.currentStats.games,
                goals: player.currentStats.goals,
                assists: player.currentStats.assists,
                points: player.currentStats.points,
                plusMinus: player.currentStats.plusMinus
            }
        );
    });

  }

}

export default TeamView;

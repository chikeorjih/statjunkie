import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';


const API = 'https://statsapi.web.nhl.com/api/v1/teams/';
const PLAYERIMAGE = 'https://nhl.bamcontent.com/images/headshots/current/60x60/';

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
        data, 
        players: this.getPlayerDetails(data), 
        isLoading: false }))
      .catch(error => this.setState({error, isLoading: false}));
  }

  render() {
    const players = this.getSummary(this.state.players);
    const avatarFormater = (cell,row) => {
        return (
            <img alt="player" src={`${PLAYERIMAGE}${cell}.jpg`}/>
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
        text: 'GP',
        sort: true
    }, {
        dataField: 'goals',
        text: 'G',
        sort: true
    }, {
        dataField: 'assists',
        text: 'A',
        sort: true
    }, {
        dataField: 'points',
        text: 'Pts',
        sort: true
    }, {
        dataField: 'plusMinus',
        text: '+/-',
        sort: true
    }, {
        dataField: 'projections.goals',
        text: 'Proj. G',
        sort: true
    }, {
        dataField: 'projections.assists',
        text: 'Proj. A',
        sort: true
    }, {
        dataField: 'projections.points',
        text: 'Proj. Pts',
        sort: true
    }, {
        dataField: 'averages.goals',
        text: 'G/GP',
        sort: true
    }, {
        dataField: 'careerAverages.goals',
        text: 'G/GP(Career)',
        sort: true
    }, {
        dataField: 'averages.assists',
        text: 'A/GP',
        sort: true
    }, {
        dataField: 'careerAverages.assists',
        text: 'A/GP(Career)',
        sort: true
    }, {
        dataField: 'averages.points',
        text: 'Pts/GP',
        sort: true
    }, {
        dataField: 'careerAverages.points',
        text: 'Pts/GP(Career)',
        sort: true
    }];
    console.log(this.state);
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
                currentStats:  this.getCurrentPlayerStats(player.person),
                careerStats: this.getCareerAverages(player.person)
            }
        );
    });
    //TODO: this filters to skaters, handle goalies next
    return players.filter(player => player.details.primaryPosition.code !== 'G');
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

  getCareerAverages(person) {
    const stats = person.stats[0].splits.filter((year) => {
        return (
            year.league.id === 133
        );
    });
    let totalStats = {games: 0, goals: 0, assists: 0, points: 0 };

    // TODO: fast but there is a better way to do this
    for (var i = 0, len = stats.length; i < len; i++) {
        Object.assign(totalStats,{
            games: totalStats.games + stats[i].stat.games,
            goals: totalStats.goals + stats[i].stat.goals,
            assists: totalStats.assists + stats[i].stat.assists,
            points: totalStats.points + stats[i].stat.points
        });
    }

    let careerAverages = {
        goals: this.getAverage(totalStats.goals,totalStats.games), 
        assists: this.getAverage(totalStats.assists,totalStats.games), 
        points: this.getAverage(totalStats.points,totalStats.games)
    };

    return {totalStats, careerAverages};
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
                plusMinus: player.currentStats.plusMinus,
                projections: {
                    goals: this.getProjection(player.currentStats.goals,player.currentStats.games),
                    assists: this.getProjection(player.currentStats.assists,player.currentStats.games),
                    points: this.getProjection(player.currentStats.points,player.currentStats.games)
                },
                averages: {
                    goals: this.getAverage(player.currentStats.goals,player.currentStats.games),
                    assists: this.getAverage(player.currentStats.assists,player.currentStats.games),
                    points: this.getAverage(player.currentStats.points,player.currentStats.games)
                },
                careerAverages: {
                    goals: player.careerStats.careerAverages.goals,
                    assists: player.careerStats.careerAverages.assists,
                    points: player.careerStats.careerAverages.points
                }
            }
        );
    });

  }

  getProjection(stat,games) {
    stat = (stat === undefined) ? 0 : stat;

    return Math.round((stat/games) * 82);
  }

  getAverage(stat,games) {
    return Math.round((stat/games)*100)/100;
  }

}

export default TeamView;

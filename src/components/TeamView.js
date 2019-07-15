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
    };
    const defaultSorted = [{
        dataField: 'points',
        order: 'desc'
      }];
      const headerSortingClasses = (column, sortOrder, isLastSorting, colIndex) => (
        sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'
      );
      

    const columns = [
        { dataField: 'picture', text: '', formatter: avatarFormater }, 
        { dataField: 'name', text: 'Player', sort: true, headerSortingClasses },
        { dataField: 'position', text: 'Pos', sort: true, headerSortingClasses },
        { dataField: 'gp', text: 'GP', sort: true, headerSortingClasses },
        { dataField: 'goals', text: 'G', sort: true, headerSortingClasses },
        { dataField: 'assists', text: 'A', sort: true, headerSortingClasses },
        { dataField: 'points', text: 'Pts', sort: true, headerSortingClasses },
        { dataField: 'plusMinus', text: '+/-', sort: true, headerSortingClasses },
        { dataField: 'projections.goals', text: 'Pj.G', sort: true, headerSortingClasses },
        { dataField: 'projections.assists', text: 'Pj.A', sort: true, headerSortingClasses },
        { dataField: 'projections.points', text: 'Pj.Pts', sort: true, headerSortingClasses },
        { dataField: 'averages.goals', text: 'G/G.', sort: true, headerSortingClasses },
        { dataField: 'careerAverages.goals', text: 'Career', sort: true, headerSortingClasses },
        { dataField: 'averages.assists', text: 'A/G.', sort: true, headerSortingClasses },
        { dataField: 'careerAverages.assists', text: 'Career', sort: true, headerSortingClasses },
        { dataField: 'averages.points', text: 'Pts/G.',sort: true, headerSortingClasses },
        { dataField: 'careerAverages.points', text: 'Career',sort: true, headerSortingClasses }
    ];
    console.log(this.state);
    return (
        <div className="team-content">
            <div className='roster-stats'>
                <BootstrapTable keyField='picture' data={ players } columns={ columns } defaultSorted={ defaultSorted }/>
            </div>
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
                position: player.details.primaryPosition.code,
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

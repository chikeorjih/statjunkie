import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import {TeamContext} from '../pages/Team';
import Mappers from '../helpers/mappers';
import Image from './Image';

const PLAYERIMAGE = 'https://nhl.bamcontent.com/images/headshots/current/60x60/';

class SkaterView extends Component {

  render() {
    return (
      <TeamContext.Consumer>
        {(context) => {
          const players = Mappers.getSummary(context.state.players, false);

          const avatarFormater = (cell,row) => {
              return (
                  <Image cssName={'player'} url={PLAYERIMAGE} player={cell} type='jpg'/>
              );
          };
          const performanceFormater = (avg,careerAvg,cell,stDev) => {
            //TODO consider sing the Standard deviation thats being passed in
            const buffer = .0244; //give them a 2pt/g/a buffer
            let style = '';

            if(avg <= (careerAvg - buffer)){
              style = 'poor'
            }else if (avg >= (careerAvg + buffer)) {
              style = 'good'
            }
            return <span className={style}>{cell}</span>
          };
          const goalsPerformanceFormater = (cell,row) => performanceFormater(row.averages.goals,row.trailingCareerAverages.goals,cell,row.standardDeviation.goals);
          const astsPerformanceFormater = (cell,row) => performanceFormater(row.averages.assists,row.trailingCareerAverages.assists,cell,row.standardDeviation.assists);
          const ptsPerformanceFormater = (cell,row) => performanceFormater(row.averages.points,row.trailingCareerAverages.points,cell,row.standardDeviation.points);
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
              { dataField: 'goals', text: 'G', sort: true, headerSortingClasses, formatter: goalsPerformanceFormater },
              { dataField: 'assists', text: 'A', sort: true, headerSortingClasses, formatter: astsPerformanceFormater },
              { dataField: 'points', text: 'Pts', sort: true, headerSortingClasses, formatter: ptsPerformanceFormater },
              { dataField: 'plusMinus', text: '+/-', sort: true, headerSortingClasses },
              { dataField: 'projections.goals', text: 'Pj.G', sort: true, headerSortingClasses },
              { dataField: 'projections.assists', text: 'Pj.A', sort: true, headerSortingClasses },
              { dataField: 'projections.points', text: 'Pj.Pts', sort: true, headerSortingClasses },
              { dataField: 'averages.points', text: 'Pts/G.',sort: true, headerSortingClasses },
              { dataField: 'careerAverages.points', text: 'Career',sort: true, headerSortingClasses }
          ];
          
          return (
            <div className="team-content">
                <div className='roster-stats'>
                    <BootstrapTable keyField='picture' data={ players } columns={ columns } defaultSorted={ defaultSorted }/>
                    <div className="legend">
                      <div><span className="good"></span> Better than recent performance (last 3 years)</div>
                      <div><span className="poor"></span> Worse than recent performance (last 3 years)</div>
                    </div>
                </div>
            </div>
          )
        }}
      </TeamContext.Consumer>
    );
  }
}

export default SkaterView;

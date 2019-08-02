import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import {TeamContext} from '../pages/Team';
import Mappers from '../helpers/mappers';

const PLAYERIMAGE = 'https://nhl.bamcontent.com/images/headshots/current/60x60/';

class GoalieView extends Component {

  render() {
    return (
      <TeamContext.Consumer>
        {(context) => {
          const players = Mappers.getSummary(context.state.goalies, true);
          const avatarFormater = (cell,row) => {
              return (
                  <img alt="player" src={`${PLAYERIMAGE}${cell}.jpg`}/>
              );
          };
          const gaaPerformanceFormater = (avg,careerAvg,cell,isOver) => {
            const buffer = .1;
            let style = '';
            if(avg < (careerAvg - buffer)){
              style = 'good'
            }else if (avg > (careerAvg + buffer)) {
              style = 'poor'
            }
            return <span className={style}>{cell}</span>;
          };
          const svPerformanceFormater = (avg,careerAvg,cell,isOver) => {
            const buffer = .01;
            let style = '';
            if(avg > (careerAvg + buffer)){
              style = 'good'
            }else if (avg < (careerAvg - buffer)) {
              style = 'poor'
            }
            return <span className={style}>{cell}</span>;
          };
          const gaaFormater = (cell,row) => gaaPerformanceFormater(row.gaa,row.trailingCareerAverages.gaa,cell);
          const svFormater = (cell,row) => svPerformanceFormater(row.svP,row.trailingCareerAverages.saveP,cell);
          const defaultSorted = [{
              dataField: 'gp',
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
              { dataField: 'w', text: 'W', sort: true, headerSortingClasses },
              { dataField: 'l', text: 'L', sort: true, headerSortingClasses },
              { dataField: 'so', text: 'SO', sort: true, headerSortingClasses },
              { dataField: 'svP', text: 'SV%', sort: true, headerSortingClasses, formatter: svFormater },
              { dataField: 'gaa', text: 'GAA', sort: true, headerSortingClasses, formatter: gaaFormater },
              { dataField: 'sa', text: 'SA', sort: true, headerSortingClasses },
              { dataField: 'pkSv', text: 'PKSV%', sort: true, headerSortingClasses }
          ];
          
          return (
            <div className="team-content">
                <div className='roster-stats goalie'>
                    <BootstrapTable keyField='picture' data={ players } columns={ columns } defaultSorted={ defaultSorted }/>
                </div>
            </div>
          )
        }}
      </TeamContext.Consumer>
    );
  }
}

export default GoalieView;

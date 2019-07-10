import React, { Component } from 'react';
import TeamView from '../components/TeamView';

const DEFAULT_TEAM = '19';

class Team extends Component {

  render() {
      return (
          <div className="team">
           <TeamView teamId={DEFAULT_TEAM} />
          </div>
      );
  }
}

export default Team;

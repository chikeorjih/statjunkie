import React, { Component } from 'react';
import TeamDetails from '../components/TeamDetails';
import TeamView from '../components/TeamView';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTeam: '19'
    }
  }

  render() {
      return (
          <div className="team">
            <TeamDetails teamId={this.state.currentTeam} />
            <TeamView teamId={this.state.currentTeam} />
          </div>
      );
  }
}

export default Team;

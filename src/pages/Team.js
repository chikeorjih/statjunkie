import React, { Component } from 'react';
import TeamDetails from '../components/TeamDetails';
import TeamView from '../components/TeamView';

const TeamContext = React.createContext(null);

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTeam: '19'
    }
  }

  updateTeam(newTeam) {
    this.setState({currentTeam: newTeam.toString()});
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

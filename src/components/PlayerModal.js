import React, { Component } from 'react';
import {TeamContext} from '../pages/Team';

class PlayerModal extends Component {

  render() {
    return (
        <TeamContext.Consumer>
        {(context) => {
            const closeModal = () => {
                this.props.showModal(false);
            };

            return (
                <div className="modal">
                    <div className="modal-bkg" onClick={closeModal}></div>
                    <div className="modal-content">
                        {this.props.activePlayer.details.fullName}
                    </div>
                </div>
            )
        }}
        </TeamContext.Consumer>
    )
  }

}

export default PlayerModal;
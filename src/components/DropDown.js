import React, { useState } from 'react';

const DropDown = (props) => {
    //state
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        (isOpen === true) ? setIsOpen(false) : setIsOpen(true);
    };

    const updateTeam = (e) => {
        const teamId = e.currentTarget.dataset.teamid;
        props.updateTeam(teamId);
    };


    const teamList = props.list.map((team,index) => (
        <li key={index} data-teamid={team.id} onClick={updateTeam}>{team.name}</li>
    ));

    let caretCss = (isOpen) ? 'caret open' : 'caret closed';
    let listCss = (isOpen) ? 'dropdown-list open' : 'dropdown-list closed';
    let labelCss =(props.label !== undefined && props.label.length < 8) ? 'label' : 'label large';

    return (
        <div className="dropdown" onClick={toggleDropdown}>
            <span className={labelCss}>{props.label}</span>
            <span className={caretCss}></span>
            <ul className={listCss}>
                {teamList}
            </ul>
        </div>
    );
}

export default DropDown;

import React, { useState } from 'react';

const DropDown = (props) => {
    //state
    const [isOpen, setIsOpen] = useState(false);

    const teamList = props.list.map((team,index) => (
        <li key={index} teamId={team.id}>{team.name}</li>
    ));

    let caretCss = (isOpen) ? 'caret open' : 'caret closed';
    let listCss = (isOpen) ? 'dropdown-list open' : 'dropdown-list closed';

    const toggleDropdown = () => {
        (isOpen === true) ? setIsOpen(false) : setIsOpen(true);
    };

    return (
        <div className="dropdown">
            <span onClick={toggleDropdown}>{props.label}</span>
            <span className={caretCss}></span>
            <ul className={listCss}>
                {teamList}
            </ul>
        </div>
    );
}

export default DropDown;

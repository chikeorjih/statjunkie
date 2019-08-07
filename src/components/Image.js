import React, { useState } from 'react';

const Image = (props) => {
    const [loaded, setLoaded] = useState(false);
    const doneLoading = () => {
        setLoaded(true);
    }
    let imgClass = (loaded) ? 'image loaded' : 'image';

    return (
        <img className={imgClass} onLoad={doneLoading} alt="player" src={`${props.url}${props.player}.${props.type}`}/>
    );
}

export default Image;

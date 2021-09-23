import React from 'react';

// import rightEmblem from '../../assets/common/rightEmblem.png'
import rightText from '../../assets/common/rightText.png'
import rightMicrophone from '../../assets/common/rightMicrophone.png'
import './index.scss'

function SideBar() {
    return (
        <div className="sidebar">
            {/* <img className="rightEmblem" src={rightEmblem} alt="" /> */}
            <img className="rightText" src={rightText} alt="" />
            <img className="rightMicrophone" src={rightMicrophone} alt="" />
        </div>
    );
}

export default SideBar;

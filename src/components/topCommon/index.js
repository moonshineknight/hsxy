import React from 'react';
import { Link } from 'react-router-dom';

import leftLogo from '../../assets/common/左上角logo.png';
import topText from '../../assets/common/字体.png';
import ReturnTo from '../../assets/common/返回.png';
import maskStar from '../../assets/common/五角星遮罩.png';
import columns from '../../assets/common/华表.png';

import './index.scss'

function SideBar({returnTo}) {
    return (
        <div className="top">
            <img  className='leftLogo' src={leftLogo} alt='' />
            <Link to={returnTo}>
            <img  className='returnTo' src={ReturnTo} alt='' />
            </Link>
            <img  className='topText' src={topText} alt='' />
            <img  className='maskStar' src={maskStar} alt='' />
            <img  className='columns' src={columns} alt='' />
        </div>
    );
}

export default SideBar;

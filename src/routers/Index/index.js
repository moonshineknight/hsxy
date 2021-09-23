import React from 'react';
import { Link } from 'react-router-dom';
import RightSide from '../../components/rightSide';
import LeftLogo from '../../assets/common/左上角logo.png';
import leftMain from '../../assets/index/左侧主体.jpg';
import mainText from '../../assets/index/文字主体.png';
import columns from '../../assets/common/华表.png';
import startButton from '../../assets/index/开始按钮.png';
import './index.scss';

function Index() {
  return (
    <div className="index">
      <RightSide />
      <div className="content">
        <img  className='leftMain' src={leftMain} alt='' />
        <img  className='leftLogo' src={LeftLogo} alt='' />
        <img  className='mainText' src={mainText} alt='' />
        <img  className='columns' src={columns} alt='' />
        <Link to="/list"><img  className='startButton' src={startButton} alt='' />
        </Link>
      </div>
    </div>
  );
}

export default Index;

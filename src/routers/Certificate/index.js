import React, { useState } from 'react';
import { message,Modal } from 'antd';
import axios from 'axios';

import { Link } from 'react-router-dom';
import RightSide from '../../components/rightSide';
// import LeftLogo from '../../assets/common/左上角logo.png';
import leftMain from '../../assets/index/左侧主体.jpg';
import leftReturn from '../../assets/common/返回.png';
import columns from '../../assets/common/华表.png';
import sendMailButton from '../../assets/certificate/邮件.png';
import { GetQueryString } from '../../utils';
import './index.scss';

function Certificate() {
  const [mail, setMail] = useState('');
  const [sendMessage, setSendMessage] = useState(false);
  const fileName = GetQueryString('fileName');
  
  const sendClick = () => {
    if(!mail){
      return;
    }

    const formdata = new FormData();
    formdata.append('photoName', fileName);
    formdata.append('mail', mail);
    axios({
      method: 'post',
      url: '/api/uploadTape/sendMail2',
      data:formdata,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 100000,
      // ...//其他相关配置
    }).then((res) => {
      if (res && res.data.status === 200) {
        setSendMessage(false);
        message.success('发送成功');
      } else {
        message.warning(res.data.msg);
      };
    });
  }
  
  return (
    <div className="index">
      <RightSide />
      <div className="content">
        <img  className='certificateLeftMain' src={leftMain} alt='' />
        {/* <img  className='leftLogo' src={LeftLogo} alt='' /> */}
        <Link to="/index"><img  className='leftReturn' src={leftReturn} alt='' /></Link>
        <img  className='columns' src={columns} alt='' />
        {/* <img  className='certificate' src={columns} alt='' /> */}
        <img  className='certificate' src={`/api/file/getPhotoByFilename?filename=${fileName}`} alt='' />
        <div className='mainTips'>您也可以把证书发送到您的邮箱</div>
        <img onClick={() => setSendMessage(true)} className='sendMailButton' src={sendMailButton} alt='' />
      </div>
      {/* <Modal
          centered
          destroyOnClose
          width={'5rem'}
          title=""
          bodyStyle={{height:"12%",paddingTop:'40px'}}
          visible={sendMessage}
          footer={<div style={{width:'100%',textAlign:'center',backgroundColor:'rgb(237,240,241)'}}>
            <div style={{color:'rgb(179,43,47)',margin:'15px 0'}}>
              将证书发送到你的邮箱吧
            </div>
        <div style={{ textAlign: 'center',marginBottom:'5px'}}>
          <button onClick={sendClick} style={{backgroundColor:'rgb(179,43,47)',width:'180px',height:"30px",margin:0,padding:0,border:0,borderRadius:'15px'}}>
          <Link style={{color:'#fff',textDecoration:'none',fontSize:'16px'}} >确认发送</Link>
        </button>
        </div>
          </div>}
          
          onCancel={() => setSendMessage(false)}
        >
          <input onChange={e=> setMail(e.target.value)} placeholder="点击输入您的邮箱" type='text' style={{height:'30px',fontSize:'24px',outlineStyle: 'none',border: 0, }} />
        </Modal> */}

        <Modal
          centered
          destroyOnClose
          className='recordingModal'
          title=""
          visible={sendMessage}
          footer={<div style={{ width: '100%', textAlign: 'center' }}>
            <div className='textTips'>
            将证书发送到你的邮箱吧
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={sendClick} className='clickSureButton'>确认发送 </button>
            </div>
          </div>}
          
          onCancel={() => setSendMessage(false)}
        >
          
          <input className='inputContent' onChange={e=> setMail(e.target.value)} placeholder="点击输入您的邮箱" type='text' />
        </Modal>
    </div>
  );
}

export default Certificate;

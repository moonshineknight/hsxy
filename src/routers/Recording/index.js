import React, { Fragment, useState, useEffect, useRef } from 'react';
import {  message, Modal } from 'antd';
import {createHashHistory } from 'history';
import axios from 'axios';
import RightSide from '../../components/rightSide';
import TopCommon from '../../components/topCommon';
import Recorder from 'js-audio-recorder';
import Phone from '../../assets/record/话筒.png';
import playIcon from '../../assets/record/播放.png';

import destroyIcon from '../../assets/record/放弃.png';
import paseIcon from '../../assets/record/暂停.png';
import endIcon from '../../assets/record/完成.png';
import certificateIcon from '../../assets/record/证书.png';
import './index.scss';

// 录音操作页
function List() {
  const recorderTool = useRef(null);
  const drawRecorderId = useRef(null);
  const drawPlayId = useRef(null);
  const ctx = useRef(null);
  const pCtx = useRef(null);
  const oCanvas = useRef(null);
  const pCanvas = useRef(null);
  const [recordingInfo, setRecordingInfo] = useState({});
  const [recordingStatus, setRecordingStatus] = useState('');
  const [playingStatus, setPlayingStatus] = useState('');

  const [sendMessage, setSendMessage] = useState(false);
  const [userName, setUserName] = useState('');

  const [recordPaseStatus, setRecordPase] = useState(false); // 录音暂停
  const [playPase, setPlayPase] = useState(false); // 播放暂停

  useEffect(() => {
    init();
    oCanvas.current = document.getElementById('canvasRecording');
    ctx.current = oCanvas.current.getContext("2d");

    //播放波浪
    pCanvas.current = document.getElementById('canvasPlay');
    pCtx.current = pCanvas.current.getContext("2d");

    return () => {
      recorderTool.current = null;
    }
  }, []);

  const init = () => {
    let recorder = new Recorder({
      sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
      sampleRate: 48000,              // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1,                 // 声道，支持 1 或 2， 默认是1
      // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    });
    recorderTool.current = recorder;
    recorder.onprogress = (params) => {
      setRecordingInfo(params);
    };

    recorder.onplayend = () => {
      stopPlayRecorder();
      // setPlayingStatus('end');
    };

  }

  const drawRecord = () => {
    // 用requestAnimationFrame稳定60fps绘制
    drawRecorderId.current = requestAnimationFrame(drawRecord);
    // 实时获取音频大小数据
    let dataArray = recorderTool.current.getRecordAnalyseData(),
      bufferLength = dataArray.length;

    // 填充背景色
    ctx.current.fillStyle = 'rgb(247, 188, 20)';
    ctx.current.fillRect(0, 0, oCanvas.current.width, oCanvas.current.height);

    // 设定波形绘制颜色
    ctx.current.lineWidth = 3;
    ctx.current.strokeStyle = 'rgb(255, 0, 0)';
    ctx.current.beginPath();

    let sliceWidth = oCanvas.current.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
      x = 0;          // 绘制点的x轴位置
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * oCanvas.current.height / 2;
      if (i === 0) {
        // 第一个点
        ctx.current.moveTo(x, y);
      } else {
        // 剩余的点
        ctx.current.lineTo(x, y);
      }
      // 依次平移，绘制所有点
      x += sliceWidth;
    }

    ctx.current.lineTo(oCanvas.current.width, oCanvas.current.height / 2);
    ctx.current.stroke();
  }

  const drawPlay = () => {
    // 用requestAnimationFrame稳定60fps绘制
    if (!recordingInfo.duration) {
      return;
    }

    if (recorderTool.current) {
      drawPlayId.current = requestAnimationFrame(drawPlay);
      // 实时获取音频大小数据

      let dataArray = recorderTool.current.getPlayAnalyseData(),
        bufferLength = dataArray.length;

      // 填充背景色
      pCtx.current.fillStyle = 'rgb(247, 188, 20)';
      pCtx.current.fillRect(0, 0, pCanvas.current.width, pCanvas.current.height);

      // 设定波形绘制颜色
      pCtx.current.lineWidth = 3;
      pCtx.current.strokeStyle = 'rgb(255, 0, 0)';
      pCtx.current.beginPath();

      let sliceWidth = pCanvas.current.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
        x = 0;          // 绘制点的x轴位置
      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = v * pCanvas.current.height / 2;
        if (i === 0) {
          // 第一个点
          pCtx.current.moveTo(x, y);
        } else {
          // 剩余的点
          pCtx.current.lineTo(x, y);
        }
        // 依次平移，绘制所有点
        x += sliceWidth;
      }

      pCtx.current.lineTo(pCanvas.current.width, pCanvas.current.height / 2);
      pCtx.current.stroke();
    }
  }

  // 开始录音
  const recorderStart = () => {
    if (!recorderTool.current) {
      init();
    }
    recorderTool.current.start().then(() => {
      setRecordingStatus('record');
      drawRecord();
    }, (error) => {
      console.log(`${error.name} : ${error.message}`)
    })
  }

  // 结束录音
  const recorderStop = () => {
    if (recorderTool.current) {
      recorderTool.current.stop();
      drawRecorderId.current && cancelAnimationFrame(drawRecorderId.current);
      drawRecorderId.current = null;
      setRecordingStatus('end');
      setRecordPase(false);
    }
  }

  //  录音暂停继续
  const recordStatusOption = () => {
    if (recordingStatus === 'record') {
      if (recordPaseStatus) {
        
        recorderResume();
      } else {
        console.log('暂停 :>> ');
        recorderPause();
      }
      setRecordPase(!recordPaseStatus);
    }
  }

  // 录音暂停
  const recorderPause = () => {
    console.log('recorderTool.current ', recorderTool.current);
    if (recorderTool.current) {
      recorderTool.current.pause();
    }
  }

  // 录音继续
  const recorderResume = () => {
    if (recorderTool.current) {
      recorderTool.current.resume();
    }
  }

  // 录音播放
  const recorderPlay = () => {
    if (recorderTool.current) {
      recorderTool.current.play();
      setPlayingStatus('play');
      drawPlay();//绘制波浪图
    }
  }

  //  播放暂停继续
  const playStatusOption = () => {
    if (playingStatus === 'play') {
      if (playPase) {
        recorderResumePlay();
      } else {
        recorderPausePlay();
      }
      setPlayPase(!playPase);
    }
  }

  // 暂停录音播放
  const recorderPausePlay = () => {
    if (recorderTool.current) {
      recorderTool.current.pausePlay()
    }
  }

  // 恢复录音播放
  const recorderResumePlay = () => {
    if (recorderTool.current) {
      recorderTool.current.resumePlay();
      drawPlay();//绘制波浪图
    }
  }

  // 停止录音播放
  const stopPlayRecorder = () => {
    if (recorderTool.current) {
      recorderTool.current.stopPlay();
      setPlayingStatus('end');
    }
  }

  const destroyRecorder = () => {
    if (recorderTool.current) {
      recorderTool.current.destroy().then(() => {
        drawRecorderId.current && cancelAnimationFrame(drawRecorderId.current);
        drawPlayId.current && cancelAnimationFrame(drawPlayId.current);
        setRecordingInfo({});
        recorderTool.current = null;
        drawRecorderId.current = null;
        drawPlayId.current = null;
        setRecordingStatus('');
        setSendMessage(false);
      });
    }
  }

  const getRandom = () => {
    let num = Math.floor(Math.random() * 10000000);
    return num;
  }

  const sendClick = () => {
    if(!userName){
      return;
    }

    let blob = recorderTool.current.getWAVBlob();
    let files = new window.File(
      [blob],
      getRandom(),
      { type: blob.type }
    );

    const formdata = new FormData();
    formdata.append('file', files);
    formdata.append('userName', userName);
    // formdata.append('mail', mail);
    axios({
      method: 'post',
      url: '/api/uploadTape/gentPhotoPath',
      data: formdata,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 100000,
      // ...//其他相关配置
    }).then((res) => {
      if (res && res.data.status === 200) {
        setSendMessage(false);
        const history = createHashHistory();
        history.push(`/certificate?fileName=${res.data.data}`)
        // window.open(`${window.location.origin}/certificate?fileName=${res.data.data}`,'_self');        
      } else {
        message.warning(res.data.msg);
      };
    });
  }


  return (
    <div className="record">
      <RightSide />
      <div className="content">
        <TopCommon returnTo='./list' />
        <img className='phone' src={Phone} alt='' />
        <span className='angle'></span>

        {/* 开始录音 */}
        <div className='recording' style={{ display: !recordingStatus ? "block" : 'none' }} >
          <img onClick={recorderStart} className='playIcon' src={playIcon} alt='' />
          <div className='playText'>
            开始录音
            </div>
        </div>

        {/* 录音过程 */}
        <div className='recording' style={{ display: recordingStatus === 'record' ? "block" : 'none' }} >
          <div className='timer'>
            <div className='num'>
              {(recordingInfo.duration && recordingInfo.duration.toFixed(3)) || 0}
            </div>
            <div className='nameTitle'>
              录音时长(秒)
            </div>
          </div>
          <div>
            <div className='recordingCanvas'>
              <canvas width="300" height="150" id="canvasRecording"></canvas>
            </div>
          </div>
          <div className='optionButton'>
            <span className='destroyRecord'>
              <img onClick={destroyRecorder} className='destroyIcon' src={destroyIcon} alt='' />
              <span className='destroyText'>放弃录音</span>
            </span>
            <span className='paseRecord'>
              <img onClick={recordStatusOption} className='paseIcon' src={!recordPaseStatus ? paseIcon : playIcon} alt='' />
              <span className='paseText'>{`${!recordPaseStatus ? '暂停' : '继续'}录音`}</span>
            </span>
            <span className='endRecord'>
              <img onClick={recorderStop} className='endIcon' src={endIcon} alt='' />
              <span className='endText'>完成录音</span>
            </span>
          </div>
        </div>



        {/* 播放过程 */}
        <div className='recording' style={{ display: recordingStatus === 'end' ? "block" : 'none' }} >
          <div className='timer'>
            <div className='num'>
            {(recordingInfo.duration && recordingInfo.duration.toFixed(3)) || 0}
            </div>
            <div className='nameTitle'>
              录音时长(秒)
            </div>
          </div>
          <div>
            <div className='recordingCanvas'>
              <canvas width="300" height="150" id="canvasPlay"></canvas>
            </div>
          </div>
          <div className='optionButton'>
            <span className='destroyRecord'>
              <img onClick={destroyRecorder} className='destroyIcon' src={destroyIcon} alt='' />
              <span className='destroyText'>放弃音频</span>
            </span>
            <span className='paseRecord'>
              {playingStatus === 'play' ? null: <Fragment>
              <img onClick={recorderPlay} className='paseIcon' src={playIcon} alt='' />
              <span className='paseText'>播放音频</span>
            </Fragment>
              }
              {
                playingStatus === 'play' ? <Fragment>
                  <img onClick={playStatusOption} className='paseIcon' src={!playPase ? paseIcon: playIcon} alt='' />
                  <span className='paseText'>{`${playPase ? '继续' : '暂停'}音频`}</span>
              </Fragment> : null
              }
            </span>
            <span className='endRecord'>
              <img onClick={() => setSendMessage(true)} className='endIcon' src={certificateIcon} alt='' />
              <span className='endText'>生成证书</span>
            </span>
          </div>
        </div>
      </div>
      <Modal
          centered
          destroyOnClose
          className='recordingModal'
          title=""
          visible={sendMessage}
          footer={<div style={{ width: '100%', textAlign: 'center' }}>
            <div className='textTips'>
              请填写你的姓名，我们现在将生成你的专属学习证书
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={sendClick} className='clickSureButton'>确认上传 </button>
            </div>
          </div>}
          
          onCancel={() => setSendMessage(false)}
        >
          <input className='inputContent' onChange={e=> setUserName(e.target.value)} placeholder="点击输入您的姓名" type='text' />
        </Modal>
    </div>
  );
}

export default List;

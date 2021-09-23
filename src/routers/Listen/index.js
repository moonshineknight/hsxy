import React, { useEffect } from 'react';
import './index.scss';
import moment from 'moment';
import axios from 'axios';
// import  VConsole  from  'vconsole';
import { GetQueryString } from '../../utils';
import certificate from '../../assets/certificate/手机证书.jpeg';
import icon from '../../assets/common/suolvtu.jpg';
// const vConsole = new VConsole();

function Index() {
  const fileName = GetQueryString('fileName');
  const name = fileName.split('_name')[0].split('_')[1];

  useEffect(() => {
    const getConfigData = () => {
      const signUrl = encodeURIComponent(`${window.location.href.split('#')[0]}`);
      let url = `/api/wechat/config`;
      const formdata = new FormData();
      formdata.append('signUrl', signUrl);
      axios({
        method: 'post',
        url,
        data: formdata,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000,
      }).then((result) => {
        if (result && result.status === 200) {
          window.wx.config({
            debug: false,//这里一般在测试阶段先用ture，等打包给后台的时候就改回false,
            appId: result.data.appid,
            timestamp: result.data.timestamp,
            nonceStr: result.data.nonceStr,
            signature: result.data.signature,
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
          })

          window.wx.error(function (res) {
            console.log('signUrl', signUrl, 'wxError')
            console.log('res', res, 'wxError')
            console.log('result.data', result.data, 'wxError')
            console.log('window.location.href',window.location.href);

            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });

          window.wx.ready(function () {
            console.log('ready1');
            window.wx.updateAppMessageShareData({
              title: '江宁路街道情景党课学习证书', // 分享标题
              imgUrl: `https://huanshengxiyu.com/suolvtu.jpg`, // 分享图标
              desc: '我已经完成了欢声习语的学习，来听听我的学习感言吧。',
              link: window.location.href,
              success: function () {
                console.log('updateAppMessageShareData',window.location.href);
              },
            });

            window.wx.updateTimelineShareData({
              title: '江宁路街道情景党课学习证书', // 分享标题
              imgUrl: `https://huanshengxiyu.com/suolvtu.jpg`, // 分享图标
              desc: '我已经完成了欢声习语的学习，来听听我的学习感言吧。',
              link: window.location.href,
              success: function () {
                console.log('updateTimelineShareData',window.location.href);
                
              },
            });
          });
        };
      });
    };
    getConfigData();
  }, []);

  useEffect(() => {
    //判断横屏竖屏
    const detectOrient = () => {
      var width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight;
      if (width <= height) {//竖屏   
        if (320 > width) {
          width = 320;
        }
        if (width > 750) {
          width = 750;
        }
        document.getElementsByTagName("html")[0].style.fontSize = width / 7.5 + "px";
        return false;
      } else {//横屏     
        if (height > width) {
          height = 320;
        }
        if (height > 750) {
          height = 750;
        }
        document.getElementsByTagName("html")[0].style.fontSize = height / 7.5 + "px";
        return false;
      }
    }
    detectOrient();
    window.onresize = () => {
      detectOrient();
    };

    return () => {
      window.onresize = null;
    }

  }, [])

  return (
    <div className="listen">
      <img className='certificate' src={certificate} alt='' />
      <div className='studyText'>{`${name}同志已完成《做人民的孺子牛》情景党课学习，聆听了习近平新时代中国特色社会主义思想并发表了学习感言，祝贺你！`}
      </div>
      <div className='studyCompany'>静安区江宁路街道党工委
      </div>
      <div className='studyDate'>{moment().format('YYYY年MM月DD日')}
      </div>
      <div className='audioContainer' >
        <audio className='mobilAudio' src={`/api/file/getUserTapeFile?fileName=${fileName}`} autoplay="autoplay" controls="controls" ></audio>
      </div>
    </div>
  );
}

export default Index;

import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import './index.css';


function Index() {
  const [detailData, setDetailData] = useState(null);
  const [menuData, setMenuData] = useState([]);
  useEffect(() => {
    getMenuData();
  }, []);

  const getMenuData =() =>{
    axios({
      method: 'get',
      url: '/api/content/queryContentPage',
      data: {
        pageNo:1,
        pageSize:1000,
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 100000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        const data  = res.data.data.list;
        setMenuData(data.map((item) => {
          const {title,id,acc,content} = item;
          return {
            title,
            id,
            acc,
            content
          };
        }));
      } else {
        message.error(res && res.data.msg);
      }
    });
  }

  const playListen = (id) => {
    const current = menuData.find(item => item.id === id * 1)
    setDetailData(current);
  }


 

  return (
    <div className='container'>

      <div className='menu'>
        {
          menuData.map((menu, index) => {
            let styleName = 'listElement';
            if(detailData && menu.id ===detailData.id ){
              styleName = 'selectElement'
            }
            return (
              <div title={menu.title} key={index} className={styleName} onClick={()=> playListen(menu.id)}>
                {menu.title}
              </div>
            )
          })
        }
      </div>
      {
        detailData ? <div className='detail' >
        <h2 style={{color:"yellow"}}>{detailData.title}</h2>
        <p className='text'>{detailData.content}</p>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <audio className='audio' src={`/api/file/getContentFile?fileName=${detailData.acc}`} autoplay="autoplay" controls="controls" ></audio>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button className='detail_record'>
          <Link style={{color:'red',textDecoration:'none'}} to="/recording">我有体会，要录音</Link>
        </button>
        </div>
      </div>:<div className='tips' >请点击左侧目录 开始您的学习旅程</div>
      }
      <div style={{ position:'fixed', top: '20px', textAlign: "left" }}>
        <button className='recording_button' style={{backgroundColor:"rgb(243, 231, 216)"}}>
          <Link style={{ color: 'red', textDecoration: 'none' }} to="/index">返回</Link>
        </button>
      </div>
      <div style={{ width:'100%',pointerEvents:'none', position:'fixed', top: '20px', textAlign: "center",fontSize:'48px',color:'yellow' }}>
       欢声习语
      </div>
    </div>
  );
}

export default Index;

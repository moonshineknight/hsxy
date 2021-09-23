import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import axios from 'axios';
import RightSide from '../../components/rightSide';
import TopCommon from '../../components/topCommon';
import { GetQueryString } from '../../utils'
import icon from '../../assets/list/声音图标.png';
import './index.scss';

function List() {
  const [chapterList, setChapterList] = useState([]);
  const content = GetQueryString('content');
  const [modalVisible, setModalVisible] = useState(false);
  const [recordInfo, setRecordInfo] = useState({});
  const getChapterList = () => {

    const parentId = GetQueryString('parentId');
    axios({
      method: 'get',
      url: `/api/content/queryContentPage?pageNo=1&pageSize=100&parentId=${parentId}`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        setChapterList(res.data.data.list);
      } else {
        message.error(res && res.data.msg);
      }
    });
  }

  const listenRecord = (chapter) => {
    setModalVisible(true);
    setRecordInfo(chapter);
  }




  useEffect(() => {
    getChapterList();
  }, []);

  return (
    <div className="list">
      <RightSide />
      <div className="content">
        <TopCommon returnTo='/list' />
        <div className='cardTitle'>
          <span className='label'>{content}</span>
          <div className='chapterNum'>
            {`共${GetQueryString('childCount') || 0}节`}
            {/* <span className='text'>{`共${chapterList.length}节`}</span> */}
          </div>
        </div>
        <div className='cardList' >
          {
            chapterList.map((chapter) => {
              return <div key={chapter.id} className='chapter'>
                <div className='chapterText'>
                  <img className='icon' src={icon} alt='' />
                  <span className='chapterTitle' onClick={() => listenRecord(chapter)}>
                    {chapter.title}
                  </span>
                </div>
              </div>
            })
          }
        </div>
        <Modal
          centered
          destroyOnClose
          width='62.5%'
          title=""
          className='listModal'
          bodyStyle={{ maxHeight: '40%', padding: '60px 40px 20px' }}
          visible={modalVisible}
          footer={<div style={{ width: '100%', textAlign: 'center' }}>
            <audio className='audio' src={`/api/file/getContentFile?fileName=${recordInfo.acc}`} autoplay="autoplay" controls="controls" ></audio>
            <div style={{ textAlign: 'center' }}>
              <Link className='recordButton' to="/recording">我有体会，要录音</Link>
            </div>
          </div>}
          onCancel={() => setModalVisible(false)}
        >
          <div className='modalContent'>
            {/* <img className='imagebck' src={backText} alt='' /> */}
            <h4 className='titleChepter'>{recordInfo.title}</h4>
            <p className='contentChepter'>
              {recordInfo.content}
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default List;

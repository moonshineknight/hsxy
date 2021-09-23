import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import RightSide from '../../components/rightSide';
import TopCommon from '../../components/topCommon';
// import chapter from '../../assets/list/章节.png';
import scanList from '../../assets/list/查看列表.png';

import './index.scss';

function List() {

  const [contentList, setContentList] = useState([]);
  const [page, setPage] = useState(1);

  const getContentList = () => {
    axios({
      method: 'get',
      url: `/api/content/queryContentPage`,
      data: {
        pageNo:1,
        pageSize:100,
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.status === 200) {

        setContentList(res.data.data.list);
      } else {
        message.error(res && res.data.msg);
      }
    });
  }


  useEffect(() => {
    getContentList();
  }, []);

  let contentView = [];

  if (contentList.length) {
    contentView = contentList.slice((page - 1) * 10, page * 10)
  }

  return (
    <div className="list">
      <RightSide />
      <div className="content">
        <TopCommon returnTo='./index' />
        <div className='titleList'>
          {
            contentView.map((content) => {
              return (<div className='card' key={content.id}>
                <span className='label'>{content.title}</span>
                <div className='chapterNum'>
                {`共${content.childCount}节`}
                  {/* <span className='text'>{`共${content.childCount}节`}</span> */}
                </div>
                <Link to={`/chapterList?parentId=${content.id}&content=${content.title}&childCount=${content.childCount}`}><img  className='scanList' src={scanList} alt='' /></Link>
              </div>

              );
            })
          }
        </div>
        <div className='pageChange'>
          <button className={page === 1 ? 'notCurrent' :'current'} onClick={() => setPage(1)}> 上一页 </button>
          <button className={page === 2 ? 'notCurrent' :'current'} onClick={() => setPage(2)}> 下一页 </button>
        </div>
      </div>
    </div>
  );
}

export default List;

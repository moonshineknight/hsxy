import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Button, Modal, Input, Upload, message, Select } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './index.css';
import TextArea from 'antd/lib/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

function Index() {
  const [tableData, setTableData] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [contentList, setContentList] = useState(false);
  const [content, setContent] = useState('');
  const [modalContent, setModalContent] = useState({});
  const [fileList, setFileList] = useState([]);

  const getTableData = (parentId) => {
    let url = `/api/content/queryContentPage?pageNo=1&pageSize=100`;
    if (parentId) {
      url = url + '&parentId=' + parentId
    };
    axios({
      method: 'get',
      url,
      // data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (parentId) {
        if (res && res.data.status === 200) {
          const childrenList = res.data.data.list;
          const list = [];
          tableData.forEach((item) => {
            if (item.id === parentId) {
              item.childrenList = childrenList
            };
            list.push(item);
          })
          setTableData(list);
        } else {
          message.error(res && res.data.msg);
        }
      } else {
        if (res && res.data.status === 200) {

          setTableData(res.data.data.list);
        } else {
          message.error(res && res.data.msg);
        }
      }
    });
  }

  useEffect(() => {
    getTableData();
    getContentList();
  }, []);


  const getContentList = () => {
    axios({
      method: 'get',
      url: `/api/content/getParentContentPullDown`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        setContentList(res.data.data);
      } else {
        message.error(res && res.data.msg);
      }
    });
  }

  const deleteContent = (id, parentId) => {
    axios({
      method: 'get',
      url: '/api/content/deleteContent',
      params: {
        id,
      },
      // ...//其他相关配置
    }).then((res) => {
      if (res && res.data.status === 200) {
        message.success('删除成功');
        if (parentId) {
          getTableData(parentId);
        } else {
          getTableData();
        }
      }
    });

  }

  const updateContent = (record, parentId) => {
    const { title, content, id } = record;
    setEditVisible(true);
    const data = {
      title,
      content,
      id,
    }
    if (parentId) {
      data.parentId = parentId;
      setContent(parentId);
    }
    setModalContent(data);
  }



  const addContent = (record) => {
    getContentList();
    setEditVisible(true);
    if(record){
      setContent(record.id);
      setModalContent({parentId:record.id});
    }else{
      setModalContent({});
    }
    
  }

  const confirm = async () => {
    if ((!modalContent.title && !modalContent.id)&& modalContent.parentId) {
      message.warning('请填写标题');
      return;
    }
    if ((!modalContent.content && !modalContent.id) && modalContent.parentId) {
      message.warning('请填写文本内容');
      return;
    }

    if ((!fileList.length && !modalContent.id) && modalContent.parentId ) {
      message.warning('选择文件');
      return;
    }
    
    const formdata = new FormData();
    formdata.append('title', modalContent.title);
    formdata.append('content', modalContent.content);
    if (modalContent.parentId) {
      formdata.append('parentId', modalContent.parentId);
    }
    if (fileList.length) {
      formdata.append('file', fileList[0]);
    }

    if (modalContent.id) {
      formdata.append('id', modalContent.id);
    }
    let url = '/api/content/addContent';
    if (modalContent.id) {
      url = '/api/content/updateContent';
    }
    await axios({
      method: 'post',
      url,
      data: formdata,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000,
    }).then((res) => {
      if (res && res.data.status === 200) {
        if (modalContent.id) {
          message.success('修改成功');
        } else {
          message.success('添加成功');
        }

        if(modalContent.parentId){
          getTableData(modalContent.parentId);
          }else{
            getTableData()
          }

        setModalContent({});
        setEditVisible(false);
        setFileList([]);
        setContent('');
        
        
      } else {
        message.error(res && res.data.msg);
      }
    });
  }

  const onCancel = () => {
    setEditVisible(false);
    setModalContent({});
    setContent('');
  }

  const props = {
    onRemove: file => {
      setFileList(() => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: file => {
      setFileList(() => [...fileList, file]);
      return false;
    },
    fileList,
  };

  const updateModalContent = (key, value) => {
    setModalContent({
      ...modalContent,
      [key]: value,
    })
  }

  const expandedRowRender = (data) => {
    const sunColumn = [
      {
        title: '章节名称',
        dataIndex: 'title',
        key: 'title'
      },

      {
        title: '内容',
        dataIndex: 'content',   //在数据中对应的属性
        key: 'content',
        width: 600,
      },
      {
        title: '操作',
        dataIndex: 'id',   //在数据中对应的属性
        key: 'id',   //key
        render: (text, record) => (
          <span>
            <Button type='primary' onClick={() => updateContent(record, data.id)}> 修改</Button> &nbsp;&nbsp;
            <Button type='primary' onClick={() => deleteContent(record.id, data.id)}> 删除</Button>
          </span>
        ),
      },
    ];
    return <Table size='small' scroll={{ y: 400 }} rowKey='id' columns={sunColumn} dataSource={data.childrenList || []} pagination={false} />;
  }

  const onExpand = (expanded, record) => {
    getTableData(record.id);
  }

  const columns = [
    {
      title: '目录名称',        //菜单内容
      dataIndex: 'title',   //在数据中对应的属性
      key: 'title',   //key
      width: 300,
    },
    {
      title: '操作',
      dataIndex: 'id',   //在数据中对应的属性
      key: 'id',   //key
      render: (text, record) => (
        <span>
            <Button type='primary' onClick={() => addContent(record)}> 新增 </Button> &nbsp;&nbsp;
          <Button type='primary' onClick={() => updateContent(record)}> 修改</Button> &nbsp;&nbsp;
          <Button type='primary' onClick={() => deleteContent(record.id)}> 删除</Button>
        </span>
      ),
    },
  ];


  return (
    <div className="editPage" style={{ padding: '20px 30px' }}>
      <Row>
        <Col span={2} >
          <Button type='primary' onClick={() => addContent()}>
            新增
        </Button>
        </Col>
        <Col span={2}>
          <Button type='primary' >
            <Link style={{ textDecoration: 'none' }} to="/list">返回</Link>
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24} >
          <Table
            size='small'
            rowKey='id'
            pagination={false}
            expandable={{
              expandedRowRender: record => expandedRowRender(record),
              rowExpandable: () => true,
              onExpand: (expanded, record) => onExpand(expanded, record)
            }}
            dataSource={tableData}
            columns={columns} />
        </Col>
      </Row>
      <Modal
        width={600}
        title="编辑"
        visible={editVisible}
        onOk={confirm}
        onCancel={onCancel}
      >
        <div style={{ textAlign: "center" }}>

        {
        (modalContent.parentId) && <div style={{marginBottom:'10px'}}>
            <div style={{ display: 'inline-block', width: '80px' }}>目录:</div>
            <div style={{ display: 'inline-block', width: '420px', height: '25px' }}>
              <Select disabled={!!content} value={content} style={{ width: '100%' }} onChange={value => setContent(value)}>
                {
                  contentList.length && contentList.map((content) => {
                    return <Option key={content.value} value={content.value}>{content.label}</Option>
                  })
                }
              </Select>
            </div>
          </div>
          }

          <div>
            <div style={{ display: 'inline-block', width: '80px' }}>{content ? '章节':'目录' }:</div>
            <div style={{ display: 'inline-block', width: '420px', height: '25px' }}>
              <Input style={{ width: '100%', height: '100%' }} value={modalContent.title} onChange={(e) => { updateModalContent('title', e.target.value) }} />
            </div>
          </div>

          

          {
            (modalContent.parentId) && <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'inline-block', width: '80px' }}>内容:</div>
              <div style={{ display: 'inline-block', width: '420px' }}>
                <TextArea autoSize={{ minRows: 10, maxRows: 18 }}
                  style={{ width: '100%', height: '100%' }}
                  value={modalContent.content}
                  onChange={(e) => { updateModalContent('content', e.target.value) }} />
              </div>
            </div>
          }

          {
            (modalContent.parentId) && <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'inline-block', width: '80px' }}>文件:</div>
              <div style={{ display: 'inline-block', width: '420px' }}>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </div>
            </div>
          }

        </div>
      </Modal>
    </div>
  );
}

export default Index;


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
// import  VConsole  from  'vconsole';

// import wx from 'weixin-jsapi';

import './index.css';
import * as serviceWorker from './serviceWorker';

import Index from './routers/Index';
import List from './routers/List';
import ChapterList from './routers/ChapterList';
import Listen from './routers/Listen';
// import Detail from './routers/Detail';
import Recording from './routers/Recording';
import EditPage from './routers/EditPage';
import Certificate from './routers/Certificate';
import icon from './assets/common/suolvtu.jpg';

class Hello extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/index" component={Index} />
        <Route exact path="/list" component={List} />
        <Route exact path="/listen" component={Listen} />
        {/* <Route exact path="/detail" component={Detail} /> */}
        <Route exact path="/recording" component={Recording} />
        <Route exact path="/editPage" component={EditPage} />
        <Route exact path="/chapterList" component={ChapterList} />
        <Route exact path="/certificate" component={Certificate} />
        <Route exact path="/" component={Index} />
      </Router>
    )
  }
}

ReactDOM.render(
  <Hello />,
  document.getElementById('root')
)

serviceWorker.unregister();

// EditorTabBar.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import PerfectScrollbar from 'react-perfect-scrollbar';

// ============================================
// import react components
import EditorTabBarItem from './EditorTabBarItem.jsx';

// ============================================
// import react redux-action
import {swapTab} from '../states/mainState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/EditorTabBar.css';

// ============================================
// constants

// ============================================
// react components
class EditorTabBar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    show: PropTypes.bool,
    showToolBar: PropTypes.bool,
    editorArr: PropTypes.any,
    tabArr: PropTypes.any,
    newEditor: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleNewEditor = this.handleNewEditor.bind(this);
    this.setDrag = this.setDrag.bind(this);
    this.setDrop = this.setDrop.bind(this);

    this.state = {
      dragId: null,
    };
  }

  render() {
    let top = 0;
    if (this.props.showToolBar) top += 40;
    let tabs = [];

    // reorder tabs
    for (let i in this.props.tabArr) {
      let id = this.props.tabArr[i];
      tabs.push(<EditorTabBarItem setDrag={this.setDrag} setDrop={this.setDrop} id={id} key={id}/>)
    }

    return (
      this.props.show ? (
        <div id='EditorTabBar-frame' className='noselect' style={{top: top}}>
          <div className='ETB-xanchor-outer'>
            <div className='ETB-xanchor-inner'>
              <PerfectScrollbar>
                <div className='ETB-begin'>&nbsp;</div>
                {tabs}
                <div className='ETB-end'>&nbsp;</div>
                <div className='ETB-new' onClick={this.handleNewEditor}>
                  <div className='ETB-new-middle'>
                    <div className='ETB-new-inner'>
                      <i className="fas fa-plus"></i>
                    </div>
                  </div>
                </div>
              </PerfectScrollbar>
              <div className='ETB-bg'></div>
            </div>
          </div>
        </div>
      ) : <div></div>
    );
  }

  handleNewEditor() {
    this.props.newEditor();
  }

  setDrag(id) {
    this.setState({
      dragId: id
    });
  }

  setDrop(id) {
    this.setState({
      dragId: null,
    });
    this.props.dispatch(swapTab(id, this.state.dragId));
  }
}

export default connect (state => ({
  show: state.main.showTabBar,
  showToolBar: state.main.showToolBar,
  editorArr: state.main.editorArr,
  tabArr: state.main.tabArr,
}))(EditorTabBar);

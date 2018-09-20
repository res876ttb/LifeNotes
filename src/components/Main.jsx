// Main.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import SideBar from './SideBar.jsx';
import Editor from './Editor.jsx';

import EditorCore from './EditorCore.jsx';

// ============================================
// import react redux-action
import {setSideBarWidth} from '../states/mainState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/Main.css';
import '../styles/Global.css';

// ============================================
// constants

// ============================================
// react components
class Main extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.state = {
      mouseDown: false,
    };
  }

  render() {
    return (
      <div id='main' 
        onMouseUp={this.handleMouseUp} 
        onMouseMove={this.handleMouseMove}
        style={{cursor: this.state.mouseDown ? 'col-resize' : 'auto'}}
      >
        <SideBar mouseDown={this.handleMouseDown}/>
        <Editor showTabBar={true} showToolBar={true} />
        {/* <EditorCore showToolBar={false} showTabBar={false}/> */}
      </div>
    );
  }

  handleMouseDown() {
    console.log('Clicked');
    this.setState({
      mouseDown: true,
    });
  }

  handleMouseUp() {
    this.setState({
      mouseDown: false,
    });
  }

  handleMouseMove(e) {
    if (this.state.mouseDown) {
      let maxW = window.innerWidth - 420;
      if (maxW > 500) maxW = 500;
      if (maxW > window.innerWidth / 2) maxW = window.innerWidth / 2;

      if (e.pageX >= 180 && e.pageX < maxW) {
        this.props.dispatch(setSideBarWidth(e.pageX));
      } else if (e.pageX > maxW) {
        this.props.dispatch(setSideBarWidth(maxW));
      } else {
        this.props.dispatch(setSideBarWidth(180));
      }
    }
  }
}

export default connect (state => ({

}))(Main);

// Editor.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import EditorToolBar from './EditorToolBar.jsx';
import EditorTabBar from './EditorTabBar.jsx';
import EditorCore from './EditorCore.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/Editor.css';

// ============================================
// constants

// ============================================
// react components
class Editor extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    sideBarWidth: PropTypes.number,
    showToolBar: PropTypes.bool,
    showTabBar: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div id='Editor-frame' style={{left: `${this.props.sideBarWidth}px`, height: '100%'}}>
        <EditorToolBar show={this.props.showToolBar} />
        <EditorTabBar show={this.props.showTabBar} />
        <EditorCore showToolBar={this.props.showToolBar} showTabBar={this.props.showTabBar} />
      </div>
    );
  }
}

export default connect (state => ({
  sideBarWidth: state.main.sideBarWidth,
}))(Editor);

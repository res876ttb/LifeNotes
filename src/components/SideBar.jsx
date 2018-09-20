// SideBar.jsx
//  

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/SideBar.css';

// ============================================
// constants

// ============================================
// react components
class SideBar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    width: PropTypes.number,
    mouseDown: PropTypes.func,
  }

  constructor(props) {
    super(props);

    // this.handleMouseDown = this.handleMouseDown.bind(this);
    // this.handleMouseUp = this.handleMouseUp.bind(this);
    // this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);

    this.state = {

    };
  }

  render() {
    return (
      <div id='SB-frame' style={{width: `${this.props.width}px`}} >
        SideBar
        <div id='SB-resizer' 
          onMouseDown={this.handleMouseDown}
          style={{left: `${this.props.width - 4}px`}}
        ></div>
      </div>
    );
  }

  handleMouseDown(e) {
    this.props.mouseDown();
    e.preventDefault();
    e.stopPropagation();
  }
}

export default connect (state => ({
  width: state.main.sideBarWidth,
}))(SideBar);

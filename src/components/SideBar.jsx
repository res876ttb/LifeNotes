// SideBar.jsx
//  

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import SideBarFolder from './SideBarFolder.jsx';
import SideBarFile from './SideBarFile.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis
import {getNewID} from '../utils/id.js';

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
    noteIndex: PropTypes.object,
    tagIndex: PropTypes.object,
  }

  constructor(props) {
    super(props);

    // this.handleMouseDown = this.handleMouseDown.bind(this);
    // this.handleMouseUp = this.handleMouseUp.bind(this);
    // this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.folderToggler = this.folderToggler.bind(this);

    this.state = {
      expendedDir: ['//'],
      showall: false,
    };
  }

  componentDidUpdate() {
    // console.log(this.props.noteIndex);
    // console.log(this.state.expendedDir);
  }

  render() {
    let fileList = <div></div>
    if (this.props.noteIndex != null) {
      fileList = this.getTreeComponents(this.props.noteIndex, 0);
    }

    return (
      <div id='SB-frame' style={{
        width: `${this.props.width}px`,
        overflow: 'scroll',
        whiteSpace:'nowrap',
      }}>
        {fileList}
        <div id='SB-resizer'
          onMouseDown={this.handleMouseDown}
          style={{left: `${this.props.width - 4}px`}}
        ></div>
      </div>
    );
  }

  folderToggler(folderName) {
    // console.log(`Toggle ${folderName}`);
    if (this.state.expendedDir.indexOf(folderName) == -1) {
      this.setState({
        expendedDir: [...this.state.expendedDir, folderName]
      });
    } else {
      let tmp = [...this.state.expendedDir];
      tmp.splice(this.state.expendedDir.indexOf(folderName), 1);
      this.setState({
        expendedDir: tmp
      });
    }
  }

  getTreeComponents(directory, level) {
    if ((this.state.expendedDir.indexOf(directory.ppath + directory.name) == -1 && this.state.showall == false) || directory == null) {
      return (<div></div>);
    }
    let dirList = [];
    let noteList = [];
    for (let d in directory.directories) {
      dirList.push(
        <SideBarFolder 
          directory={directory.directories[d]} 
          level={level} 
          child={this.getTreeComponents(directory.directories[d], level + 1)}
          toggler={this.folderToggler}
          expendedDir={this.state.expendedDir}
          key={getNewID()}
        />
      );
    }
    for (let n in directory.notes) {
      noteList.push(
        <SideBarFile 
          note={directory.notes[n]}
          key={getNewID()}
        />
      );
    }
    if (level === 0) {
      return (
        <div>
          {dirList}
          {noteList}
        </div>
      )
    } else {
      return (
        <div style={{paddingLeft: '20px'}}>
          {dirList}
          {noteList}
        </div>
      )
    }
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

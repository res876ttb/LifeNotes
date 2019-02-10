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

// ============================================
// import react redux-action
import {
  setSideBarWidth,
  updateNoteIndex,
  setDispatcher,
} from '../states/mainState.js';

// ============================================
// import apis
import {
  initDB, 
  cleanDB, 
  runTest, 
  newNote,
} from '../utils/storage.js';
import { 
  printc 
} from '../utils/output';
import { 
  runGoogleDriveAPITest 
} from '../utils/googleDrive';

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
    noteIndex: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.state = {
      mouseDown: false,
      noteIndex: null,
      tagIndex: null
    };
  }

  componentWillMount() {
    this.props.dispatch(setDispatcher(this.props.dispatch));
    if (0) {
      initDB((noteIndex, tagIndex) => {
        cleanDB(() => {
          initDB((noteIndex, tagIndex) => {
            this.props.dispatch(updateNoteIndex(noteIndex));
          });
        });
      });
    } else {
      initDB((noteIndex, tagIndex) => {
        this.props.dispatch(updateNoteIndex(noteIndex));
        console.log(noteIndex);
      });
    }
  }

  componentDidMount() {
    runGoogleDriveAPITest(() => {
      console.log('API testing done.');
    });
  }

  render() {
    // console.log(this.props.noteIndex);
    return (
      <div id='main' 
        onMouseUp={this.handleMouseUp} 
        onMouseMove={this.handleMouseMove}
        style={{cursor: this.state.mouseDown ? 'col-resize' : 'auto'}}
      >
        <SideBar mouseDown={this.handleMouseDown} noteIndex={this.props.noteIndex} tagIndex={this.state.tagIndex}/>
        <Editor showTabBar={true} showToolBar={true} />
        {/* <EditorCore showToolBar={false} showTabBar={false}/> */}
      </div>
    );
  }

  handleMouseDown() {
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
      
      let x = e.pageX - 6;
      if (x >= 180 && x < maxW) {
        this.props.dispatch(setSideBarWidth(x));
      } else if (x > maxW) {
        this.props.dispatch(setSideBarWidth(maxW));
      } else {
        this.props.dispatch(setSideBarWidth(180));
      }
    }
  }
}

export default connect (state => ({
  noteIndex: state.main.noteIndex
}))(Main);

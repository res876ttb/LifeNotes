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
            // this.setState({
            //   noteIndex: noteIndex,
            //   tagIndex: tagIndex
            // });
            this.props.dispatch(updateNoteIndex(noteIndex));
            runTest(noteIndex, tagIndex, (newNoteIndex) => {
              // this.setState({
              //   noteIndex: {...newNoteIndex}
              // });
              this.props.dispatch(updateNoteIndex(newNoteIndex));
              console.log(newNoteIndex);
            });
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
  noteIndex: state.main.noteIndex
}))(Main);

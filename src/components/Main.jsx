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
  setDispatcher,
  initIndex,
  updateSignedInStatus,
  updateUserProfile,
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
  initGDAPI,
  runGoogleDriveAPITest,
  getGoogleUserProfile,
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
      initDB(() => {
        cleanDB(() => {
          initDB((noteIndex, tagIndex, directoryIndex, tagTrie) => {
            this.props.dispatch(initIndex(directoryIndex, noteIndex, tagIndex, tagTrie));
          });
        });
      });
    } else {
      initDB((noteIndex, tagIndex, directoryIndex, tagTrie) => {
        this.props.dispatch(initIndex(directoryIndex, noteIndex, tagIndex, tagTrie));
      });
    }
  }

  componentDidMount() {
    initGDAPI(isSignedIn => {
      this.props.dispatch(updateSignedInStatus(isSignedIn));
      if (isSignedIn) {
        getGoogleUserProfile((userName, userImageUrl) => {
          this.props.dispatch(updateUserProfile(userName, userImageUrl));
        });
      }
    }, 'secret key 123', () => {
      runGoogleDriveAPITest(() => {
        console.log('API testing done.');
      });
    })
  }

  render() {
    // console.log(this.props.noteIndex);
    return (
      <div id='main' 
        onMouseUp={this.handleMouseUp} 
        onMouseMove={this.handleMouseMove}
        style={{cursor: this.state.mouseDown ? 'col-resize' : 'auto'}}
      >
        <SideBar mouseDown={this.handleMouseDown} />
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

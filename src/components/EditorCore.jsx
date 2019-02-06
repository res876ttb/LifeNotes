// EditorCore.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components

// ============================================
// import react redux-action
// import {setActiveEditor} from '../states/mainState.js';
import { 
  setTitle,
  updateNoteIndex,
} from '../states/mainState';

// ============================================
// import apis
import { 
  updateTitle,
} from '../utils/storage.js';

// ============================================
// import css file
import '../styles/EditorCore.css';
import '../styles/hyperMD.css';

// ============================================
// constants

// ============================================
// react components
class EditorCore extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    showTabBar: PropTypes.bool,
    showToolBar: PropTypes.bool,
    editor: PropTypes.any,
    id: PropTypes.string,
    initValue: PropTypes.string,
    activeEditorId: PropTypes.string,
    titleArr: PropTypes.any,
    updateNoteArr: PropTypes.func,
    saveNote: PropTypes.func,
    ppath: PropTypes.string,
    noteIndex: PropTypes.object,
    changeNoteSignal: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateTitle = this.updateTitle.bind(this);

    this.state = {
      mac: false,       // if current os is macOS
      editor: null,
    };
  }

  componentDidMount() {
    let myTextarea = document.getElementById('EditorCore-frame' + this.props.id);

    let editor = HyperMD.fromTextArea(myTextarea, {
      mode: {
        name: 'hypermd',
        hashtag: true,
      },
      hmdFold: {
        image: true,
        link:  true,
        math:  true,
        html:  true, // maybe dangerous
        emoji: true,
        code:  true,
      },
      hmdFoldCode: {
        flowchart: true,
        mermaid: true,
      },
      tabSize: 2,
    });
    editor.setSize(null, "100%");
    editor.setValue(this.props.initValue);
    
    this.setState({
      // detect os version
      mac: (navigator.appVersion.match(/Mac|mac/) !== null) ? true : false,
      // set hypermd
      editor: editor
    });

    this.props.updateNoteArr(this.props.id, {modified: false, editor: editor});

    setInterval(() => {
      if (this.state.editor.hasFocus()) {
        if (this.props.id === this.props.activeEditorId) {
          this.updateTitle();
        } 
      }  
    }, 1000);

    setTimeout(() => {
      this.updateTitle();
    }, 1);
  }

  componentWillUnmount() {
    this.props.saveNote(this.props.id);
  }

  render() {
    let top = 0;
    if (this.props.showTabBar) top += 40;
    if (this.props.showToolBar) top += 40;
    return (
      <div className='EditorCore-frame' style={{
        top: `${top}px`,
        zIndex: this.props.id === this.props.activeEditorId ? '1' : '0',
      }} onKeyDown={this.handleKeyDown} onClick={this.handleClick}>
        <div className='EditorCore-HMD-wrapper'>
          <textarea id={'EditorCore-frame' + this.props.id} onKeyDown={this.handleKeyDown}></textarea>
        </div>
      </div>
    );
  }

  updateTitle() {
    let title = this.state.editor.getLine(0);
    if (title.match(/^#{1,6}[\t\ ]+[\S\ \t]+/)) {
      title = title.replace(/^#{1,6}[\t\ ]+/, '');
      title = title.replace(/#+$/, '');
      title = title.replace(/[\ \t]+$/, '');
      if (this.props.titleArr[this.props.id] !== title) {
        this.props.dispatch(setTitle(this.props.id, title));
        updateTitle(title, this.props.ppath, this.props.id, this.props.noteIndex, newNoteIndex => {
          this.props.dispatch(updateNoteIndex(newNoteIndex));
        });
      }
    } else if (this.props.titleArr[this.props.id] !== 'Untitled') {
      this.props.dispatch(setTitle(this.props.id, 'Untitled'));
      updateTitle('Untitled', this.props.ppath, this.props.id, this.props.noteIndex, newNoteIndex => {
        this.props.dispatch(updateNoteIndex(newNoteIndex));
      });
    }
  }

  handleClick() {
    this.state.editor.focus();
  }

  handleKeyDown(e) {
    this.props.changeNoteSignal(this.props.id);
  }

/**
 * @func getMode
 * @desc Return mode for undo stack
 * @param key Event from input listener
 * @param sel Event from window.getSelection()
 */
  getMode(key, sel) {
    // when isCollapsed is false, then something is selected
    if (sel.isCollapsed === false) {
      switch (key) {
        case 'deleteContentBackward': case 'deleteContentForward': // backspace, delete
          return 'range delete';
        default:
          return 'replace';
      }
    } else {
      switch (key) {
        case 'deleteContentBackward': // backspace
          return 'back delete';
        case 'deleteContentForward': // delete
          return 'forward delete';
        default: 
          return 'insert';
      }
    }
  }
}

export default connect (state => ({
  showTabBar: state.main.showTabBar,
  showToolBar: state.main.showToolBar,
  activeEditorId: state.main.activeEditorId,
  titleArr: state.main.titleArr,
  noteIndex: state.main.noteIndex,
}))(EditorCore);

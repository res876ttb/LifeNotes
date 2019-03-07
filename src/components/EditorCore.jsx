// EditorCore.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import PerfectScrollbar from 'react-perfect-scrollbar';

// ============================================
// import react components

// ============================================
// import react redux-action
// import {setActiveEditor} from '../states/mainState.js';
import { 
  setTitle,
  updateNoteIndex,
  updateDirectoryIndex,
  updateTagIndex,
  updateTagTrie
} from '../states/mainState';

// ============================================
// import apis
import { 
  updateTitle,
  updateTags,
} from '../utils/storage.js';
import {
  init_math_preview
} from '../utils/mathPrevies.js';

// ============================================
// import css file
import '../styles/EditorCore.css';
import '../styles/hyperMD.css';

// ============================================
// constants
const HyperMD = require('hypermd');

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
    d: PropTypes.string,
    noteIndex: PropTypes.object,
    directoryIndex: PropTypes.object,
    changeNoteSignal: PropTypes.func,
    tagTrie: PropTypes.object,
    tagIndex: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.parseTags = this.parseTags.bind(this);

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
      tabSize: 2, // TODO: User configurable
    });
    editor.setSize(null, "100%");
    editor.setValue(this.props.initValue);

    init_math_preview(editor, this.props.id);

    // update title when user change content
    let updateTitle = HyperMD.debounce(() => {
      this.updateTitle();
    }, 500);
    editor.on('change', updateTitle);

    // parse tags when user change content
    let parseTags = HyperMD.debounce(() => {
      this.parseTags();
    }, 500);
    editor.on('change', parseTags);
    
    this.setState({
      // detect os version
      mac: (navigator.appVersion.match(/Mac|mac/) !== null) ? true : false,
      // set hypermd
      editor: editor
    });

    this.props.updateNoteArr(this.props.id, {modified: false, editor: editor});

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
        <PerfectScrollbar>
          <div className='EditorCore-HMD-wrapper'>
            <textarea id={'EditorCore-frame' + this.props.id} onKeyDown={this.handleKeyDown}></textarea>
          </div>
        </PerfectScrollbar>

        <div id={"math-preview-" + this.props.id} className="float-win float-win-hidden">
          <div className="float-win-title">
            <button className="float-win-close"><i className="fas fa-times"></i></button>
            Math Preview
          </div>
          <div className="float-win-content" id={"math-preview-content-" + this.props.id}></div>
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
        updateTitle(title, this.props.d, this.props.id, this.props.noteIndex, this.props.directoryIndex, (newNoteIndex, newDirectoryIndex) => {
          this.props.dispatch(updateNoteIndex(newNoteIndex));
          this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
        });
      }
    } else if (this.props.titleArr[this.props.id] !== 'Untitled') {
      this.props.dispatch(setTitle(this.props.id, 'Untitled'));
      updateTitle('Untitled', this.props.d, this.props.id, this.props.noteIndex, this.props.directoryIndex, (newNoteIndex, newDirectoryIndex) => {
        this.props.dispatch(updateNoteIndex(newNoteIndex));
        this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
      });
    }
  }

  parseTags() {
    if (this.state.editor.lineCount() < 2) return;

    let tagsLine = ' ' + this.state.editor.getLine(1);
    // regex with space
    let regWS = /\W(\#([\w\/]|\\.)([\w\s\/]|\\.)+([\w\/]|\\.)\b\#)/g;
    // regex without space
    let reg = /\W(\#([\w\/]|\\.)+\b)/g;

    // match hashtags with space
    let tagsWS = tagsLine.match(regWS);
    if (tagsWS === null) tagsWS = [];

    // remove match pattern
    for (let i in tagsWS) {
      tagsLine = tagsLine.replace(tagsWS[i], '');
    }

    // match hashtags without space
    let tags = tagsLine.match(reg);
    if (tags === null) tags = [];

    // concat tags
    tags = tags.concat(tagsWS);

    // remove unecessary characters
    for (let i in tags) {
      tags[i] = tags[i].slice(2);
      tags[i] = tags[i].replace(/\\#/g, '´');
      tags[i] = tags[i].replace(/#/g, '');
      tags[i] = tags[i].replace(/\\/g, '');
      tags[i] = tags[i].replace('´', '#');
    }

    // update tags
    tags.sort();
    updateTags(tags, this.props.id, this.props.noteIndex, this.props.tagIndex, this.props.tagTrie, (newNoteIndex, newTagIndex, newTagTrie) => {
      this.props.dispatch(updateNoteIndex(newNoteIndex));
      this.props.dispatch(updateTagIndex(newTagIndex));
      this.props.dispatch(updateTagTrie(newTagTrie));
    });
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
  directoryIndex: state.main.directoryIndex,
  tagIndex: state.main.tagIndex,
  tagTrie: state.main.tagTrie,
}))(EditorCore);

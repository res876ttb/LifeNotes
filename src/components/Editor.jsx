// Editor.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Hotkeys from 'react-hot-keys';

// ============================================
// import react components
import EditorToolBar from './EditorToolBar.jsx';
import EditorTabBar from './EditorTabBar.jsx';
import EditorCore from './EditorCore.jsx';

// ============================================
// import react redux-action
import {
  addEditor,
  setActiveEditor,
  updateNoteIndex,
  setNoteOpener,
} from '../states/mainState.js';

// ============================================
// import apis
import { 
  newNote,
  getNote,
  updateNote,
} from '../utils/storage.js';

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
    editorArr: PropTypes.any,
    noteIndex: PropTypes.object,
    tabArr: PropTypes.any,

    defaultNotePath: PropTypes.string,
    saveInterval: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.handleNewEditor = this.handleNewEditor.bind(this);
    this.handleSaveNotes = this.handleSaveNotes.bind(this);
    this.handleCyclicSave = this.handleCyclicSave.bind(this);
    this.catchSaveHotkey = this.catchSaveHotkey.bind(this);
    this.handleUpdateNoteArr = this.handleUpdateNoteArr.bind(this);
    this.handleChangeNoteSignal = this.handleChangeNoteSignal.bind(this);

    this.state = {
      mac: (navigator.appVersion.match(/Mac|mac/) !== null) ? true : false,
      noteArr: {} // id: {modified, editor}
    };
  }

  componentWillMount() {
    this.props.dispatch(setNoteOpener(this.handleNewEditor));
  }

  componentDidMount() {
    this.handleNewEditor();
    this.handleCyclicSave();
  }

  render() {
    let editorArrSize = Object.keys(this.props.editorArr).length;
    let editorArr = [];
    for (let i in this.props.editorArr) {
      editorArr.push(this.props.editorArr[i]);
    }
    return (
      <Hotkeys 
        keyName='command+s,ctrl+s'
        onKeyDown={this.catchSaveHotkey}
      >
        <div id='Editor-frame' style={{left: `${this.props.sideBarWidth}px`, height: '100%'}}>
          {editorArrSize === 0 ? (
            <div id='Editor-empty-outer'>
              <div id='Editor-empty-middle'>
                <div id='Editor-empty-inner'>
                  <div style={{paddingBottom: '10px'}}>No document is opened.</div>
                  <Button onClick={this.handleNewEditor} variant="outlined" color="primary">Create a new document</Button>
                </div>
              </div>
            </div>
          ) : editorArr}
          <EditorToolBar />
          <EditorTabBar newEditor={this.handleNewEditor} />
        </div>
      </Hotkeys>
    );
  }

  handleNewEditor(noteid, ppath) {
    if (this.props.noteIndex === null) return;
    if (typeof(noteid) === 'string') {
      console.log(`Open note ${noteid}`);
      getNote(noteid, note => {
        let newEditor = (
          <EditorCore 
            initValue={note.content} 
            id={noteid} key={noteid} 
            updateNoteArr={this.handleUpdateNoteArr} 
            saveNote={this.handleSaveNotes}
            ppath={ppath}
            changeNoteSignal={this.handleChangeNoteSignal}
          />
        );
        this.props.dispatch(addEditor(newEditor, noteid));
        this.props.dispatch(setActiveEditor(noteid));
      });
    } else {
      newNote(this.props.defaultNotePath, this.props.noteIndex, (newNoteIndex, noteHeader, note) => {
        this.props.dispatch(updateNoteIndex(newNoteIndex));
        let id = noteHeader._id;
        let newEditor = (
          <EditorCore 
            initValue={''} 
            id={id} key={id} 
            updateNoteArr={this.handleUpdateNoteArr} 
            saveNote={this.handleSaveNotes} 
            ppath={noteHeader.ppath}
            changeNoteSignal={this.handleChangeNoteSignal}
          />
        );
        this.props.dispatch(addEditor(newEditor, id));
        this.props.dispatch(setActiveEditor(id));
      });
    }
  }

  handleCyclicSave() {
    setTimeout(() => {
      this.handleCyclicSave();
      this.handleSaveNotes();
    }, this.props.saveInterval);
  }

  handleUpdateNoteArr(noteid, value) {
    let noteArr = {...this.state.noteArr};
    noteArr[noteid] = value;
    this.setState({
      noteArr: noteArr,
    });
  }

  handleSaveNotes() {
    let noteArr = {...this.state.noteArr};
    for (let i in this.props.tabArr) {
      let id = this.props.tabArr[i];
      if (noteArr[id].modified && noteArr[id].editor) {
        updateNote(id, noteArr[id].editor.getValue(), this.props.noteIndex, newNoteIndex => {
          this.props.dispatch(updateNoteIndex(newNoteIndex));
        });
      }
      noteArr[id].modified = false;
    }
    this.setState({
      noteArr: noteArr,
    });
  }

  handleChangeNoteSignal(id) {
    if (this.state.noteArr[id].modified === false) {
      let noteArr = {...this.state.noteArr};
      noteArr[id].modified = true;
      this.setState({
        noteArr: noteArr,
      });
    }
  }

  handleDeleteNoteFromArr(noteid) {
    let noteArr = {...this.state.noteArr};
    delete noteArr[noteid];
    this.setState({
      noteArr: noteArr,
    });
  }

  catchSaveHotkey(keyName, e, handle) {
    e.preventDefault();
    if ((this.state.mac && keyName === 'command+s') || (!this.state.mac && keyName === 'ctrl+s')) {
      console.log('Manually save notes');
      this.handleSaveNotes();
    }
  }
}

export default connect (state => ({
  sideBarWidth: state.main.sideBarWidth,
  showToolBar: state.main.showToolBar,
  showTabBar: state.main.showTabBar,
  editorArr: state.main.editorArr,
  noteIndex: state.main.noteIndex,
  tabArr: state.main.tabArr,

  defaultNotePath: state.setting.defaultNotePath,
  saveInterval: state.setting.saveInterval,
}))(Editor);

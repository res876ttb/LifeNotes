// SideBar.jsx
//  

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import PerfectScrollbar from 'react-perfect-scrollbar';

// ============================================
// import react components
import SideBarFolder from './SideBarFolder.jsx';
import SideBarFile from './SideBarFile.jsx';
import SideBarTag from './SideBarTag.jsx';

// ============================================
// import react redux-action
import {
  updateNoteIndex, 
  updateDirectoryIndex,
  updateTagIndex,
  updateTagTrie,
  initIndex,
} from '../states/mainState.js';

// ============================================
// import apis
import {
  getNewID
} from '../utils/id.js';
import {
  moveDirectory,
  moveNote,
  newNote,
  newDirectory,
  cleanDB, 
  initDB,
} from '../utils/storage.js';
import {
  splitOnce
} from '../utils/string.js';
import {
  signInWithGoogle,
  signOutGoogle,
  getGoogleUserProfile,
} from '../utils/googleDrive.js';

// ============================================
// import css file
import '../styles/SideBar.css';
import '../../vendor/react-perfect-scrollbar.min.css';
import { generateKeyPair } from 'crypto';

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
    directoryIndex: PropTypes.object,
    GDSignedIn: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.folderToggler = this.folderToggler.bind(this);

    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.handleNewFolder = this.handleNewFolder.bind(this);
    this.handleDialogContentChange = this.handleDialogContentChange.bind(this);
    this.handleDialogEnterKey = this.handleDialogEnterKey.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleResetDB = this.handleResetDB.bind(this);

    this.handleDrop = this.handleDrop.bind(this);

    this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this);
    this.handleSignOutGoogle = this.handleSignOutGoogle.bind(this);

    this.state = {
      expendedDir: ['0'],
      expendedTag: ['0'],
      showAllDir: false,
      showAllTag: false,

      anchorEl: null,
      anchorReference: 'anchorEl', // anchorEl, anchorPosition
      anchorPosition: {
        x: 0,
        y: 0,
      },
      menuOpen: false,
      unchangeable: true,

      dialogOpen: false,
      dialogTitle: 'Undefined',
      dialogDescription: 'Undefined',
      dialogConfirm: 'Confirm',
      dialogCancel: 'Cancel',
      dialogConfirmAction: null,
      dialogCancelAction: null,
      dialogLabel: 'Undefined',
      dialogContent: '',
      dialogShowDescription: true,
      dialogShowTextfield: true,
    };
  }

  componentDidUpdate() {
    // console.log(this.props.noteIndex);
    // console.log(this.state.expendedDir);
  }

  render() {
    let fileList = <div></div>;
    let tagList = <div></div>;
    if (this.props.directoryIndex) {
      fileList = this.getTreeComponentsFolder(this.props.directoryIndex['0'], 0);
    }
    if (this.props.tagIndex) {
      tagList = this.getTreeComponentsTag(this.props.tagIndex['0']);
    }

    return (
      <div 
        id='SB-frame' 
        style={{width: `${this.props.width}px`,}}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
        onContextMenu={this.handleRightClick}
      >
        <PerfectScrollbar>
          {fileList}
          <div style={{margin: '0px 10px', width: `${this.props.width - 20}px`, height: '30px'}}>
            <div style={{borderBottom: '2px dotted rgb(150,150,150)', height: '15px'}}></div>
          </div>
          {tagList}
          <div style={{height: '120px'}}></div>
        </PerfectScrollbar>
        {/* Reset button, used for debugging */}
        <div style={{position: 'fixed', bottom: '60px', width: `${this.props.width}px`, textAlign: 'center'}}>
          <div style={{margin: '0px auto 0px auto'}}>
            <Tooltip title='This buttom will remove all data in database immediately. Note that this action cannot be undone.'>
              <Button variant="contained" color="secondary" onClick={this.handleResetDB}>
                Reset Database
              </Button>
            </Tooltip>
          </div>
        </div>
        {/* Sign-in button */}
        <div style={{position: 'fixed', bottom: '10px', width: `${this.props.width}px`, textAlign: 'center'}}>
          {this.props.GDSignedIn ? 
            <div>
              <Button variant="contained" color="primary" onClick={this.handleSignOutGoogle}>
                <i className="fas fa-sign-out-alt width-28 text-center"></i>
                Sign Out
              </Button>
            </div> :
            <div style={{margin: '0px auto 0px auto'}}>
              <Button variant="contained" color="primary" onClick={this.handleSignInWithGoogle}>
                <i className="fab fa-google width-28 text-center"></i>
                Sign in
              </Button>
            </div> }
        </div>

        <Menu
          anchorReference={this.state.anchorReference}
          anchorEl={this.state.anchorEl}
          anchorPosition={{top: this.state.anchorPosition.y, left: this.state.anchorPosition.x}}
          open={this.state.menuOpen}
          onClose={this.handleMenuClick}
          onClick={e=>e.stopPropagation()}
        >
          <MenuItem onClick={this.handleNewNote}>New note</MenuItem>
          <MenuItem onClick={this.handleNewFolder}>New folder</MenuItem>
        </Menu>

        <Dialog
          onClick={e => e.stopPropagation()}
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
          maxWidth='md'
        >
          <DialogTitle id="form-dialog-title">{this.state.dialogTitle}</DialogTitle>
          <div style={{width: '300px'}}></div>
          <DialogContent>
            {this.state.dialogShowDescription ? 
              <DialogContentText>
                {this.state.dialogDescription}
              </DialogContentText> : <div></div> 
            }
            {this.state.dialogShowTextfield ? 
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={this.state.dialogLabel}
                value={this.state.dialogContent}
                onChange={this.handleDialogContentChange}
                onKeyPress={this.handleDialogEnterKey}
                fullWidth
              /> : <div></div>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.state.dialogCancelAction} color="primary">
              {this.state.dialogCancel}
            </Button>
            <Button onClick={this.state.dialogConfirmAction} color="primary">
              {this.state.dialogConfirm}
            </Button>
          </DialogActions>
        </Dialog>
        <div id='SB-resizer'
          onMouseDown={this.handleMouseDown}
          style={{left: `${this.props.width + 5}px`}}
        ></div>
      </div>
    );
  }

  handleSignInWithGoogle() {
    signInWithGoogle(r => {
      // get user profile
      getGoogleUserProfile((userName, userImageUrl) => {
        console.log(userName, userImageUrl);
      });
    });
  }

  handleSignOutGoogle() {
    signOutGoogle();
  }

  folderToggler(id) {
    // console.log(`Toggle ${folderName}`);
    if (this.state.expendedDir.indexOf(id) == -1) {
      this.setState({
        expendedDir: [...this.state.expendedDir, id]
      });
    } else {
      let tmp = [...this.state.expendedDir];
      tmp.splice(this.state.expendedDir.indexOf(id), 1);
      this.setState({
        expendedDir: tmp
      });
    }
  }

  getTreeComponentsFolder(directory, level) {
    if (directory === null || directory === undefined || (this.state.expendedDir.indexOf(directory.i) === -1 && this.state.showAllDir === false)) {
      return (<div></div>);
    }
    let dirList = [];
    let noteList = [];

    for (let d in directory.d) {
      dirList.push(
        <SideBarFolder 
          directory={this.props.directoryIndex[directory.d[d]]}
          level={level}
          child={this.getTreeComponentsFolder(this.props.directoryIndex[directory.d[d]], level + 1)}
          toggler={this.folderToggler}
          expendedDir={this.state.expendedDir}
          key={getNewID()}
        />
      );
    }
    for (let n in directory.no) {
      noteList.push(
        <SideBarFile 
          note={this.props.noteIndex[directory.no[n]]}
          key={getNewID()}
        />
      );
    }
    return (
      <div style={{paddingLeft: level === 0 ? '0px' : '20px'}}>
        {dirList}
        {noteList}
      </div>
    )
  }

  getTreeComponentsTag(tag) {
    if (tag === null) {
      return <div></div>
    }

    // parse first word
    let tagDict = {};
    for (let i in tag.t) {
      let splitted = splitOnce(this.props.tagIndex[tag.t[i]].na, '/');
      let first = splitted[0];
      let last = '';
      if (splitted.length > 1) last = splitted[1];
      if (first in tagDict) {
        tagDict[first].push({
          i: tag.t[i],
          t: last,
        });
      } else {
        tagDict[first] = [{
          i: tag.t[i],
          t: last,
        }];
      }
    }

    // create element
    let tagList = [];
    for (let i in tagDict) {
      tagList.push(
        <SideBarTag
          key={getNewID()}
          tagids={tagDict[i]}
          title={i}
          showAllTag={this.state.showAllTag}
        />
      );
    }

    return (
      <div>
        {tagList}
      </div>
    )
  }

  handleMouseDown(e) {
    this.props.mouseDown();
    e.preventDefault();
    e.stopPropagation();
  }

  handleMenuClick(e) {
    if (e)
      e.stopPropagation();
    if (this.state.menuOpen !== true) {
      this.setState({menuOpen: true, anchorEl: e.currentTarget, anchorReference: 'anchorEl'});
    } else {
      this.setState({menuOpen: false, anchorEl: null});
    }
  }

  handleRightClick(e) {
    e.preventDefault();
    let mousePosition = {
      x: e.clientX,
      y: e.clientY,
    };
    if (this.state.menuOpen !== true) {
      this.setState({menuOpen: true, anchorPosition: mousePosition, anchorReference: 'anchorPosition'});
    } else {
      this.setState({menuOpen: false, anchorPosition: mousePosition});
    }
  }
  
  handleNewNote(e) {
    e.stopPropagation();
    newNote('0', this.props.directoryIndex, this.props.noteIndex, (newDirectoryIndex, newNoteIndex) => {
      this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
      this.props.dispatch(updateNoteIndex(newNoteIndex));
    });
    this.handleMenuClick(e);
  }

  handleDialogContentChange(e) {
    this.setState({
      dialogContent: e.target.value
    });
  }

  handleDialogEnterKey(e) {
    if (e.key == 'Enter') {
      this.state.dialogConfirmAction();
    }
  }

  handleDialogClose(e) {
    console.log('Dialog Close is fired');
    if (e) e.stopPropagation();
    this.setState({dialogOpen: false, dialogContent: ''});
  }

  handleNewFolder(e) {
    e.stopPropagation();
    this.setState({
      dialogOpen: true,
      dialogTitle: 'Create a new folder',
      dialogDescription: 'Name the new folder',
      dialogConfirm: 'Confirm',
      dialogCancel: 'Cancel',
      dialogConfirmAction: () => {
        console.log('Confirm');
        newDirectory('0', this.state.dialogContent, this.props.directoryIndex, newDirectoryIndex => {
          this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
        });
        this.handleDialogClose();
      },
      dialogCancelAction: () => {
        console.log('Cancel');
        this.handleDialogClose();
      },
      dialogLabel: 'Folder name',
      dialogShowDescription: true,
      dialogShowTextfield: true,
    });
    this.handleMenuClick(e);
  }

  handleDrop(e) {
    e.stopPropagation();
    let id = e.dataTransfer.getData('id');
    let d = e.dataTransfer.getData('d');
    let type = e.dataTransfer.getData('type');
    e.dataTransfer.setData('id', null);
    e.dataTransfer.setData('d', null);
    e.dataTransfer.setData('type', null);
    if (type && id && d) {
      if (type === 'note') {
        moveNote(id, d, '0', this.props.noteIndex, this.props.directoryIndex, (result, newDirectoryIndex, newNoteIndex) => {
          if (result) {
            console.log('Note is moved successfully!');
            this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
            this.props.dispatch(updateNoteIndex(newNoteIndex));
          } else {
            console.log('Note is not moved.');
          }
        });
      } else if (type === 'dir') {
        moveDirectory(id, d, '0', this.props.directoryIndex, this.props.noteIndex, (result, newDirectoryIndex, newNoteIndex) => {
          if (result) {
            console.log('Directory is moved successfully!');
            this.props.dispatch(updateNoteIndex(newNoteIndex));
            this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
          } else {
            console.log('Directory is not moved.');
          }
        })
      }
    } else {
      console.error('Something goes wrong! type, id or ppath is null.');
    }
  }

  handleResetDB() {
    cleanDB(() => {
      initDB((noteIndex, tagIndex, directoryIndex, tagTrie) => {
        this.props.dispatch(initIndex(directoryIndex, noteIndex, tagIndex, tagTrie));
        this.props.dispatch(updateNoteIndex(noteIndex));
        this.props.dispatch(updateTagIndex(tagIndex));
        this.props.dispatch(updateDirectoryIndex(directoryIndex));
        this.props.dispatch(updateTagTrie(tagTrie));
        console.log('DB is reset!!');
      })
    });
  }
}

export default connect (state => ({
  width: state.main.sideBarWidth,
  noteIndex: state.main.noteIndex,
  tagIndex: state.main.tagIndex,
  directoryIndex: state.main.directoryIndex,
  GDSignedIn: state.main.GDSignedIn,
}))(SideBar);

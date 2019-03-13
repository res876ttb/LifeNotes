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
import Tooltip from '@material-ui/core/Tooltip';

import PerfectScrollbar from 'react-perfect-scrollbar';

// ============================================
// import react components
import SideBarFolder from './SideBarFolder.jsx';
import SideBarFile from './SideBarFile.jsx';
import SideBarTag from './SideBarTag.jsx';
import UserProfile from './UserProfile.jsx';
import Setting from './Setting.jsx';

// ============================================
// import react redux-action
import {
  updateNoteIndex, 
  updateDirectoryIndex,
  updateTagIndex,
  updateTagTrie,
  initIndex,
  updateUserProfile,
  resetUserProfile,
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
  exportDatabase,
  importDatabase
} from '../utils/storage.js';
import {
  splitOnce
} from '../utils/string.js';
import {
  signInWithGoogle,
  signOutGoogle,
  getGoogleUserProfile,
} from '../utils/googleDrive.js';
import {
  downloadFile
} from '../utils/download.js';

// ============================================
// import css file
import '../styles/SideBar.css';
import '../../vendor/react-perfect-scrollbar.min.css';

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
    this.tagToggler = this.tagToggler.bind(this);

    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleFeatureClick = this.handleFeatureClick.bind(this);
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.handleNewFolder = this.handleNewFolder.bind(this);
    this.handleDialogContentChange = this.handleDialogContentChange.bind(this);
    this.handleDialogEnterKey = this.handleDialogEnterKey.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleResetDB = this.handleResetDB.bind(this);

    this.handleDrop = this.handleDrop.bind(this);

    this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this);
    this.handleSignOutGoogle = this.handleSignOutGoogle.bind(this);

    this.handleOpenSetting = this.handleOpenSetting.bind(this);

    this.handleExportDatabase = this.handleExportDatabase.bind(this);

    this.handleGetDatabaseFile = this.handleGetDatabaseFile.bind(this);

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
      featureOpen: false,
      moreOpen: false,
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

      settingOpen: false,
    };
  }

  componentDidUpdate() {
    // console.log(this.props.noteIndex);
    // console.log(this.state.expendedDir);
  }

  componentDidMount() {
    document.getElementById('database-file').addEventListener('change', this.handleGetDatabaseFile, false);
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

    let fileTree = (
      <div style={{position: 'absolute', bottom: '175px', left: '2px', right: '2px', top: '2px'}} onContextMenu={this.handleRightClick}>
        <PerfectScrollbar>
          {fileList}
          <div style={{margin: '0px 10px', width: `${this.props.width - 20}px`, height: '30px'}}>
            <div style={{borderBottom: '2px dotted rgb(150,150,150)', height: '15px'}}></div>
          </div>
          {tagList}
        </PerfectScrollbar>
      </div>
    );

    let settingSync = (
      <div style={{position: 'fixed', bottom: '67px', height: '40px', width: `${this.props.width}px`, textAlign: 'center', borderTop: 'solid 1px rgb(200, 200, 200)', paddingTop: '10px'}}>
        <Button onClick={this.handleOpenSetting}>
          <i className="fas fa-cog"></i>
          <div className='inline-block' style={{paddingLeft: '6px'}}>Setting</div>
        </Button>
        <Button disabled={this.props.GDSignedIn ? false : true}>
          <i className="fas fa-sync-alt"></i>
          <div className='inline-block' style={{paddingLeft: '6px'}}>Sync</div>
        </Button>
      </div>
    );

    let setting = (
      <Setting 
        open={this.state.settingOpen}
        toggleSetting={this.handleOpenSetting}
      />
    );

    let signInUserProfile = (
      <div style={{position: 'fixed', bottom: '10px', height: '40px', width: `${this.props.width}px`, textAlign: 'center', borderTop: 'solid 1px rgb(200, 200, 200)', paddingTop: '10px'}}>
        {this.props.GDSignedIn ? 
          <UserProfile
            handleSignOutGoogle={this.handleSignOutGoogle}
            width={this.props.width}
          /> :
          <div style={{margin: '0px auto 0px auto'}}>
            <Button variant="contained" color="primary" onClick={this.handleSignInWithGoogle}>
              <i className="fab fa-google" style={{paddingRight: '6px'}}></i>
              Sign in
            </Button>
          </div> 
        }
      </div>
    )

    let menu = (
      <div>
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
      </div>
    );

    let resizer = (
      <div id='SB-resizer'
        onMouseDown={this.handleMouseDown}
        style={{left: `${this.props.width + 5}px`}}
      ></div>
    )

    let features = (
      <div style={{position: 'fixed', bottom: '127px', width: `${this.props.width}px`, textAlign: 'center', paddingTop: '10px', borderTop: 'solid 1px rgb(200, 200, 200)'}}>
        <Button onClick={this.handleFeatureClick}>
          <i className="fas fa-file-export"></i>
          <div className='inline-block' style={{paddingLeft: '6px'}}>Export</div>
        </Button>
        <Button onClick={this.handleMoreClick}>
          <i className="fas fa-grip-horizontal"></i>
          <div className='inline-block' style={{paddingLeft: '6px'}}>More</div>
        </Button>

        <Menu
          anchorReference={this.state.anchorReference}
          anchorEl={this.state.anchorEl}
          anchorPosition={{top: this.state.anchorPosition.y, left: this.state.anchorPosition.x}}
          open={this.state.featureOpen}
          onClose={this.handleFeatureClick}
          onClick={e=>e.stopPropagation()}
        >
          <Tooltip title='Download Markdown file of current note.' placement='right' enterDelay={500}>
            <MenuItem disabled>Markdown</MenuItem>
          </Tooltip>
          <Tooltip title='Download PDF file of current note.' placement='right' enterDelay={500}>
            <MenuItem disabled>PDF</MenuItem>
          </Tooltip>
          <Tooltip title='Download the whole user data as well as setting.' placement='right' enterDelay={500}>
            <MenuItem onClick={this.handleExportDatabase}>Whole database</MenuItem>
          </Tooltip>
        </Menu>

        <Menu
          anchorReference={this.state.anchorReference}
          anchorEl={this.state.anchorEl}
          anchorPosition={{top: this.state.anchorPosition.y, left: this.state.anchorPosition.x}}
          open={this.state.moreOpen}
          onClose={this.handleMoreClick}
          onClick={e=>e.stopPropagation()}
        >
          <label htmlFor="database-file">
            <MenuItem onClick={this.handleMoreClick}>Import from database file</MenuItem>
          </label>
          <MenuItem disabled>Import from markdown file</MenuItem>
          <Tooltip title='This buttom will remove all data in database immediately. Note that this action cannot be undone.'>
            <MenuItem onClick={this.handleResetDB}>Reset Database</MenuItem>
          </Tooltip>
        </Menu>
      </div>
    );

    let inputs = (
      <input
        accept=".json"
        id="database-file"
        type="file"
        style={{display: 'none'}}
        name="file"
      />
    );

    return (
      <div 
        id='SB-frame' 
        style={{width: `${this.props.width}px`,}}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        {fileTree}
        {settingSync}
        {setting}
        {signInUserProfile}
        {features}
        {menu}
        {resizer}
        {inputs}
      </div>
    );
  }

  handleGetDatabaseFile(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (f => {
      return e => {
        cleanDB(() => {
          initDB(() => {
            importDatabase(e.target.result, (newNoteIndex, newDirectoryIndex, newTagIndex, newTire) => {
              this.props.dispatch(initIndex(newDirectoryIndex, newNoteIndex, newTagIndex, newTire));
              this.props.dispatch(updateNoteIndex(newNoteIndex));
              this.props.dispatch(updateTagIndex(newTagIndex));
              this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
              this.props.dispatch(updateTagTrie(newTire));
              console.log('Database is imported!!');
              this.handleMoreClick();
            });
          });
        });
      }
    })(file);
    reader.readAsText(file);
  }

  handleExportDatabase() {
    exportDatabase(this.props.noteIndex, this.props.directoryIndex, this.props.tagIndex, database => {
      downloadFile(database, 'database.json', 0);
    });
    this.handleFeatureClick();
  }

  handleOpenSetting() {
    if (this.state.settingOpen) {
      this.setState({
        settingOpen: false,
      });
    } else {
      this.setState({
        settingOpen: true,
      });
    }
  }

  handleSignInWithGoogle() {
    signInWithGoogle(r => {
      // get user profile
      getGoogleUserProfile((userName, userImageUrl) => {
        this.props.dispatch(updateUserProfile(userName, userImageUrl));
      });
    });
  }

  handleSignOutGoogle() {
    signOutGoogle();
    this.props.dispatch(resetUserProfile());
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

  tagToggler(id) {
    if (this.state.expendedTag.indexOf(id) == -1) {
      this.setState({
        expendedTag: [...this.state.expendedTag, id]
      });
    } else {
      let tmp = [...this.state.expendedTag];
      tmp.splice(this.state.expendedTag.indexOf(id), 1);
      this.setState({
        expendedTag: tmp,
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
          width={this.props.width}
        />
      );
    }
    for (let n in directory.no) {
      noteList.push(
        <SideBarFile 
          note={this.props.noteIndex[directory.no[n]]}
          key={getNewID()}
          width={this.props.width}
          level={level}
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
          level={0}
          width={this.props.width}
          toggler={this.tagToggler}
          expended={this.state.expendedTag}
          prefix={''}
        />
      );
    }

    return (
      <div>
        {tagList}
      </div>
    )
  }

  handleMoreClick(e) {
    if (e) e.stopPropagation();
    if (this.state.moreOpen !== true) {
      this.setState({moreOpen: true, anchorEl: e.currentTarget, anchorReference: 'anchorEl'});
    } else {
      this.setState({moreOpen: false, anchorEl: null});
    }
  }

  handleFeatureClick(e) {
    if (e) e.stopPropagation();
    if (this.state.featureOpen !== true) {
      this.setState({featureOpen: true, anchorEl: e.currentTarget, anchorReference: 'anchorEl'});
    } else {
      this.setState({featureOpen: false, anchorEl: null});
    }
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
        this.handleMoreClick();
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

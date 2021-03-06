// SideBarFolder.jsx
//  The folder component of SideBar component

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

// ============================================
// import react components

// ============================================
// import react redux-action
import { 
  updateNoteIndex, updateDirectoryIndex
} from '../states/mainState.js';

// ============================================
// import apis
import { 
  newDirectory,
  newNote,
  deleteDirectory,
  renameDirectory,
  moveNote,
  moveDirectory,
} from '../utils/storage.js';

// ============================================
// import css file
import '../styles/SideBarElement.css';

// ============================================
// constants

// ============================================
// react components
class SideBarFolder extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    directory: PropTypes.object,
    level: PropTypes.number,
    child: PropTypes.object,
    toggler: PropTypes.func,
    expendedDir: PropTypes.array,
    noteIndex: PropTypes.object,
    width: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.handleNewFolder = this.handleNewFolder.bind(this);
    this.handleRenameFolder = this.handleRenameFolder.bind(this);
    this.handleDeleteFolder = this.handleDeleteFolder.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogEnterKey = this.handleDialogEnterKey.bind(this);
    this.handleDialogContentChange = this.handleDialogContentChange.bind(this);

    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);

    this.state = {
      anchorEl: null,
      anchorReference: 'anchorEl', // anchorEl, anchorPosition
      anchorPosition: {
        x: 0,
        y: 0,
      },
      menuOpen: false,
      unchangeable: this.props.directory.i === '1' ? true : false,

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

  render() {
    return (
      <div 
        className='noSelect' 
        onClick={this.handleClick}
        onDragOver={e => {e.preventDefault()}}
        onDrop={this.handleDrop}
      >
        <div 
          className='SideBarElement'
          onContextMenu={this.handleRightClick}
          draggable={true}
          onDragStart={this.handleDragStart}
        >
          <Tooltip title={this.props.directory.na} placement='right'>
            <div className='SideBarElement-content' style={{maxWidth: `${this.props.width - this.props.level * 20 - 4}px`}}>
              {this.props.expendedDir.indexOf(this.props.directory.i) === -1 ?
                <i className="far fa-folder width-28 text-center"></i> :
                <i className="far fa-folder-open width-28 text-center"></i>
              }
              {this.props.directory.na}
            </div>  
          </Tooltip>
          
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
            <MenuItem onClick={this.handleRenameFolder} disabled={this.state.unchangeable}>Rename</MenuItem>
            <MenuItem onClick={this.handleDeleteFolder} disabled={this.state.unchangeable}>Delete this folder</MenuItem>
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
        {this.props.child}
      </div>
    );
  }

  handleDragStart(e) {
    e.dataTransfer.setData('type', 'dir');
    e.dataTransfer.setData('id', this.props.directory.i);
    e.dataTransfer.setData('d', this.props.directory.p);
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
        moveNote(id, d, this.props.directory.i, this.props.noteIndex, this.props.directoryIndex, (result, newDirectoryIndex, newNoteIndex) => {
          if (result) {
            console.log('Note is moved successfully!');
            this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
            this.props.dispatch(updateNoteIndex(newNoteIndex));
          } else {
            console.log('Note is not moved.');
          }
        });
      } else if (type === 'dir') {
        moveDirectory(id, d, this.props.directory.i, this.props.directoryIndex, this.props.noteIndex, (result, newDirectoryIndex, newNoteIndex) => {
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

  handleNewNote(e) {
    e.stopPropagation();
    newNote(this.props.directory.i, this.props.directoryIndex, this.props.noteIndex, (newDirectoryIndex, newNoteIndex) => {
      this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
      this.props.dispatch(updateNoteIndex(newNoteIndex));
    });
    this.handleMenuClick(e);
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
        newDirectory(this.props.directory.i, this.state.dialogContent, this.props.directoryIndex, newDirectoryIndex => {
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

  handleDeleteFolder(e) {
    e.stopPropagation();
    this.setState({
      dialogOpen: true,
      dialogTitle: `Delete folder "${this.props.directory.name}" and all notes in this folder?`,
      dialogConfirm: 'Confirm',
      dialogCancel: 'Cancel',
      dialogConfirmAction: () => {
        deleteDirectory(this.props.directory.i, this.props.directoryIndex, this.props.noteIndex, (newDirectoryIndex, newNoteIndex) => {
          this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
          this.props.dispatch(updateNoteIndex(newNoteIndex));
        });
        this.handleDialogClose();
      }, 
      dialogCancelAction: () => {
        console.log('Cancel');
        this.handleDialogClose();
      },
      dialogShowDescription: false,
      dialogShowTextfield: false,
    });
    this.handleMenuClick(e);
  }

  handleRenameFolder(e) {
    e.stopPropagation();
    this.setState({
      dialogOpen: true,
      dialogTitle: `Rename folder "${this.props.directory.name}".`,
      dialogConfirm: 'Confirm',
      dialogCancel: 'Cancel',
      dialogConfirmAction: () => {
        renameDirectory(this.props.directory.i, this.state.dialogContent, this.props.directoryIndex, newDirectoryIndex => {
          this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
        });
        this.handleDialogClose();
      }, 
      dialogCancelAction: () => {
        console.log('Cancel');
        this.handleDialogClose();
      },
      dialogLabel: 'New folder name',
      dialogShowDescription: false,
      dialogShowTextfield: true,
    });
    this.handleMenuClick(e);
  }

  handleDialogClose(e) {
    console.log('Dialog Close is fired');
    if (e) e.stopPropagation();
    this.setState({dialogOpen: false});
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

  handleRightClick(e) {
    e.preventDefault();
    e.stopPropagation();
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

  handleMenuClick(e) {
    if (e)
      e.stopPropagation();
    if (this.state.menuOpen !== true) {
      this.setState({menuOpen: true, anchorEl: e.currentTarget, anchorReference: 'anchorEl'});
    } else {
      this.setState({menuOpen: false, anchorEl: null});
    }
  }

  handleClick(e) {
    e.stopPropagation();
    this.props.toggler(this.props.directory.i);
  }
}

export default connect (state => ({
  noteIndex: state.main.noteIndex,
  directoryIndex: state.main.directoryIndex,
  tagIndex: state.main.tagIndex,
}))(SideBarFolder);

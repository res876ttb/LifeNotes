// SideBarFile.jsx
//  Maintain top-level program data.

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

// ============================================
// import react components

// ============================================
// import react redux-action
import {
  updateNoteIndex,
  updateDirectoryIndex,
  openNote,
} from '../states/mainState.js';

// ============================================
// import apis
import {
  newNote,
  newDirectory,
  deleteNote,
  moveNote,
  moveDirectory
} from '../utils/storage.js';

// ============================================
// import css file

// ============================================
// constants

// ============================================
// react components
class SideBarFile extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    note: PropTypes.object,
    noteIndex: PropTypes.object,
    directoryIndex: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.handleNewFolder = this.handleNewFolder.bind(this);
    this.handleRenameFile = this.handleRenameFile.bind(this);
    this.handleDeleteFile = this.handleDeleteFile.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogEnterKey = this.handleDialogEnterKey.bind(this);
    this.handleDialogContentChange = this.handleDialogContentChange.bind(this);

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.state = {
      anchorEl: null,
      anchorReference: 'anchorEl', // anchorEl, anchorPosition
      anchorPosition: {
        x: 0,
        y: 0,
      },
      menuOpen: false,

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
        className='SideBarElement'
        onClick={this.handleClick} 
        onContextMenu={this.handleRightClick}
        draggable={true}
        onDragStart={this.handleDragStart}
        onDragOver={e => {e.preventDefault();}}
        onDrop={this.handleDrop}
      >
        <i className="fas fa-file-alt width-28 text-center"></i>
        {this.props.note.title}
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
          {/* <MenuItem onClick={this.handleRenameFile}>Rename</MenuItem> */}
          <MenuItem onClick={this.handleDeleteFile}>Delete this note</MenuItem>
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
  }

  handleDragStart(e) {
    e.dataTransfer.setData('type', 'note');
    e.dataTransfer.setData('id', this.props.note._id);
    e.dataTransfer.setData('ppath', this.props.note.ppath);
  }

  handleDrop(e) {
    e.stopPropagation();
    let id = e.dataTransfer.getData('id');
    let ppath = e.dataTransfer.getData('ppath');
    let type = e.dataTransfer.getData('type');
    e.dataTransfer.setData('id', null);
    e.dataTransfer.setData('ppath', null);
    e.dataTransfer.setData('type', null);
    if (type && id && ppath) {
      if (type === 'note') {
        moveNote(id, ppath, this.props.note.ppath, this.props.noteIndex, this.props.directoryIndex, (result, newDirectoryIndex, newNoteIndex) => {
          if (result) {
            console.log('Note is moved successfully!');
            this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
            this.props.dispatch(updateNoteIndex(newNoteIndex));
          } else {
            console.log('Note is not moved.');
          }
        });
      } else if (type === 'dir') {
        moveDirectory(id, ppath, this.props.note.ppath, this.props.directoryIndex, (result, newDirectoryIndex) => {
          if (result) {
            console.log('Directory is moved successfully!');
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
    newNote(this.props.note.ppath, this.props.directoryIndex, this.props.noteIndex, (newDirectoryIndex, newNoteIndex) => {
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
        newDirectory(this.props.note.ppath, this.state.dialogContent, this.props.directoryIndex, newDirectoryIndex => {
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

  handleDeleteFile(e) {
    e.stopPropagation();
    this.setState({
      dialogOpen: true,
      dialogTitle: `Delete note "${this.props.note.title}"?`,
      dialogConfirm: 'Confirm',
      dialogCancel: 'Cancel',
      dialogConfirmAction: () => {
        deleteNote(this.props.note, this.props.noteIndex, this.props.directoryIndex, (newDirectoryIndex, newNoteIndex) => {
          this.props.dispatch(updateNoteIndex(newNoteIndex));
          this.props.dispatch(updateDirectoryIndex(newDirectoryIndex));
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

  handleRenameFile(e) {
    e.stopPropagation();
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

  handleClick(e) {
    e.stopPropagation();
    // open notes
    this.props.dispatch(openNote(this.props.note._id, this.props.note.ppath));
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
}

export default connect (state => ({
  noteIndex: state.main.noteIndex,
  directoryIndex: state.main.directoryIndex,
}))(SideBarFile);

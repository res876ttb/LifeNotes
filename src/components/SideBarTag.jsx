// SideBarTag.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Tooltip from '@material-ui/core/Tooltip';

import PerfectScrollbar from 'react-perfect-scrollbar';

// ============================================
// import react components
import SideBarTagPlum from './SideBarTagPlum.jsx';

// ============================================
// import react redux-action
import {
  openNote
} from '../states/mainState.js';

// ============================================
// import apis
import {getNewID} from '../utils/id.js';
import {splitOnce} from '../utils/string.js';

// ============================================
// import css file
import '../styles/SideBarTag.css';

// ============================================
// constants

// ============================================
// react components
class SideBarTag extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    tagids: PropTypes.array,
    title: PropTypes.string,
    showAllTag: PropTypes.bool,
    tagIndex: PropTypes.object,
    noteIndex: PropTypes.object,
    level: PropTypes.number,
    width: PropTypes.number,
    toggler: PropTypes.func,
    expended: PropTypes.array,
    prefix: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.getChildren = this.getChildren.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.handleCollapseClick = this.handleCollapseClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleShowNotes = this.handleShowNotes.bind(this);
    this.handleTooltipClose = this.handleTooltipClose.bind(this);
    this.handleOpenNote = this.handleOpenNote.bind(this);

    this.state = {
      expand: false,
      showNote: false,
      id: this.props.prefix + this.props.title,
    };
  }

  render() {
    let children = [];
    if (this.props.tagIndex) {
      children = this.getChildren();
    }

    let notes = this.getNotes();
    let title = (
      <div className='SideBarTag-tooltip'>
        <PerfectScrollbar>
          <div className="SideBarTag-tooltip-title">
            <p className="SideBarTag-tooltip-title-text">
              <i className={"fab fa-slack-hash width-28 text-center "}></i>
              {this.props.title}
            </p>
          </div>
          {notes}
        </PerfectScrollbar>
      </div>
    );

    let expended = this.props.showAllTag || this.props.expended.indexOf(this.state.id) != -1;

    return (
      <div>
        <Tooltip title={title} interactive={true} placement="right">
          <div className='SideBarTag noselect' onClick={this.handleCollapseClick} onContextMenu={this.handleRightClick} style={{width: `${this.props.width - this.props.level * 20 - 4}px`}}>
            <i className={"fab fa-slack-hash width-28 text-center " + (expended ? 'SideBarTag-hash-rotate' : '')}></i>
            {this.props.title}
            <div className="SideBarTag-indicator text-center">
              <i className="fas fa-arrow-right SideBarTag-indicator-arrow"></i>
            </div>
          </div>
        </Tooltip>
        <div style={{paddingLeft: '20px'}}>
          {expended ? children : null}
        </div>
      </div>
    );
  }

  handleCollapseClick(e) {
    e.stopPropagation();
    this.props.toggler(this.state.id);
  }

  handleTooltipClose(e) {
    e.stopPropagation();
    this.setState({showNote: false});
  }

  handleShowNotes(e) {
    e.stopPropagation();
    if (this.state.showNote) {
      this.setState({showNote: false});
    } else {
      this.setState({showNote: true});
    }
  }

  handleOpenNote(id, dir) {
    this.props.dispatch(openNote(id, dir));
  }

  handleRightClick(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  getNotes() {
    if (this.props.noteIndex === null || this.props.tagIndex === null) return [];
    let notes = [];
    for (let i in this.props.tagids) {
      let tagHeader = this.props.tagIndex[this.props.tagids[i].i];
      for (let j in tagHeader.no) {
        let noteHeader = this.props.noteIndex[tagHeader.no[j]];
        if (noteHeader) {
          notes.push(
            <div className='SideBarTag-item noselect' key={getNewID()} onClick={e => {
              e.stopPropagation();
              this.handleOpenNote(noteHeader._id, noteHeader.d);
            }}>
              <i className="fas fa-file-alt width-28 text-center"></i>
              {noteHeader.t}
            </div>
          )
        }
      }
    }

    return notes;
  }

  getChildren() {
    let tagDict = {};
    let tagList = [];

    // parse info
    for (let i in this.props.tagids) {
      let id = this.props.tagids[i].i;
      let title = this.props.tagids[i].t;
      let splitted = splitOnce(title, '/');
      let first = splitted[0];
      let last = '';
      if (splitted.length > 1) last = splitted[1];
      if (first in tagDict) {
        tagDict[first].push({
          i: id,
          t: last,
        });
      } else {
        tagDict[first] = [{
          i: id,
          t: last,
        }];
      }
    }

    // add element
    for (let i in tagDict) {
      if (i == '') continue;
      tagList.push(
        <SideBarTagPlum
          key={getNewID()}
          tagids={tagDict[i]}
          title={i}
          showAllTag={this.props.showAllTag}
          level={this.props.level}
          width={this.props.width}
          toggler={this.props.toggler}
          expended={this.props.expended}
          prefix={this.state.id}
        />
      );
    }

    return tagList;
  }
}

export default connect (state => ({
  tagIndex: state.main.tagIndex,
  noteIndex: state.main.noteIndex,
}))(SideBarTag);

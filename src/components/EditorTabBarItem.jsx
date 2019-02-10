// EditorTabBarItem.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components

// ============================================
// import react redux-action
import {
  setActiveEditor, 
  removeEditor
} from '../states/mainState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/EditorTabBarItem.css';

// ============================================
// constants

// ============================================
// react components
class EditorTabBarItem extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    click: PropTypes.func,
    id: PropTypes.string,
    activeEditorId: PropTypes.string,
    titleArr: PropTypes.any,
    setDrag: PropTypes.func,
    setDrop: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleSetActiveEditor = this.handleSetActiveEditor.bind(this);
    this.handleCloseEditor = this.handleCloseEditor.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);

    this.state = {
      width: 1,
      dragOver: false,
    };
  }

  render() {
    let title = this.props.titleArr[this.props.id];
    let active = this.props.activeEditorId === this.props.id;
    if (!title) {
      title = 'Untitled';
    }

    return (
      <div className="ETBI-frame" onClick={this.handleSetActiveEditor} style={{
        zIndex: (active ? '1' : '2'),
        background: (active ? 'rgb(247, 247, 247)' : 'rgb(220, 220, 220)'),
        borderBottomRightRadius: (active ? '0px' : '8px'),
        borderBottomLeftRadius: (active ? '0px' : '8px'),
      }}>
        <div className={"ETBI-frame-inner" + 
          (active ? (this.state.dragOver ? " ETBI-frame-inner-dragover" : "") : 
                    (this.state.dragOver ? " ETBI-frame-inner-inactive ETBI-frame-inner-inactive-dragover" : " ETBI-frame-inner-inactive"))}
          draggable="true" 
          onDragStart={this.handleDragStart}
          onDragOver={this.handleDragOver}
          onDrop={this.handleOnDrop}
          onDragLeave={this.handleDragLeave}
        >
          <div style={{
            display: 'inline-block',
            lineHeight: '1rem',
          }}>
            <div style={{
              position: 'relative',
              top: '4px',
              maxWidth: '180px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              lineHeight: '1.2rem',
            }}>
              {title}
            </div>
          </div>
          <div className="ETBI-close" onClick={this.handleCloseEditor}>
            <div className={"ETBI-close-inner" + (active ? "" : " ETBI-close-inner-inactive")}>
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="ETBI-close-color"></div>
          </div>
        </div>
        <div className="ETBI-bgr-l" style={{display: (active ? 'block' : 'none')}}></div>
        <div className="ETBI-bgr-r" style={{display: (active ? 'block' : 'none')}}></div>
      </div>
    );
  }

  handleSetActiveEditor() {
    this.props.dispatch(setActiveEditor(this.props.id));
  }

  handleCloseEditor(e) {
    e.stopPropagation();
    this.props.dispatch(removeEditor(this.props.id));
  }

  handleDragStart(e) {
    e.dataTransfer.setData('tabid', this.props.id);
    this.props.setDrag(this.props.id);
  }

  handleDragOver(e) {
    e.preventDefault();
    if (this.state.dragOver === false) {
      this.setState({
        dragOver: true,
      });
    } 
  }

  handleOnDrop(e) {
    let tabid = e.dataTransfer.getData('tabid');
    if (tabid) {
      e.dataTransfer.setData('tabid', null);
      this.props.setDrop(this.props.id);
      this.setState({
        dragOver: false,
      });
    }
  }

  handleDragLeave() {
    if (this.state.dragOver === true) {
      this.setState({
        dragOver: false,
      });
    }
  }
}

export default connect (state => ({
  activeEditorId: state.main.activeEditorId,
  titleArr: state.main.titleArr,
}))(EditorTabBarItem);

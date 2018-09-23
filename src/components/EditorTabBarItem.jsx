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
  }

  constructor(props) {
    super(props);

    this.handleSetActiveEditor = this.handleSetActiveEditor.bind(this);
    this.handleCloseEditor = this.handleCloseEditor.bind(this);

    this.state = {
      width: 1,
    };
  }

  render() {
    let title = this.props.titleArr[this.props.id];
    if (!title) {
      title = 'Untitled';
    }

    if (this.props.activeEditorId === this.props.id) {
      // active
      return (
        <div className="ETBI-frame" onMouseUp={this.handleSetActiveEditor}>
          {title}
          <div className="ETBI-close" onMouseUp={this.handleCloseEditor}>
            <div className="ETBI-close-inner">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="ETBI-close-color"></div>
          </div>
          <div className="ETBI-bgr-l"></div>
          <div className="ETBI-bgr-r"></div>
        </div>
      );
    } else {
      // inactive
      return (
        <div className="ETBI-frame ETBI-frame-inactive" onMouseUp={this.handleSetActiveEditor}>
          {title}
          <div className="ETBI-close" onMouseUp={this.handleCloseEditor}>
            <div className="ETBI-close-inner ETBI-close-inner-inactive">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="ETBI-close-color"></div>
          </div>
        </div>
      );
    }
  }

  handleSetActiveEditor() {
    this.props.dispatch(setActiveEditor(this.props.id));
  }

  handleCloseEditor(e) {
    e.stopPropagation();
    this.props.dispatch(removeEditor(this.props.id));
  }
}

export default connect (state => ({
  activeEditorId: state.main.activeEditorId,
  titleArr: state.main.titleArr,
}))(EditorTabBarItem);

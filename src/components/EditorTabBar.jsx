// EditorTabBar.jsx
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

// ============================================
// import apis

// ============================================
// import css file
import '../styles/EditorTabBar.css';

// ============================================
// constants

// ============================================
// react components
class EditorTabBar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    show: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>{this.props.show ? (
        <div id='EditorTabBar-frame'>
          EditorTabBar
        </div>
      ) : null}</div>
    );
  }
}

export default connect (state => ({

}))(EditorTabBar);

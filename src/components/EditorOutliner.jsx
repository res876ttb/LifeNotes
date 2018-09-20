// EditorOutliner.jsx
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

// ============================================
// constants

// ============================================
// react components
class EditorOutliner extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default connect (state => ({

}))(EditorOutliner);

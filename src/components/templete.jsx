/**
 * @file templete.jsx
 * @desc description
 */

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
class Templete extends React.Component {
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

}))(Templete);

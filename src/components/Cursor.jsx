// Cursor.jsx
//  Emulate the cursor.

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
import '../styles/Global.css';

// ============================================
// constants

// ============================================
// react components
class Cursor extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      show: true
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({show: !this.state.show})
    }, 500);
  }

  render() {
    return (
      <div id='cursor-out'><div id='cursor'></div></div>
    );
  }
}

export default connect (state => ({

}))(Cursor);
